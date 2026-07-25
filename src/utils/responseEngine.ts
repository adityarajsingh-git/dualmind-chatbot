import type { ChatMode, FAQ } from '../types';
import { recruitmentFAQs, employeeHelpFAQs } from '../data/mockData';

// ---------------------------------------------------------------------------
// Lightweight text matching — whole-word, synonym-aware, scored FAQ retrieval.
// Runs fully client-side; no backend or API needed.
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  'a', 'an', 'the', 'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your', 'it', 'its',
  'is', 'are', 'was', 'were', 'be', 'been', 'am', 'do', 'does', 'did', 'done',
  'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'if', 'then',
  'than', 'so', 'not', 'no', 'yes', 'how', 'what', 'when', 'where', 'who', 'whom',
  'which', 'why', 'there', 'this', 'that', 'these', 'those', 'have', 'has', 'had',
  'get', 'got', 'please', 'tell', 'about', 'from', 'by', 'as', 'into', 'also',
  'any', 'some', 'more', 'want', 'need', 'know', 'am', 'up', 'out', 'now'
]);

// Maps a stemmed word to its canonical topic token so "vacation", "PTO" and
// "holidays" all land on the same FAQ as "leave".
const SYNONYMS: Record<string, string> = {
  vacation: 'leave', pto: 'leave', timeoff: 'leave', holiday: 'leave',
  salary: 'pay', wage: 'pay', compensation: 'pay', ctc: 'pay', package: 'pay',
  paycheck: 'payslip', paystub: 'payslip',
  laptop: 'computer', pc: 'computer', desktop: 'computer', machine: 'computer',
  wifi: 'network', internet: 'network',
  login: 'password', signin: 'password', credential: 'password',
  expense: 'reimbursement', reimburse: 'reimbursement',
  cv: 'resume',
  remote: 'wfh',
  quit: 'resign', resignation: 'resign',
  vacancy: 'opening', vacancie: 'opening',
  ill: 'sick', unwell: 'sick',
  doctor: 'medical', hospital: 'medical',
  boss: 'manager', supervisor: 'manager'
};

function rawWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function stem(w: string): string {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 4 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 3 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of rawWords(text)) {
    if (w.length < 2 || STOPWORDS.has(w)) continue;
    const s = stem(w);
    out.add(SYNONYMS[s] ?? s);
  }
  return out;
}

/**
 * Returns the best-matching FAQ for a message, or null when nothing scores
 * high enough. Score is the token overlap relative to the smaller token set,
 * so both short questions and verbose ones match fairly.
 */
export function findBestFAQ(message: string, faqs: FAQ[]): FAQ | null {
  const msgTokens = tokenize(message);
  if (msgTokens.size === 0) return null;

  let best: FAQ | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const faqTokens = tokenize(faq.question + ' ' + (faq.keywords ?? []).join(' '));
    if (faqTokens.size === 0) continue;

    let overlap = 0;
    for (const t of faqTokens) {
      if (msgTokens.has(t)) overlap++;
    }

    // A single shared word is only enough for very short questions
    const minOverlap = faqTokens.size <= 2 ? 1 : 2;
    if (overlap < minOverlap) continue;

    const score = overlap / Math.min(faqTokens.size, msgTokens.size);
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  return bestScore >= 0.6 ? best : null;
}

/**
 * Returns the k highest-scoring FAQs for a message (no minimum threshold).
 * Used as the retrieval/grounding step for AI mode — the LLM answers only
 * from these excerpts.
 */
