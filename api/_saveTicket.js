// Shared ticket-save logic used by both the Vercel serverless function
// (api/tickets.js) and the local Vite dev middleware (vite.config.ts).
// Reads the Atlas connection string from MONGODB_URI — never hard-coded.

import { MongoClient } from 'mongodb';

const DB_NAME = 'dualmind';
const COLLECTION = 'tickets';

// Reuse the connection across warm invocations
let cached = globalThis._dualmindMongo;
if (!cached) cached = globalThis._dualmindMongo = { promise: null };

async function getDb() {
  if (!cached.promise) {
    cached.promise = MongoClient.connect(process.env.MONGODB_URI).then((client) => client.db(DB_NAME));
  }
  return cached.promise;
}

const str = (v, max) => String(v ?? '').slice(0, max);

// Returns the name of the first bad field, or null. Over-long values are
// truncated by str() rather than rejected so a long feedback note is never lost.
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'body';
  if (typeof body.ticketId !== 'string' || !body.ticketId.trim()) return 'ticketId';
  for (const f of ['mode', 'feedback', 'initialQuery']) {
    if (body[f] != null && typeof body[f] !== 'string') return f;
  }
  return null;
}

// HTTP status for a saveTicket() result — shared by the Vercel fn and the dev middleware.
export const statusFor = (r) => (r.ok ? 201 : r.skipped ? 200 : r.error === 'invalid_ticket' ? 400 : 500);

/**
 * Insert one ticket. Returns { ok, ... }. Never throws — callers just relay it.
 * When MONGODB_URI is unset it's a no-op so the app still works offline.
 */
export async function saveTicket(body) {
  const invalid = validate(body);
  if (invalid) return { ok: false, error: 'invalid_ticket', field: invalid };
  if (!process.env.MONGODB_URI) {
    return { ok: false, skipped: 'no_db_configured' };
  }
  try {
    const doc = {
      ticketId: str(body.ticketId, 40),
      mode: str(body.mode, 40),
      feedback: str(body.feedback, 4000),
      initialQuery: str(body.initialQuery, 2000),
      createdAt: new Date()
    };
    const db = await getDb();
    await db.collection(COLLECTION).insertOne(doc);
    return { ok: true, ticketId: doc.ticketId };
  } catch {
    return { ok: false, error: 'save_failed' };
  }
}
