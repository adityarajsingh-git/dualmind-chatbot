// Vercel serverless function — saves support tickets to MongoDB Atlas.
//
// The Atlas connection string is read from the MONGODB_URI environment
// variable (set it in the Vercel dashboard — never commit it). If the var
// is not configured, the endpoint is a harmless no-op so the app still works.

import { saveTicket } from './_saveTicket.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const result = await saveTicket(body);

  res.status(result.ok ? 201 : result.skipped ? 200 : 500).json(result);
}
