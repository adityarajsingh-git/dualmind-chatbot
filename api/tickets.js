// Vercel serverless function — saves support tickets to MongoDB Atlas.
//
// The Atlas connection string is read from the MONGODB_URI environment
// variable (set it in the Vercel dashboard — never commit it). If the var
// is not configured, the endpoint is a harmless no-op so the app still works.
//
// Local `npm run dev` (Vite) does not run this file; the frontend's save call
// is best-effort and fails silently until you deploy to Vercel.

import { MongoClient } from 'mongodb';

const DB_NAME = 'dualmind';
const COLLECTION = 'tickets';

// Reuse the connection across warm serverless invocations
let cached = globalThis._dualmindMongo;
if (!cached) cached = globalThis._dualmindMongo = { promise: null };

async function getDb() {
  if (!cached.promise) {
    cached.promise = MongoClient.connect(process.env.MONGODB_URI).then((client) => client.db(DB_NAME));
  }
  return cached.promise;
}

const str = (v, max) => String(v ?? '').slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  // No DB configured → succeed silently so the local/demo flow is unaffected
  if (!process.env.MONGODB_URI) {
    res.status(200).json({ ok: false, skipped: 'no_db_configured' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const doc = {
      ticketId: str(body.ticketId, 40),
      mode: str(body.mode, 40),
      feedback: str(body.feedback, 4000),
      initialQuery: str(body.initialQuery, 2000),
      createdAt: new Date()
    };

    const db = await getDb();
    await db.collection(COLLECTION).insertOne(doc);

    res.status(201).json({ ok: true, ticketId: doc.ticketId });
  } catch {
    res.status(500).json({ ok: false, error: 'save_failed' });
  }
}
