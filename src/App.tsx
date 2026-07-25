import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingBackground from './components/LandingBackground';
import Logo from './components/Logo';
import type { ChatMode, Message } from './types';
import { generateBotResponse } from './utils/responseEngine';
import { parseResumeFile, buildResumeAnalysis } from './utils/resumeParser';
import { saveTicket } from './utils/ticketApi';
import {
  generateLLMResponse,
  isAIModeEnabled,
  getApiKey,
  saveApiKey,
  clearApiKey,
  getModel,
  saveModel,
  getProvider,
  saveProvider,
  providerMeta,
  PROVIDERS,
  type Provider,
  type LLMHistoryItem
} from './utils/llmClient';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState<ChatMode | null>(null); // Start with no mode selected
  const [messages, setMessages] = useState<Message[]>([]);
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
  const [showSettings, setShowSettings] = useState(false); // AI mode settings modal
  const [providerInput, setProviderInput] = useState<Provider>(getProvider());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [modelInput, setModelInput] = useState(getModel());
  const [aiEnabled, setAiEnabled] = useState(isAIModeEnabled());
  const [isBotTyping, setIsBotTyping] = useState(false); // Typing indicator while AI mode responds
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input field focus
  const messagesEndRef = useRef<HTMLDivElement>(null); // Anchor for auto-scroll
  const pendingTimeouts = useRef<number[]>([]);

  // Every delayed action goes through schedule() so a mode switch or "New Chat"
  // can cancel stale bot replies before they land in the wrong conversation
  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    pendingTimeouts.current.push(id);
    return id;
  };
  // Epoch guards async work (LLM calls) the same way clearing timeouts guards
  // delayed work: bump it on reset and stale promises drop their results
  const conversationEpoch = useRef(0);
  const clearPendingTimeouts = () => {
    pendingTimeouts.current.forEach((id) => clearTimeout(id));
    pendingTimeouts.current = [];
    conversationEpoch.current += 1;
  };
  useEffect(() => clearPendingTimeouts, []);

  const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Keep the newest message in view
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input when chatbot opens or mode is selected
  useEffect(() => {
    if (isChatbotOpen && currentMode && inputRef.current) {
      // Small delay to ensure the input is rendered
      const id = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [isChatbotOpen, currentMode]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentMode) return;
    const mode = currentMode;
    const userInput = inputMessage;
    const newMessage: Message = {
      id: makeId(),
      content: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Focus input after sending message
    schedule(() => inputRef.current?.focus(), 100);

    const deliverBotResponse = (responseContent: string) => {
      const botResponse: Message = {
        id: makeId(),
        content: responseContent,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      // Add mode-specific satisfaction check after bot response (except for special messages)
      if (!responseContent.includes('🎉') && !responseContent.includes('🎫') && !responseContent.includes('📄')) {
        schedule(() => {
          const satisfactionMessage: Message = {
            id: makeId(),
            content: mode === 'recruitment'
              ? "Would you like to apply for job opportunities we are serving? If yes, please upload your CV below and we'll check where you are suitable!"
              : "Are you satisfied with this response, or would you like to ask more questions?",
            sender: 'bot',
            timestamp: new Date(),
            isSatisfactionCheck: true,
            mode
          };
          setMessages(prev => [...prev, satisfactionMessage]);
        }, 1500);
      }
    };

    if (aiEnabled) {
      // AI mode: grounded LLM answer; falls back to the rule engine on any error
      const epoch = conversationEpoch.current;
      const history: LLMHistoryItem[] = messages
        .filter(msg => !msg.isSatisfactionCheck)
        .slice(-6)
        .map(msg => ({
          role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.content
        }));

      setIsBotTyping(true);
      generateLLMResponse(userInput, mode, history).then((result) => {
        if (conversationEpoch.current !== epoch) return; // conversation was reset
        setIsBotTyping(false);
        let content = result.content ?? generateBotResponse(userInput, mode);
        if (!result.content) {
          const why = result.detail ? ` — ${result.detail}` : '';
          if (result.error === 'auth') {
            content += `\n\n⚠️ AI mode: key rejected${why}. Check Settings. (Answer from built-in knowledge base.)`;
          } else {
            content += `\n\n💤 AI mode unavailable${why}. (Answer from built-in knowledge base.)`;
          }
        }
        deliverBotResponse(content);
      });
      return;
    }

    // Rule engine: generate the reply once and reuse it for the satisfaction check
    const responseContent = generateBotResponse(userInput, mode);
    schedule(() => deliverBotResponse(responseContent), 1000);
  };

  const handleModeChange = (mode: ChatMode) => {
    clearPendingTimeouts();
    setIsBotTyping(false);
    setCurrentMode(mode);
    setMessages([{
      id: makeId(),
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
    return `TKT-${timestamp}-${random}`;
  };

  const generateConversationSummary = (msgs: Message[]) => {
    const userMessages = msgs.filter(msg => msg.sender === 'user');
    
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
          id: makeId(),
          content: "🎉 Thank you for visiting our Recruitment Assistant! We appreciate your interest. Feel free to come back anytime when you're ready to explore career opportunities with us. Good luck with your job search!",
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
          id: makeId(),
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
            schedule(typeSummary, 30); // Typing speed
          } else {
            setIsGeneratingSummary(false);
          }
        };

        schedule(typeSummary, 500); // Start typing after 500ms
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

    // Best-effort save to the optional MongoDB backend (no-op if not deployed)
    const firstUserMessage = messages.find((m) => m.sender === 'user')?.content ?? '';
    saveTicket({
      ticketId,
      mode: currentMode ?? 'employee-help',
      feedback: feedbackText,
      initialQuery: firstUserMessage
    });

    const ticketMessage = {
      id: makeId(),
      content: ` Your support ticket has been created with reference ID: **${ticketId}**\n\nOur backend team will reach out to you shortly. You can also contact us directly using this reference number.`,
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, ticketMessage]);

    // Clear feedback text
    setFeedbackText('');
  };

  const startNewConversation = () => {
    clearPendingTimeouts();
    setIsBotTyping(false);
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

  const openSettings = () => {
    const p = getProvider();
    setProviderInput(p);
    setApiKeyInput(getApiKey(p) ?? '');
    setModelInput(getModel(p));
    setShowSettings(true);
  };

  // Switching provider in the dropdown loads that provider's own saved key + model
  const handleProviderChange = (p: Provider) => {
    setProviderInput(p);
    setApiKeyInput(getApiKey(p) ?? '');
    setModelInput(getModel(p));
  };

  const handleSettingsSave = () => {
    saveProvider(providerInput);
    saveApiKey(providerInput, apiKeyInput);
    saveModel(providerInput, modelInput);
    setAiEnabled(isAIModeEnabled());
    setShowSettings(false);
  };

  const handleClearApiKey = () => {
    saveProvider(providerInput);
    clearApiKey(providerInput);
    setApiKeyInput('');
    setAiEnabled(isAIModeEnabled());
  };

  const handleProceedApplication = () => {
    const confirmationMessage = {
      id: makeId(),
      content: `✅ **Application Submitted Successfully!**\n\nYour profile has been forwarded to our backend team for review. Here's what happens next:\n\n• **Step 1**: HR team will review your application\n• **Step 2**: You'll receive an email confirmation\n• **Step 3**: Shortlisted candidates will be contacted\n• **Step 4**: Interview scheduling and process\n\n**Expected Timeline**: 3-5 business days\n\nThank you for considering us as your next career opportunity. We look forward to connecting with you! 🚀`,
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
              <LandingBackground onStartChat={() => setIsChatbotOpen(true)} />
              
              {/* Logo Button to Control Chatbot - Only show when chatbot is closed */}
              {!isChatbotOpen && (
                <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Friendly label pill */}
                  <div style={{
                    backgroundColor: 'white',
                    color: '#0f172a',
                    padding: '10px 16px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 8px 24px -8px rgba(15, 23, 42, 0.25)',
                    whiteSpace: 'nowrap',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ color: '#4f46e5' }}>Need help?</span> Chat with us 👋
                  </div>

                  <button
                    className="dm-launcher dm-lift"
                    onClick={toggleChatbot}
                    aria-label="Open HR Buddy chat"
                    style={{
                      width: '66px',
                      height: '66px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 12px 30px -6px rgba(79, 70, 229, 0.45)',
                      position: 'relative',
                      padding: 0
                    }}
                  >
                    <Logo size={40} />
                  </button>
                </div>
              )}

              {/* Chatbot - Only show when isChatbotOpen is true */}
              {isChatbotOpen && (
                <div className="dm-window" style={{position: 'fixed', top: '24px', right: '24px', bottom: '24px', width: '420px', maxWidth: 'calc(100vw - 48px)', backgroundColor: 'white', borderRadius: '24px', boxShadow: 'var(--dm-shadow)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                        {/* Chatbot Header */}
                        <div style={{background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color: 'white', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0}}>
                            <div style={{position: 'relative', width: '44px', height: '44px', flexShrink: 0, backgroundColor: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.2)'}}>
                              <Logo size={32} />
                              <span style={{position: 'absolute', bottom: '-2px', right: '-2px', width: '13px', height: '13px', backgroundColor: '#4ade80', borderRadius: '50%', border: '2px solid #4338ca'}} />
                            </div>
                            <div style={{minWidth: 0}}>
                              <h1 style={{fontSize: '17px', fontWeight: 700, margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>HR Buddy</h1>
                              <p style={{fontSize: '13px', color: '#c7d2fe', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {currentMode === null ? 'Choose your assistance mode' :
                                 currentMode === 'recruitment' ? 'Recruitment & Career Support' : 'Employee Help Desk'}
                                {aiEnabled && (
                                  <span style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: '99px', fontSize: '11px', fontWeight: 600}}>⚡ AI</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div style={{display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0}}>
                            {currentMode && (
                              <>
                                <button
                                  className="dm-lift"
                                  onClick={() => handleModeChange(currentMode === 'recruitment' ? 'employee-help' : 'recruitment')}
                                  style={{padding: '7px 12px', backgroundColor: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'}}
                                  title="Switch assistant mode"
                                >
                                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                  </svg>
                                  <span className="dm-hide-sm">Switch</span>
                                </button>
                                <button
                                  className="dm-lift"
                                  onClick={startNewConversation}
                                  style={{padding: '7px 10px', backgroundColor: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                  title="Start a new conversation"
                                >
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
                                    <path d="M3 3v5h5"/>
                                  </svg>
                                </button>
                              </>
                            )}
                            <button
                              className="dm-lift"
                              onClick={openSettings}
                              style={{padding: '8px', backgroundColor: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                              title="AI Mode Settings"
                            >
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                              </svg>
                            </button>
                            <button
                              className="dm-lift"
                              onClick={toggleChatbot}
                              style={{padding: '8px', backgroundColor: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
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
                    background: 'linear-gradient(180deg, #f8fafc 0%, #eef1f6 100%)',
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
                      background: 'linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(241,245,249,0.96) 100%)'
                    }}></div>
                    <div style={{textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1}}>
                      <h2 style={{fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em'}}>👋 Welcome to HR Buddy</h2>
                      <p style={{fontSize: '15px', color: '#64748b', margin: 0}}>How can I help you today?</p>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1}}>
                      {[
                        { mode: 'recruitment' as ChatMode, emoji: '💼', accent: '#4f46e5', bg: '#eef2ff', title: 'Recruitment Assistant', desc: 'Job openings, resume review & applications' },
                        { mode: 'employee-help' as ChatMode, emoji: '🏢', accent: '#10b981', bg: '#ecfdf5', title: 'Employee Help Desk', desc: 'Leave, payroll, IT support & HR policies' }
                      ].map((card) => (
                        <button
                          key={card.mode}
                          className="dm-lift"
                          onClick={() => handleModeChange(card.mode)}
                          style={{
                            padding: '18px 18px',
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            boxShadow: '0 6px 18px -8px rgba(15,23,42,0.15)',
                            textAlign: 'left'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = card.accent;
                            e.currentTarget.style.boxShadow = `0 12px 28px -10px ${card.accent}66`;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 6px 18px -8px rgba(15,23,42,0.15)';
                          }}
                        >
                          <div style={{width: '52px', height: '52px', flexShrink: 0, background: card.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px'}}>
                            {card.emoji}
                          </div>
                          <div style={{flex: 1}}>
                            <h3 style={{fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 3px 0'}}>{card.title}</h3>
                            <p style={{fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.4}}>{card.desc}</p>
                          </div>
                          <svg width="20" height="20" fill="none" stroke={card.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                    <p style={{fontSize: '12px', color: '#94a3b8', marginTop: '24px', position: 'relative', zIndex: 1, textAlign: 'center'}}>
                      Powered by DualMind · your data stays in your browser
                    </p>
                  </div>
                ) : (
                  /* Chat Messages Area */
                  <div className="dm-scroll" style={{flex: 1, padding: '18px 16px', overflowY: 'auto', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'}}>
                    {messages.map((message) => (
                      <div key={message.id} className="dm-msg" style={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '14px'
                      }}>
                        <div style={{
                          background: message.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #4338ca)' : '#ffffff',
                          color: message.sender === 'user' ? 'white' : '#1e293b',
                          padding: '11px 15px',
                          borderRadius: '18px',
                          borderBottomRightRadius: message.sender === 'user' ? '5px' : '18px',
                          borderBottomLeftRadius: message.sender === 'user' ? '18px' : '5px',
                          maxWidth: '82%',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          boxShadow: message.sender === 'user' ? '0 6px 16px -6px rgba(79,70,229,0.5)' : '0 4px 12px -6px rgba(15,23,42,0.12)',
                          border: message.sender === 'user' ? 'none' : '1px solid #eef2f6'
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
                                className="dm-lift"
                                onClick={() => handleSatisfactionResponse(true, message.mode ?? currentMode ?? 'employee-help')}
                                style={{
                                  padding: '9px 16px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '999px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: '0 4px 12px -5px rgba(16,185,129,0.6)'
                                }}
                              >
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                {message.mode === 'recruitment' ? 'Yes, I want to apply' : "Yes, I'm satisfied"}
                              </button>
                              <button
                                className="dm-lift"
                                onClick={() => handleSatisfactionResponse(false, message.mode ?? currentMode ?? 'employee-help')}
                                style={{
                                  padding: '9px 16px',
                                  backgroundColor: 'white',
                                  color: '#64748b',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '999px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
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
                    {isBotTyping && (
                      <div className="dm-msg" style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '14px'}}>
                        <div style={{
                          backgroundColor: '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '18px',
                          borderBottomLeftRadius: '5px',
                          boxShadow: '0 4px 12px -6px rgba(15,23,42,0.12)',
                          border: '1px solid #eef2f6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <span className="dm-dot" />
                          <span className="dm-dot" />
                          <span className="dm-dot" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
                
                {/* Quick Actions and Message Input - Only show when mode is selected */}
                {currentMode && (
                  <>
                    {/* Quick Actions */}
                    {currentMode === 'recruitment' && (
                      <div style={{padding: '12px 16px 0', backgroundColor: 'white'}}>
                        <button
                          className="dm-lift"
                          onClick={() => setShowResumeUpload(true)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 6px 16px -6px rgba(16,185,129,0.6)'
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
                      <div style={{padding: '12px 16px 0', backgroundColor: 'white'}}>
                        <button
                          className="dm-lift"
                          onClick={handleProceedApplication}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 6px 16px -6px rgba(79,70,229,0.6)'
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
                    <div style={{padding: '14px 16px', borderTop: '1px solid #eef2f6', backgroundColor: 'white'}}>
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '26px', padding: '5px 5px 5px 8px', border: '1px solid #e2e8f0', transition: 'border-color 0.15s ease'}}>
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          onFocus={(e) => { e.currentTarget.parentElement!.style.borderColor = '#818cf8'; }}
                          onBlur={(e) => { e.currentTarget.parentElement!.style.borderColor = '#e2e8f0'; }}
                          placeholder="Type your message…"
                          style={{flex: 1, padding: '9px 8px', border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b'}}
                        />
                        <button
                          className="dm-lift"
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim()}
                          aria-label="Send message"
                          style={{
                            width: '40px',
                            height: '40px',
                            flexShrink: 0,
                            background: inputMessage.trim() ? 'linear-gradient(135deg, #6366f1, #4338ca)' : '#cbd5e1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: inputMessage.trim() ? '0 4px 12px -4px rgba(79,70,229,0.6)' : 'none'
                          }}
                        >
                          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
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
                          if (!file) return;
                          // Simulated analysis delay; cancelled if the user resets the chat
                          schedule(() => {
                            parseResumeFile(file).then((resume) => {
                              const analysisMessage: Message = {
                                id: makeId(),
                                content: buildResumeAnalysis(file.name, resume),
                                sender: 'bot',
                                timestamp: new Date()
                              };
                              setMessages(prev => [...prev, analysisMessage]);
                              setShowResumeUpload(false);
                            });
                          }, 2000);
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

              {/* AI Mode Settings Modal */}
              {showSettings && (
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
                    maxWidth: '480px',
                    width: '90%',
                    maxHeight: '85vh',
                    overflow: 'auto'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                      <h2 style={{margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937'}}>⚡ AI Mode Settings</h2>
                      <button
                        onClick={() => setShowSettings(false)}
                        style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280'}}
                      >
                        ×
                      </button>
                    </div>

                    <p style={{fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 16px'}}>
                      Add your own API key to enable AI-powered answers grounded in the built-in
                      knowledge base. <strong>Google Gemini has a free tier</strong> — pick it for a
                      zero-cost setup. Without a key, the assistant runs on the free rule-based engine.
                    </p>

                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                      fontSize: '13px',
                      color: '#1e40af'
                    }}>
                      🔒 Your key is stored only in <strong>this browser</strong> (localStorage) and is
                      sent only to the provider you choose — never to any other server.
                    </div>

                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                      Provider
                    </label>
                    <select
                      value={providerInput}
                      onChange={(e) => handleProviderChange(e.target.value as Provider)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        marginBottom: '16px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      {PROVIDERS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>

                    <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                      <span>API key</span>
                      <a href={providerMeta(providerInput).keyUrl} target="_blank" rel="noreferrer" style={{fontSize: '12px', color: '#4f46e5', fontWeight: 600, textDecoration: 'none'}}>
                        Get a key ↗
                      </a>
                    </label>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder={providerMeta(providerInput).keyHint}
                      autoComplete="off"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        marginBottom: '16px',
                        boxSizing: 'border-box'
                      }}
                    />

                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                      Model
                    </label>
                    <select
                      value={modelInput}
                      onChange={(e) => setModelInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        marginBottom: '16px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    >
                      {providerMeta(providerInput).models.map((m) => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>

                    <p style={{fontSize: '13px', color: aiEnabled ? '#059669' : '#6b7280', margin: '0 0 20px'}}>
                      {aiEnabled ? '⚡ AI mode is currently ON' : '💤 AI mode is currently OFF — using the rule-based engine'}
                    </p>

                    <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                      {aiEnabled && (
                        <button
                          onClick={handleClearApiKey}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginRight: 'auto'
                          }}
                        >
                          Remove key
                        </button>
                      )}
                      <button
                        onClick={() => setShowSettings(false)}
                        style={{
                          padding: '10px 16px',
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
                        onClick={handleSettingsSave}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Save
                      </button>
                    </div>
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
