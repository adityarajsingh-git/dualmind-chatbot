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

/**
 * Insert one ticket. Returns { ok, ... }. Never throws — callers just relay it.
 * When MONGODB_URI is unset it's a no-op so the app still works offline.
 */
export async function saveTicket(body) {
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
