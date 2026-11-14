import { describe, expect, it } from 'vitest';
import type { FAQ } from '../types';
import { findBestFAQ, retrieveTopFAQs } from './responseEngine';

const faqs: FAQ[] = [
  { question: 'How do I apply for leave?', answer: 'leave-answer' },
  { question: 'How do I reset my password?', answer: 'password-answer' },
  { question: 'When is payslip generated?', answer: 'payslip-answer', keywords: ['salary slip'] }
];

describe('findBestFAQ', () => {
  it('ignores stopwords and matches on the topic words', () => {
    expect(findBestFAQ('what is the way to apply for leave', faqs)?.answer).toBe('leave-answer');
  });

  it('stems plurals and verb endings', () => {
    expect(findBestFAQ('resets passwords', faqs)?.answer).toBe('password-answer');
  });

  it('expands synonyms (vacation -> leave)', () => {
    expect(findBestFAQ('apply for vacation', faqs)?.answer).toBe('leave-answer');
  });

  it('matches on keywords that are not in the question text', () => {
    expect(findBestFAQ('where is my salary slip', faqs)?.answer).toBe('payslip-answer');
  });

  it('returns null for empty, stopword-only or unrelated input', () => {
    expect(findBestFAQ('', faqs)).toBeNull();
    expect(findBestFAQ('what is the', faqs)).toBeNull();
    expect(findBestFAQ('pizza toppings', faqs)).toBeNull();
  });
});

describe('retrieveTopFAQs', () => {
  it('returns nothing for empty input', () => {
    expect(retrieveTopFAQs('', 'employee-help')).toEqual([]);
  });

  it('ranks the best match first and respects k', () => {
    const top = retrieveTopFAQs('how do I apply for leave', 'employee-help', 3);
    expect(top.length).toBeLessThanOrEqual(3);
    expect(top[0].question.toLowerCase()).toContain('leave');
  });
});
