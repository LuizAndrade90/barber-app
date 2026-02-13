import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";

export const servicos = pgTable("servicos", {
  id: uuid("id").defaultRandom().primaryKey(),
  barbeariaId: uuid("barbearia_id")
    .references(() => barbearias.id, { onDelete: "cascade" })
    .notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  duracaoMinutos: integer("duracao_minutos").notNull(),
  precocentavos: integer("preco_centavos").notNull(),
  categoria: text("categoria"),
  icone: text("icone"),
  exibirWhatsapp: boolean("exibir_whatsapp").default(true).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
