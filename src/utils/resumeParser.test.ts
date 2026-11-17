import { describe, it, expect } from 'vitest';
import { validateResumeFile, MAX_RESUME_BYTES } from './resumeParser';

describe('validateResumeFile', () => {
  it('accepts normal pdf/doc/docx', () => {
    expect(validateResumeFile({ name: 'cv.PDF', size: 1000 })).toBeNull();
    expect(validateResumeFile({ name: 'cv.docx', size: 1000 })).toBeNull();
  });
  it('rejects empty, oversized and unsupported files', () => {
    expect(validateResumeFile({ name: 'cv.pdf', size: 0 })).toMatch(/empty/);
    expect(validateResumeFile({ name: 'cv.pdf', size: MAX_RESUME_BYTES + 1 })).toMatch(/5 MB/);
    expect(validateResumeFile({ name: 'cv.exe', size: 10 })).toMatch(/Unsupported/);
  });
});
