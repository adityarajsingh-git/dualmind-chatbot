import type { JobRole, Language, FAQ } from '../types';

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
    requirements: ['Sales', 'Communication', 'CRM', 'Insurance Knowledge'],
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
  // Add more job positions here
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

export const employeeHelpTopics = [
  {
    id: '1',
    category: 'HR & Policies',
    title: 'Leave Management',
    description: 'Apply for leaves, check leave balance, understand leave policies',
    commonIssues: ['Sick leave application', 'Annual leave balance', 'Maternity leave policy', 'Work from home requests']
  },
  {
    id: '2',
    category: 'IT Support',
    title: 'Technical Issues',
    description: 'Laptop problems, software access, network issues, password reset',
    commonIssues: ['Laptop not working', 'VPN connection issues', 'Software installation', 'Email access problems']
  },
  {
    id: '3',
    category: 'Payroll & Benefits',
    title: 'Salary & Benefits',
    description: 'Salary queries, tax deductions, benefits enrollment, reimbursement',
    commonIssues: ['Salary slip queries', 'Tax deduction questions', 'Health insurance claims', 'Travel reimbursement']
  },
  {
    id: '4',
    category: 'Workplace',
    title: 'Office & Facilities',
    description: 'Office access, parking, cafeteria, meeting rooms, office supplies',
    commonIssues: ['Office access card issues', 'Parking space allocation', 'Meeting room booking', 'Office supplies request']
  },
  // Add more employee help topics here
  {
    id: '5',
    category: 'Learning & Development',
    title: 'Training & Growth',
    description: 'Training programs, skill development, and career growth opportunities',
    commonIssues: ['Training programs', 'Skill development', 'Certification courses', 'Career guidance', 'Mentorship']
  },
  {
    id: '6',
    category: 'Performance & Reviews',
    title: 'Performance Management',
    description: 'Performance reviews, goal setting, and feedback processes',
    commonIssues: ['Performance review process', 'Goal setting', 'Feedback sessions', 'Performance improvement plans']
  },
  {
    id: '7',
    category: 'Compliance & Legal',
    title: 'Legal & Compliance',
    description: 'Company policies, legal requirements, and compliance matters',
    commonIssues: ['Company policies', 'Legal requirements', 'Compliance training', 'Code of conduct']
  }
];

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

export const recruitmentFAQs: FAQ[] = [
  {
    question: 'What are the eligibility criteria for software engineering roles?',
    answer: 'For software engineering roles, we typically look for candidates with 2-4 years of experience in React, TypeScript, Node.js, and cloud platforms like AWS. A degree in Computer Science or related field is preferred.'
  },
  {
    question: 'What is the interview process like?',
    answer: 'Our interview process includes: 1) Initial screening call, 2) Technical assessment, 3) Technical interview with coding, 4) System design discussion, 5) HR and culture fit interview.'
  },
  {
    question: 'Do you offer remote work options?',
    answer: 'Yes, we offer flexible work arrangements including remote work, hybrid models, and flexible hours based on role requirements and team needs.'
  },
  {
    question: 'What benefits do you provide?',
    answer: 'We offer comprehensive benefits including health insurance, life insurance, flexible PTO, learning & development budget, stock options, and wellness programs.'
  }
];

