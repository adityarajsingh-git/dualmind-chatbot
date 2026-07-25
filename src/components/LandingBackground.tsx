import Logo from './Logo';

const FEATURES = [
  { emoji: '💼', title: 'Recruitment', desc: 'Job openings, resume matching & guided applications.' },
  { emoji: '🏢', title: 'Employee Help Desk', desc: 'Leave, payroll, IT support, benefits & HR policies.' },
  { emoji: '⚡', title: 'AI Mode', desc: 'Add a free Gemini or Claude key for grounded, cited answers.' }
];

const LandingBackground = ({ onStartChat }: { onStartChat: () => void }) => {
  return (
    <div className="dm-hero">
      <div className="dm-hero-inner">
        <span className="dm-hero-badge">⚡ AI-powered · runs entirely in your browser</span>

        <div style={{ marginBottom: '10px' }}>
          <Logo size={76} />
        </div>

        <h1 className="dm-hero-title">DualMind</h1>
        <p className="dm-hero-tagline">One chatbot, two minds.</p>
        <p className="dm-hero-sub">
          A Recruitment Assistant and an Employee Help Desk in a single chat — built for
          teams of 30–100. Ask about jobs, leave, payroll, IT, or company policies and get
          instant answers.
        </p>

        <button className="dm-hero-cta dm-lift" onClick={onStartChat}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Start a conversation
        </button>

        <div className="dm-hero-cards">
          {FEATURES.map((f) => (
            <div key={f.title} className="dm-hero-card">
              <div className="dm-hero-card-icon">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="dm-hero-foot">No signup · no backend · your data stays on your device</p>
      </div>
    </div>
  );
};

export default LandingBackground;
