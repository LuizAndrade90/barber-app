import { db } from "@/lib/db";
import {
  barbearias,
  barbeiros,
  servicos,
  clientes,
  agendamentos,
  agendamentoHistorico,
  conversas,
  mensagens,
  bloqueios,
} from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { calculateAvailableSlots } from "@/lib/services/slots";
import type * as T from "./types";

export async function handleGetContext(
  barbeariaId: string,
  data: T.GetContextData
) {
  const barbearia = await db.query.barbearias.findFirst({
    where: eq(barbearias.id, barbeariaId),
  });

  const conversa = await db.query.conversas.findFirst({
    where: and(
      eq(conversas.barbeariaId, barbeariaId),
      eq(conversas.whatsappFrom, data.whatsappFrom)
    ),
    with: { cliente: true },
  });

  const barbeirosList = await db.query.barbeiros.findMany({
    where: and(eq(barbeiros.barbeariaId, barbeariaId), eq(barbeiros.ativo, true)),
  });

  const servicosList = await db.query.servicos.findMany({
    where: and(
      eq(servicos.barbeariaId, barbeariaId),
      eq(servicos.ativo, true),
      eq(servicos.exibirWhatsapp, true)
    ),
  });

  return {
    barbearia: {
      nome: barbearia?.nome,
      config: barbearia?.config,
      mensagens: barbearia?.mensagens,
    },
    conversa,
    barbeiros: barbeirosList.map((b) => ({
      id: b.id,
      nome: b.nome,
      especialidades: b.especialidades,
    })),
    servicos: servicosList.map((s) => ({
      id: s.id,
      nome: s.nome,
      duracao: s.duracaoMinutos,
      preco: s.precocentavos,
    })),
  };
}

export async function handleGetSlots(
  barbeariaId: string,
  data: T.GetSlotsData
) {
  const dataObj = new Date(data.data);
  const dataInicio = new Date(dataObj);
  dataInicio.setHours(0, 0, 0, 0);
  const dataFim = new Date(dataObj);
  dataFim.setHours(23, 59, 59, 999);

  const [barbearia, barbeiro, servico, agendamentosDoDia, bloqueiosDoDia] =
    await Promise.all([
      db.query.barbearias.findFirst({
        where: eq(barbearias.id, barbeariaId),
      }),
      db.query.barbeiros.findFirst({
        where: eq(barbeiros.id, data.barbeiroId),
      }),
      db.query.servicos.findFirst({
        where: eq(servicos.id, data.servicoId),
      }),
      db.query.agendamentos.findMany({
        where: and(
          eq(agendamentos.barbeariaId, barbeariaId),
          eq(agendamentos.barbeiroId, data.barbeiroId),
          gte(agendamentos.dataHora, dataInicio),
          lte(agendamentos.dataHora, dataFim),
          sql`${agendamentos.status} NOT IN ('cancelado', 'no_show')`
        ),
      }),
      db.query.bloqueios.findMany({
        where: and(
          eq(bloqueios.barbeariaId, barbeariaId),
          eq(bloqueios.barbeiroId, data.barbeiroId),
          lte(bloqueios.dataInicio, dataFim),
          gte(bloqueios.dataFim, dataInicio),
          eq(bloqueios.ativo, true)
        ),
      }),
    ]);

  if (!barbearia || !barbeiro || !servico) return [];

  const config = barbearia.config as {
    horarioFuncionamento: Record<string, { inicio: string; fim: string; ativo: boolean }>;
    intervaloSlots: number;
  };

  return calculateAvailableSlots(
    config,
    barbeiro.horarioPersonalizado as Record<string, { inicio: string; fim: string; ativo: boolean }> | null,
    agendamentosDoDia,
    bloqueiosDoDia,
    servico.duracaoMinutos,
    dataObj
  );
}

