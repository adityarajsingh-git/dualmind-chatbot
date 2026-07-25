export interface TicketPayload {
  ticketId: string;
  mode: string;
  feedback: string;
  initialQuery: string;
}

// Best-effort save to the optional MongoDB backend (api/tickets).
// Never throws — the local ticket flow works with or without a deployed
// backend, so offline / local-dev / not-yet-deployed all degrade silently.
export async function saveTicket(payload: TicketPayload): Promise<void> {
  try {
    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // ignore — no backend reachable
  }
}
