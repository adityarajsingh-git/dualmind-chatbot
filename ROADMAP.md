# DualMind — Roadmap

One small, complete increment at a time. Items are derived from README.md and the
current code; tick an item in the same commit that ships it, and add follow-ups
you discover as new unchecked entries.

## ✅ Shipped
- [x] Rule-based engine: stopwords, light stemming, synonym map, scored retrieval over the FAQ knowledge base
- [x] Recruitment mode: candidate FAQs, simulated resume upload and skill match scoring, job catalog, mock application flow
- [x] Employee help mode: IT / HR / leave / payroll FAQs with quick-action topics
- [x] Optional AI mode (Gemini or Claude, bring your own key) with client-side RAG and silent fallback
- [x] Optional ticket persistence to MongoDB Atlas via `api/tickets.js` (Vercel serverless)

## 🔨 Chat experience
- [x] Persist the conversation in `localStorage` so a page refresh keeps the chat and the active mode; "Clear chat" is the existing New Chat button (already shipped)
- [x] Show which path answered when AI mode fell back (already shipped: fallback replies carry an inline "Answer from built-in knowledge base" note)
- [ ] (needs the matched FAQ stored on the message first) Make source citations in AI answers expandable: tap a citation to reveal the knowledge-base excerpt it came from
- [ ] "Was this helpful?" thumbs on each bot answer; a thumbs-down offers the ticket flow directly
- [x] Export the current conversation as a `.txt` download (header download button)

## 🔨 Robustness
- [ ] Add Vitest and unit tests for the retrieval engine: stopword removal, stemming, synonym expansion, scoring order
- [x] Validate `api/tickets.js` input (required ticketId, string types, truncated lengths) and return structured error JSON with HTTP 400
- [ ] Handle provider rate-limit and quota errors with a short, friendly inline message instead of only falling back silently
- [ ] Guard the resume parser against empty or oversized input and show an explicit error state

## 🔨 Accessibility & polish
- [x] Keyboard support for the floating widget: Esc closes (unless a modal is open), focus moves into the chat on open (already shipped) and back to the launcher on close
- [x] `aria-live` region so screen readers announce new bot messages
- [x] Esc also closes the settings, resume-upload and feedback modals (confirmation modals stay explicit-dismiss)
- [ ] Audit the widget on narrow (≤ 360 px) screens: no horizontal overflow, input stays above the keyboard
- [ ] Dark theme toggle persisted in `localStorage`, using the existing CSS variables

## 🧑‍💻 Needs the owner (agent must skip)
- [ ] Deploy to Vercel and connect MongoDB Atlas for tickets
- [ ] Add screenshots / GIF and a live demo link to README
