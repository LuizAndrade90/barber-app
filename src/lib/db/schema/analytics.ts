import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  date,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";
import { barbeiros } from "./barbers";

export const metricasDiarias = pgTable(
  "metricas_diarias",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    barbeariaId: uuid("barbearia_id")
      .references(() => barbearias.id, { onDelete: "cascade" })
      .notNull(),
    barbeiroId: uuid("barbeiro_id").references(() => barbeiros.id, {
      onDelete: "set null",
    }),
    data: date("data").notNull(),
    totalAgendamentos: integer("total_agendamentos").default(0).notNull(),
    agendamentosConcluidos: integer("agendamentos_concluidos")
      .default(0)
      .notNull(),
    agendamentosCancelados: integer("agendamentos_cancelados")
      .default(0)
      .notNull(),
    agendamentosNoShow: integer("agendamentos_no_show").default(0).notNull(),
    receitaTotal: integer("receita_total").default(0).notNull(),
    ticketMedio: integer("ticket_medio").default(0).notNull(),
    taxaOcupacao: integer("taxa_ocupacao").default(0),
    novosClientes: integer("novos_clientes").default(0).notNull(),
    whatsappMensagensRecebidas: integer("whatsapp_mensagens_recebidas")
      .default(0)
      .notNull(),
    whatsappMensagensEnviadas: integer("whatsapp_mensagens_enviadas")
      .default(0)
      .notNull(),
    whatsappAgendamentos: integer("whatsapp_agendamentos")
      .default(0)
      .notNull(),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_metricas_barbearia_barbeiro_data").on(
      table.barbeariaId,
      table.barbeiroId,
      table.data
    ),
  ]
);

export const aiInsights = pgTable("ai_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  barbeariaId: uuid("barbearia_id")
    .references(() => barbearias.id, { onDelete: "cascade" })
    .notNull(),
  tipo: text("tipo", {
    enum: ["oportunidade", "alerta", "tendencia", "sugestao"],
  }).notNull(),
  categoria: text("categoria", {
    enum: [
      "receita",
      "ocupacao",
      "clientes",
      "servicos",
      "cancelamentos",
      "whatsapp",
      "geral",
    ],
  }).notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  dados: jsonb("dados"),
  prioridade: integer("prioridade").default(0).notNull(),
  lido: boolean("lido").default(false).notNull(),
  descartado: boolean("descartado").default(false).notNull(),
  expiraEm: timestamp("expira_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
