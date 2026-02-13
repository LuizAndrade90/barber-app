CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" timestamp with time zone,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "agendamento_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agendamento_id" uuid NOT NULL,
	"nota" integer NOT NULL,
	"nota_corte" integer,
	"nota_atendimento" integer,
	"nota_ambiente" integer,
	"comentario" text,
	"sentimento_ia" text,
	"respondido_via" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agendamento_feedback_agendamento_id_unique" UNIQUE("agendamento_id")
);
--> statement-breakpoint
CREATE TABLE "agendamento_historico" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agendamento_id" uuid NOT NULL,
	"acao" text NOT NULL,
	"dados_anteriores" jsonb,
	"dados_novos" jsonb,
	"realizado_por" text,
	"observacao" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agendamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"barbeiro_id" uuid,
	"servico_id" uuid,
	"cliente_id" uuid,
	"data_hora" timestamp with time zone NOT NULL,
	"data_hora_fim" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'agendado' NOT NULL,
	"preco_original" integer NOT NULL,
	"preco_final" integer,
	"desconto" integer DEFAULT 0,
	"forma_pagamento" text,
	"origem" text DEFAULT 'manual' NOT NULL,
	"observacoes" text,
	"observacoes_internas" text,
	"lembrete_enviado" boolean DEFAULT false NOT NULL,
	"confirmacao_cliente" boolean,
	"confirmado_em" timestamp with time zone,
	"cancelado_em" timestamp with time zone,
	"motivo_cancelamento" text,
	"cancelado_por" text,
	"remarcado_de" uuid,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"categoria" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	"dados" jsonb,
	"prioridade" integer DEFAULT 0 NOT NULL,
	"lido" boolean DEFAULT false NOT NULL,
	"descartado" boolean DEFAULT false NOT NULL,
	"expira_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barbearias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"telefone" text,
	"email" text,
	"endereco" jsonb,
	"logo" text,
	"config" jsonb DEFAULT '{"horarioFuncionamento":{"segunda":{"inicio":"09:00","fim":"19:00","ativo":true},"terca":{"inicio":"09:00","fim":"19:00","ativo":true},"quarta":{"inicio":"09:00","fim":"19:00","ativo":true},"quinta":{"inicio":"09:00","fim":"19:00","ativo":true},"sexta":{"inicio":"09:00","fim":"19:00","ativo":true},"sabado":{"inicio":"09:00","fim":"17:00","ativo":true},"domingo":{"inicio":"09:00","fim":"13:00","ativo":false}},"intervaloSlots":30,"antecedenciaMinima":60,"antecedenciaMaxima":30,"cancelamentoLimite":120,"confirmacaoAutomatica":false,"lembreteAntecedencia":120}'::jsonb,
	"notificacoes" jsonb DEFAULT '{"novoAgendamento":true,"cancelamento":true,"lembrete":true,"confirmacao":true}'::jsonb,
	"mensagens" jsonb DEFAULT '{"boasVindas":"Olá! Bem-vindo à {barbearia}. Como posso ajudar?","confirmacao":"Seu agendamento foi confirmado para {data} às {hora}.","lembrete":"Lembrete: Você tem um agendamento amanhã às {hora} na {barbearia}.","cancelamento":"Seu agendamento foi cancelado com sucesso.","posAtendimento":"Obrigado pela visita! Como foi sua experiência? Avalie de 1 a 5."}'::jsonb,
	"plano" text DEFAULT 'trial' NOT NULL,
	"whatsapp_numero" text,
	"whatsapp_token" text,
	"whatsapp_verify_token" text,
	"n8n_webhook_url" text,
	"n8n_api_key" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barbearias_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "barbeiros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"usuario_id" uuid,
	"nome" text NOT NULL,
	"apelido" text,
	"telefone" text,
	"email" text,
	"avatar" text,
	"cor_calendario" text DEFAULT '#25d466' NOT NULL,
	"especialidades" text[],
	"comissao" integer DEFAULT 0,
	"horario_personalizado" jsonb,
	"total_atendimentos" integer DEFAULT 0 NOT NULL,
	"avaliacao_media" integer DEFAULT 0,
	"receita_mes" integer DEFAULT 0,
	"ordem" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bloqueios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"barbeiro_id" uuid,
	"tipo" text NOT NULL,
	"titulo" text,
	"data_inicio" timestamp with time zone NOT NULL,
	"data_fim" timestamp with time zone NOT NULL,
	"dia_inteiro" boolean DEFAULT false NOT NULL,
	"recorrencia" jsonb,
	"observacao" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cliente_metricas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"total_visitas" integer DEFAULT 0 NOT NULL,
	"total_gasto" integer DEFAULT 0 NOT NULL,
	"ticket_medio" integer DEFAULT 0 NOT NULL,
	"ultima_visita" timestamp with time zone,
	"frequencia_dias" integer,
	"cancelamentos" integer DEFAULT 0 NOT NULL,
	"no_shows" integer DEFAULT 0 NOT NULL,
	"score_confiabilidade" integer DEFAULT 100 NOT NULL,
	"score_fidelidade" integer DEFAULT 0 NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cliente_metricas_cliente_id_unique" UNIQUE("cliente_id")
);
--> statement-breakpoint
CREATE TABLE "cliente_preferencias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"barbeiro_preferido_id" uuid,
	"horario_preferido" text,
	"dia_preferido" text,
	"servicos_favoritos" uuid[],
	"observacoes_corte" text,
	"produtos_preferidos" text[],
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cliente_preferencias_cliente_id_unique" UNIQUE("cliente_id")
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"whatsapp" text,
	"telefone" text,
	"email" text,
	"data_nascimento" timestamp with time zone,
	"genero" text,
	"endereco" jsonb,
	"observacoes" text,
	"tags" text[],
	"fonte" text DEFAULT 'manual',
	"vip" boolean DEFAULT false NOT NULL,
	"bloqueado" boolean DEFAULT false NOT NULL,
	"motivo_bloqueio" text,
	"avatar" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"cliente_id" uuid,
	"whatsapp_from" text NOT NULL,
	"whatsapp_nome" text,
	"estado" text DEFAULT 'inicio' NOT NULL,
	"contexto" jsonb,
	"ultima_interacao" timestamp with time zone DEFAULT now() NOT NULL,
	"expira_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mensagens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversa_id" uuid NOT NULL,
	"direcao" text NOT NULL,
	"tipo" text DEFAULT 'texto' NOT NULL,
	"conteudo" text NOT NULL,
	"whatsapp_message_id" text,
	"whatsapp_status" text,
	"intencao_detectada" text,
	"metadados" jsonb,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metricas_diarias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"barbeiro_id" uuid,
	"data" date NOT NULL,
	"total_agendamentos" integer DEFAULT 0 NOT NULL,
	"agendamentos_concluidos" integer DEFAULT 0 NOT NULL,
	"agendamentos_cancelados" integer DEFAULT 0 NOT NULL,
	"agendamentos_no_show" integer DEFAULT 0 NOT NULL,
	"receita_total" integer DEFAULT 0 NOT NULL,
	"ticket_medio" integer DEFAULT 0 NOT NULL,
	"taxa_ocupacao" integer DEFAULT 0,
	"novos_clientes" integer DEFAULT 0 NOT NULL,
	"whatsapp_mensagens_recebidas" integer DEFAULT 0 NOT NULL,
	"whatsapp_mensagens_enviadas" integer DEFAULT 0 NOT NULL,
	"whatsapp_agendamentos" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"duracao_minutos" integer NOT NULL,
	"preco_centavos" integer NOT NULL,
	"categoria" text,
	"icone" text,
	"exibir_whatsapp" boolean DEFAULT true NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbearia_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"email_verificado" timestamp with time zone,
	"senha" text,
	"image" text,
	"role" text DEFAULT 'barber' NOT NULL,
	"permissoes" jsonb DEFAULT '{"gerenciarEquipe":false,"gerenciarServicos":false,"gerenciarClientes":false,"verRelatorios":false,"gerenciarConfiguracoes":false,"gerenciarWhatsApp":false}'::jsonb,
	"ativo" boolean DEFAULT true NOT NULL,
	"ultimo_login" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_usuarios_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_feedback" ADD CONSTRAINT "agendamento_feedback_agendamento_id_agendamentos_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "public"."agendamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_historico" ADD CONSTRAINT "agendamento_historico_agendamento_id_agendamentos_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "public"."agendamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_barbeiro_id_barbeiros_id_fk" FOREIGN KEY ("barbeiro_id") REFERENCES "public"."barbeiros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servico_id_servicos_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."servicos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barbeiros" ADD CONSTRAINT "barbeiros_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barbeiros" ADD CONSTRAINT "barbeiros_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bloqueios" ADD CONSTRAINT "bloqueios_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bloqueios" ADD CONSTRAINT "bloqueios_barbeiro_id_barbeiros_id_fk" FOREIGN KEY ("barbeiro_id") REFERENCES "public"."barbeiros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cliente_metricas" ADD CONSTRAINT "cliente_metricas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cliente_preferencias" ADD CONSTRAINT "cliente_preferencias_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cliente_preferencias" ADD CONSTRAINT "cliente_preferencias_barbeiro_preferido_id_barbeiros_id_fk" FOREIGN KEY ("barbeiro_preferido_id") REFERENCES "public"."barbeiros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversas" ADD CONSTRAINT "conversas_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversas" ADD CONSTRAINT "conversas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_conversa_id_conversas_id_fk" FOREIGN KEY ("conversa_id") REFERENCES "public"."conversas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metricas_diarias" ADD CONSTRAINT "metricas_diarias_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metricas_diarias" ADD CONSTRAINT "metricas_diarias_barbeiro_id_barbeiros_id_fk" FOREIGN KEY ("barbeiro_id") REFERENCES "public"."barbeiros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_usuarios_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_barbearia_id_barbearias_id_fk" FOREIGN KEY ("barbearia_id") REFERENCES "public"."barbearias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agendamentos_barbearia_data" ON "agendamentos" USING btree ("barbearia_id","data_hora");--> statement-breakpoint
CREATE INDEX "idx_agendamentos_barbeiro_data" ON "agendamentos" USING btree ("barbeiro_id","data_hora");--> statement-breakpoint
CREATE INDEX "idx_agendamentos_cliente" ON "agendamentos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "idx_agendamentos_status" ON "agendamentos" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_conversas_barbearia_whatsapp" ON "conversas" USING btree ("barbearia_id","whatsapp_from");--> statement-breakpoint
CREATE INDEX "idx_mensagens_conversa" ON "mensagens" USING btree ("conversa_id");--> statement-breakpoint
CREATE INDEX "idx_mensagens_criado_em" ON "mensagens" USING btree ("criado_em");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_metricas_barbearia_barbeiro_data" ON "metricas_diarias" USING btree ("barbearia_id","barbeiro_id","data");