export async function handleCreateAppointment(
  barbeariaId: string,
  data: T.CreateAppointmentData
) {
  const servico = await db.query.servicos.findFirst({
    where: eq(servicos.id, data.servicoId),
  });

  if (!servico) throw new Error("Serviço não encontrado");

  const dataHora = new Date(data.dataHora);
  const dataHoraFim = new Date(dataHora);
  dataHoraFim.setMinutes(dataHoraFim.getMinutes() + servico.duracaoMinutos);

  const [novo] = await db
    .insert(agendamentos)
    .values({
      barbeariaId,
      barbeiroId: data.barbeiroId,
      servicoId: data.servicoId,
      clienteId: data.clienteId,
      dataHora,
      dataHoraFim,
      precoOriginal: servico.precocentavos,
      precoFinal: servico.precocentavos,
      origem: "whatsapp",
    })
    .returning();

  await db.insert(agendamentoHistorico).values({
    agendamentoId: novo.id,
    acao: "criado",
    dadosNovos: { origem: "whatsapp" },
    realizadoPor: "n8n",
  });

  return novo;
}

export async function handleCancelAppointment(
  barbeariaId: string,
  data: T.CancelAppointmentData
) {
  const [updated] = await db
    .update(agendamentos)
    .set({
      status: "cancelado",
      canceladoEm: new Date(),
      motivoCancelamento: data.motivo,
      canceladoPor: "cliente",
      atualizadoEm: new Date(),
    })
    .where(
      and(
        eq(agendamentos.id, data.agendamentoId),
        eq(agendamentos.barbeariaId, barbeariaId)
      )
    )
    .returning();

  if (updated) {
    await db.insert(agendamentoHistorico).values({
      agendamentoId: data.agendamentoId,
      acao: "cancelado",
      dadosNovos: { motivo: data.motivo },
      realizadoPor: "n8n",
    });
  }

  return updated;
}

export async function handleGetAppointments(
  barbeariaId: string,
  data: T.GetAppointmentsData
) {
  const conditions = [eq(agendamentos.barbeariaId, barbeariaId)];

  if (data.clienteId) {
    conditions.push(eq(agendamentos.clienteId, data.clienteId));
  }

  if (data.data) {
    const dataInicio = new Date(data.data);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(data.data);
    dataFim.setHours(23, 59, 59, 999);
    conditions.push(gte(agendamentos.dataHora, dataInicio));
    conditions.push(lte(agendamentos.dataHora, dataFim));
  }

  return db.query.agendamentos.findMany({
    where: and(...conditions),
    with: { barbeiro: true, servico: true, cliente: true },
    orderBy: agendamentos.dataHora,
    limit: 20,
  });
}

export async function handleUpdateConversation(
  barbeariaId: string,
  data: T.UpdateConversationData
) {
  const existing = await db.query.conversas.findFirst({
    where: and(
      eq(conversas.barbeariaId, barbeariaId),
      eq(conversas.whatsappFrom, data.whatsappFrom)
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(conversas)
      .set({
        estado: data.estado as typeof existing.estado,
        contexto: data.contexto as typeof existing.contexto,
        ultimaInteracao: new Date(),
      })
      .where(eq(conversas.id, existing.id))
      .returning();
    return updated;
  }

  const [nova] = await db
    .insert(conversas)
    .values({
      barbeariaId,
      whatsappFrom: data.whatsappFrom,
      estado: data.estado as "inicio",
      contexto: data.contexto,
    })
    .returning();

  return nova;
}

export async function handleLogMessage(
  barbeariaId: string,
  data: T.LogMessageData
) {
  const [msg] = await db
    .insert(mensagens)
    .values({
      conversaId: data.conversaId,
      direcao: data.direcao,
      tipo: (data.tipo as "texto") ?? "texto",
      conteudo: data.conteudo,
      whatsappMessageId: data.whatsappMessageId,
      intencaoDetectada: data.intencaoDetectada,
    })
    .returning();

  return msg;
}
