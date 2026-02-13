export type N8nAction =
  | "getContext"
  | "getSlots"
  | "createAppointment"
  | "updateAppointment"
  | "cancelAppointment"
  | "getAppointments"
  | "updateConversation"
  | "logMessage";

export interface N8nRequest {
  action: N8nAction;
  barbeariaId: string;
  data: Record<string, unknown>;
}

export interface N8nResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface GetContextData {
  whatsappFrom: string;
}

export interface GetSlotsData {
  barbeiroId: string;
  servicoId: string;
  data: string;
}

export interface CreateAppointmentData {
  barbeiroId: string;
  servicoId: string;
  clienteId: string;
  dataHora: string;
}

export interface UpdateAppointmentData {
  agendamentoId: string;
  status: string;
}

export interface CancelAppointmentData {
  agendamentoId: string;
  motivo?: string;
}

export interface GetAppointmentsData {
  clienteId?: string;
  whatsappFrom?: string;
  data?: string;
}

export interface UpdateConversationData {
  whatsappFrom: string;
  estado: string;
  contexto?: Record<string, unknown>;
}

export interface LogMessageData {
  conversaId: string;
  direcao: "entrada" | "saida";
  tipo?: string;
  conteudo: string;
  whatsappMessageId?: string;
  intencaoDetectada?: string;
}
