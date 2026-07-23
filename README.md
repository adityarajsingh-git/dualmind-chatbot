<p align="center">
  <img src="./src/assets/logo.png" alt="DualMind logo" width="96" />
</p>

<h1 align="center">DualMind 🤖</h1>

<p align="center"><b>One chatbot, two minds</b> — a Recruitment Assistant and an Employee Help Desk in a single chat interface.</p>

---

**DualMind** is a dual-mode chatbot concept originally built for a hackathon. It runs fully client-side with rule-based logic and mock data — no backend, no API keys, clone and run.

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

## 🧰 Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** for dev/build
- **React Router 7**
- Plain CSS with custom utility classes (no UI framework)

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
src/
├── App.tsx                    # main app: chat logic, modes, simulated responses
├── components/
│   └── LandingBackground.tsx  # landing hero
├── data/mockData.ts           # job roles, FAQs, mock resume profiles
├── types/index.ts             # shared TypeScript types
└── assets/                    # logo & backgrounds
```

## 🗺️ Roadmap

- Wire responses to a real LLM API (the response engine is currently rule-based)
- Real PDF parsing for resumes (pdf.js) instead of simulated extraction
- Persist chat history
- Split `App.tsx` into smaller components

## 📝 Notes

All names, emails, phone numbers, and company references in the mock data are fictional. Built as a learning/hackathon concept by [Adityaraj Singh](https://github.com/adityarajsingh-git).

## 📄 License

[MIT](./LICENSE)
