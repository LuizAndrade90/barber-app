import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../server";
import { servicos } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

export const servicesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.servicos.findMany({
      where: eq(servicos.barbeariaId, ctx.barbeariaId),
      orderBy: [asc(servicos.ordem), asc(servicos.nome)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.servicos.findFirst({
        where: and(
          eq(servicos.id, input.id),
          eq(servicos.barbeariaId, ctx.barbeariaId)
        ),
      });
    }),

  create: managerProcedure
    .input(
      z.object({
        nome: z.string().min(1).max(100),
        descricao: z.string().max(500).optional(),
        duracaoMinutos: z.number().int().min(5).max(480),
        precoCentavos: z.number().int().min(0).max(100000),
        categoria: z.string().max(50).optional(),
        icone: z.string().max(50).optional(),
        exibirWhatsapp: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const maxOrdem = await ctx.db.query.servicos.findFirst({
        where: eq(servicos.barbeariaId, ctx.barbeariaId),
        orderBy: (s, { desc }) => [desc(s.ordem)],
      });

      const [novo] = await ctx.db
        .insert(servicos)
        .values({
          barbeariaId: ctx.barbeariaId,
          ...input,
          precocentavos: input.precoCentavos,
          ordem: (maxOrdem?.ordem ?? 0) + 1,
        })
        .returning();

      return novo;
    }),

  update: managerProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        nome: z.string().min(1).max(100).optional(),
        descricao: z.string().max(500).optional(),
        duracaoMinutos: z.number().int().min(5).max(480).optional(),
        precoCentavos: z.number().int().min(0).max(100000).optional(),
        categoria: z.string().max(50).optional(),
        icone: z.string().max(50).optional(),
        exibirWhatsapp: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, precoCentavos, ...rest } = input;
      const updateData: Record<string, unknown> = {
        ...rest,
        atualizadoEm: new Date(),
      };
      if (precoCentavos !== undefined) {
        updateData.precocentavos = precoCentavos;
      }

      const [updated] = await ctx.db
        .update(servicos)
        .set(updateData)
        .where(
          and(
            eq(servicos.id, id),
            eq(servicos.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),

  toggleActive: managerProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const servico = await ctx.db.query.servicos.findFirst({
        where: and(
          eq(servicos.id, input.id),
          eq(servicos.barbeariaId, ctx.barbeariaId)
        ),
      });

      if (!servico) throw new Error("Serviço não encontrado");

      const [updated] = await ctx.db
        .update(servicos)
        .set({ ativo: !servico.ativo, atualizadoEm: new Date() })
        .where(
          and(
            eq(servicos.id, input.id),
            eq(servicos.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),

  reorder: managerProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async ({ ctx, input }) => {
      for (let i = 0; i < input.ids.length; i++) {
        await ctx.db
          .update(servicos)
          .set({ ordem: i + 1 })
          .where(
            and(
              eq(servicos.id, input.ids[i]),
              eq(servicos.barbeariaId, ctx.barbeariaId)
            )
          );
      }
    }),
});
