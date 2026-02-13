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

export const clientes = pgTable("clientes", {
  id: uuid("id").defaultRandom().primaryKey(),
  barbeariaId: uuid("barbearia_id")
    .references(() => barbearias.id, { onDelete: "cascade" })
    .notNull(),
  nome: text("nome").notNull(),
  whatsapp: text("whatsapp"),
  telefone: text("telefone"),
  email: text("email"),
  dataNascimento: timestamp("data_nascimento", { withTimezone: true }),
  genero: text("genero", { enum: ["masculino", "feminino", "outro"] }),
  endereco: jsonb("endereco").$type<{
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  }>(),
  observacoes: text("observacoes"),
  tags: text("tags").array(),
  fonte: text("fonte", {
    enum: ["whatsapp", "manual", "indicacao", "instagram", "outro"],
  }).default("manual"),
  vip: boolean("vip").default(false).notNull(),
  bloqueado: boolean("bloqueado").default(false).notNull(),
  motivoBloqueio: text("motivo_bloqueio"),
  avatar: text("avatar"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const clienteMetricas = pgTable("cliente_metricas", {
  id: uuid("id").defaultRandom().primaryKey(),
  clienteId: uuid("cliente_id")
    .references(() => clientes.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  totalVisitas: integer("total_visitas").default(0).notNull(),
  totalGasto: integer("total_gasto").default(0).notNull(),
  ticketMedio: integer("ticket_medio").default(0).notNull(),
  ultimaVisita: timestamp("ultima_visita", { withTimezone: true }),
  frequenciaDias: integer("frequencia_dias"),
  cancelamentos: integer("cancelamentos").default(0).notNull(),
  noShows: integer("no_shows").default(0).notNull(),
  scoreConfiabilidade: integer("score_confiabilidade").default(100).notNull(),
  scoreFidelidade: integer("score_fidelidade").default(0).notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const clientePreferencias = pgTable("cliente_preferencias", {
  id: uuid("id").defaultRandom().primaryKey(),
  clienteId: uuid("cliente_id")
    .references(() => clientes.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  barbeiroPreferidoId: uuid("barbeiro_preferido_id").references(
    () => barbeiros.id,
    { onDelete: "set null" }
  ),
  horarioPreferido: text("horario_preferido"),
  diaPreferido: text("dia_preferido"),
  servicosFavoritos: uuid("servicos_favoritos").array(),
  observacoesCorte: text("observacoes_corte"),
  produtosPreferidos: text("produtos_preferidos").array(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
