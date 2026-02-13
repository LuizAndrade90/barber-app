import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agendamentos } from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  // Verificar autorizacao (cron secret ou API key)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const agora = new Date();
    const emDuasHoras = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

    // Buscar agendamentos confirmados nas proximas 2 horas sem lembrete
    const pendentesLembrete = await db.query.agendamentos.findMany({
      where: and(
        eq(agendamentos.status, "confirmado"),
        eq(agendamentos.lembreteEnviado, false),
        gte(agendamentos.dataHora, agora),
        lte(agendamentos.dataHora, emDuasHoras)
      ),
      with: {
        cliente: true,
        barbeiro: true,
        servico: true,
        barbearia: true,
      },
    });

    // Marcar como lembrete enviado
    const ids = pendentesLembrete.map((a) => a.id);
    if (ids.length > 0) {
      await db
        .update(agendamentos)
        .set({ lembreteEnviado: true })
        .where(sql`${agendamentos.id} IN ${ids}`);
    }

    return NextResponse.json({
      success: true,
      lembretes: pendentesLembrete.length,
      agendamentos: pendentesLembrete.map((a) => ({
        id: a.id,
        clienteNome: a.cliente?.nome,
        clienteWhatsapp: a.cliente?.whatsapp,
        barbeiroNome: a.barbeiro?.nome,
        servicoNome: a.servico?.nome,
        dataHora: a.dataHora,
        barbeariaId: a.barbeariaId,
      })),
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { error: "Erro ao processar lembretes" },
      { status: 500 }
    );
  }
}
