import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingBackground from './components/LandingBackground';
import type { ChatMode } from './types';
import { jobRoles, employeeHelpFAQs, recruitmentFAQs } from './data/mockData';
import './App.css';
import Background from './assets/background.png';
import Logo from './assets/logo.png';

function App() {
  const [currentMode, setCurrentMode] = useState<ChatMode | null>(null); // Start with no mode selected
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showTicketConfirmation, setShowTicketConfirmation] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // New state for chatbot visibility
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // New state for feedback popup
  const [feedbackText, setFeedbackText] = useState(''); // State for feedback input
  const [conversationSummary, setConversationSummary] = useState(''); // State for animated summary
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false); // State for summary animation
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input field focus

  // Auto-focus input when chatbot opens or mode is selected
  useEffect(() => {
    if (isChatbotOpen && currentMode && inputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatbotOpen, currentMode]);

  const generateBotResponse = (userMessage: string, mode: ChatMode): string => {
    const message = userMessage.toLowerCase();
    
    if (mode === 'recruitment') {
      // Search through recruitment FAQs first
      for (const faq of recruitmentFAQs) {
        const questionWords = faq.question.toLowerCase().split(' ');
        const messageWords = message.split(' ');
        
        // Check if any significant words from the question match the user's message
        const matchingWords = questionWords.filter(word => 
          word.length > 3 && messageWords.some(msgWord => 
            msgWord.includes(word) || word.includes(msgWord)
          )
        );
        
        if (matchingWords.length >= 2) {
          return faq.source ? `${faq.answer}\n\n*Source: ${faq.source}*` : faq.answer;
        }
      }
      
      // Fallback to keyword-based responses with generic conversational responses
      if (message.includes('apply') && (message.includes('job') || message.includes('position'))) {
        return "Fantastic! I'm excited to help you apply for a position at Acme Corp! 🚀\n\nWe have amazing opportunities across various departments:\n\n• **Technology** - Software Engineers, Data Scientists, DevOps\n• **Product & Design** - Product Managers, UI/UX Designers\n• **Business** - Sales, Marketing, Business Development\n• **Operations** - HR, Finance, Customer Support\n\nTo get started, I'd love to learn more about your background! You can:\n📄 **Upload your resume** for instant AI analysis\n💬 **Tell me about your experience** and interests\n\nWhat would you prefer to do first?";
      }
      if (message.includes('job') || message.includes('opening') || message.includes('position') || message.includes('career')) {
        return "Great! We have several exciting job openings at Acme Corp. We're currently hiring for:\n\n• Software Engineers (React, Node.js, Python)\n• Product Managers\n• Data Scientists\n• Marketing Specialists\n• Sales Representatives\n\nWould you like me to help you find a role that matches your skills?";
      }
      if (message.includes('apply') || message.includes('application')) {
        return "Wonderful! I'm here to help you with your job application at Acme Corp! 🌟\n\nHere's how I can assist you:\n\n📋 **Application Process:**\n• Upload and analyze your resume\n• Match you with suitable roles\n• Provide interview preparation tips\n• Guide you through next steps\n\n📎 **Quick Start:** Use the 'Upload Resume' button below for instant analysis!\n\nWhat specific help do you need with your application?";
      }
      if (message.includes('resume') || message.includes('cv')) {
        return "I can help you with resume optimization! For the best results:\n\n• Keep it concise (1-2 pages)\n• Highlight relevant skills and experience\n• Use action verbs (developed, managed, implemented)\n• Include quantifiable achievements\n• Tailor it to the specific role\n\n📎 **Upload your resume** using the button below for AI-powered analysis and personalized suggestions!";
      }
      if (message.includes('interview') || message.includes('prepare')) {
        return "Here are some interview tips for Acme Corp:\n\n• Research our company culture and values\n• Prepare examples using the STAR method\n• Be ready to discuss your technical skills\n• Show enthusiasm for the insurance/fintech industry\n• Ask thoughtful questions about the role\n\nWhat specific role are you interviewing for?";
      }
      if (message.includes('salary') || message.includes('compensation')) {
        return "Our compensation packages are competitive and include:\n\n• Competitive base salary\n• Performance bonuses\n• Health insurance\n• Learning & development budget\n• Flexible work arrangements\n\nExact compensation depends on role, experience, and location. Would you like to discuss a specific position?";
      }
      
      // Add more generic responses for common queries
      if (message.includes('help') || message.includes('assist') || message.includes('support')) {
        return "I'm here to help you with your career journey at Acme Corp! 🤝\n\nI can assist you with:\n\n🎯 **Finding the right role** for your skills\n📄 **Resume analysis** and optimization\n💼 **Application process** guidance\n🎤 **Interview preparation** tips\n🏢 **Company information** and culture\n\nWhat would you like to explore first? Feel free to ask me anything or upload your resume for personalized recommendations!";
      }
      
      if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
        return "Hello! Welcome to Acme Corp's Recruitment Assistant! 👋\n\nI'm here to help you explore amazing career opportunities with us. Whether you're looking for your first job or your next big career move, I'm excited to assist you!\n\n🚀 **What I can do for you:**\n• Help you find suitable job openings\n• Analyze your resume and suggest improvements\n• Guide you through our application process\n• Provide interview tips and company insights\n\nHow can I help you today?";
      }
      
      if (message.includes('thank') || message.includes('thanks')) {
        return "You're very welcome! 😊 I'm happy to help you with your career journey at Acme Corp.\n\nIf you have any more questions about job opportunities, applications, or anything else related to careers here, feel free to ask! I'm here to support you every step of the way.\n\nGood luck with your job search! 🌟";
      }
    } else {
      // SIMPLE: Check if user message matches any question in mock data
      for (const faq of employeeHelpFAQs) {
        const questionLower = faq.question.toLowerCase();
        
        // Skip matching for very short messages (like "hi", "ok", etc.)
        if (message.length < 4) {
          continue;
        }
        
        // Check if user message contains the question or vice versa
        // But exclude partial word matches for short words
        if (message.length >= 8 && questionLower.includes(message)) {
          console.log('Found match:', faq.question);
          return faq.source ? `${faq.answer}\n\n*Source: ${faq.source}*` : faq.answer;
        }
        
        // Check if question is contained in user message (for longer user messages)
        if (message.length >= 15 && message.includes(questionLower)) {
          console.log('Found match:', faq.question);
          return faq.source ? `${faq.answer}\n\n*Source: ${faq.source}*` : faq.answer;
        }
        
        // For medium length messages, check for significant word overlap
        if (message.length >= 8) {
          const questionWords = questionLower.split(' ').filter(word => word.length > 3);
          const messageWords = message.split(' ').filter(word => word.length > 3);
          
          let matchCount = 0;
          for (const qWord of questionWords) {
            if (messageWords.includes(qWord)) {
              matchCount++;
            }
          }
          
          // If more than 50% of significant question words match
          if (questionWords.length > 0 && matchCount >= Math.ceil(questionWords.length * 0.6)) {
            console.log('Found match:', faq.question);
            return faq.source ? `${faq.answer}\n\n*Source: ${faq.source}*` : faq.answer;
          }
        }
      }
      
      // Fallback to keyword-based responses
      if (message.includes('leave') || message.includes('sick') || message.includes('vacation')) {
        return "I can help you with leave management! Here's how to apply:\n\n• **Sick Leave**: Email your manager and HRBP\n• **Annual Leave**: Use the HR portal or email request\n• **Medical Leave**: Submit medical certificate for >3 days\n• **Work from Home**: Request through your manager\n\nYour current leave balance is available in the HR portal. Need help with anything specific?";
      }
      if (message.includes('salary') || message.includes('pay') || message.includes('payslip')) {
        return "For salary-related queries:\n\n• **Payslips**: Available in the HR portal\n• **Salary Structure**: Contact HRBP for details\n• **Tax Documents**: Download from HR portal\n• **Salary Revision**: Discuss with your manager during appraisal\n\nIs there a specific salary question I can help with?";
      }
      if (message.includes('it') || message.includes('computer') || message.includes('laptop') || message.includes('system')) {
        return "For IT support:\n\n• **Laptop Issues**: Contact IT helpdesk at it-support@acme.example.com\n• **Software Problems**: Raise ticket in IT portal\n• **Password Reset**: Use self-service portal\n• **Network Issues**: Contact IT team immediately\n\nWhat specific IT issue are you facing?";
      }
      if (message.includes('hr') || message.includes('policy') || message.includes('benefit')) {
        return "For HR policies and benefits:\n\n• **Employee Handbook**: Available on HR portal\n• **Benefits**: Health insurance, PF, gratuity\n• **Policies**: Code of conduct, leave policy, WFH policy\n• **HRBP Contact**: Available in your employee directory\n\nWhich policy or benefit would you like to know about?";
      }
      if (message.includes('office') || message.includes('facility') || message.includes('cafeteria')) {
        return "Office facilities available:\n\n• **Cafeteria**: Open 9 AM - 6 PM\n• **Parking**: Assigned slots for employees\n• **Gym**: Available 24/7 with access card\n• **Meeting Rooms**: Book through calendar system\n• **Transport**: Shuttle service available\n\nNeed information about any specific facility?";
      }
    }
    
    // Default responses based on mode
    const defaultResponses = {
      recruitment: [
        "I'm here to help with your career journey at Acme Corp! I can assist with job applications, resume reviews, interview preparation, and career guidance. What would you like to know?",
        "Great! I can help you explore career opportunities, optimize your resume, prepare for interviews, and understand our company culture. How can I assist you today?",
        "Welcome to the recruitment assistant! I can help you find the right role, improve your application, and guide you through our hiring process. What's your question?"
      ],
      'employee-help': [
        "I'm here to help with all your employee needs! I can assist with HR queries, IT support, leave management, office facilities, and company policies. What do you need help with?",
        "Great! I can help you with workplace issues, HR policies, IT problems, leave applications, and general employee assistance. How can I help you today?",
        "Welcome to the employee help desk! I'm here to resolve your workplace queries and provide support. What would you like to know?"
      ]
    };
    
    const responses = defaultResponses[mode];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && currentMode) {
      const newMessage = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: 'user' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      const userInput = inputMessage;
      setInputMessage('');
      
      // Focus input after sending message
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      // Generate intelligent bot response
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          content: generateBotResponse(userInput, currentMode),
          sender: 'bot' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);

        // Add mode-specific satisfaction check after bot response (except for special messages)
        const responseContent = generateBotResponse(userInput, currentMode);
        if (!responseContent.includes('🎉') && !responseContent.includes('🎫') && !responseContent.includes('📄')) {
          setTimeout(() => {
            const satisfactionMessage = {
              id: (Date.now() + 2).toString(),
              content: currentMode === 'recruitment' 
                ? "Would you like to apply for job opportunities we are serving? If yes, please upload your CV below and we'll check where you are suitable!"
                : "Are you satisfied with this response, or would you like to ask more questions?",
              sender: 'bot' as const,
              timestamp: new Date(),
              isSatisfactionCheck: true,
              mode: currentMode
            };
            setMessages(prev => [...prev, satisfactionMessage]);
          }, 1500);
        }
      }, 1000);
    }
  };

  const handleModeChange = (mode: ChatMode) => {
    setCurrentMode(mode);
    setMessages([{
      id: '1',
      content: mode === 'recruitment'
        ? "Welcome to the Recruitment Assistant! I can help you with job applications, resume reviews, and career guidance. How can I assist you today?"
        : "Welcome to the Employee Help Desk! I can help you with HR queries, IT support, workplace issues, and general employee assistance. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const generateTicketId = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `PB-${timestamp}-${random}`;
  };

  const generateConversationSummary = (messages: any[]) => {
    const userMessages = messages.filter(msg => msg.sender === 'user');
    
    if (userMessages.length === 0) return '';
    
    const firstUserMessage = userMessages[0].content;
    
    return `📋 Conversation Summary

Initial Query: ${firstUserMessage}

Status: Issue not fully resolved - requires additional support`;
  };

  const handleSatisfactionResponse = (isSatisfied: boolean, mode: ChatMode) => {
    if (mode === 'recruitment') {
      if (isSatisfied) {
        // Show CV upload option for recruitment
        setShowResumeUpload(true);
      } else {
        // Thank you message for recruitment
        const thankYouMessage = {
          id: Date.now().toString(),
          content: "🎉 Thank you for visiting our Recruitment Assistant! We appreciate your interest in Acme Corp. Feel free to come back anytime when you're ready to explore career opportunities with us. Good luck with your job search!",
          sender: 'bot' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, thankYouMessage]);
      }
    } else {
      // Employee Help Desk mode
      if (isSatisfied) {
        // End conversation with satisfaction message
        const satisfactionMessage = {
          id: Date.now().toString(),
          content: "🎉 Thank you for using HR Buddy! We're glad we could help you today. Feel free to start a new conversation anytime you need assistance.",
          sender: 'bot' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, satisfactionMessage]);
      } else {
        // Generate and show animated summary first
        setIsGeneratingSummary(true);
        setConversationSummary('');
        setShowFeedbackPopup(true);
        
        // Simulate summary generation with animation
        const summary = generateConversationSummary(messages);
        let currentSummary = '';
        let index = 0;
        
        const typeSummary = () => {
          if (index < summary.length) {
            currentSummary += summary[index];
            setConversationSummary(currentSummary);
            index++;
            setTimeout(typeSummary, 30); // Typing speed
          } else {
            setIsGeneratingSummary(false);
          }
        };
        
        setTimeout(typeSummary, 500); // Start typing after 500ms
      }
    }
  };

  const handleFeedbackSubmit = () => {
    // Close feedback popup
    setShowFeedbackPopup(false);
    
    // Generate ticket and show popup
    const ticketId = generateTicketId();
    setGeneratedTicketId(ticketId);
    setShowTicketConfirmation(true);
    
    const ticketMessage = {
      id: Date.now().toString(),
      content: ` Your support ticket has been created with reference ID: **${ticketId}**\n\nOur backend team will reach out to you shortly. You can also contact us directly using this reference number.`,
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, ticketMessage]);
    
    // Clear feedback text
    setFeedbackText('');
  };

  const startNewConversation = () => {
    setCurrentMode(null);
    setMessages([]);
    setInputMessage('');
    setShowResumeUpload(false);
    setShowEmailConfirmation(false);
    setShowTicketConfirmation(false);
    setGeneratedTicketId('');
    setShowFeedbackPopup(false);
    setFeedbackText('');
    setConversationSummary('');
    setIsGeneratingSummary(false);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleProceedApplication = () => {
    const confirmationMessage = {
      id: Date.now().toString(),
      content: `✅ **Application Submitted Successfully!**\n\nYour profile has been forwarded to our backend team for review. Here's what happens next:\n\n• **Step 1**: HR team will review your application\n• **Step 2**: You'll receive an email confirmation\n• **Step 3**: Shortlisted candidates will be contacted\n• **Step 4**: Interview scheduling and process\n\n**Expected Timeline**: 3-5 business days\n\nThank you for considering Acme Corp as your next career opportunity. We look forward to connecting with you! 🚀`,
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
    setShowEmailConfirmation(true);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={
            <>
              <LandingBackground />
              
              {/* Logo Button to Control Chatbot - Only show when chatbot is closed */}
              {!isChatbotOpen && (
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000 }}>
                  {/* Tooltip Message */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '90px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    maxWidth: '220px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    opacity: 0,
                    transform: 'translateX(10px)',
                    transition: 'all 0.3s ease',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    border: '1px solid #93c5fd'
                  }} id="chatbot-tooltip">
                    👋 Hi! Need help? 
                  </div>
                  
                  <button
                    onClick={toggleChatbot}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.35)';
                      const tooltip = document.getElementById('chatbot-tooltip');
                      if (tooltip) {
                        tooltip.style.opacity = '1';
                        tooltip.style.transform = 'translateX(0)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
                      const tooltip = document.getElementById('chatbot-tooltip');
                      if (tooltip) {
                        tooltip.style.opacity = '0';
                        tooltip.style.transform = 'translateX(10px)';
                      }
                    }}
                  >
                    <img 
                      src={Logo} 
                      alt="HR Buddy" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                  </button>
                </div>
              )}

              {/* Chatbot - Only show when isChatbotOpen is true */}
              {isChatbotOpen && (
                <div style={{position: 'fixed', top: 0, right: 0, width: '600px', height: '100vh', backgroundColor: 'white', border: '2px solid #3b82f6', zIndex: 9999, display: 'flex', flexDirection: 'column'}}>
                        {/* Chatbot Header */}
                        <div style={{background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <div style={{width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                              <img 
                                src={Logo} 
                                alt="HR Buddy Logo" 
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                            <div>
                              <h1 style={{fontSize: '18px', fontWeight: 'bold', margin: 0}}>HR Buddy</h1>
                              <p style={{fontSize: '14px', color: '#bfdbfe', margin: 0}}>
                                {currentMode === null ? 'Choose your assistance mode' : 
                                 currentMode === 'recruitment' ? 'Recruitment & Career Support' : 'Employee Help Desk'}
                              </p>
                            </div>
                          </div>
                          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                            {currentMode && (
                              <>
                                <button
                                  onClick={() => handleModeChange(currentMode === 'recruitment' ? 'employee-help' : 'recruitment')}
                                  style={{padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'}}
                                >
                                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                  </svg>
                                  Switch
                                </button>
                                <button
                                  onClick={startNewConversation}
                                  style={{padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'}}
                                >
                                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 4h5v2H6v2H4V4zm15 0h-5v2h3v2h2V4zM4 15h2v2h3v2H4v-4zm15 0h-2v2h-3v2h5v-4z"/>
                                  </svg>
                                  New Chat
                                </button>
                              </>
                            )}
                            <button
                              onClick={toggleChatbot}
                              style={{padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                              title="Close Chatbot"
                            >
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                
                {/* Mode Selection Screen */}
                {currentMode === null ? (
                  <div style={{
                    flex: 1, 
                    padding: '32px 24px', 
                    backgroundImage: `url(${Background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {/* Overlay for better text readability */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(0.5px)'
                    }}></div>
                    <div style={{textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1}}>
                      <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0'}}>Welcome to HR Buddy</h2>
                      <p style={{fontSize: '16px', color: '#6b7280', margin: 0}}>Choose how I can help you today</p>
                    </div>
                    
                    <div style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px', position: 'relative', zIndex: 1}}>
                      <button
                        onClick={() => handleModeChange('recruitment')}
                        style={{
                          padding: '20px 24px',
                          backgroundColor: 'white',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div style={{width: '48px', height: '48px', backgroundColor: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span style={{fontSize: '24px'}}>💼</span>
                        </div>
                        <div style={{textAlign: 'left'}}>
                          <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0'}}>Recruitment Assistant</h3>
                          <p style={{fontSize: '14px', color: '#6b7280', margin: 0}}>Job applications, resume reviews, career guidance</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handleModeChange('employee-help')}
                        style={{
                          padding: '20px 24px',
                          backgroundColor: 'white',
                          border: '2px solid #10b981',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#ecfdf5';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div style={{width: '48px', height: '48px', backgroundColor: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span style={{fontSize: '24px'}}>🏢</span>
                        </div>
                        <div style={{textAlign: 'left'}}>
                          <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0'}}>Employee Help Desk</h3>
                          <p style={{fontSize: '14px', color: '#6b7280', margin: 0}}>HR queries, workplace assistance</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Chat Messages Area */
                  <div style={{flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f9fafb'}}>
                    {messages.map((message) => (
                      <div key={message.id} style={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          backgroundColor: message.sender === 'user' ? '#3b82f6' : '#e5e7eb',
                          color: message.sender === 'user' ? 'white' : 'black',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          maxWidth: '80%',
                          fontSize: '14px'
                        }}>
                          <div style={{margin: 0, whiteSpace: 'pre-line'}}>
                            {message.content.split('\n').map((line: string, index: number) => {
                              if (line.startsWith('*Source:')) {
                                return (
                                  <div key={index} style={{
                                    fontSize: '11px',
                                    color: '#6b7280',
                                    fontStyle: 'italic',
                                    marginTop: '8px',
                                    opacity: 0.8
                                  }}>
                                    {line.replace(/\*/g, '')}
                                  </div>
                                );
                              }
                              // Check for bold text (e.g., **text**)
                              const renderableLine = line.split(/(\*\*[^*]+\*\*)/g).map((segment, segIndex) => {
                                if (segment.startsWith('**') && segment.endsWith('**')) {
                                  return <strong key={segIndex} style={{fontWeight: 'bold'}}>{segment.slice(2, -2)}</strong>;
                                }
                                return segment;
                              });
                              return <div key={index}>{renderableLine}</div>;
                            })}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            opacity: 0.7,
                            marginTop: '4px'
                          }}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          
                          {/* Satisfaction Check Buttons */}
                          {message.isSatisfactionCheck && (
                            <div style={{
                              display: 'flex',
                              gap: '8px',
                              marginTop: '12px',
                              justifyContent: 'center'
                            }}>
                              <button
                                onClick={() => handleSatisfactionResponse(true, message.mode || currentMode)}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '20px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                {message.mode === 'recruitment' ? 'Yes, I want to apply' : "Yes, I'm satisfied"}
                              </button>
                              <button
                                onClick={() => handleSatisfactionResponse(false, message.mode || currentMode)}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '20px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                {message.mode === 'recruitment' ? 'No, thank you' : 'No, I need more help'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Quick Actions and Message Input - Only show when mode is selected */}
                {currentMode && (
                  <>
                    {/* Quick Actions */}
                    {currentMode === 'recruitment' && (
                      <div style={{padding: '12px 16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb'}}>
                        <button 
                          onClick={() => setShowResumeUpload(true)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                          </svg>
                          Upload Resume for AI Analysis
                        </button>
                      </div>
                    )}

                    {/* Proceed Application Button - Shows only for successful matches */}
                    {(() => {
                      // Find the most recent resume analysis message
                      const resumeAnalysisMessages = messages.filter(msg => 
                        msg.content.includes('Resume Analysis Complete!')
                      );
                      
                      if (resumeAnalysisMessages.length === 0) return false;
                      
                      const mostRecentAnalysis = resumeAnalysisMessages[resumeAnalysisMessages.length - 1];
                      
                      // Check if the most recent analysis shows approval
                      return mostRecentAnalysis.content.includes('Congratulations! You are eligible') && 
                             !mostRecentAnalysis.content.includes("We're sorry, but we couldn't find a perfect match") && 
                             !mostRecentAnalysis.content.includes("Application Rejected");
                    })() && (
                      <div style={{padding: '12px 16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f0f9ff'}}>
                        <button 
                          onClick={handleProceedApplication}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Proceed with Application
                        </button>
                      </div>
                    )}

                    {/* Message Input */}
                    <div style={{padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white'}}>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          style={{flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '24px', outline: 'none', fontSize: '14px'}}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim()}
                          style={{
                            padding: '12px',
                            backgroundColor: inputMessage.trim() ? '#3b82f6' : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: inputMessage.trim() ? 'pointer' : 'not-allowed'
                          }}
                        >
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
                </div>
              )}

              {/* Resume Upload Modal */}
              {showResumeUpload && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <h2 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Upload Resume</h2>
                      <button 
                        onClick={() => setShowResumeUpload(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      padding: '40px 20px',
                      textAlign: 'center',
                      backgroundColor: '#f9fafb'
                    }}>
                      <svg width="48" height="48" fill="none" stroke="#6b7280" viewBox="0 0 24 24" style={{margin: '0 auto 16px'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p style={{margin: '0 0 16px', color: '#6b7280'}}>Upload your resume (PDF, DOC, DOCX)</p>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        style={{display: 'none'}}
                        id="resume-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Simulate AI analysis with real file content parsing
                            setTimeout(() => {
                              // Extract name from file
                              const extractedName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
                              
                              // Parse resume content from uploaded file
                              const parseResumeContent = async (file: File) => {
                                return new Promise<{
                                  name: string;
                                  experience: number;
                                  skills: string[];
                                  education: string;
                                  location: string;
                                  currentRole: string;
                                  email?: string;
                                  phone?: string;
                                }>((resolve) => {
                                  // Simulate reading file content (in real implementation, use PDF.js or similar)
                                  const reader = new FileReader();
                                  
                                  reader.onload = (e) => {
                                    // Read the actual file content
                                    const fileContent = e.target?.result as string || '';
                                    const fileName = file.name.toLowerCase();
                                    
                                    console.log('File name:', fileName);
                                    console.log('File content:', fileContent); // Debug log
                                    
                                    // Extract data from actual file content using regex patterns
                                    const extractDataFromContent = (content: string) => {
                                      // Extract name (look for "Name:" pattern)
                                      const nameMatch = content.match(/name:\s*([^\n\r]+)/i);
                                      const extractedNameFromContent = nameMatch ? nameMatch[1].trim() : extractedName;
                                      
                                      // Extract email
                                      const emailMatch = content.match(/email:\s*([^\n\r]+)/i);
                                      const email = emailMatch ? emailMatch[1].trim() : undefined;
                                      
                                      // Extract phone
                                      const phoneMatch = content.match(/mobile\s*number:\s*([^\n\r]+)/i);
                                      const phone = phoneMatch ? phoneMatch[1].trim() : undefined;
                                      
                                      // Extract skills
                                      const skillsMatch = content.match(/skills:\s*([^\n\r]+)/i);
                                      const skills = skillsMatch ? 
                                        skillsMatch[1].split(',').map(s => s.trim()) : 
                                        ["Basic Computer", "Communication"];
                                      
                                      // Extract experience - improved pattern matching
                                      const expMatch = content.match(/experience:\s*([^\n\r]+)/i);
                                      let experience = 0.5; // default
                                      
                                      if (expMatch) {
                                        const expText = expMatch[1].toLowerCase();
                                        console.log('Experience text found:', expText); // Debug log
                                        
                                        // Check for months first
                                        if (expText.includes('20 months') || expText.includes('20 month')) {
                                          experience = 1.67; // 20 months = 20/12 = 1.67 years
                                        } else if (expText.includes('18 months') || expText.includes('18 month')) {
                                          experience = 1.5;
                                        } else if (expText.includes('15 months') || expText.includes('15 month')) {
                                          experience = 1.25;
                                        } else if (expText.includes('12 months') || expText.includes('12 month')) {
                                          experience = 1.0;
                                        } else if (expText.includes('10 months') || expText.includes('10 month')) {
                                          experience = 0.83;
                                        } else if (expText.includes('8 months') || expText.includes('8 month')) {
                                          experience = 0.67;
                                        } else if (expText.includes('6 months') || expText.includes('6 month')) {
                                          experience = 0.5;
                                        } else if (expText.includes('3 months') || expText.includes('3 month')) {
                                          experience = 0.25;
                                        } else if (expText.includes('2 months') || expText.includes('2 month')) {
                                          experience = 0.17;
                                        } else if (expText.includes('1 month') || expText.includes('1 month')) {
                                          experience = 0.08;
                                        }
                                        // Check for years
                                        else if (expText.includes('7 year') || expText.includes('7yr')) {
                                          experience = 7.0;
                                        } else if (expText.includes('6 year') || expText.includes('6yr')) {
                                          experience = 6.0;
                                        } else if (expText.includes('5 year') || expText.includes('5yr')) {
                                          experience = 5.0;
                                        } else if (expText.includes('4 year') || expText.includes('4yr')) {
                                          experience = 4.0;
                                        } else if (expText.includes('3 year') || expText.includes('3yr')) {
                                          experience = 3.0;
                                        } else if (expText.includes('2.5 year') || expText.includes('2.5yr')) {
                                          experience = 2.5;
                                        } else if (expText.includes('2 year') || expText.includes('2yr')) {
                                          experience = 2.0;
                                        } else if (expText.includes('1.5 year') || expText.includes('1.5yr')) {
                                          experience = 1.5;
                                        } else if (expText.includes('1.2 year') || expText.includes('1.2yr')) {
                                          experience = 1.2;
                                        } else if (expText.includes('1 year') || expText.includes('1yr')) {
                                          experience = 1.0;
                                        }
                                      }
                                      
                                      return {
                                        name: extractedNameFromContent,
                                        experience,
                                        skills,
                                        education: "B.Com", // Default for demo
                                        location: "Gurgaon", // Default for demo
                                        currentRole: experience < 1 ? "Fresher" : "Software Engineer",
                                        email,
                                        phone
                                      };
                                    };
                                    
                                    // Check if it's a PDF file (which can't be read as text)
                                    if (fileName.endsWith('.pdf')) {
                                      // For PDF files, we need to simulate content extraction
                                      // In a real implementation, you'd use PDF.js or similar
                                      console.log('PDF file detected, simulating content extraction');
                                      
                                      // Simulate PDF content extraction based on filename
                                      let simulatedContent = '';
                                      
                                      if (fileName.includes('cv for hr h') || fileName.includes('hr h')) {
                                        simulatedContent = `CV
Name: Rohan Sharma
Email: rohan.sharma@email.com
Mobile number: 9876543210
Skills: Dance, Singing and cycling
Experience: 2 months.`;
                                      } else if (fileName.includes('dummy hr') || fileName.includes('dummy_hr')) {
                                        // Specific rejection case for "Dummy Hr"
                                        simulatedContent = `CV
Name: Dummy HR Candidate
Email: dummy.hr@email.com
Mobile number: 9876543212
Skills: Basic Computer, Communication
Experience: 8 months`;
                                      } else if (fileName.includes('my cv') || fileName.includes('my_cv')) {
                                        // Specific rejection case for "My CV"
                                        simulatedContent = `CV
Name: My CV Candidate
Email: my.cv@email.com
Mobile number: 9876543213
Skills: Basic Skills, Learning
Experience: 6 months`;
                                      } else if (fileName.includes('20') || fileName.includes('twenty')) {
                                        simulatedContent = `CV
Name: Experienced Candidate
Email: experienced@email.com
Mobile number: 9876543210
Skills: React, JavaScript, Node.js, Python, SQL, AWS
Experience: 20 months`;
                                      } else if (fileName.includes('approved') || fileName.includes('accepted')) {
                                        // Specific approval case for demo
                                        simulatedContent = `CV
Name: Approved Candidate
Email: approved@email.com
Mobile number: 9876543214
Skills: React, JavaScript, Node.js, Python, SQL, AWS, Docker
Experience: 3 years`;
                                      } else if (fileName.includes('senior') || fileName.includes('lead')) {
                                        // Senior level approval case
                                        simulatedContent = `CV
Name: Senior Developer
Email: senior@email.com
Mobile number: 9876543215
Skills: React, JavaScript, Node.js, Python, SQL, AWS, Docker, Kubernetes, Microservices
Experience: 5 years`;
                                      } else {
                                        // Default simulation for unknown PDFs
                                        simulatedContent = `CV
Name: ${extractedName}
Email: ${extractedName.toLowerCase().replace(/\s+/g, '.')}@email.com
Mobile number: 9876543211
Skills: React, JavaScript, Node.js, Python, SQL
Experience: 2 years`;
                                      }
                                      
                                      const extractedData = extractDataFromContent(simulatedContent);
                                      console.log('PDF extracted data:', extractedData); // Debug log
                                      resolve(extractedData);
                                    } else {
                                      // For text files, check for specific rejection cases first
                                      if (fileName.includes('dummy hr') || fileName.includes('dummy_hr')) {
                                        // Specific rejection case for "Dummy Hr" text file
                                        const simulatedContent = `CV
Name: Dummy HR Candidate
Email: dummy.hr@email.com
Mobile number: 9876543212
Skills: Basic Computer, Communication
Experience: 8 months`;
                                        const extractedData = extractDataFromContent(simulatedContent);
                                        console.log('Dummy HR text file extracted data:', extractedData);
                                        resolve(extractedData);
                                      } else if (fileName.includes('my cv') || fileName.includes('my_cv')) {
                                        // Specific rejection case for "My CV" text file
                                        const simulatedContent = `CV
Name: My CV Candidate
Email: my.cv@email.com
Mobile number: 9876543213
Skills: Basic Skills, Learning
Experience: 6 months`;
                                        const extractedData = extractDataFromContent(simulatedContent);
                                        console.log('My CV text file extracted data:', extractedData);
                                        resolve(extractedData);
                                      } else if (fileName.includes('approved') || fileName.includes('accepted')) {
                                        // Specific approval case for text files
                                        const simulatedContent = `CV
Name: Approved Candidate
Email: approved@email.com
Mobile number: 9876543214
Skills: React, JavaScript, Node.js, Python, SQL, AWS, Docker
Experience: 3 years`;
                                        const extractedData = extractDataFromContent(simulatedContent);
                                        console.log('Approved text file extracted data:', extractedData);
                                        resolve(extractedData);
                                      } else if (fileName.includes('senior') || fileName.includes('lead')) {
                                        // Senior level approval case for text files
                                        const simulatedContent = `CV
Name: Senior Developer
Email: senior@email.com
Mobile number: 9876543215
Skills: React, JavaScript, Node.js, Python, SQL, AWS, Docker, Kubernetes, Microservices
Experience: 5 years`;
                                        const extractedData = extractDataFromContent(simulatedContent);
                                        console.log('Senior text file extracted data:', extractedData);
                                        resolve(extractedData);
                                      } else {
                                        // For other text files, read actual content
                                        const extractedData = extractDataFromContent(fileContent);
                                        console.log('Text file extracted data:', extractedData); // Debug log
                                        resolve(extractedData);
                                      }
                                    }
                                  };
                                  
                                  // Simulate file reading (in real implementation, read actual content)
                                  reader.readAsText(file);
                                });
                              };
                              
                              // Parse the uploaded file
                              parseResumeContent(file).then((extractedData) => {
                                const mockResumeDataWithName = {
                                  ...extractedData,
                                  name: extractedData.name || extractedName
                                };
                              
                                // Use imported job database
                                const availableJobs = jobRoles;
                                
                                // Find matching jobs
                                const matchingJobs = availableJobs.filter(job => {
                                  // Extract minimum experience from job requirements
                                  const minExpMatch = job.experience.match(/(\d+)/);
                                  const minExperience = minExpMatch ? parseInt(minExpMatch[1]) : 0;
                                  
                                  const hasRequiredExperience = extractedData.experience >= minExperience;
                                  const hasRequiredSkills = job.requirements.some(skill => 
                                    extractedData.skills.some((resumeSkill: string) => 
                                      resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                      skill.toLowerCase().includes(resumeSkill.toLowerCase())
                                    )
                                  );
                                  return hasRequiredExperience && hasRequiredSkills;
                                });
                                
                                // Build analysis content with extracted data
                                let analysisContent = `📄 **Resume Analysis Complete!**\n\n**File**: ${file.name}\n**Name**: ${mockResumeDataWithName.name}\n**Current Role**: ${extractedData.currentRole}\n**Experience**: ${extractedData.experience} years\n**Education**: ${extractedData.education}\n**Location**: ${extractedData.location}\n**Skills Detected**: ${extractedData.skills.join(", ")}`;
                                
                                // Add contact info if available
                                if (extractedData.email) {
                                  analysisContent += `\n**Email**: ${extractedData.email}`;
                                }
                                if (extractedData.phone) {
                                  analysisContent += `\n**Phone**: ${extractedData.phone}`;
                                }
                                analysisContent += `\n\n`;
                              
                                // Check for minimum experience requirement (1 year)
                                if (extractedData.experience < 1) {
                                  analysisContent += `❌ **Application Rejected - Insufficient Experience**\n\n`;
                                  analysisContent += `**Reason for Rejection:**\n`;
                                  analysisContent += `• Minimum experience required: 1 year\n`;
                                  analysisContent += `• Your current experience: ${extractedData.experience} years\n`;
                                  analysisContent += `• Experience gap: ${(1 - extractedData.experience).toFixed(1)} years\n\n`;
                                  analysisContent += `**Recommendations:**\n`;
                                  analysisContent += `• Gain more professional experience in your field\n`;
                                  analysisContent += `• Consider internships or entry-level positions\n`;
                                  analysisContent += `• Build relevant skills through projects and certifications\n`;
                                  analysisContent += `• Reapply when you have at least 1 year of experience\n\n`;
                                  analysisContent += `**We encourage you to apply again in the future when you meet our experience requirements!**`;
                                } else if (matchingJobs.length > 0) {
                                  analysisContent += `🎉 **Congratulations! You are eligible for ${matchingJobs.length} position(s):**\n\n`;
                                  matchingJobs.forEach((job, index) => {
                                    analysisContent += `**${index + 1}. ${job.title}** (${job.department})\n`;
                                    analysisContent += `• Experience Required: ${job.experience} ✅\n`;
                                    analysisContent += `• Skills Match: ${job.requirements.join(", ")} ✅\n`;
                                    analysisContent += `• Location: ${job.location}\n`;
                                    analysisContent += `• Description: ${job.description}\n\n`;
                                  });
                                  analysisContent += `**Next Steps:**\n• Click "Proceed with Application" below\n• Our backend team will review your profile\n• You'll receive an email confirmation shortly\n• HR will contact you for next steps`;
                                } else {
                                  // Enhanced failure handling with specific recommendations
                                  analysisContent += `😔 **We're sorry, but we couldn't find a perfect match for your current profile.**\n\n`;
                                  analysisContent += `**Why this happened:**\n`;
                                  analysisContent += `• Your experience (${extractedData.experience} years) may not meet our current requirements\n`;
                                  analysisContent += `• Skills gap in areas we're actively hiring for\n`;
                                  analysisContent += `• Current openings may not align with your background\n\n`;
                                
                                  analysisContent += `**📈 How to improve your chances:**\n`;
                                  if (extractedData.experience < 1) {
                                    analysisContent += `• Gain more hands-on experience through internships or projects\n`;
                                  }
                                  analysisContent += `• Consider upskilling in high-demand areas:\n`;
                                  analysisContent += `  - Tech: React, JavaScript, Python, AWS\n`;
                                  analysisContent += `  - Sales: CRM tools, communication skills\n`;
                                  analysisContent += `  - Support: Customer service, problem-solving\n`;
                                  analysisContent += `  - HR: Recruitment, employee relations\n\n`;
                                  
                                  analysisContent += `**🔄 Alternative Options:**\n`;
                                  analysisContent += `• **Internship Programs**: Great for gaining experience\n`;
                                  analysisContent += `• **Freelance Projects**: Build portfolio and skills\n`;
                                  analysisContent += `• **Certification Courses**: Enhance your skill set\n`;
                                  analysisContent += `• **Re-apply in 3-6 months**: After skill development\n\n`;
                                  
                                  analysisContent += `**💡 We encourage you to:**\n`;
                                  analysisContent += `• Keep your profile updated on our careers page\n`;
                                  analysisContent += `• Follow us on LinkedIn for new openings\n`;
                                  analysisContent += `• Consider our referral program\n\n`;
                                  
                                  analysisContent += `**Thank you for your interest in Acme Corp!** We'll keep your profile in our database for future opportunities. 🚀`;
                                }
                              
                                const analysisMessage = {
                                  id: Date.now().toString(),
                                  content: analysisContent,
                                  sender: 'bot' as const,
                                  timestamp: new Date()
                                };
                                setMessages(prev => [...prev, analysisMessage]);
                                setShowResumeUpload(false);
                              });
                            }, 2000);
                          }
                        }}
                      />
                      <label 
                        htmlFor="resume-upload"
                        style={{
                          display: 'inline-block',
                          padding: '12px 24px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Choose File
                      </label>
                    </div>
                    
                    <div style={{marginTop: '16px', fontSize: '14px', color: '#6b7280'}}>
                      <p style={{margin: 0}}>✅ AI-powered analysis</p>
                      <p style={{margin: '4px 0 0'}}>✅ Skill extraction</p>
                      <p style={{margin: '4px 0 0'}}>✅ Job recommendations</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Confirmation Popup */}
              {showEmailConfirmation && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    maxWidth: '400px',
                    width: '90%',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    
                    <h2 style={{margin: '0 0 16px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>
                      Email Sent! 
                    </h2>
                    
                    <p style={{margin: '0 0 24px', fontSize: '16px', color: '#6b7280', lineHeight: '1.5'}}>
                      We've sent a confirmation email to your registered email address with all the details about your application and next steps.
                    </p>
                    
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '24px'
                    }}>
                      <p style={{margin: '0', fontSize: '14px', color: '#1e40af'}}>
                        <strong>Check your inbox for:</strong><br/>
                        • Application confirmation<br/>
                        • Interview timeline<br/>
                        • Contact information<br/>
                        • Next steps
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setShowEmailConfirmation(false)}
                      style={{
                        width: '100%',
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback Popup */}
              {showFeedbackPopup && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <h2 style={{margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937'}}>Feedback & Support Request</h2>
                      <button
                        onClick={() => {
                          setShowFeedbackPopup(false);
                          setFeedbackText('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Animated Conversation Summary */}
                    <div style={{marginBottom: '20px'}}>
                      <h3 style={{fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>
                        {isGeneratingSummary ? 'Generating Summary...' : 'Conversation Summary'}
                      </h3>
                      <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        minHeight: '200px',
                        position: 'relative'
                      }}>
                        {isGeneratingSummary ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#6b7280',
                            fontSize: '14px'
                          }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '2px solid #e5e7eb',
                              borderTop: '2px solid #3b82f6',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Analyzing summary...</span>
                          </div>
                        ) : (
                          <div style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#374151',
                            whiteSpace: 'pre-line'
                          }}>
                            {conversationSummary.split('\n').map((line: string, index: number) => {
                              if (line.startsWith('📋')) {
                                return (
                                  <div key={index} style={{
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    fontSize: '16px',
                                    marginBottom: '12px',
                                    borderBottom: '2px solid #e5e7eb',
                                    paddingBottom: '8px'
                                  }}>
                                    {line}
                                  </div>
                                );
                              } else if (line.includes(':') && !line.startsWith('•') && !line.startsWith('Key Points') && !line.startsWith('Status') && line.startsWith('Initial Query')) {
                                const [label, value] = line.split(':');
                                return (
                                  <div key={index} style={{
                                    marginBottom: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                  }}>
                                    <span style={{
                                      fontWeight: '600',
                                      color: '#374151',
                                      fontSize: '13px'
                                    }}>
                                      {label}:
                                    </span>
                                    <span style={{
                                      color: '#6b7280',
                                      fontSize: '14px',
                                      marginLeft: '8px'
                                    }}>
                                      {value}
                                    </span>
                                  </div>
                                );
                              } else if (line.startsWith('Key Points') || line.startsWith('Status')) {
                                return (
                                  <div key={index} style={{
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginTop: '12px',
                                    marginBottom: '6px',
                                    fontSize: '14px'
                                  }}>
                                    {line}
                                  </div>
                                );
                              } else if (line.startsWith('•')) {
                                return (
                                  <div key={index} style={{
                                    marginLeft: '16px',
                                    marginBottom: '4px',
                                    color: '#4b5563',
                                    fontSize: '13px'
                                  }}>
                                    {line}
                                  </div>
                                );
                              } else if (line.trim() === '') {
                                return <div key={index} style={{height: '8px'}}></div>;
                              } else {
                                return (
                                  <div key={index} style={{
                                    marginBottom: '4px',
                                    color: '#6b7280',
                                    fontSize: '13px'
                                  }}>
                                    {line}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Feedback Input */}
                    <div style={{marginBottom: '20px'}}>
                      <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                        Please tell us what wasn't resolved or what additional help you need:
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Describe your issue, what you expected, or what additional assistance you need..."
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                      <button
                        onClick={() => {
                          setShowFeedbackPopup(false);
                          setFeedbackText('');
                        }}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleFeedbackSubmit}
                        disabled={!feedbackText.trim()}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: feedbackText.trim() ? '#3b82f6' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Submit & Create Ticket
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Confirmation Popup */}
              {showTicketConfirmation && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    maxWidth: '450px',
                    width: '90%',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: '#f59e0b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>

                    <h2 style={{margin: '0 0 16px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>
                      Support Ticket Created! 
                    </h2>

                    <p style={{margin: '0 0 24px', fontSize: '16px', color: '#6b7280', lineHeight: '1.5'}}>
                      Your support ticket has been successfully created. Our backend team will reach out to you shortly to provide additional assistance.
                    </p>

                    <div style={{
                      backgroundColor: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '24px'
                    }}>
                      <p style={{margin: '0', fontSize: '14px', color: '#92400e'}}>
                        <strong>Your Reference Ticket ID:</strong><br/>
                        <span style={{fontSize: '18px', fontWeight: 'bold', color: '#1f2937'}}>{generatedTicketId}</span>
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '24px'
                    }}>
                      <p style={{margin: '0', fontSize: '14px', color: '#1e40af'}}>
                        <strong>What happens next:</strong><br/>
                        • Our team will review your query<br/>
                        • You'll receive a response within 24 hours<br/>
                        • Keep this ticket ID for reference<br/>
                        • Contact us directly using this ID if needed
                      </p>
                    </div>

                    <button 
                      onClick={() => setShowTicketConfirmation(false)}
                      style={{
                        width: '100%',
                        padding: '12px 24px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      Understood!
                    </button>
                  </div>
                </div>
              )}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
