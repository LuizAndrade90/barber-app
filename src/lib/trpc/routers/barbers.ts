import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../server";
import { barbeiros } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

const horarioSchema = z.record(
  z.string().max(20),
  z.object({
    inicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    fim: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    ativo: z.boolean(),
  })
);

export const barbersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.barbeiros.findMany({
      where: eq(barbeiros.barbeariaId, ctx.barbeariaId),
      orderBy: [asc(barbeiros.ordem), asc(barbeiros.nome)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.barbeiros.findFirst({
        where: and(
          eq(barbeiros.id, input.id),
          eq(barbeiros.barbeariaId, ctx.barbeariaId)
        ),
        with: {
          usuario: true,
        },
      });
    }),

  create: managerProcedure
    .input(
      z.object({
        nome: z.string().min(1).max(100),
        apelido: z.string().max(50).optional(),
        telefone: z.string().max(20).optional(),
        email: z.string().email().max(100).optional(),
        corCalendario: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#25d466"),
        especialidades: z.array(z.string().max(50)).max(20).optional(),
        comissao: z.number().min(0).max(100).default(0),
        horarioPersonalizado: horarioSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const maxOrdem = await ctx.db.query.barbeiros.findFirst({
        where: eq(barbeiros.barbeariaId, ctx.barbeariaId),
        orderBy: (b, { desc }) => [desc(b.ordem)],
      });

      const [novo] = await ctx.db
        .insert(barbeiros)
        .values({
          barbeariaId: ctx.barbeariaId,
          ...input,
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
        apelido: z.string().max(50).optional(),
        telefone: z.string().max(20).optional(),
        email: z.string().email().max(100).optional(),
        corCalendario: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        especialidades: z.array(z.string().max(50)).max(20).optional(),
        comissao: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      const [updated] = await ctx.db
        .update(barbeiros)
        .set({ ...rest, atualizadoEm: new Date() })
        .where(
          and(
            eq(barbeiros.id, id),
            eq(barbeiros.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),

  toggleActive: managerProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const barbeiro = await ctx.db.query.barbeiros.findFirst({
        where: and(
          eq(barbeiros.id, input.id),
          eq(barbeiros.barbeariaId, ctx.barbeariaId)
        ),
      });

      if (!barbeiro) throw new Error("Barbeiro não encontrado");

      const [updated] = await ctx.db
        .update(barbeiros)
        .set({ ativo: !barbeiro.ativo, atualizadoEm: new Date() })
        .where(
          and(
            eq(barbeiros.id, input.id),
            eq(barbeiros.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),

  updateSchedule: managerProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        horarioPersonalizado: horarioSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(barbeiros)
        .set({
          horarioPersonalizado: input.horarioPersonalizado,
          atualizadoEm: new Date(),
        })
        .where(
          and(
            eq(barbeiros.id, input.id),
            eq(barbeiros.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),
});