export function retrieveTopFAQs(message: string, mode: ChatMode, k = 5): FAQ[] {
  const faqs = mode === 'recruitment' ? recruitmentFAQs : employeeHelpFAQs;
  const msgTokens = tokenize(message);
  if (msgTokens.size === 0) return [];

  return faqs
    .map((faq) => {
      const faqTokens = tokenize(faq.question + ' ' + (faq.keywords ?? []).join(' '));
      let overlap = 0;
      for (const t of faqTokens) {
        if (msgTokens.has(t)) overlap++;
      }
      const score = faqTokens.size > 0 ? overlap / Math.min(faqTokens.size, msgTokens.size) : 0;
      return { faq, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.faq);
}

function formatFAQ(faq: FAQ): string {
  return faq.source ? `${faq.answer}\n\n*Source: ${faq.source}*` : faq.answer;
}

// ---------------------------------------------------------------------------
// Canned responses
// ---------------------------------------------------------------------------

const GREETING: Record<ChatMode, string> = {
  recruitment:
    "Hello! Welcome to the Recruitment Assistant! 👋\n\nI can help you with:\n• Finding open roles that fit your skills\n• The application and interview process\n• Resume tips — or upload your resume below for instant analysis\n• Salary, benefits, and work culture questions\n\nWhat would you like to know?",
  'employee-help':
    "Hello! Welcome to the Employee Help Desk! 👋\n\nI can help you with:\n• Leave, attendance, and work-from-home\n• Payroll, payslips, and reimbursements\n• IT support (passwords, laptop, VPN, email)\n• Benefits, policies, and HR requests\n\nWhat do you need help with today?"
};

const THANKS: Record<ChatMode, string> = {
  recruitment:
    "You're very welcome! 😊 If you have more questions about roles, applications, or interviews, just ask. Good luck with your job search! 🌟",
  'employee-help':
    "You're welcome! 😊 If anything else comes up — leave, payroll, IT, or policies — I'm right here."
};

const RECRUITMENT_TOPICS: Array<{ words: string[]; answer: string }> = [
  {
    words: ['job', 'jobs', 'opening', 'openings', 'position', 'positions', 'role', 'roles', 'career', 'careers', 'vacancy', 'vacancies', 'hiring', 'work'],
    answer:
      "We're currently hiring across several teams:\n\n• **Engineering** — Software Engineers, QA, Data Scientists\n• **Product & Design** — Product Managers, UI/UX Designers\n• **Business** — Sales, Marketing, Business Analysts\n• **Operations** — Support, Operations Managers\n\n📎 The fastest way to find your fit: **upload your resume below** and I'll match you against every open role automatically!"
  },
  {
    words: ['apply', 'application', 'applied', 'applying'],
    answer:
      "Here's how to apply:\n\n1. 📄 **Upload your resume** using the button below — I'll analyze it instantly\n2. 🎯 I'll match your skills and experience against all open roles\n3. ✅ If there's a match, click **Proceed with Application**\n4. 📧 You'll get a confirmation and HR will contact you for next steps\n\nWant to start now? Just hit 'Upload Resume for AI Analysis' below!"
  },
  {
    words: ['resume', 'cv'],
    answer:
      "Resume tips for the best results:\n\n• Keep it concise (1–2 pages)\n• Lead with skills and quantifiable achievements\n• Use action verbs (built, led, improved)\n• Clearly state your **total experience** and **key skills** — that's what our matching looks at\n\n📎 Upload your resume below for instant analysis and role matching!"
  },
  {
    words: ['interview', 'interviews', 'prepare', 'preparation'],
    answer:
      "Interview preparation tips:\n\n• Research the company and the role before you join the call\n• Prepare 2–3 stories using the STAR method (Situation, Task, Action, Result)\n• Be ready to walk through projects on your resume in depth\n• Prepare thoughtful questions about the team and roadmap\n\nOur process is typically: screening call → technical/functional round → culture-fit chat with the founders or team lead."
  },
  {
    words: ['salary', 'pay', 'compensation', 'ctc', 'stipend', 'package'],
    answer:
      "Compensation is competitive and depends on the role, your experience, and location. It typically includes:\n\n• Base salary\n• Performance bonus\n• Health insurance\n• Learning & development budget\n\nExact numbers are discussed in the HR round once there's a mutual fit — that keeps the conversation fair for everyone."
  },
  {
    words: ['intern', 'internship', 'fresher', 'freshers', 'graduate', 'entry'],
    answer:
      "For full-time roles we ask for at least **1 year of professional experience**. If you're earlier in your journey:\n\n• 🎓 We run **internship programs** a few times a year\n• 🛠️ Build portfolio projects and certifications in the meantime\n• 🔄 Reapply once you cross the 1-year mark — we'd love to hear from you again!"
  },
  {
    words: ['referral', 'refer', 'referred'],
    answer:
      "If a current employee referred you, mention their name when you apply (or ask them to submit your profile internally). Referred candidates get a guaranteed resume review and usually a faster response."
  }
];

const EMPLOYEE_TOPICS: Array<{ words: string[]; answer: string }> = [
  {
    words: ['leave', 'leaves', 'vacation', 'sick', 'pto', 'holiday', 'holidays', 'wfh', 'absent'],
    answer:
      "I can help with leave and time off! Quick guide:\n\n• **Sick leave**: Inform your manager, then mark it in the HR portal\n• **Planned leave**: Apply at least 2 days ahead (2 weeks for longer breaks)\n• **Work from home**: Get manager approval and mark it in the portal\n• **Balance**: Check the HR portal under Leave Summary\n\nAsk me something specific — e.g. \"how many leaves can I carry forward?\""
  },
  {
    words: ['salary', 'pay', 'payslip', 'payroll', 'paycheck', 'tax', 'paid'],
    answer:
      "For payroll questions:\n\n• **Salary date**: Credited on the last working day of each month\n• **Payslips**: Download from the HR portal under Payroll\n• **Tax documents**: Annual tax statements are on the portal too\n• **Bank change**: Email HR with your new account details and proof\n\nWhat specifically would you like to know?"
  },
  {
    words: ['laptop', 'computer', 'password', 'vpn', 'wifi', 'network', 'software', 'email', 'printer', 'access', 'system', 'device'],
    answer:
      "For IT support:\n\n• **Password reset**: Use the self-service reset link, or ask IT\n• **Laptop/hardware issues**: Raise a ticket with the IT helpdesk\n• **Software or licenses**: Request via IT with manager approval\n• **VPN/network problems**: Restart first 🙂 then contact IT if it persists\n\nWhat's the specific issue you're facing?"
  },
  {
    words: ['policy', 'policies', 'benefit', 'benefits', 'insurance', 'hr', 'handbook'],
    answer:
      "For policies and benefits:\n\n• **Employee handbook**: On the HR portal — covers all policies\n• **Health insurance**: Group cover for you; dependents can be added\n• **Key policies**: Leave, WFH, expenses, code of conduct\n• **Anything unclear**: HR is one email away\n\nWhich policy or benefit would you like details on?"
  },
  {
    words: ['office', 'facility', 'facilities', 'cafeteria', 'parking', 'desk', 'room', 'meeting'],
    answer:
      "Office and facilities:\n\n• **Meeting rooms**: Book through the shared calendar\n• **Parking**: First-come or assigned, depending on your office\n• **Supplies/equipment**: Request through the office manager\n• **Access issues**: Contact admin/facilities\n\nNeed help with something specific?"
  },
  {
    words: ['resign', 'resignation', 'notice', 'exit', 'relieving', 'fnf'],
    answer:
      "For exit-related questions:\n\n• **Resignation**: Email your manager and HR; notice period is typically 30 days\n• **Full & final settlement**: Processed within 45 days of your last day\n• **Leave encashment**: Unused earned leave is paid out in F&F\n• **Experience letter**: Issued along with your relieving letter\n\nAnything specific I can clarify?"
  }
];

const DEFAULT_RESPONSE: Record<ChatMode, string> = {
  recruitment:
    "I want to make sure I point you in the right direction! I can help with:\n\n🎯 **Open roles** — \"what positions are open?\"\n📄 **Applying** — \"how do I apply?\" (or upload your resume below)\n🎤 **Interviews** — \"what's the interview process?\"\n💰 **Compensation** — \"what benefits do you offer?\"\n\nTry rephrasing your question, or upload your resume for instant role matching!",
  'employee-help':
    "I didn't find an exact answer for that, but I can help with:\n\n🏖️ **Leave & attendance** — \"how do I apply for sick leave?\"\n💰 **Payroll** — \"when is salary credited?\"\n💻 **IT support** — \"how do I reset my password?\"\n📋 **Policies & benefits** — \"what does health insurance cover?\"\n🚪 **Exit process** — \"what is the notice period?\"\n\nTry rephrasing, or if it's urgent I can raise a support ticket for you — just answer \"No, I need more help\" after any response."
};

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function generateBotResponse(userMessage: string, mode: ChatMode): string {
  const words = new Set(rawWords(userMessage));
  const hasAny = (...ws: string[]) => ws.some((w) => words.has(w));

  // Whole-word checks: "position" no longer matches "it", "hiring" no longer
  // matches "hi". Greetings/thanks only short-circuit for short messages so
  // "hi, how do I apply for leave" still gets a real answer.
  if (words.size <= 4 && hasAny('hi', 'hello', 'hey', 'namaste', 'greetings', 'morning')) {
    return GREETING[mode];
  }
  if (words.size <= 6 && hasAny('thanks', 'thank', 'thankyou')) {
    return THANKS[mode];
  }

  // 1) Scored FAQ retrieval over the knowledge base
  const faqs = mode === 'recruitment' ? recruitmentFAQs : employeeHelpFAQs;
  const faq = findBestFAQ(userMessage, faqs);
  if (faq) return formatFAQ(faq);

  // 2) Topic-level fallbacks (whole-word keyword matching)
  const topics = mode === 'recruitment' ? RECRUITMENT_TOPICS : EMPLOYEE_TOPICS;
  for (const topic of topics) {
    if (hasAny(...topic.words)) return topic.answer;
  }

  // 3) Guided default
  return DEFAULT_RESPONSE[mode];
}
