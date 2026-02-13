import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";
import { barbeiros } from "./barbers";

export const bloqueios = pgTable("bloqueios", {
  id: uuid("id").defaultRandom().primaryKey(),
  barbeariaId: uuid("barbearia_id")
    .references(() => barbearias.id, { onDelete: "cascade" })
    .notNull(),
  barbeiroId: uuid("barbeiro_id").references(() => barbeiros.id, {
    onDelete: "cascade",
  }),
  tipo: text("tipo", {
    enum: ["almoco", "folga", "ferias", "feriado", "outro"],
  }).notNull(),
  titulo: text("titulo"),
  dataInicio: timestamp("data_inicio", { withTimezone: true }).notNull(),
  dataFim: timestamp("data_fim", { withTimezone: true }).notNull(),
  diaInteiro: boolean("dia_inteiro").default(false).notNull(),
  recorrencia: jsonb("recorrencia").$type<{
    tipo: "diario" | "semanal" | "mensal";
    diasSemana?: number[];
    intervalo?: number;
    dataFimRecorrencia?: string;
  }>(),
  observacao: text("observacao"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
