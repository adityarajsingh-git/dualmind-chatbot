import Anthropic from '@anthropic-ai/sdk';
import type { ChatMode } from '../types';
import { retrieveTopFAQs } from './responseEngine';

// ---------------------------------------------------------------------------
// AI mode — "bring your own key". The key lives only in the user's browser
// (localStorage) and calls go directly from the browser to the Claude API.
// No key configured → the app runs on the built-in rule engine at zero cost.
// ---------------------------------------------------------------------------

const API_KEY_STORAGE = 'dualmind_api_key';
const MODEL_STORAGE = 'dualmind_model';

export const DEFAULT_MODEL = 'claude-opus-4-8';

export const AVAILABLE_MODELS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 — most capable' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 — balanced' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — fastest, cheapest' }
];

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function saveApiKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed) {
    localStorage.setItem(API_KEY_STORAGE, trimmed);
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE);
}

export function getModel(): string {
  return localStorage.getItem(MODEL_STORAGE) ?? DEFAULT_MODEL;
}

export function saveModel(model: string): void {
  localStorage.setItem(MODEL_STORAGE, model);
}

export function isAIModeEnabled(): boolean {
  return Boolean(getApiKey());
}

// ---------------------------------------------------------------------------
// Grounded generation (RAG-lite)
// ---------------------------------------------------------------------------

const PERSONA: Record<ChatMode, string> = {
  recruitment:
    'You are the Recruitment Assistant for a small company (30-100 employees). You help candidates with job openings, applications, interviews, and hiring policies.',
  'employee-help':
    'You are the Employee Help Desk assistant for a small company (30-100 employees). You help employees with leave, payroll, IT support, benefits, policies, and HR requests.'
};

function buildSystemPrompt(mode: ChatMode, userMessage: string): string {
  const excerpts = retrieveTopFAQs(userMessage, mode, 5);
  const knowledge = excerpts.length
    ? excerpts
        .map(
          (faq, i) =>
            `[${i + 1}] Q: ${faq.question}\nA: ${faq.answer}${faq.source ? `\nSource: ${faq.source}` : ''}`
        )
        .join('\n\n')
    : '(no relevant excerpts found)';

  return `${PERSONA[mode]}

Answer the user's question using ONLY the company knowledge base excerpts below. Rules:
- Ground every claim in the excerpts. Do not invent policies, numbers, or deadlines.
- When an excerpt has a Source, end your answer with "*Source: <name>*".
- If the excerpts do not cover the question, say you don't have that information and suggest the user raise a support ticket (they can answer "No, I need more help" after your reply to create one).
- Be concise and friendly. Use **bold** for key terms and bullet points for lists (this UI renders **bold** and bullets, not full markdown).

Company knowledge base excerpts:

${knowledge}`;
}

export interface LLMHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMResult {
  content: string | null;
  error?: 'auth' | 'rate_limit' | 'other';
}

/**
 * Ask the Claude API for a grounded answer. Returns { content: null, error }
 * on any failure so the caller can fall back to the rule engine — the app
 * must never break because AI mode is misconfigured.
 */
export async function generateLLMResponse(
  userMessage: string,
  mode: ChatMode,
  history: LLMHistoryItem[]
): Promise<LLMResult> {
  const apiKey = getApiKey();
  if (!apiKey) return { content: null, error: 'other' };

  const client = new Anthropic({
    apiKey,
    // Required for direct browser calls; the key is the user's own and never
    // leaves their machine except to go to the Claude API.
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await client.messages.create({
      model: getModel(),
      max_tokens: 1024, // chat answers are deliberately short
      system: buildSystemPrompt(mode, userMessage),
      messages: [
        ...history.slice(-6),
        { role: 'user' as const, content: userMessage }
      ]
    });

    if (response.stop_reason === 'refusal') {
      return { content: null, error: 'other' };
    }

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return text ? { content: text } : { content: null, error: 'other' };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { content: null, error: 'auth' };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { content: null, error: 'rate_limit' };
    }
    return { content: null, error: 'other' };
  }
}
