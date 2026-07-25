import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev only: serve POST /api/tickets so ticket storage can be tested with
// `npm run dev` (no deploy needed). Put your Atlas string in a local `.env`
// file as MONGODB_URI — it is gitignored and never sent to the browser.
// In production, Vercel serves api/tickets.js instead.
function ticketsDevApi(): Plugin {
  return {
    name: 'dualmind-tickets-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/tickets', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }))
          return
        }
        let raw = ''
        req.on('data', (c) => (raw += c))
        req.on('end', async () => {
          try {
            // @ts-expect-error - plain JS module (also used by the Vercel fn), no .d.ts
            const { saveTicket } = await import('./api/_saveTicket.js')
            const result = await saveTicket(raw ? JSON.parse(raw) : {})
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = result.ok ? 201 : result.skipped ? 200 : 500
            res.end(JSON.stringify(result))
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, error: 'save_failed' }))
          }
        })
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load MONGODB_URI (and any other non-VITE_ vars) from .env files into
  // process.env so the dev middleware above can reach the database.
  const env = loadEnv(mode, process.cwd(), '')
  if (env.MONGODB_URI) process.env.MONGODB_URI = env.MONGODB_URI

  return {
    plugins: [react(), ticketsDevApi()]
  }
})
