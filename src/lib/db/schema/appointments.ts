import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";
import { barbeiros } from "./barbers";
import { servicos } from "./services";
import { clientes } from "./clients";

export const agendamentos = pgTable(
  "agendamentos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    barbeariaId: uuid("barbearia_id")
      .references(() => barbearias.id, { onDelete: "cascade" })
      .notNull(),
    barbeiroId: uuid("barbeiro_id")
      .references(() => barbeiros.id, { onDelete: "set null" }),
    servicoId: uuid("servico_id")
      .references(() => servicos.id, { onDelete: "set null" }),
    clienteId: uuid("cliente_id")
      .references(() => clientes.id, { onDelete: "set null" }),
    dataHora: timestamp("data_hora", { withTimezone: true }).notNull(),
    dataHoraFim: timestamp("data_hora_fim", { withTimezone: true }).notNull(),
    status: text("status", {
      enum: [
        "agendado",
        "confirmado",
        "em_atendimento",
        "concluido",
        "cancelado",
        "no_show",
      ],
    })
      .default("agendado")
      .notNull(),
    precoOriginal: integer("preco_original").notNull(),
    precoFinal: integer("preco_final"),
    desconto: integer("desconto").default(0),
    formaPagamento: text("forma_pagamento", {
      enum: ["dinheiro", "pix", "cartao_credito", "cartao_debito"],
    }),
    origem: text("origem", {
      enum: ["whatsapp", "manual", "app"],
    })
      .default("manual")
      .notNull(),
    observacoes: text("observacoes"),
    observacoesInternas: text("observacoes_internas"),
    lembreteEnviado: boolean("lembrete_enviado").default(false).notNull(),
    confirmacaoCliente: boolean("confirmacao_cliente"),
    confirmadoEm: timestamp("confirmado_em", { withTimezone: true }),
    canceladoEm: timestamp("cancelado_em", { withTimezone: true }),
    motivoCancelamento: text("motivo_cancelamento"),
    canceladoPor: text("cancelado_por", {
      enum: ["cliente", "barbeiro", "sistema"],
    }),
    remarcadoDe: uuid("remarcado_de"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_agendamentos_barbearia_data").on(
      table.barbeariaId,
      table.dataHora
    ),
    index("idx_agendamentos_barbeiro_data").on(
      table.barbeiroId,
      table.dataHora
    ),
    index("idx_agendamentos_cliente").on(table.clienteId),
    index("idx_agendamentos_status").on(table.status),
  ]
);

export const agendamentoHistorico = pgTable("agendamento_historico", {
  id: uuid("id").defaultRandom().primaryKey(),
  agendamentoId: uuid("agendamento_id")
    .references(() => agendamentos.id, { onDelete: "cascade" })
    .notNull(),
  acao: text("acao", {
    enum: [
      "criado",
      "confirmado",
      "iniciado",
      "concluido",
      "cancelado",
      "remarcado",
      "no_show",
      "editado",
    ],
  }).notNull(),
  dadosAnteriores: jsonb("dados_anteriores"),
  dadosNovos: jsonb("dados_novos"),
  realizadoPor: text("realizado_por"),
  observacao: text("observacao"),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const agendamentoFeedback = pgTable("agendamento_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  agendamentoId: uuid("agendamento_id")
    .references(() => agendamentos.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  nota: integer("nota").notNull(),
  notaCorte: integer("nota_corte"),
  notaAtendimento: integer("nota_atendimento"),
  notaAmbiente: integer("nota_ambiente"),
  comentario: text("comentario"),
  sentimentoIA: text("sentimento_ia", {
    enum: ["positivo", "neutro", "negativo"],
  }),
  respondidoVia: text("respondido_via", {
    enum: ["whatsapp", "app"],
  }),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
