import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { N8nResponse } from "@/lib/n8n/types";
import {
  handleGetContext,
  handleGetSlots,
  handleCreateAppointment,
  handleCancelAppointment,
  handleGetAppointments,
  handleUpdateConversation,
  handleLogMessage,
} from "@/lib/n8n/handlers";
import { db } from "@/lib/db";
import { barbearias } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { timingSafeEqual } from "crypto";

// Zod schemas para cada action
const getContextSchema = z.object({
  whatsappFrom: z.string().min(1).max(30),
});

const getSlotsSchema = z.object({
  barbeiroId: z.string().uuid(),
  servicoId: z.string().uuid(),
  data: z.string().max(20),
});

const createAppointmentSchema = z.object({
  barbeiroId: z.string().uuid(),
  servicoId: z.string().uuid(),
  clienteId: z.string().uuid(),
  dataHora: z.string().max(30),
});

const cancelAppointmentSchema = z.object({
  agendamentoId: z.string().uuid(),
  motivo: z.string().max(500).optional(),
});

const getAppointmentsSchema = z.object({
  clienteId: z.string().uuid().optional(),
  whatsappFrom: z.string().max(30).optional(),
  data: z.string().max(20).optional(),
});

const updateConversationSchema = z.object({
  whatsappFrom: z.string().min(1).max(30),
  estado: z.string().max(30),
  contexto: z.record(z.string(), z.unknown()).optional(),
});

const logMessageSchema = z.object({
  conversaId: z.string().uuid(),
  direcao: z.enum(["entrada", "saida"]),
  tipo: z.string().max(20).optional(),
  conteudo: z.string().max(5000),
  whatsappMessageId: z.string().max(100).optional(),
  intencaoDetectada: z.string().max(100).optional(),
});

const requestSchema = z.object({
  action: z.enum([
    "getContext",
    "getSlots",
    "createAppointment",
    "cancelAppointment",
    "getAppointments",
    "updateConversation",
    "logMessage",
  ]),
  barbeariaId: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
});

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function badRequest() {
  return NextResponse.json<N8nResponse>(
    { success: false, error: "Dados inválidos para esta ação" },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  // Autenticacao por API key com comparacao timing-safe
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.N8N_API_KEY;

  if (!apiKey || !expectedKey || !safeCompare(apiKey, expectedKey)) {
    return NextResponse.json<N8nResponse>(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    // Validar estrutura do request
    const parseResult = requestSchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json<N8nResponse>(
        { success: false, error: "Payload inválido" },
        { status: 400 }
      );
    }

    const { action, barbeariaId, data } = parseResult.data;

    // Verificar que a barbearia existe e esta ativa
    const barbearia = await db.query.barbearias.findFirst({
      where: eq(barbearias.id, barbeariaId),
    });

    if (!barbearia || !barbearia.ativo) {
      return NextResponse.json<N8nResponse>(
        { success: false, error: "Barbearia não encontrada" },
        { status: 404 }
      );
    }

    let result: unknown;

    switch (action) {
      case "getContext": {
        const parsed = getContextSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleGetContext(barbeariaId, parsed.data);
        break;
      }
      case "getSlots": {
        const parsed = getSlotsSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleGetSlots(barbeariaId, parsed.data);
        break;
      }
      case "createAppointment": {
        const parsed = createAppointmentSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleCreateAppointment(barbeariaId, parsed.data);
        break;
      }
      case "cancelAppointment": {
        const parsed = cancelAppointmentSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleCancelAppointment(barbeariaId, parsed.data);
        break;
      }
      case "getAppointments": {
        const parsed = getAppointmentsSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleGetAppointments(barbeariaId, parsed.data);
        break;
      }
      case "updateConversation": {
        const parsed = updateConversationSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleUpdateConversation(barbeariaId, parsed.data);
        break;
      }
      case "logMessage": {
        const parsed = logMessageSchema.safeParse(data);
        if (!parsed.success) return badRequest();
        result = await handleLogMessage(barbeariaId, parsed.data);
        break;
      }
    }

    return NextResponse.json<N8nResponse>({ success: true, data: result });
  } catch (error) {
    console.error("Webhook n8n error:", error instanceof Error ? error.message : "unknown");
    // Nunca expor detalhes internos de erro
    return NextResponse.json<N8nResponse>(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
