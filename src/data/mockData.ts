import type { JobRole, FAQ } from '../types';

export const jobRoles: JobRole[] = [
  {
    id: '1',
    title: 'Software Engineer',
    department: 'Engineering',
    requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
    description: 'Build scalable web applications and contribute to our tech stack',
    experience: '2-4 years',
    location: 'Gurgaon, Delhi NCR'
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    requirements: ['Product Strategy', 'Analytics', 'User Research', 'Agile'],
    description: 'Lead product development and drive business growth',
    experience: '3-5 years',
    location: 'Mumbai, Maharashtra'
  },
  {
    id: '3',
    title: 'Sales Executive',
    department: 'Sales',
    requirements: ['Sales', 'Communication', 'CRM'],
    description: 'Drive sales growth and build customer relationships',
    experience: '1-3 years',
    location: 'Bangalore, Karnataka'
  },
  {
    id: '4',
    title: 'Data Analyst',
    department: 'Analytics',
    requirements: ['SQL', 'Python', 'Tableau', 'Statistics'],
    description: 'Analyze data to drive business insights and decisions',
    experience: '2-4 years',
    location: 'Pune, Maharashtra'
  },
  {
    id: '5',
    title: 'Data Scientist',
    department: 'Tech',
    requirements: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow'],
    description: 'Build and deploy machine learning models for business insights',
    experience: '3-6 years',
    location: 'Bangalore, Mumbai, Gurgaon'
  },
  {
    id: '6',
    title: 'UI/UX Designer',
    department: 'Tech',
    requirements: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    description: 'Design intuitive and beautiful user interfaces',
    experience: '2-4 years',
    location: 'Mumbai, Delhi, Bangalore, Gurgaon'
  },
  {
    id: '7',
    title: 'Project Manager',
    department: 'Tech',
    requirements: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'],
    description: 'Lead cross-functional teams and manage project delivery',
    experience: '4-7 years',
    location: 'Pune, Mumbai, Bangalore, Gurgaon'
  },
  {
    id: '8',
    title: 'Quality Assurance Engineer',
    department: 'Tech',
    requirements: ['Testing', 'Selenium', 'Automation', 'Manual Testing', 'Bug Tracking'],
    description: 'Ensure software quality through comprehensive testing',
    experience: '2-4 years',
    location: 'Gurgaon, Mumbai, Bangalore, Pune'
  },
  {
    id: '9',
    title: 'Business Analyst',
    department: 'Finance',
    requirements: ['Business Analysis', 'SQL', 'Excel', 'Requirements Gathering', 'Documentation'],
    description: 'Analyze business processes and requirements',
    experience: '2-4 years',
    location: 'Mumbai, Delhi, Bangalore, Gurgaon'
  },
  {
    id: '10',
    title: 'Operations Manager',
    department: 'Support',
    requirements: ['Operations Management', 'Process Improvement', 'Leadership', 'Analytics', 'Team Management'],
    description: 'Optimize operations and improve efficiency',
    experience: '4-6 years',
    location: 'Mumbai, Bangalore, Gurgaon, Chennai'
  }
];

// ---------------------------------------------------------------------------
// Recruitment knowledge base — generic, works for any small/mid-size company
// ---------------------------------------------------------------------------

