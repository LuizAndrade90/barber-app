import { z } from "zod";
import { router, protectedProcedure, ownerProcedure } from "../server";
import { barbearias } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";

export const settingsRouter = router({
  getBarbearia: protectedProcedure.query(async ({ ctx }) => {
    const barbearia = await ctx.db.query.barbearias.findFirst({
      where: eq(barbearias.id, ctx.barbeariaId),
    });

    if (!barbearia) return null;

    // Nunca expor segredos ao client
    return {
      ...barbearia,
      whatsappToken: barbearia.whatsappToken ? "••••••••" : null,
      whatsappVerifyToken: barbearia.whatsappVerifyToken ? "••••••••" : null,
      n8nApiKey: barbearia.n8nApiKey ? "••••••••" : null,
      n8nWebhookUrl: barbearia.n8nWebhookUrl ? "••••••••" : null,
    };
  }),

  updateConfig: ownerProcedure
    .input(
      z.object({
        horarioFuncionamento: z
          .record(
            z.string(),
            z.object({
              inicio: z.string().regex(/^\d{2}:\d{2}$/),
              fim: z.string().regex(/^\d{2}:\d{2}$/),
              ativo: z.boolean(),
            })
          )
          .optional(),
        intervaloSlots: z.number().int().min(5).max(120).optional(),
        antecedenciaMinima: z.number().int().min(0).max(1440).optional(),
        antecedenciaMaxima: z.number().int().min(1).max(90).optional(),
        cancelamentoLimite: z.number().int().min(0).max(1440).optional(),
        confirmacaoAutomatica: z.boolean().optional(),
        lembreteAntecedencia: z.number().int().min(0).max(1440).optional(),
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
        nome: z.string().min(1).max(100).optional(),
        telefone: z.string().max(20).optional(),
        email: z.string().email().max(100).optional(),
        endereco: z
          .object({
            rua: z.string().max(200).optional(),
            numero: z.string().max(20).optional(),
            complemento: z.string().max(100).optional(),
            bairro: z.string().max(100).optional(),
            cidade: z.string().max(100).optional(),
            estado: z.string().max(2).optional(),
            cep: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
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

  updateWhatsapp: ownerProcedure
    .input(
      z.object({
        whatsappNumero: z.string().max(20).optional(),
        whatsappToken: z.string().max(500).optional(),
        whatsappVerifyToken: z.string().max(200).optional(),
        n8nWebhookUrl: z.string().url().max(500).optional(),
        n8nApiKey: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, unknown> = {
        atualizadoEm: new Date(),
      };

      if (input.whatsappNumero !== undefined) {
        updateData.whatsappNumero = input.whatsappNumero;
      }
      // Criptografar segredos antes de salvar
      if (input.whatsappToken !== undefined) {
        updateData.whatsappToken = encrypt(input.whatsappToken);
      }
      if (input.whatsappVerifyToken !== undefined) {
        updateData.whatsappVerifyToken = encrypt(input.whatsappVerifyToken);
      }
      if (input.n8nWebhookUrl !== undefined) {
        updateData.n8nWebhookUrl = input.n8nWebhookUrl;
      }
      if (input.n8nApiKey !== undefined) {
        updateData.n8nApiKey = encrypt(input.n8nApiKey);
      }

      const [updated] = await ctx.db
        .update(barbearias)
        .set(updateData)
        .where(eq(barbearias.id, ctx.barbeariaId))
        .returning();

      return {
        ...updated,
        whatsappToken: updated.whatsappToken ? "••••••••" : null,
        whatsappVerifyToken: updated.whatsappVerifyToken ? "••••••••" : null,
        n8nApiKey: updated.n8nApiKey ? "••••••••" : null,
      };
    }),
});
