import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";
import { usuarios } from "./users";

export const barbeiros = pgTable("barbeiros", {
  id: uuid("id").defaultRandom().primaryKey(),
  barbeariaId: uuid("barbearia_id")
    .references(() => barbearias.id, { onDelete: "cascade" })
    .notNull(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, {
    onDelete: "set null",
  }),
  nome: text("nome").notNull(),
  apelido: text("apelido"),
  telefone: text("telefone"),
  email: text("email"),
  avatar: text("avatar"),
  corCalendario: text("cor_calendario").default("#25d466").notNull(),
  especialidades: text("especialidades").array(),
  comissao: integer("comissao").default(0),
  horarioPersonalizado: jsonb("horario_personalizado").$type<{
    [dia: string]: { inicio: string; fim: string; ativo: boolean };
  }>(),
  // Metricas desnormalizadas
  totalAtendimentos: integer("total_atendimentos").default(0).notNull(),
  avaliacaoMedia: integer("avaliacao_media").default(0),
  receitaMes: integer("receita_mes").default(0),
  ordem: integer("ordem").default(0).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