export const recruitmentFAQs: FAQ[] = [
  {
    question: 'How do I apply for a job?',
    answer: 'Applying is simple: 1) Upload your resume right here in the chat for instant analysis, 2) I\'ll match you against all open roles, 3) If there\'s a fit, click "Proceed with Application" and HR will contact you with next steps.',
    keywords: ['apply', 'application', 'process', 'submit']
  },
  {
    question: 'What job openings do you currently have?',
    answer: 'We hire across Engineering, Product, Design, Sales, Marketing, Analytics, and Operations. The current catalog includes Software Engineers, Product Managers, Data Scientists/Analysts, UI/UX Designers, QA Engineers, Business Analysts, Sales Executives, and Operations Managers. Upload your resume and I\'ll tell you exactly which ones you qualify for!',
    keywords: ['openings', 'jobs', 'positions', 'vacancies', 'hiring', 'roles', 'available']
  },
  {
    question: 'What are the eligibility criteria for software engineering roles?',
    answer: 'For software engineering roles we typically look for 2–4 years of experience with React, TypeScript, Node.js, and cloud platforms like AWS. A Computer Science degree helps but strong practical experience matters most.',
    keywords: ['eligibility', 'criteria', 'requirements', 'software', 'engineer', 'developer']
  },
  {
    question: 'What is the interview process like?',
    answer: 'Our interview process has 4 steps: 1) Initial screening call with HR, 2) Technical or functional assessment, 3) In-depth interview with the hiring team, 4) Culture-fit conversation and offer discussion. Most candidates finish all rounds within two weeks.',
    keywords: ['interview', 'rounds', 'steps', 'stages']
  },
  {
    question: 'How long does the hiring process take?',
    answer: 'Typically 1–2 weeks from application to offer. You\'ll hear back on your application within 3–5 business days, and we try to keep no more than a few days between interview rounds.',
    keywords: ['timeline', 'long', 'time', 'days', 'duration', 'response', 'hear back']
  },
  {
    question: 'How do I check my application status?',
    answer: 'After you apply you\'ll receive an email confirmation. If you haven\'t heard back within 5 business days, reply to that email or write to the recruiting team with your name and the role you applied for.',
    keywords: ['status', 'update', 'follow', 'track', 'applied']
  },
  {
    question: 'Do you offer remote work options?',
    answer: 'Yes! We offer flexible arrangements including hybrid and fully remote options depending on the role and team. Discuss specifics with the hiring manager during your interview.',
    keywords: ['remote', 'wfh', 'home', 'hybrid', 'flexible', 'onsite']
  },
  {
    question: 'What benefits do you provide?',
    answer: 'Our benefits include health insurance, flexible PTO, a learning & development budget, performance bonuses, and flexible/hybrid work arrangements. Details are shared with your offer.',
    keywords: ['benefits', 'perks', 'insurance', 'bonus']
  },
  {
    question: 'When are salary details discussed?',
    answer: 'Compensation is discussed in the HR round once there\'s mutual interest. Our packages are competitive and based on role, experience, and location — base salary plus performance bonus and benefits.',
    keywords: ['salary', 'compensation', 'pay', 'ctc', 'package', 'negotiate']
  },
  {
    question: 'Can freshers apply?',
    answer: 'Full-time roles require at least 1 year of professional experience. If you\'re a fresher, keep an eye out for our internship programs — they\'re the best route in, and interns regularly convert to full-time offers.',
    keywords: ['fresher', 'freshers', 'graduate', 'entry', 'level', 'experience', 'zero']
  },
  {
    question: 'Do you offer internships?',
    answer: 'Yes, we run internship programs a few times a year across engineering, design, and business teams. Internships typically last 3–6 months and strong performers receive full-time offers.',
    keywords: ['internship', 'intern', 'student', 'college', 'trainee']
  },
  {
    question: 'Can I apply for multiple positions?',
    answer: 'Yes, you can apply for up to two roles at a time. Better yet, upload your resume here and I\'ll automatically check you against every open position at once.',
    keywords: ['multiple', 'two', 'several', 'positions', 'more than one']
  },
  {
    question: 'Can I reapply after being rejected?',
    answer: 'Absolutely — we encourage reapplying after 6 months. Use the time to build the skills highlighted in your feedback, and mention your previous application when you reapply.',
    keywords: ['reapply', 'rejected', 'again', 'reapplication', 'second']
  },
  {
    question: 'How does the employee referral process work?',
    answer: 'If someone who works here referred you, mention their name in your application or ask them to submit your profile internally. Referred candidates get a guaranteed resume review and typically a faster response.',
    keywords: ['referral', 'refer', 'referred', 'employee', 'friend']
  },
  {
    question: 'What should I include in my resume?',
    answer: 'Keep it to 1–2 pages. Clearly state your total experience and key skills (that\'s what our matching engine reads), lead with quantifiable achievements, and use action verbs. Tailor the top third of the resume to the role you want.',
    keywords: ['resume', 'cv', 'include', 'tips', 'format', 'improve']
  },
  {
    question: 'How should I prepare for the interview?',
    answer: 'Research the company and product, prepare 2–3 STAR-method stories (Situation, Task, Action, Result), be ready to discuss your resume projects in depth, and bring thoughtful questions about the team and roadmap. For technical roles, brush up on fundamentals and practice explaining your thinking aloud.',
    keywords: ['prepare', 'preparation', 'interview', 'tips', 'advice']
  },
  {
    question: 'What is the company culture like?',
    answer: 'We\'re a close-knit team that values ownership, direct communication, and learning. Being a smaller company means your work is visible and your ideas reach decision-makers fast — you won\'t be a cog in a machine.',
    keywords: ['culture', 'environment', 'team', 'values', 'like to work']
  },
  {
    question: 'Do you provide relocation assistance?',
    answer: 'Relocation support is decided case by case depending on the role and level. If you\'d need to relocate, raise it in the HR round and we\'ll let you know what\'s possible.',
    keywords: ['relocation', 'relocate', 'move', 'city', 'shift']
  },
  {
    question: 'What is the notice period expectation for joining?',
    answer: 'We understand most candidates have a 30–60 day notice period. Share your earliest joining date in the HR round; for urgent roles we may discuss a notice-period buyout.',
    keywords: ['notice', 'joining', 'date', 'buyout', 'when can i join']
  }
];

