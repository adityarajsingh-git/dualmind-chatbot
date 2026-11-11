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
- [ ] Persist the conversation in `localStorage` so a page refresh keeps the chat and the active mode; add a "Clear chat" action
- [ ] Show a subtle "answered by rule engine" badge when AI mode fell back, so the user knows which path answered
- [ ] Make source citations in AI answers expandable: tap a citation to reveal the knowledge-base excerpt it came from
- [ ] "Was this helpful?" thumbs on each bot answer; a thumbs-down offers the ticket flow directly
- [ ] Export the current conversation as a `.txt` download (useful when a ticket is raised)

## 🔨 Robustness
- [ ] Add Vitest and unit tests for the retrieval engine: stopword removal, stemming, synonym expansion, scoring order
- [ ] Validate `api/tickets.js` input (required fields, max lengths) and return structured error JSON
- [ ] Handle provider rate-limit and quota errors with a short, friendly inline message instead of only falling back silently
- [ ] Guard the resume parser against empty or oversized input and show an explicit error state

## 🔨 Accessibility & polish
- [ ] Keyboard support for the floating widget: Esc closes, focus moves into the chat on open and back to the launcher on close
- [ ] `aria-live` region so screen readers announce new bot messages
- [ ] Audit the widget on narrow (≤ 360 px) screens: no horizontal overflow, input stays above the keyboard
- [ ] Dark theme toggle persisted in `localStorage`, using the existing CSS variables

## 🧑‍💻 Needs the owner (agent must skip)
- [ ] Deploy to Vercel and connect MongoDB Atlas for tickets
- [ ] Add screenshots / GIF and a live demo link to README