// Mock resume profiles for testing different scenarios (without names - extracted from resume)
export const mockResumeProfiles = [
  {
    experience: 4,
    skills: ["React", "JavaScript", "Node.js", "Python", "SQL", "AWS", "Docker", "Git"],
    department: "Tech",
    education: "B.Tech Computer Science",
    location: "Gurgaon",
    currentRole: "Software Engineer"
  },
  {
    experience: 2,
    skills: ["Python", "SQL", "Excel", "Tableau", "Financial Analysis"],
    department: "Finance",
    education: "MBA Finance",
    location: "Mumbai",
    currentRole: "Financial Analyst"
  },
  {
    experience: 2.5,
    skills: ["Communication", "Sales", "CRM", "Customer Service"],
    department: "Sales",
    education: "BBA Marketing",
    location: "Delhi",
    currentRole: "Sales Representative"
  },
  {
    experience: 3,
    skills: ["HR Management", "Recruitment", "Employee Relations", "Payroll"],
    department: "HR",
    education: "Masters in HR",
    location: "Bangalore",
    currentRole: "HR Executive"
  },
  {
    experience: 1.5,
    skills: ["Basic Computer", "Communication", "Problem Solving"],
    department: "Support",
    education: "B.Com",
    location: "Chennai",
    currentRole: "Support Executive"
  },
  {
    experience: 6,
    skills: ["Java", "Spring Boot", "Microservices", "Kubernetes", "DevOps"],
    department: "Tech",
    education: "M.Tech Computer Science",
    location: "Pune",
    currentRole: "Senior Software Engineer"
  },
  {
    experience: 1.5,
    skills: ["Customer Service", "Communication", "Problem Solving", "CRM"],
    department: "Support",
    education: "B.A English",
    location: "Hyderabad",
    currentRole: "Customer Support Executive"
  },
  {
    experience: 2.5,
    skills: ["Digital Marketing", "Social Media", "Analytics", "SEO", "Content Creation"],
    department: "Marketing",
    education: "BBA Marketing",
    location: "Mumbai",
    currentRole: "Digital Marketing Executive"
  },
  {
    experience: 5,
    skills: ["Sales Management", "Leadership", "CRM", "Team Building", "Strategy"],
    department: "Sales",
    education: "MBA Sales & Marketing",
    location: "Bangalore",
    currentRole: "Sales Manager"
  },
  {
    experience: 2.2,
    skills: ["Communication", "Customer Service", "Patience", "Multitasking"],
    department: "Call Centre",
    education: "B.A",
    location: "Gurgaon",
    currentRole: "Call Centre Executive"
  },
  // Add more resume profiles here
  {
    experience: 7,
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Science", "Statistics", "SQL"],
    department: "Tech",
    education: "PhD Computer Science",
    location: "Bangalore",
    currentRole: "Senior Data Scientist"
  },
  {
    experience: 2.8,
    skills: ["Content Writing", "SEO", "Social Media", "Marketing", "Analytics"],
    department: "Marketing",
    education: "B.A Journalism",
    location: "Mumbai",
    currentRole: "Content Marketing Executive"
  },
  {
    experience: 4.5,
    skills: ["Project Management", "Agile", "Scrum", "Leadership", "Communication", "Risk Management"],
    department: "Tech",
    education: "MBA Project Management",
    location: "Pune",
    currentRole: "Project Manager"
  },
  {
    experience: 2.8,
    skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    department: "Tech",
    education: "B.Des Graphic Design",
    location: "Delhi",
    currentRole: "UI/UX Designer"
  },
  {
    experience: 1.8,
    skills: ["Basic Computer", "Communication", "Learning", "Adaptability"],
    department: "Support",
    education: "12th Pass",
    location: "Chennai",
    currentRole: "Junior Support Executive"
  },
  // Test cases for rejection (less than 1 year experience)
  {
    experience: 0.5,
    skills: ["Basic Computer", "Communication"],
    department: "Support",
    education: "B.Com",
    location: "Mumbai",
    currentRole: "Intern"
  },
  {
    experience: 0.8,
    skills: ["Customer Service", "Communication"],
    department: "Call Centre",
    education: "12th Pass",
    location: "Delhi",
    currentRole: "Trainee"
  },
  {
    experience: 0.3,
    skills: ["Basic Skills"],
    department: "Support",
    education: "High School",
    location: "Bangalore",
    currentRole: "Fresher"
  },
  // Additional demo profiles for jury testing
  {
    experience: 0.6,
    skills: ["Basic Computer", "Communication", "Learning"],
    department: "Support",
    education: "B.Com",
    location: "Mumbai",
    currentRole: "Intern"
  },
  {
    experience: 1.5,
    skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    department: "Tech",
    education: "B.Tech Computer Science",
    location: "Delhi",
    currentRole: "Frontend Developer"
  },
  {
    experience: 3.5,
    skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
    department: "Tech",
    education: "M.Tech Computer Science",
    location: "Bangalore",
    currentRole: "Backend Developer"
  }
];

