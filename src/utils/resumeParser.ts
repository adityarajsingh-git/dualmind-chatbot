import type { JobRole } from '../types';
import { jobRoles } from '../data/mockData';

export interface ExtractedResume {
  name: string;
  experience: number; // in years
  skills: string[];
  education: string;
  location: string;
  currentRole: string;
  email?: string;
  phone?: string;
}

/**
 * Parses "3 years", "2.5 yrs", "18 months", "5+ years" etc. into years.
 * Returns null when no experience figure is found.
 */
export function parseExperience(text: string): number | null {
  const match = text.toLowerCase().match(/(\d+(?:\.\d+)?)\s*\+?\s*(years?|yrs?|months?|mos?)\b/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const years = match[2].startsWith('y') ? value : value / 12;
  return Math.round(years * 100) / 100;
}

function extractFromContent(content: string, fallbackName: string): ExtractedResume {
  const nameMatch = content.match(/name:\s*([^\n\r]+)/i);
  const emailMatch = content.match(/e-?mail:\s*([^\n\r]+)/i);
  const phoneMatch = content.match(/(?:mobile|phone|contact)(?:\s*(?:number|no\.?))?:\s*([^\n\r]+)/i);
  const skillsMatch = content.match(/skills:\s*([^\n\r]+)/i);
  const educationMatch = content.match(/education:\s*([^\n\r]+)/i);
  const locationMatch = content.match(/location:\s*([^\n\r]+)/i);
  const expLineMatch = content.match(/experience:\s*([^\n\r]+)/i);

  // Prefer the "Experience:" line, then anywhere in the document
  const experience =
    (expLineMatch ? parseExperience(expLineMatch[1]) : null) ??
    parseExperience(content) ??
    0.5;

  return {
    name: nameMatch ? nameMatch[1].trim() : fallbackName,
    experience,
    skills: skillsMatch
      ? skillsMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
      : ['Basic Computer', 'Communication'],
    education: educationMatch ? educationMatch[1].trim() : 'Not specified',
    location: locationMatch ? locationMatch[1].trim() : 'Not specified',
    currentRole: experience < 1 ? 'Fresher' : 'Professional',
    email: emailMatch ? emailMatch[1].trim() : undefined,
    phone: phoneMatch ? phoneMatch[1].trim() : undefined
  };
}

/**
 * Binary formats (PDF/DOC/DOCX) can't be read as plain text in the browser
 * without a parsing library, so demo content is simulated from the filename.
 * Triggers are deliberately specific so ordinary names like "resume-2024.pdf"
 * fall through to the default profile.
 */
function simulatedBinaryContent(fileName: string, fallbackName: string): string {
  if (fileName.includes('fresher') || fileName.includes('intern')) {
    return 'Name: Demo Fresher\nEmail: fresher@example.com\nMobile number: 9876500001\nSkills: Basic Computer, Communication\nExperience: 2 months';
  }
  if (fileName.includes('dummy')) {
    return 'Name: Demo Candidate\nEmail: dummy@example.com\nMobile number: 9876500002\nSkills: Basic Computer, Communication\nExperience: 8 months';
  }
  if (fileName.includes('senior') || fileName.includes('lead')) {
    return 'Name: Senior Developer\nEmail: senior@example.com\nMobile number: 9876500003\nSkills: React, JavaScript, Node.js, Python, SQL, AWS, Docker, Kubernetes\nExperience: 5 years';
  }
  if (fileName.includes('approved') || fileName.includes('accepted')) {
    return 'Name: Approved Candidate\nEmail: approved@example.com\nMobile number: 9876500004\nSkills: React, JavaScript, Node.js, Python, SQL, AWS, Docker\nExperience: 3 years';
  }
  return `Name: ${fallbackName}\nEmail: ${fallbackName.toLowerCase().replace(/\s+/g, '.')}@example.com\nMobile number: 9876500005\nSkills: React, JavaScript, Node.js, Python, SQL\nExperience: 2 years`;
}

export function parseResumeFile(file: File): Promise<ExtractedResume> {
  const fallbackName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim() || 'Candidate';
  const fileName = file.name.toLowerCase();

  if (/\.(pdf|docx?|rtf)$/.test(fileName)) {
    return Promise.resolve(extractFromContent(simulatedBinaryContent(fileName, fallbackName), fallbackName));
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      resolve(extractFromContent(content, fallbackName));
    };
    reader.onerror = () => resolve(extractFromContent('', fallbackName));
    reader.readAsText(file);
  });
}

