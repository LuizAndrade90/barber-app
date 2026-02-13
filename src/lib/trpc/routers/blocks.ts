import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../server";
import { bloqueios } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const blocksRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        barbeiroId: z.string().uuid().optional(),
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}/).max(30).optional(),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}/).max(30).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(bloqueios.barbeariaId, ctx.barbeariaId),
        eq(bloqueios.ativo, true),
      ];

      if (input.barbeiroId) {
        conditions.push(eq(bloqueios.barbeiroId, input.barbeiroId));
      }

      if (input.dataInicio) {
        conditions.push(gte(bloqueios.dataInicio, new Date(input.dataInicio)));
      }

      if (input.dataFim) {
        conditions.push(lte(bloqueios.dataFim, new Date(input.dataFim)));
      }

      return ctx.db.query.bloqueios.findMany({
        where: and(...conditions),
        with: { barbeiro: true },
        orderBy: bloqueios.dataInicio,
      });
    }),

  create: managerProcedure
    .input(
      z.object({
        barbeiroId: z.string().uuid().optional(),
        tipo: z.enum(["almoco", "folga", "ferias", "feriado", "outro"]),
        titulo: z.string().max(100).optional(),
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}/).max(30),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}/).max(30),
        diaInteiro: z.boolean().default(false),
        recorrencia: z
          .object({
            tipo: z.enum(["diario", "semanal", "mensal"]),
            diasSemana: z.array(z.number().int().min(0).max(6)).max(7).optional(),
            intervalo: z.number().int().min(1).max(12).optional(),
            dataFimRecorrencia: z.string().max(30).optional(),
          })
          .optional(),
        observacao: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [novo] = await ctx.db
        .insert(bloqueios)
        .values({
          barbeariaId: ctx.barbeariaId,
          barbeiroId: input.barbeiroId,
          tipo: input.tipo,
          titulo: input.titulo,
          dataInicio: new Date(input.dataInicio),
          dataFim: new Date(input.dataFim),
          diaInteiro: input.diaInteiro,
          recorrencia: input.recorrencia,
          observacao: input.observacao,
        })
        .returning();

      return novo;
    }),

  delete: managerProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(bloqueios)
        .set({ ativo: false, atualizadoEm: new Date() })
        .where(
          and(
            eq(bloqueios.id, input.id),
            eq(bloqueios.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),
});