export const employeeHelpFAQs: FAQ[] = [
  {
    question: 'How do I apply for sick leave?',
    answer: 'You can apply for sick leave through the HR portal or by emailing your manager and HRBP. For sick leave of more than 3 days, you may need to submit a medical certificate. The leave will be deducted from your sick leave balance.'
  },
  {
    question: 'How can I reset my password?',
    answer: 'To reset your password: 1) Go to the IT portal, 2) Click "Forgot Password", 3) Enter your employee ID and registered email, 4) Follow the instructions sent to your email. If you face issues, contact IT support at it-support@acme.example.com.'
  },
  {
    question: 'How do I check my leave balance?',
    answer: 'You can check your leave balance by: 1) Logging into the HR portal, 2) Going to "My Profile" section, 3) Viewing "Leave Balance" tab. You can also contact HRBP for detailed leave information.'
  },
  {
    question: 'How do I request office supplies?',
    answer: 'To request office supplies: 1) Log into the facilities portal, 2) Go to "Supply Request" section, 3) Select the items you need, 4) Submit the request. Your manager will approve the request and supplies will be delivered to your desk.'
  },
  {
    question: 'How do I book a meeting room?',
    answer: 'To book a meeting room: 1) Open Outlook calendar, 2) Create a new meeting, 3) Click "Add Room" and select from available rooms, 4) Set your meeting time and duration. The room will be automatically booked if available.'
  },
  {
    question: 'How do I claim travel reimbursement?',
    answer: 'For travel reimbursement: 1) Keep all original bills and receipts, 2) Fill out the expense form on the HR portal, 3) Attach supporting documents, 4) Submit to your manager for approval. Reimbursement will be processed in the next payroll cycle.'
  },
  // Add more employee help FAQs here
  {
    question: 'How do I apply for training programs?',
    answer: 'You can apply for training programs through the Learning & Development portal. Browse available courses, check eligibility, and submit your application. Your manager will review and approve based on business needs and your development goals.'
  },
  {
    question: 'How do I schedule a performance review?',
    answer: 'Performance reviews are scheduled quarterly. You will receive a calendar invite from HR. If you need to reschedule, contact your manager and HRBP at least 48 hours in advance. Prepare your self-assessment and goal updates beforehand.'
  },
  {
    question: 'What is the company dress code policy?',
    answer: 'We follow a business casual dress code. Smart casuals are acceptable for most roles. For client meetings or formal events, business formal attire is required. Check the employee handbook for detailed guidelines.'
  },
  {
    question: 'How do I report a workplace issue?',
    answer: 'You can report workplace issues through: 1) Your direct manager, 2) HRBP, 3) Anonymous reporting portal, 4) Ethics hotline. All reports are taken seriously and investigated confidentially.'
  },
  {
    question: 'How do I update my emergency contact information?',
    answer: 'Update your emergency contact information through the HR portal: 1) Log in to your employee account, 2) Go to "Personal Information", 3) Update emergency contacts, 4) Save changes. This information is crucial for your safety.'
  },
  // Additional comprehensive employee help FAQs
  {
    question: 'How do I download my salary slip?',
    answer: 'Log in to PBhr.in > My Benefit & Pay > Compensation > Payslips to view and download your salary slips.'
  },
  {
    question: 'When will I receive the statutory bonus?',
    answer: 'Statutory bonus is processed during August–September each year for the previous financial year.'
  },
  {
    question: 'How do I enrol in NPS?',
    answer: 'Drop a mail to hr@acme.example.com with your employee ID and desired contribution percentage.'
  },
  {
    question: 'How many leaves do I have left?',
    answer: 'Check your leave balance on PBhr.in > Time & Attendance > Attendance & Leave > Leave Summary.'
  },
  {
    question: 'I missed to punch in — what should I do?',
    answer: 'Regularize via PBhr.in > Time & Attendance > Attendance > Request > Forgot to Punch.'
  },
  {
    question: 'My tenure is coming to an end (Contractual). What happens?',
    answer: 'Your HRBP will connect with you for next steps—should I notify them for you?'
  },
  {
    question: 'How do I download Form 16?',
    answer: 'Go to PBhr.in > HRMS > My Profile > View Details > Employee Lifecycle > Form 16.'
  },
  {
    question: 'How do I change my education details in HRMS?',
    answer: 'Please contact your HRBP for updating educational details.'
  },
  {
    question: 'What will I receive in my Full & Final settlement?',
    answer: 'F&F includes pending salary, leave encashment, and deductions, with a detailed breakup.'
  },
  {
    question: 'I want to change my bank account. What should I do?',
    answer: 'Email your HRBP with your employee ID, reason, and new bank details (with proof showing Name, Account No., and IFSC).'
  },
  {
    question: 'When is my appraisal due?',
    answer: 'Appraisals follow an Apr–Mar cycle; those who joined on or before Dec 31 are eligible for the same year.'
  },
  {
    question: 'How do I set or update my goals for the year?',
    answer: 'Go to PBhr.in > HRMS > Goals to set or update your goals.'
  },
  {
    question: 'I cannot access PBhr.in portal — what should I do?',
    answer: 'If your employee ID is active, please contact the IT team for login or network support.'
  },
  {
    question: 'How do I regularize my attendance for past dates?',
    answer: 'If the date falls outside the current attendance cycle (21st–20th), it can\'t be regularized—should I raise a ticket?'
  },
  {
    question: 'How do I update my Aadhaar/PAN details?',
    answer: 'Mail your HRBP with your employee ID and a masked copy of Aadhaar for the update.'
  },
  {
    question: 'My name is misspelled in official documents — how do I correct it?',
    answer: 'Email your HRBP with your employee ID, Aadhaar, and PAN for name correction.'
  },
  {
    question: 'When will my ecode be generated?',
    answer: 'Your ecode will be generated within 5–7 working days from your date of joining.'
  },
  // Comprehensive Policy FAQs
  {
    question: 'Who does the leave policy apply to?',
    answer: 'It applies to all employees, including probationers, of PB Fintech Ltd. and its subsidiaries/group companies.',
    source: 'Leave Policy'
  },
  {
    question: 'What types of leave are available?',
    answer: 'Employees are entitled to Earned Leave (EL), Sick Leave (SL), and Casual Leave (CL) as per state provisions.',
    source: 'Leave Policy'
  },
  {
    question: 'How is the leave year defined?',
    answer: 'The leave year follows the company\'s calendar year, from 1st January to 31st December.',
    source: 'Leave Policy'
  },
  {
    question: 'Can I carry forward unused leaves?',
    answer: 'Earned Leave can be carried forward up to state limits. Sick Leave and Casual Leave cannot be carried forward.',
    source: 'Leave Policy'
  },
  {
    question: 'Can I club Casual Leave and Sick Leave together?',
    answer: 'Yes, CL and SL can be clubbed, but only with manager approval.',
    source: 'Leave Policy'
  },
  {
    question: 'What if I take more leave than my balance?',
    answer: 'Excess leave will be treated as Leave Without Pay (LWP) and deducted from your salary.',
    source: 'Leave Policy'
  },
  {
    question: 'What happens if I don\'t mark leave on the ESS portal?',
    answer: 'Unmarked leave will be treated as absent, and your salary will be deducted for that period.',
    source: 'Leave Policy'
  },
  {
    question: 'How much notice is required before applying for leave?',
    answer: 'At least 2 days in advance for short leaves. If leave exceeds 5 days, it must be planned 30 days in advance.',
    source: 'Leave Policy'
  },
  {
    question: 'How many days of maternity leave are allowed?',
    answer: '26 weeks for up to 2 children. If expecting after 2 children, the duration is 12 weeks.',
    source: 'Leave Policy'
  },
  {
    question: 'Is there leave available for miscarriage?',
    answer: 'Yes, 6 weeks of paid leave is available after miscarriage or medical termination of pregnancy.',
    source: 'Leave Policy'
  },
  {
    question: 'Is adoption leave available?',
    answer: 'Yes, female employees adopting a child can take up to 12 weeks of adoption leave.',
    source: 'Leave Policy'
  },
  {
    question: 'Is paternity leave available?',
    answer: 'Yes, male employees are entitled to 7 days of paternity leave within 90 days of delivery or adoption.',
    source: 'Leave Policy'
  },
  {
    question: 'Can I take leave during my notice period?',
    answer: 'Only pro-rata Sick Leave is allowed. Any other leave will be marked as absent and recovered from your notice pay.',
    source: 'Leave Policy'
  },
  {
    question: 'Can I encash unused leaves?',
    answer: 'Unused Earned Leave will be encashed at the basic pay rate within 60 working days after resignation or termination.',
    source: 'Leave Policy'
  },
  {
    question: 'What holidays are provided?',
    answer: 'All employees get public holidays as per the company calendar, including Republic Day, Independence Day, and Gandhi Jayanti.',
    source: 'Leave Policy'
  },
  {
    question: 'What if I work on a public holiday?',
    answer: 'You will get a compensatory off, which must be availed within 90 days, applicable up to Assistant Manager level.',
    source: 'Leave Policy'
  },
  {
    question: 'Who is eligible for local conveyance reimbursement?',
    answer: 'All employees whose role demands local travel with specific approval from their Department Head.',
    source: 'Local Conveyance Policy'
  },
  {
    question: 'Is home to office travel covered in local conveyance?',
    answer: 'No, daily commute between office and home is not covered.',
    source: 'Local Conveyance Policy'
  },
  {
    question: 'What is the reimbursement rate for fuel?',
    answer: 'Rs. 12 per km for 4-wheelers and Rs. 6 per km for 2-wheelers, with a maximum of 4000 km per month.',
    source: 'Local Conveyance Policy'
  },
  {
    question: 'Is public transport reimbursement allowed?',
    answer: 'Yes, up to Rs. 10,000 per month, with original bills submitted.',
    source: 'Local Conveyance Policy'
  },
  {
    question: 'Can I claim parking and toll charges?',
    answer: 'Yes, parking and toll expenses are reimbursable with original receipts.',
    source: 'Local Conveyance Policy'
  },
  {
    question: 'How do I claim local conveyance reimbursement?',
    answer: 'Submit claims via ESS with scanned bills, manager approval, and submit originals to Finance. Payment is processed within 15 days.',
    source: 'Local Conveyance Policy'
  },
  {
    question: 'Who does the relocation policy apply to?',
    answer: 'All employees, including probationers, and new joiners offered relocation reimbursement.',
    source: 'Relocation Policy'
  },
  {
    question: 'What expenses are covered under relocation?',
    answer: 'One-way travel for employee, spouse, and up to 2 children, hotel stay for 7 days, and transportation of household goods including one vehicle.',
    source: 'Relocation Policy'
  },
  {
    question: 'Do I need quotations for shifting household goods?',
    answer: 'Yes, you must submit at least 3 quotations. The best quotation is approved by the Functional Head.',
    source: 'Relocation Policy'
  },
  {
    question: 'What happens if I leave the company within one year after relocation?',
    answer: 'All relocation expenses will be recovered from your Full & Final settlement.',
    source: 'Relocation Policy'
  },
  {
    question: 'Who is eligible under the travel policy?',
    answer: 'All employees requiring travel for work with approval, and candidates traveling for interviews if reimbursement is offered.',
    source: 'Travel Policy'
  },
  {
    question: 'What travel modes are reimbursable?',
    answer: 'Air tickets (economy class), train tickets as per grade, and road travel with approval.',
    source: 'Travel Policy'
  },
  {
    question: 'What train travel classes are allowed?',
    answer: 'Directors+: 1st AC, Managers-VP: 2nd AC, DM level and below: 3rd AC.',
    source: 'Travel Policy'
  },
  {
    question: 'What is the hotel entitlement?',
    answer: 'Directors+: Actuals; Managers-VP: Rs. 8000 in metros, Rs. 5000 in non-metros; DM level: Rs. 5000 in metros, Rs. 3000 in non-metros.',
    source: 'Travel Policy'
  },
  {
    question: 'What is the daily meal reimbursement limit?',
    answer: 'Up to Rs. 2000 per day on actuals.',
    source: 'Travel Policy'
  },
  {
    question: 'Is per diem allowance provided?',
    answer: 'No, per diem is not paid for office travel.',
    source: 'Travel Policy'
  },
  {
    question: 'How to claim travel reimbursement?',
    answer: 'Submit reimbursement form with original bills, boarding pass, and approvals to Finance within 30 days. Payment is made within 15 days.',
    source: 'Travel Policy'
  },
  {
    question: 'Who is eligible for education fee reimbursement?',
    answer: 'Full-time employees with at least one year of service.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'What types of courses are eligible?',
    answer: 'Work-integrated, higher education, or accredited certification courses relevant to current or future work.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'How many programs can I enroll in at a time?',
    answer: 'Only one program at a time is allowed.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'What is the reimbursement limit for education?',
    answer: 'For courses ≤6 months: Rs. 50,000 or 75%. For >6 months: Rs. 1,00,000 p.a. or 75%. Books up to 10% of tuition fee.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'When is education reimbursement paid?',
    answer: 'After successful completion, upon submission of original mark sheets and proof of fees paid.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'What are the minimum passing criteria for education reimbursement?',
    answer: 'At least 50% marks, or equivalent grade, must be secured.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'What happens if I don\'t finish the course?',
    answer: 'No reimbursement will be given if the course is not completed successfully.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'What if I resign after receiving reimbursement?',
    answer: 'You must serve 6 months after short courses and 1 year after longer courses, or the reimbursed fee will be recovered with 9% interest.',
    source: 'Work Integrated Education Policy'
  },
  {
    question: 'Are taxes applicable on reimbursement?',
    answer: 'Yes, the reimbursed amount is taxable as per IT slab, and the employee bears the tax liability.',
    source: 'Work Integrated Education Policy'
  }
];
