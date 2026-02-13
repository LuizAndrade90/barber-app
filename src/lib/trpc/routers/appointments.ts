import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { agendamentos, agendamentoHistorico, barbeiros, servicos, clientes, bloqueios } from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { calculateAvailableSlots } from "@/lib/services/slots";

export const appointmentsRouter = router({
  listByDate: protectedProcedure
    .input(
      z.object({
        data: z.string(),
        barbeiroId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dataInicio = new Date(input.data);
      dataInicio.setHours(0, 0, 0, 0);
      const dataFim = new Date(input.data);
      dataFim.setHours(23, 59, 59, 999);

      const conditions = [
        eq(agendamentos.barbeariaId, ctx.barbeariaId),
        gte(agendamentos.dataHora, dataInicio),
        lte(agendamentos.dataHora, dataFim),
      ];

      if (input.barbeiroId) {
        conditions.push(eq(agendamentos.barbeiroId, input.barbeiroId));
      }

      return ctx.db.query.agendamentos.findMany({
        where: and(...conditions),
        with: {
          barbeiro: true,
          servico: true,
          cliente: true,
        },
        orderBy: agendamentos.dataHora,
      });
    }),

  listByDateRange: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string(),
        dataFim: z.string(),
        barbeiroId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const inicio = new Date(input.dataInicio);
      const fim = new Date(input.dataFim);

      const conditions = [
        eq(agendamentos.barbeariaId, ctx.barbeariaId),
        gte(agendamentos.dataHora, inicio),
        lte(agendamentos.dataHora, fim),
      ];

      if (input.barbeiroId) {
        conditions.push(eq(agendamentos.barbeiroId, input.barbeiroId));
      }

      return ctx.db.query.agendamentos.findMany({
        where: and(...conditions),
        with: {
          barbeiro: true,
          servico: true,
          cliente: true,
        },
        orderBy: agendamentos.dataHora,
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.agendamentos.findFirst({
        where: and(
          eq(agendamentos.id, input.id),
          eq(agendamentos.barbeariaId, ctx.barbeariaId)
        ),
        with: {
          barbeiro: true,
          servico: true,
          cliente: true,
          historico: { orderBy: (h, { desc }) => [desc(h.criadoEm)] },
          feedback: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        barbeiroId: z.string().uuid(),
        servicoId: z.string().uuid(),
        clienteId: z.string().uuid(),
        dataHora: z.string(),
        observacoes: z.string().optional(),
        origem: z.enum(["whatsapp", "manual", "app"]).default("manual"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const servico = await ctx.db.query.servicos.findFirst({
        where: and(
          eq(servicos.id, input.servicoId),
          eq(servicos.barbeariaId, ctx.barbeariaId)
        ),
      });

      if (!servico) throw new Error("Serviço não encontrado");

      const dataHora = new Date(input.dataHora);
      const dataHoraFim = new Date(dataHora);
      dataHoraFim.setMinutes(dataHoraFim.getMinutes() + servico.duracaoMinutos);

      const [novoAgendamento] = await ctx.db
        .insert(agendamentos)
        .values({
          barbeariaId: ctx.barbeariaId,
          barbeiroId: input.barbeiroId,
          servicoId: input.servicoId,
          clienteId: input.clienteId,
          dataHora,
          dataHoraFim,
          precoOriginal: servico.precocentavos,
          precoFinal: servico.precocentavos,
          origem: input.origem,
          observacoes: input.observacoes,
        })
        .returning();

      await ctx.db.insert(agendamentoHistorico).values({
        agendamentoId: novoAgendamento.id,
        acao: "criado",
        dadosNovos: { status: "agendado", dataHora: input.dataHora },
        realizadoPor: ctx.session.user.id,
      });

      return novoAgendamento;
    }),

  confirm: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(agendamentos)
        .set({
          status: "confirmado",
          confirmadoEm: new Date(),
          atualizadoEm: new Date(),
        })
        .where(
          and(
            eq(agendamentos.id, input.id),
            eq(agendamentos.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      await ctx.db.insert(agendamentoHistorico).values({
        agendamentoId: input.id,
        acao: "confirmado",
        realizadoPor: ctx.session.user.id,
      });

      return updated;
    }),

  cancel: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        motivo: z.string().optional(),
        canceladoPor: z.enum(["cliente", "barbeiro", "sistema"]).default("barbeiro"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(agendamentos)
        .set({
          status: "cancelado",
          canceladoEm: new Date(),
          motivoCancelamento: input.motivo,
          canceladoPor: input.canceladoPor,
          atualizadoEm: new Date(),
        })
        .where(
          and(
            eq(agendamentos.id, input.id),
            eq(agendamentos.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      await ctx.db.insert(agendamentoHistorico).values({
        agendamentoId: input.id,
        acao: "cancelado",
        dadosNovos: { motivo: input.motivo },
        realizadoPor: ctx.session.user.id,
      });

      return updated;
    }),

  complete: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        precoFinal: z.number().optional(),
        formaPagamento: z
          .enum(["dinheiro", "pix", "cartao_credito", "cartao_debito"])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, unknown> = {
        status: "concluido",
        atualizadoEm: new Date(),
      };
      if (input.precoFinal !== undefined) updateData.precoFinal = input.precoFinal;
      if (input.formaPagamento) updateData.formaPagamento = input.formaPagamento;

      const [updated] = await ctx.db
        .update(agendamentos)
        .set(updateData)
        .where(
          and(
            eq(agendamentos.id, input.id),
            eq(agendamentos.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      await ctx.db.insert(agendamentoHistorico).values({
        agendamentoId: input.id,
        acao: "concluido",
        realizadoPor: ctx.session.user.id,
      });

      return updated;
    }),

  markNoShow: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(agendamentos)
        .set({ status: "no_show", atualizadoEm: new Date() })
        .where(
          and(
            eq(agendamentos.id, input.id),
            eq(agendamentos.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      await ctx.db.insert(agendamentoHistorico).values({
        agendamentoId: input.id,
        acao: "no_show",
        realizadoPor: ctx.session.user.id,
      });

      return updated;
    }),

  getAvailableSlots: protectedProcedure
    .input(
      z.object({
        barbeiroId: z.string().uuid(),
        servicoId: z.string().uuid(),
        data: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = new Date(input.data);
      const dataInicio = new Date(data);
      dataInicio.setHours(0, 0, 0, 0);
      const dataFim = new Date(data);
      dataFim.setHours(23, 59, 59, 999);

      const [barbearia, barbeiro, servico, agendamentosDoDia, bloqueiosDoDia] =
        await Promise.all([
          ctx.db.query.barbearias.findFirst({
            where: (b, { eq }) => eq(b.id, ctx.barbeariaId),
          }),
          ctx.db.query.barbeiros.findFirst({
            where: and(
              eq(barbeiros.id, input.barbeiroId),
              eq(barbeiros.barbeariaId, ctx.barbeariaId)
            ),
          }),
          ctx.db.query.servicos.findFirst({
            where: and(
              eq(servicos.id, input.servicoId),
              eq(servicos.barbeariaId, ctx.barbeariaId)
            ),
          }),
          ctx.db.query.agendamentos.findMany({
            where: and(
              eq(agendamentos.barbeariaId, ctx.barbeariaId),
              eq(agendamentos.barbeiroId, input.barbeiroId),
              gte(agendamentos.dataHora, dataInicio),
              lte(agendamentos.dataHora, dataFim),
              sql`${agendamentos.status} NOT IN ('cancelado', 'no_show')`
            ),
          }),
          ctx.db.query.bloqueios.findMany({
            where: and(
              eq(bloqueios.barbeariaId, ctx.barbeariaId),
              eq(bloqueios.barbeiroId, input.barbeiroId),
              lte(bloqueios.dataInicio, dataFim),
              gte(bloqueios.dataFim, dataInicio),
              eq(bloqueios.ativo, true)
            ),
          }),
        ]);

      if (!barbearia || !barbeiro || !servico) {
        return [];
      }

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
        data
      );
    }),
});
