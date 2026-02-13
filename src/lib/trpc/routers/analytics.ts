import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { agendamentos, metricasDiarias, aiInsights } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";

const isoDateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}/).max(30);

const dateRangeInput = z.object({
  dataInicio: isoDateStr,
  dataFim: isoDateStr,
});

export const analyticsRouter = router({
  getOverview: protectedProcedure
    .input(dateRangeInput)
    .query(async ({ ctx, input }) => {
      const inicio = new Date(input.dataInicio);
      const fim = new Date(input.dataFim);

      const resultado = await ctx.db
        .select({
          total: sql<number>`count(*)`,
          concluidos: sql<number>`count(*) filter (where ${agendamentos.status} = 'concluido')`,
          cancelados: sql<number>`count(*) filter (where ${agendamentos.status} = 'cancelado')`,
          noShows: sql<number>`count(*) filter (where ${agendamentos.status} = 'no_show')`,
          receita: sql<number>`coalesce(sum(${agendamentos.precoFinal}) filter (where ${agendamentos.status} = 'concluido'), 0)`,
        })
        .from(agendamentos)
        .where(
          and(
            eq(agendamentos.barbeariaId, ctx.barbeariaId),
            gte(agendamentos.dataHora, inicio),
            lte(agendamentos.dataHora, fim)
          )
        );

      const stats = resultado[0];
      const total = Number(stats.total) || 0;
      const concluidos = Number(stats.concluidos) || 0;
      const cancelados = Number(stats.cancelados) || 0;
      const receita = Number(stats.receita) || 0;

      return {
        totalAgendamentos: total,
        concluidos,
        cancelados,
        noShows: Number(stats.noShows) || 0,
        receita,
        ticketMedio: concluidos > 0 ? Math.round(receita / concluidos) : 0,
        taxaCancelamento:
          total > 0 ? Math.round((cancelados / total) * 100) : 0,
        taxaOcupacao:
          total > 0 ? Math.round((concluidos / total) * 100) : 0,
      };
    }),

  getDailyMetrics: protectedProcedure
    .input(dateRangeInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.metricasDiarias.findMany({
        where: and(
          eq(metricasDiarias.barbeariaId, ctx.barbeariaId),
          gte(metricasDiarias.data, input.dataInicio),
          lte(metricasDiarias.data, input.dataFim)
        ),
        orderBy: metricasDiarias.data,
      });
    }),

  getServiceStats: protectedProcedure
    .input(dateRangeInput)
    .query(async ({ ctx, input }) => {
      const inicio = new Date(input.dataInicio);
      const fim = new Date(input.dataFim);

      const result = await ctx.db
        .select({
          servicoId: agendamentos.servicoId,
          total: sql<number>`count(*)`,
          receita: sql<number>`coalesce(sum(${agendamentos.precoFinal}), 0)`,
        })
        .from(agendamentos)
        .where(
          and(
            eq(agendamentos.barbeariaId, ctx.barbeariaId),
            eq(agendamentos.status, "concluido"),
            gte(agendamentos.dataHora, inicio),
            lte(agendamentos.dataHora, fim)
          )
        )
        .groupBy(agendamentos.servicoId);

      return result;
    }),

  getBarberStats: protectedProcedure
    .input(dateRangeInput)
    .query(async ({ ctx, input }) => {
      const inicio = new Date(input.dataInicio);
      const fim = new Date(input.dataFim);

      const result = await ctx.db
        .select({
          barbeiroId: agendamentos.barbeiroId,
          total: sql<number>`count(*)`,
          concluidos: sql<number>`count(*) filter (where ${agendamentos.status} = 'concluido')`,
          receita: sql<number>`coalesce(sum(${agendamentos.precoFinal}) filter (where ${agendamentos.status} = 'concluido'), 0)`,
        })
        .from(agendamentos)
        .where(
          and(
            eq(agendamentos.barbeariaId, ctx.barbeariaId),
            gte(agendamentos.dataHora, inicio),
            lte(agendamentos.dataHora, fim)
          )
        )
        .groupBy(agendamentos.barbeiroId);

      return result;
    }),

  listInsights: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.aiInsights.findMany({
      where: and(
        eq(aiInsights.barbeariaId, ctx.barbeariaId),
        eq(aiInsights.descartado, false)
      ),
      orderBy: [desc(aiInsights.prioridade), desc(aiInsights.criadoEm)],
      limit: 10,
    });
  }),

  dismissInsight: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(aiInsights)
        .set({ descartado: true })
        .where(
          and(
            eq(aiInsights.id, input.id),
            eq(aiInsights.barbeariaId, ctx.barbeariaId)
          )
        );
    }),
});
