<p align="center">
  <img src="./src/assets/logo.png" alt="DualMind logo" width="96" />
</p>

<h1 align="center">DualMind 🤖</h1>

<p align="center"><b>One chatbot, two minds</b> — a Recruitment Assistant and an Employee Help Desk in a single chat interface.</p>

---

**DualMind** is a dual-mode chatbot for small companies (30–100 employees). It runs fully client-side — no backend, no API keys required, clone and run. Optionally, plug in your own Claude API key to switch from the built-in rule engine to grounded AI answers (see [AI Mode](#-ai-mode-optional-bring-your-own-key)).

## ✨ Features

**🎯 Recruitment Mode**
- Answers candidate FAQs (eligibility, application process, interview steps)
- Simulated resume upload & analysis with skill extraction and match scoring
- Suggests matching roles from a job catalog and walks through a mock application flow

**🛠️ Employee Help Mode**
- IT support, HR, leave, and payroll FAQs
- Quick-action topics for the most common employee questions

**💬 Chat Experience**
- Seamless mode switching in one conversation
- Floating chat widget, typing indicator, quick-action buttons
- Clean, responsive, WhatsApp-style UI

## ⚡ AI Mode (optional, bring your own key)

By default DualMind answers from a **rule-based engine**: stopword removal, light stemming, a synonym map, and scored retrieval over a ~60-entry FAQ knowledge base. That works offline and costs nothing.

With your own Claude API key, it upgrades to a **client-side RAG pipeline**:

1. The retrieval engine pulls the top 5 relevant knowledge-base entries for your question
2. Claude answers **only from those excerpts** (with source citations), so it can't invent policies
3. Any failure — no key, bad key, rate limit, network — silently falls back to the rule engine

To enable it: open the chat → ⚙️ settings → choose a **provider** and paste your key.
Two providers are supported:

- **Google Gemini** — has a genuinely **free tier** ([get a key](https://aistudio.google.com/apikey)); best for a zero-cost setup.
- **Claude (Anthropic)** — paid, ~₹0.20–₹1 per message ([get a key](https://platform.claude.com/)); new accounts get free trial credit.

The key is stored **only in your browser's localStorage** and sent **only to the provider you chose** — no key ever appears in the code or bundle.

```
User question ──▶ FAQ retrieval (top-5) ──▶ Gemini / Claude (grounded prompt) ──▶ answer + source
                        │                          │ (no key / any error)
                        └──────────────────────────▶ rule-based engine ──▶ answer
```

## 🎫 Optional: save tickets to MongoDB

When a user isn't satisfied and a support ticket is created, DualMind can save it to
**MongoDB Atlas** via a tiny serverless function ([api/tickets.js](api/tickets.js)) — no
Atlas credentials ever touch the browser or the repo. It's fully optional: with no
database configured, tickets just show locally as before.

To enable (all free-tier):

1. Deploy this repo to **Vercel** (auto-detects Vite; the `api/` folder becomes serverless functions).
2. In Atlas → Network Access, allow `0.0.0.0/0` (serverless IPs vary).
3. In the Vercel project → Settings → Environment Variables, add
   `MONGODB_URI` = your Atlas connection string (see [.env.example](.env.example)).
4. Redeploy. Tickets now land in the `dualmind.tickets` collection.

## 🧰 Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** for dev/build
- **React Router 7**
- **Anthropic SDK** + **Gemini REST** for optional AI mode
- **MongoDB Atlas** + a Vercel serverless function for optional ticket storage
- Plain CSS design system (no UI framework)

## 🚀 Getting Started

```bash
git clone https://github.com/adityarajsingh-git/dualmind-chatbot.git
cd dualmind-chatbot
npm install
npm run dev        # start dev server
npm run build      # production build
```

## 📁 Project Structure

```
api/
└── tickets.js                 # optional Vercel serverless fn → MongoDB Atlas
src/
├── App.tsx                    # main app: chat UI, modes, modals
├── components/
│   ├── LandingBackground.tsx  # landing hero
│   └── Logo.tsx               # inline SVG brand mark
├── utils/
│   ├── responseEngine.ts      # scored FAQ retrieval + keyword intents (rule-based)
│   ├── llmClient.ts           # optional AI mode: Gemini/Claude client + grounded prompt
│   ├── resumeParser.ts        # resume parsing, job matching, analysis output
│   └── ticketApi.ts           # best-effort ticket save to the backend
├── data/mockData.ts           # job catalog + generic FAQ knowledge base
├── types/index.ts             # shared TypeScript types
└── assets/                    # backgrounds
```

## 🗺️ Roadmap

- ~~Wire responses to a real LLM API~~ ✅ done — BYO-key AI mode (Gemini/Claude) with grounded RAG
- ~~Persist support tickets~~ ✅ done — optional MongoDB Atlas via serverless function
- Real PDF parsing for resumes (pdf.js) instead of simulated extraction
- Admin view to browse saved tickets
- Split `App.tsx` into smaller components
- Editable knowledge base (per-company policies) instead of a static file

## 📝 Notes

All names, emails, phone numbers, and company references in the mock data are fictional. Built as a learning/hackathon concept by [Adityaraj Singh](https://github.com/adityarajsingh-git).

## 📄 License

[MIT](./LICENSE)
