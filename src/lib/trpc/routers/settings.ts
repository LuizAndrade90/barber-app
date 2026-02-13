import { z } from "zod";
import { router, protectedProcedure, ownerProcedure } from "../server";
import { barbearias } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = router({
  getBarbearia: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.barbearias.findFirst({
      where: eq(barbearias.id, ctx.barbeariaId),
    });
  }),

  updateConfig: ownerProcedure
    .input(
      z.object({
        horarioFuncionamento: z
          .record(
            z.string(),
            z.object({
              inicio: z.string(),
              fim: z.string(),
              ativo: z.boolean(),
            })
          )
          .optional(),
        intervaloSlots: z.number().min(5).optional(),
        antecedenciaMinima: z.number().min(0).optional(),
        antecedenciaMaxima: z.number().min(1).optional(),
        cancelamentoLimite: z.number().min(0).optional(),
        confirmacaoAutomatica: z.boolean().optional(),
        lembreteAntecedencia: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const barbearia = await ctx.db.query.barbearias.findFirst({
        where: eq(barbearias.id, ctx.barbeariaId),
      });

      if (!barbearia) throw new Error("Barbearia não encontrada");

      const configAtual = (barbearia.config ?? {}) as Record<string, unknown>;
      const novaConfig = { ...configAtual, ...input } as typeof barbearia.config;

      const [updated] = await ctx.db
        .update(barbearias)
        .set({ config: novaConfig, atualizadoEm: new Date() })
        .where(eq(barbearias.id, ctx.barbeariaId))
        .returning();

      return updated;
    }),

  updateNotificacoes: ownerProcedure
    .input(
      z.object({
        novoAgendamento: z.boolean().optional(),
        cancelamento: z.boolean().optional(),
        lembrete: z.boolean().optional(),
        confirmacao: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const barbearia = await ctx.db.query.barbearias.findFirst({
        where: eq(barbearias.id, ctx.barbeariaId),
      });

      if (!barbearia) throw new Error("Barbearia não encontrada");

      const notifAtual = (barbearia.notificacoes ?? {}) as Record<string, unknown>;
      const novaNotif = { ...notifAtual, ...input } as typeof barbearia.notificacoes;

      const [updated] = await ctx.db
        .update(barbearias)
        .set({ notificacoes: novaNotif, atualizadoEm: new Date() })
        .where(eq(barbearias.id, ctx.barbeariaId))
        .returning();

      return updated;
    }),

  updateDados: ownerProcedure
    .input(
      z.object({
        nome: z.string().min(1).optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        endereco: z
          .object({
            rua: z.string().optional(),
            numero: z.string().optional(),
            complemento: z.string().optional(),
            bairro: z.string().optional(),
            cidade: z.string().optional(),
            estado: z.string().optional(),
            cep: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(barbearias)
        .set({ ...input, atualizadoEm: new Date() })
        .where(eq(barbearias.id, ctx.barbeariaId))
        .returning();

      return updated;
    }),
});