function minimumExperienceOf(job: JobRole): number {
  const match = job.experience.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export function matchJobs(resume: ExtractedResume, jobs: JobRole[] = jobRoles): JobRole[] {
  return jobs.filter((job) => {
    const hasRequiredExperience = resume.experience >= minimumExperienceOf(job);
    const hasRequiredSkills = job.requirements.some((skill) =>
      resume.skills.some(
        (resumeSkill) =>
          resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(resumeSkill.toLowerCase())
      )
    );
    return hasRequiredExperience && hasRequiredSkills;
  });
}

export function buildResumeAnalysis(fileName: string, resume: ExtractedResume): string {
  const matchingJobs = matchJobs(resume);

  let content = `📄 **Resume Analysis Complete!**\n\n**File**: ${fileName}\n**Name**: ${resume.name}\n**Current Role**: ${resume.currentRole}\n**Experience**: ${resume.experience} years\n**Education**: ${resume.education}\n**Location**: ${resume.location}\n**Skills Detected**: ${resume.skills.join(', ')}`;

  if (resume.email) content += `\n**Email**: ${resume.email}`;
  if (resume.phone) content += `\n**Phone**: ${resume.phone}`;
  content += `\n\n`;

  if (resume.experience < 1) {
    content += `❌ **Application Rejected - Insufficient Experience**\n\n`;
    content += `**Reason for Rejection:**\n`;
    content += `• Minimum experience required: 1 year\n`;
    content += `• Your current experience: ${resume.experience} years\n`;
    content += `• Experience gap: ${(1 - resume.experience).toFixed(1)} years\n\n`;
    content += `**Recommendations:**\n`;
    content += `• Gain more professional experience through internships or entry-level roles\n`;
    content += `• Build relevant skills through projects and certifications\n`;
    content += `• Reapply when you have at least 1 year of experience\n\n`;
    content += `**We encourage you to apply again in the future when you meet our experience requirements!**`;
  } else if (matchingJobs.length > 0) {
    content += `🎉 **Congratulations! You are eligible for ${matchingJobs.length} position(s):**\n\n`;
    matchingJobs.forEach((job, index) => {
      content += `**${index + 1}. ${job.title}** (${job.department})\n`;
      content += `• Experience Required: ${job.experience} ✅\n`;
      content += `• Skills Match: ${job.requirements.join(', ')} ✅\n`;
      content += `• Location: ${job.location}\n`;
      content += `• Description: ${job.description}\n\n`;
    });
    content += `**Next Steps:**\n• Click "Proceed with Application" below\n• Our team will review your profile\n• You'll receive an email confirmation shortly\n• HR will contact you for next steps`;
  } else {
    content += `😔 **We're sorry, but we couldn't find a perfect match for your current profile.**\n\n`;
    content += `**Why this happened:**\n`;
    content += `• Your experience (${resume.experience} years) may not meet requirements for matching roles\n`;
    content += `• Skills gap in areas we're actively hiring for\n\n`;
    content += `**📈 How to improve your chances:**\n`;
    content += `• Consider upskilling in high-demand areas:\n`;
    content += `  - Tech: React, JavaScript, Python, AWS\n`;
    content += `  - Sales: CRM tools, communication skills\n`;
    content += `  - Analytics: SQL, Excel, Tableau\n\n`;
    content += `**🔄 Alternative Options:**\n`;
    content += `• Certification courses to enhance your skill set\n`;
    content += `• Freelance projects to build your portfolio\n`;
    content += `• Re-apply in 3–6 months after skill development\n\n`;
    content += `**Thank you for your interest!** We'll keep your profile in our database for future opportunities. 🚀`;
  }

  return content;
}
