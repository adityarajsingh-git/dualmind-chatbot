import Anthropic from '@anthropic-ai/sdk';
import type { ChatMode } from '../types';
import { retrieveTopFAQs } from './responseEngine';

// ---------------------------------------------------------------------------
// AI mode — "bring your own key". Keys live only in the user's browser
// (localStorage) and calls go directly from the browser to the provider.
// No key configured → the app runs on the built-in rule engine at zero cost.
//
// Two providers:
//   • Claude (Anthropic) — paid, ~₹0.20–₹1 per message, $5 free trial credit
//   • Gemini (Google)    — genuinely free tier, great for a zero-cost demo
// ---------------------------------------------------------------------------

export type Provider = 'claude' | 'gemini';

interface ProviderMeta {
  id: Provider;
  label: string;
  keyHint: string;
  keyUrl: string;
  models: { id: string; label: string }[];
}

export const PROVIDERS: ProviderMeta[] = [
  {
    id: 'gemini',
    label: 'Google Gemini — free tier ✅',
    keyHint: 'AIza…',
    keyUrl: 'https://aistudio.google.com/apikey',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash — fast & free' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash — free' }
    ]
  },
  {
    id: 'claude',
    label: 'Claude (Anthropic) — paid',
    keyHint: 'sk-ant-…',
    keyUrl: 'https://platform.claude.com/',
    models: [
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — cheapest' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 — balanced' },
      { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 — most capable' }
    ]
  }
];

const PROVIDER_STORAGE = 'dualmind_provider';
const keyStorage = (p: Provider) => `dualmind_key_${p}`;
const modelStorage = (p: Provider) => `dualmind_model_${p}`;

export function getProvider(): Provider {
  const p = localStorage.getItem(PROVIDER_STORAGE);
  return p === 'claude' || p === 'gemini' ? p : 'gemini';
}
export function saveProvider(p: Provider): void {
  localStorage.setItem(PROVIDER_STORAGE, p);
}

export function providerMeta(p: Provider = getProvider()): ProviderMeta {
  return PROVIDERS.find((x) => x.id === p) ?? PROVIDERS[0];
}

export function getApiKey(p: Provider = getProvider()): string | null {
  return localStorage.getItem(keyStorage(p));
}
export function saveApiKey(p: Provider, key: string): void {
  const trimmed = key.trim();
  if (trimmed) localStorage.setItem(keyStorage(p), trimmed);
  else localStorage.removeItem(keyStorage(p));
}
export function clearApiKey(p: Provider = getProvider()): void {
  localStorage.removeItem(keyStorage(p));
}

export function getModel(p: Provider = getProvider()): string {
  return localStorage.getItem(modelStorage(p)) ?? providerMeta(p).models[0].id;
}
export function saveModel(p: Provider, model: string): void {
  localStorage.setItem(modelStorage(p), model);
}

/** AI mode is on when the currently-selected provider has a key. */
export function isAIModeEnabled(): boolean {
  return Boolean(getApiKey());
}

// ---------------------------------------------------------------------------
// Grounded generation (RAG-lite) — shared across providers
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
  detail?: string; // human-readable reason surfaced for debugging
}

// ---------------------------------------------------------------------------
// Claude (Anthropic)
// ---------------------------------------------------------------------------

async function callClaude(
  apiKey: string,
  model: string,
  system: string,
  history: LLMHistoryItem[],
  userMessage: string
): Promise<LLMResult> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      system,
      messages: [...history.slice(-6), { role: 'user' as const, content: userMessage }]
    });
    if (response.stop_reason === 'refusal') return { content: null, error: 'other' };
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return text ? { content: text } : { content: null, error: 'other', detail: 'Claude returned no text' };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { content: null, error: 'auth', detail: 'Claude: invalid API key' };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { content: null, error: 'rate_limit', detail: 'Claude: rate limited' };
    }
    const detail = `Claude request failed: ${error instanceof Error ? error.message : 'unknown'}`;
    console.warn('[DualMind AI]', detail);
    return { content: null, error: 'other', detail };
  }
}

// ---------------------------------------------------------------------------
// Gemini (Google) — REST, no SDK dependency
// ---------------------------------------------------------------------------

async function callGemini(
  apiKey: string,
  model: string,
  system: string,
  history: LLMHistoryItem[],
  userMessage: string
): Promise<LLMResult> {
  const contents = [
    ...history.slice(-6).map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    })),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 2048, temperature: 0.4 }
        })
      }
    );

    if (!res.ok) {
      let apiMsg = '';
      try {
        const err = await res.json();
        apiMsg = err?.error?.message ?? '';
      } catch { /* body not JSON */ }
      const detail = `Gemini ${res.status}${apiMsg ? `: ${apiMsg}` : ''}`;
      console.warn('[DualMind AI]', detail);
      const error =
        res.status === 429 ? 'rate_limit' : res.status >= 400 && res.status < 404 ? 'auth' : 'other';
      return { content: null, error, detail };
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const text: string | undefined = candidate?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? '')
      .join('')
      .trim();

    if (text) return { content: text };

    // 200 but no usable text — surface why (safety block, token cap, etc.)
    const reason =
      candidate?.finishReason ?? data?.promptFeedback?.blockReason ?? 'empty response';
    const detail = `Gemini returned no text (${reason})`;
    console.warn('[DualMind AI]', detail, data);
    return { content: null, error: 'other', detail };
  } catch (e) {
    const detail = `Gemini request failed: ${e instanceof Error ? e.message : 'network error'}`;
    console.warn('[DualMind AI]', detail);
    return { content: null, error: 'other', detail };
  }
}

// ---------------------------------------------------------------------------
// Main entry point — routes to the selected provider
// ---------------------------------------------------------------------------

export async function generateLLMResponse(
  userMessage: string,
  mode: ChatMode,
  history: LLMHistoryItem[]
): Promise<LLMResult> {
  const provider = getProvider();
  const apiKey = getApiKey(provider);
  if (!apiKey) return { content: null, error: 'other' };

  const system = buildSystemPrompt(mode, userMessage);
  const model = getModel(provider);

  return provider === 'gemini'
    ? callGemini(apiKey, model, system, history, userMessage)
    : callClaude(apiKey, model, system, history, userMessage);
}
