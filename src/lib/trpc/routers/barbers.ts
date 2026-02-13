import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../server";
import { barbeiros } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

const horarioSchema = z.record(
  z.string(),
  z.object({
    inicio: z.string(),
    fim: z.string(),
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
        nome: z.string().min(1),
        apelido: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        corCalendario: z.string().default("#25d466"),
        especialidades: z.array(z.string()).optional(),
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
        nome: z.string().min(1).optional(),
        apelido: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        corCalendario: z.string().optional(),
        especialidades: z.array(z.string()).optional(),
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
        .where(eq(barbeiros.id, input.id))
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
