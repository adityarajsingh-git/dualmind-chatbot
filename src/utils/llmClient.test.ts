import { describe, expect, it } from 'vitest';
import { fallbackNote } from './llmClient';

describe('fallbackNote', () => {
  it('tells the user to wait or switch model on rate limit', () => {
    const note = fallbackNote({ content: null, error: 'rate_limit', detail: 'Gemini 429' });
    expect(note).toContain('rate limit');
    expect(note).toContain('Gemini 429');
    expect(note).toContain('built-in knowledge base');
  });
  it('points to Settings on auth errors', () => {
    expect(fallbackNote({ content: null, error: 'auth' })).toContain('Check Settings');
  });
  it('uses the generic note otherwise', () => {
    expect(fallbackNote({ content: null, error: 'other' })).toContain('unavailable');
  });
});
