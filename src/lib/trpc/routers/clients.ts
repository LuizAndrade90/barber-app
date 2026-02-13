import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { clientes, clienteMetricas, clientePreferencias, agendamentos } from "@/lib/db/schema";
import { eq, and, ilike, or, desc, asc, sql } from "drizzle-orm";

export const clientsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        busca: z.string().optional(),
        filtro: z.enum(["todos", "vip", "novos", "inativos"]).default("todos"),
        pagina: z.number().min(1).default(1),
        porPagina: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(clientes.barbeariaId, ctx.barbeariaId)];

      if (input.busca) {
        conditions.push(
          or(
            ilike(clientes.nome, `%${input.busca}%`),
            ilike(clientes.whatsapp, `%${input.busca}%`),
            ilike(clientes.email, `%${input.busca}%`)
          )!
        );
      }

      if (input.filtro === "vip") {
        conditions.push(eq(clientes.vip, true));
      }

      const offset = (input.pagina - 1) * input.porPagina;

      const items = await ctx.db.query.clientes.findMany({
        where: and(...conditions),
        with: { metricas: true },
        orderBy: [asc(clientes.nome)],
        limit: input.porPagina,
        offset,
      });

      return items;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const cliente = await ctx.db.query.clientes.findFirst({
        where: and(
          eq(clientes.id, input.id),
          eq(clientes.barbeariaId, ctx.barbeariaId)
        ),
        with: {
          metricas: true,
          preferencias: true,
        },
      });

      if (!cliente) throw new Error("Cliente não encontrado");

      // Ultimos agendamentos
      const ultimosAgendamentos = await ctx.db.query.agendamentos.findMany({
        where: and(
          eq(agendamentos.clienteId, input.id),
          eq(agendamentos.barbeariaId, ctx.barbeariaId)
        ),
        with: { barbeiro: true, servico: true },
        orderBy: desc(agendamentos.dataHora),
        limit: 10,
      });

      return { ...cliente, ultimosAgendamentos };
    }),

  create: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1),
        whatsapp: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        observacoes: z.string().optional(),
        tags: z.array(z.string()).optional(),
        fonte: z
          .enum(["whatsapp", "manual", "indicacao", "instagram", "outro"])
          .default("manual"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [novo] = await ctx.db
        .insert(clientes)
        .values({
          barbeariaId: ctx.barbeariaId,
          ...input,
        })
        .returning();

      // Criar metricas vazias
      await ctx.db.insert(clienteMetricas).values({
        clienteId: novo.id,
      });

      return novo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        nome: z.string().min(1).optional(),
        whatsapp: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        observacoes: z.string().optional(),
        tags: z.array(z.string()).optional(),
        vip: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      const [updated] = await ctx.db
        .update(clientes)
        .set({ ...rest, atualizadoEm: new Date() })
        .where(
          and(
            eq(clientes.id, id),
            eq(clientes.barbeariaId, ctx.barbeariaId)
          )
        )
        .returning();

      return updated;
    }),

  search: protectedProcedure
    .input(z.object({ termo: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.clientes.findMany({
        where: and(
          eq(clientes.barbeariaId, ctx.barbeariaId),
          or(
            ilike(clientes.nome, `%${input.termo}%`),
            ilike(clientes.whatsapp, `%${input.termo}%`)
          )
        ),
        limit: 10,
        orderBy: asc(clientes.nome),
      });
    }),
});
