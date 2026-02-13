import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { barbearias } from "./tenants";
import { clientes } from "./clients";

export const conversas = pgTable(
  "conversas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    barbeariaId: uuid("barbearia_id")
      .references(() => barbearias.id, { onDelete: "cascade" })
      .notNull(),
    clienteId: uuid("cliente_id").references(() => clientes.id, {
      onDelete: "set null",
    }),
    whatsappFrom: text("whatsapp_from").notNull(),
    whatsappNome: text("whatsapp_nome"),
    estado: text("estado", {
      enum: [
        "inicio",
        "identificacao",
        "menu_principal",
        "agendar_barbeiro",
        "agendar_servico",
        "agendar_data",
        "agendar_horario",
        "agendar_confirmacao",
        "consultar",
        "cancelar",
        "remarcar",
        "avaliar",
        "falar_humano",
        "finalizado",
      ],
    })
      .default("inicio")
      .notNull(),
    contexto: jsonb("contexto").$type<{
      barbeiroId?: string;
      servicoId?: string;
      data?: string;
      horario?: string;
      agendamentoId?: string;
      tentativas?: number;
      [key: string]: unknown;
    }>(),
    ultimaInteracao: timestamp("ultima_interacao", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiraEm: timestamp("expira_em", { withTimezone: true }),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_conversas_barbearia_whatsapp").on(
      table.barbeariaId,
      table.whatsappFrom
    ),
  ]
);

export const mensagens = pgTable(
  "mensagens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversaId: uuid("conversa_id")
      .references(() => conversas.id, { onDelete: "cascade" })
      .notNull(),
    direcao: text("direcao", { enum: ["entrada", "saida"] }).notNull(),
    tipo: text("tipo", {
      enum: ["texto", "imagem", "audio", "documento", "localizacao", "botao"],
    })
      .default("texto")
      .notNull(),
    conteudo: text("conteudo").notNull(),
    whatsappMessageId: text("whatsapp_message_id"),
    whatsappStatus: text("whatsapp_status", {
      enum: ["enviado", "entregue", "lido", "erro"],
    }),
    intencaoDetectada: text("intencao_detectada"),
    metadados: jsonb("metadados"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_mensagens_conversa").on(table.conversaId),
    index("idx_mensagens_criado_em").on(table.criadoEm),
  ]
);
