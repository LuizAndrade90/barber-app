import { NextRequest, NextResponse } from "next/server";
import type { N8nRequest, N8nResponse } from "@/lib/n8n/types";
import {
  handleGetContext,
  handleGetSlots,
  handleCreateAppointment,
  handleCancelAppointment,
  handleGetAppointments,
  handleUpdateConversation,
  handleLogMessage,
} from "@/lib/n8n/handlers";

export async function POST(request: NextRequest) {
  // Autenticacao por API key
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.N8N_API_KEY) {
    return NextResponse.json<N8nResponse>(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as N8nRequest;
    const { action, barbeariaId, data } = body;

    if (!action || !barbeariaId) {
      return NextResponse.json<N8nResponse>(
        { success: false, error: "action e barbeariaId são obrigatórios" },
        { status: 400 }
      );
    }

    let result: unknown;

    switch (action) {
      case "getContext":
        result = await handleGetContext(barbeariaId, data as any);
        break;
      case "getSlots":
        result = await handleGetSlots(barbeariaId, data as any);
        break;
      case "createAppointment":
        result = await handleCreateAppointment(barbeariaId, data as any);
        break;
      case "cancelAppointment":
        result = await handleCancelAppointment(barbeariaId, data as any);
        break;
      case "getAppointments":
        result = await handleGetAppointments(barbeariaId, data as any);
        break;
      case "updateConversation":
        result = await handleUpdateConversation(barbeariaId, data as any);
        break;
      case "logMessage":
        result = await handleLogMessage(barbeariaId, data as any);
        break;
      default:
        return NextResponse.json<N8nResponse>(
          { success: false, error: `Ação desconhecida: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json<N8nResponse>({ success: true, data: result });
  } catch (error) {
    console.error("Webhook n8n error:", error);
    return NextResponse.json<N8nResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno",
      },
      { status: 500 }
    );
  }
}