// ---------------------------------------------------------------------------
// Employee help desk knowledge base — generic policies for a 30–100 person org
// ---------------------------------------------------------------------------

export const employeeHelpFAQs: FAQ[] = [
  // --- Leave & attendance ---
  {
    question: 'How do I apply for sick leave?',
    answer: 'Inform your manager as early as possible, then mark the sick leave in the HR portal. For sick leave longer than 2 consecutive days, attach a medical certificate.',
    source: 'Leave Policy',
    keywords: ['sick', 'ill', 'unwell', 'medical', 'fever']
  },
  {
    question: 'How do I check my leave balance?',
    answer: 'Log in to the HR portal and open the Leave Summary section — it shows your earned, casual, and sick leave balances in real time.',
    source: 'Leave Policy',
    keywords: ['balance', 'remaining', 'left', 'many leaves']
  },
  {
    question: 'What types of leave are available?',
    answer: 'You get Earned Leave (for planned time off), Casual Leave (for short personal needs), and Sick Leave. Parental leave and bereavement leave are available separately.',
    source: 'Leave Policy',
    keywords: ['types', 'kinds', 'categories', 'earned', 'casual']
  },
  {
    question: 'Can I carry forward unused leaves?',
    answer: 'Earned Leave carries forward up to 30 days into the next calendar year. Casual and Sick Leave lapse at year end.',
    source: 'Leave Policy',
    keywords: ['carry', 'forward', 'unused', 'lapse', 'expire', 'next year']
  },
  {
    question: 'What if I take more leave than my balance?',
    answer: 'Leave beyond your available balance is treated as Leave Without Pay (LWP) and adjusted in that month\'s salary. Check your balance before applying to avoid surprises.',
    source: 'Leave Policy',
    keywords: ['more', 'exceed', 'negative', 'without pay', 'lwp', 'unpaid']
  },
  {
    question: 'How much notice is required before applying for leave?',
    answer: 'Apply at least 2 working days in advance for short leaves. For leaves longer than 5 days, plan and get approval at least 2 weeks ahead.',
    source: 'Leave Policy',
    keywords: ['notice', 'advance', 'before', 'planned']
  },
  {
    question: 'How many days of maternity leave are allowed?',
    answer: 'Maternity leave is 26 weeks of paid leave, as per statutory requirements. Speak with HR early so cover and handover can be planned comfortably.',
    source: 'Leave Policy',
    keywords: ['maternity', 'pregnancy', 'pregnant', 'child']
  },
  {
    question: 'Is paternity leave available?',
    answer: 'Yes, 2 weeks of paid paternity leave, to be taken within 3 months of the child\'s birth or adoption.',
    source: 'Leave Policy',
    keywords: ['paternity', 'father', 'baby']
  },
  {
    question: 'What are the company holidays?',
    answer: 'The annual holiday calendar (10–12 public holidays plus any regional ones) is published on the HR portal at the start of each year.',
    source: 'Leave Policy',
    keywords: ['holidays', 'calendar', 'public', 'festival']
  },
  {
    question: 'What if I work on a public holiday?',
    answer: 'You earn a compensatory off, which should be used within 60 days. Mark the comp-off request in the HR portal with your manager\'s approval.',
    source: 'Leave Policy',
    keywords: ['comp', 'compensatory', 'worked', 'weekend']
  },
  {
    question: 'What is the work from home policy?',
    answer: 'We follow a hybrid model — up to 2 WFH days per week with manager approval. Mark WFH days in the HR portal. Longer remote stretches need advance approval from your manager.',
    source: 'Employee Handbook',
    keywords: ['wfh', 'remote', 'home', 'hybrid']
  },
  {
    question: 'Can I take leave during my notice period?',
    answer: 'Only sick leave (with a medical certificate) is allowed during the notice period. Other leave taken will extend your notice period by the same number of days.',
    source: 'Exit Policy',
    keywords: ['notice period', 'leave during', 'resigned']
  },
  {
    question: 'How do I regularize a missed punch or attendance?',
    answer: 'Open the HR portal → Attendance → Regularization, pick the date, and submit the correction with a reason. Your manager approves it. Do this within the same attendance cycle.',
    source: 'Employee Handbook',
    keywords: ['punch', 'attendance', 'regularize', 'missed', 'forgot', 'biometric']
  },
  {
    question: 'What are the office timings?',
    answer: 'Core hours are 10 AM to 5 PM, with flexible start between 8–10 AM. Full-time employees are expected to log about 8 working hours a day.',
    source: 'Employee Handbook',
    keywords: ['timings', 'hours', 'shift', 'core', 'flexible']
  },

  // --- Payroll & tax ---
  {
    question: 'When is salary credited?',
    answer: 'Salary is credited on the last working day of every month. If it hasn\'t arrived by the next working day, contact HR/Finance.',
    source: 'Payroll',
    keywords: ['salary', 'credited', 'date', 'when', 'paid']
  },
  {
    question: 'How do I download my salary slip?',
    answer: 'Log in to the HR portal → Payroll → Payslips. Slips for every month are available to view and download as PDF.',
    source: 'Payroll',
    keywords: ['payslip', 'slip', 'download', 'salary slip']
  },
  {
    question: 'How do I get my annual tax statement?',
    answer: 'Your annual tax statement (e.g. Form 16) is published on the HR portal under Payroll → Tax Documents after the financial year closes, typically by mid-June.',
    source: 'Payroll',
    keywords: ['tax', 'form 16', 'statement', 'tds', 'documents']
  },
  {
    question: 'How do I submit my tax-saving declarations?',
    answer: 'Submit your investment declarations on the HR portal at the start of the financial year, and upload actual proofs by January. Missing the proof deadline means higher TDS in the final quarter.',
    source: 'Payroll',
    keywords: ['declaration', 'investment', 'proof', 'tax saving', '80c']
  },
  {
    question: 'I want to change my salary bank account. What should I do?',
    answer: 'Email HR with your employee ID and a cancelled cheque or bank statement showing your name, account number, and IFSC. Changes made before the 20th apply to that month\'s payroll.',
    source: 'Payroll',
    keywords: ['bank', 'account', 'change', 'ifsc']
  },

  // --- IT support ---
  {
    question: 'How can I reset my password?',
    answer: 'Use the "Forgot Password" self-service link on the login page — a reset link goes to your registered email. If you\'re locked out entirely, raise a ticket with IT support.',
    source: 'IT Policy',
    keywords: ['password', 'reset', 'forgot', 'locked', 'login']
  },
  {
    question: 'My laptop is not working. What do I do?',
    answer: 'Raise a ticket with the IT helpdesk describing the issue. For hardware failures, IT will arrange a repair or a loaner device so you\'re not blocked.',
    source: 'IT Policy',
    keywords: ['laptop', 'computer', 'broken', 'hardware', 'not working', 'slow']
  },
  {
    question: 'How do I request new software or a license?',
    answer: 'Raise an IT ticket with the software name and business reason, and loop in your manager for approval. Licensed tools are provisioned within 1–2 working days after approval.',
    source: 'IT Policy',
    keywords: ['software', 'license', 'install', 'tool', 'request']
  },
  {
    question: 'I cannot connect to the VPN. What should I check?',
    answer: 'First restart the VPN client and check your internet connection. If it still fails, verify your credentials haven\'t expired, then raise an IT ticket with a screenshot of the error.',
    source: 'IT Policy',
    keywords: ['vpn', 'connect', 'network', 'access']
  },
  {
    question: 'My email is not working. Who do I contact?',
    answer: 'Check webmail first to rule out a client issue. If webmail also fails, raise an IT ticket — include when it stopped working and any error message you see.',
    source: 'IT Policy',
    keywords: ['email', 'outlook', 'gmail', 'mailbox']
  },

  // --- Expenses & travel ---
  {
    question: 'How do I claim expense reimbursement?',
    answer: 'Submit the claim on the HR portal with scanned receipts within 30 days of the expense. After manager approval, reimbursement is paid with the next payroll cycle.',
    source: 'Expense Policy',
    keywords: ['reimbursement', 'expense', 'claim', 'receipts', 'money back']
  },
  {
    question: 'What is the travel policy for work trips?',
    answer: 'Book economy airfare or standard train fare, and stay within the per-night hotel caps set for your destination (shared in the Expense Policy). Meals on travel are reimbursed against actual bills up to the daily cap. Get manager approval before booking.',
    source: 'Expense Policy',
    keywords: ['travel', 'trip', 'flight', 'hotel', 'onsite', 'client visit']
  },
  {
    question: 'Can I claim fuel or cab charges for local travel?',
    answer: 'Yes — local travel for work (client visits, offsite meetings) is reimbursable with receipts or per-km rates for personal vehicles. The daily office commute is not covered.',
    source: 'Expense Policy',
    keywords: ['fuel', 'cab', 'taxi', 'local', 'conveyance', 'petrol', 'commute']
  },

  // --- Benefits ---
  {
    question: 'What does the health insurance cover?',
    answer: 'The group health policy covers you and can be extended to your spouse, children, and parents. It covers hospitalization, day-care procedures, and pre/post hospitalization expenses. Policy documents are on the HR portal.',
    source: 'Benefits',
    keywords: ['insurance', 'health', 'medical', 'cover', 'hospital', 'mediclaim']
  },
  {
    question: 'How do I add dependents to my insurance?',
    answer: 'Email HR with your dependent\'s details within 30 days of joining, marriage, or a child\'s birth. Outside those windows, additions happen at the annual policy renewal.',
    source: 'Benefits',
    keywords: ['dependent', 'spouse', 'parents', 'add', 'family', 'insurance']
  },
  {
    question: 'Is there a referral bonus?',
    answer: 'Yes! Refer a candidate by sending their resume to HR. If they\'re hired and complete 90 days, you receive the referral bonus with that month\'s payroll.',
    source: 'Benefits',
    keywords: ['referral', 'bonus', 'refer', 'friend']
  },
  {
    question: 'Is there a learning or training budget?',
    answer: 'Every employee has an annual learning budget for courses, books, and certifications relevant to their role. Get manager approval first, then claim it like a regular reimbursement.',
    source: 'Benefits',
    keywords: ['learning', 'training', 'course', 'certification', 'budget', 'upskill']
  },

  // --- HR requests & workplace ---
  {
    question: 'How do I update my personal details?',
    answer: 'Update address, phone, and emergency contacts yourself on the HR portal under My Profile. Changes to legal name, PAN, or other ID-linked details go through HR with supporting documents.',
    source: 'Employee Handbook',
    keywords: ['update', 'address', 'phone', 'personal', 'details', 'emergency contact']
  },
  {
    question: 'My name is misspelled in official documents. How do I correct it?',
    answer: 'Email HR with your employee ID and a government ID showing the correct spelling. HR will correct it across payroll, insurance, and your records.',
    source: 'Employee Handbook',
    keywords: ['name', 'misspelled', 'correction', 'wrong', 'spelling']
  },
  {
    question: 'How do I get an employment or experience letter?',
    answer: 'Request it by email to HR with the purpose (visa, loan, address proof, etc.). Standard letters are issued within 3 working days.',
    source: 'Employee Handbook',
    keywords: ['letter', 'employment', 'experience', 'proof', 'certificate', 'visa', 'loan']
  },
  {
    question: 'How do I report a workplace issue or harassment?',
    answer: 'You can report through your manager, directly to HR, or via the anonymous reporting channel. Harassment complaints go to the internal committee. Every report is handled confidentially and without retaliation.',
    source: 'Employee Handbook',
    keywords: ['harassment', 'complaint', 'report', 'issue', 'grievance', 'posh', 'bully']
  },
  {
    question: 'How does the performance review cycle work?',
    answer: 'Reviews happen twice a year — a mid-year check-in and a year-end appraisal that feeds into increments and promotions. You\'ll submit a self-assessment, then have a review conversation with your manager.',
    source: 'Employee Handbook',
    keywords: ['performance', 'review', 'appraisal', 'increment', 'promotion', 'rating']
  },
  {
    question: 'How do I set or update my goals for the year?',
    answer: 'Set your goals on the HR portal under Goals at the start of the cycle, aligned with your manager. You can update them mid-year during the check-in.',
    source: 'Employee Handbook',
    keywords: ['goals', 'okr', 'objectives', 'set', 'kpi']
  },
  {
    question: 'What is the probation period?',
    answer: 'New joiners are on probation for 3 months, with confirmation after a review with your manager. Benefits and leave accrual start from day one regardless.',
    source: 'Employee Handbook',
    keywords: ['probation', 'confirmation', 'new joiner']
  },
  {
    question: 'How do I book a meeting room?',
    answer: 'Book through the shared calendar — create a meeting, add the room as a resource, and it\'s reserved if free. For recurring bookings or events, check with the office manager.',
    source: 'Employee Handbook',
    keywords: ['meeting', 'room', 'book', 'conference']
  },
  {
    question: 'What is the dress code?',
    answer: 'Casual is fine for regular days. Go business casual for client meetings and external events. Use good judgment — comfortable but presentable.',
    source: 'Employee Handbook',
    keywords: ['dress', 'code', 'wear', 'attire', 'clothes']
  },

  // --- Exit ---
  {
    question: 'How do I resign and what is the notice period?',
    answer: 'Email your resignation to your manager and HR. The standard notice period is 30 days (60 for senior roles, as per your offer letter). HR will confirm your last working day and start the exit process.',
    source: 'Exit Policy',
    keywords: ['resign', 'resignation', 'quit', 'notice', 'leaving']
  },
  {
    question: 'What will I receive in my Full & Final settlement?',
    answer: 'F&F includes pending salary, encashment of unused earned leave, and any approved reimbursements, minus applicable deductions or recoveries. It\'s processed within 45 days of your last working day with a detailed breakup.',
    source: 'Exit Policy',
    keywords: ['full and final', 'fnf', 'settlement', 'dues']
  },
  {
    question: 'Can I encash unused leaves?',
    answer: 'Unused Earned Leave is encashed at your basic pay rate as part of the Full & Final settlement when you leave. There is no leave encashment while employed.',
    source: 'Exit Policy',
    keywords: ['encash', 'encashment', 'unused', 'leave']
  }
];
