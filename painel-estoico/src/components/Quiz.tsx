import { useState, useEffect } from 'react';
import { ArrowRight, Brain, ShieldAlert, Target, Zap, Lock, Crown, CheckCircle, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import { trackQuizStart, trackQuizComplete, trackCheckoutClick } from '../lib/analytics';

interface Question {
  id: number;
  text: string;
  options: { text: string; points: number }[];
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Como você reage quando um imprevisto destrói os seus planos do dia?",
    icon: ShieldAlert,
    options: [
      { text: "Fico irritado e perco a produtividade o dia todo.", points: 1 },
      { text: "Tento resolver, mas fico ansioso e reclamando.", points: 2 },
      { text: "Respiro fundo, aceito o que não controlo e me adapto.", points: 3 }
    ]
  },
  {
    id: 2,
    text: "Quantas vezes por semana você se sente 'escravo' dos seus pensamentos e ansiedades?",
    icon: Brain,
    options: [
      { text: "Praticamente todos os dias, é exaustivo.", points: 1 },
      { text: "Algumas vezes, quando estou sob pressão.", points: 2 },
      { text: "Raramente, tenho ferramentas para me acalmar.", points: 3 }
    ]
  },
  {
    id: 3,
    text: "Sobre seus objetivos: quão fácil é manter o foco sem se distrair com redes sociais ou fofocas?",
    icon: Target,
    options: [
      { text: "Muito difícil, me distraio a cada 10 minutos.", points: 1 },
      { text: "Consigo focar por um tempo, mas logo desisto.", points: 2 },
      { text: "Tenho foco inabalável no que realmente importa.", points: 3 }
    ]
  },
  {
    id: 4,
    text: "Se você tivesse que encarar um grande desafio hoje, você se sente pronto?",
    icon: Zap,
    options: [
      { text: "Não, sinto que qualquer problema me derruba.", points: 1 },
      { text: "Me sinto pronto, mas com muito medo e insegurança.", points: 2 },
      { text: "Sim, minha mente é meu escudo mais forte.", points: 3 }
    ]
  }
];

interface ResultData {
  title: string;
  color: string;
  desc: string;
  bullets: string[];
}

function getResult(score: number): ResultData {
  if (score <= 6) return {
    title: "MENTE VULNERÁVEL",
    color: "#ff4444",
    desc: "Sua mente está aberta a ataques externos. O caos do mundo te domina facilmente.",
    bullets: [
      "Técnica de blindagem mental para bloquear gatilhos externos.",
      "Acesso ao Painel de Controle Mental com exercícios diários.",
      "Ebook Manual do Estoico Moderno (Download Imediato)."
    ]
  };
  if (score <= 9) return {
    title: "ESTOICO EM FORMAÇÃO",
    color: "#ffa500",
    desc: "Você tem a semente da disciplina, mas a ansiedade ainda vence muitas batalhas.",
    bullets: [
      "Método de 5 minutos para cortar a ansiedade antes que ela cresça.",
      "Acesso ao Painel de Controle Mental com rotinas de foco.",
      "Ebook Manual do Estoico Moderno (Download Imediato)."
    ]
  };
  return {
    title: "MENTE EM EQUILÍBRIO",
    color: "#44ff44",
    desc: "Você já possui uma base forte, mas ainda pode alcançar o nível de um Mestre.",
    bullets: [
      "Protocolo avançado para levar seu domínio próprio ao nível máximo.",
      "Acesso ao Painel de Controle Mental com métricas de evolução.",
      "Ebook Manual do Estoico Moderno (Download Imediato)."
    ]
  };
}

type Step = 'landing' | 'questions' | 'calculating' | 'email-capture' | 'result';

export const Quiz = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState<Step>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStart = () => {
    trackQuizStart();
    setStep('questions');
  };

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('calculating');
    }
  };

  useEffect(() => {
    if (step === 'calculating') {
      const timer = setTimeout(() => setStep('email-capture'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Digite seu e-mail para continuar.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido.';
    return '';
  };

  const handleEmailSubmit = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setSubmitting(true);
    const result = getResult(score);
    useStore.getState().setQuizResult(result, score, email);
    await trackQuizComplete(email, score, result.title);
    setSubmitting(false);
    onFinish();
  };

  const handleCheckoutClick = () => {
    const result = getResult(score);
    trackCheckoutClick(email || undefined, result.title);
  };

  /* ===== LANDING ===== */
  if (step === 'landing') {
    return (
      <div className="view-transition" style={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh',
        justifyContent: 'center', alignItems: 'center', padding: '40px 24px',
        textAlign: 'center', background: 'var(--bg-primary)'
      }}>
        <div className="marble-texture" style={{ opacity: 0.1 }}></div>
        <Crown size={64} color="var(--gold)" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 10px var(--gold-glow))' }} />
        <h1 className="cinzel" style={{ fontSize: '28px', color: 'var(--gold)', letterSpacing: '4px', marginBottom: '16px' }}>
          O PROTOCOLO INABALÁVEL
        </h1>
        <p className="playfair" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '40px', maxWidth: '400px', lineHeight: 1.6 }}>
          Descubra o nível real de força da sua mente diante do caos moderno.
        </p>
        <button
          onClick={handleStart}
          className="btn-premium cinzel"
          style={{ padding: '20px 40px', background: 'var(--gold)', color: '#000', border: 'none', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          INICIAR DIAGNÓSTICO <ArrowRight size={20} />
        </button>
        <p style={{ marginTop: '30px', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '2px' }} className="cinzel">
          TEMPO ESTIMADO: 2 MINUTOS
        </p>

      </div>
    );
  }

  /* ===== QUESTIONS ===== */
  if (step === 'questions') {
    const q = questions[currentQuestion];
    const Icon = q.icon;
    return (
      <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '40px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginBottom: '60px', borderRadius: '2px' }}>
          <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.5s ease', boxShadow: '0 0 10px var(--gold-glow)' }}></div>
        </div>
        <Icon size={48} color="var(--gold)" style={{ marginBottom: '32px' }} />
        <h2 className="cinzel" style={{ fontSize: '20px', color: '#fff', marginBottom: '40px', lineHeight: 1.4 }}>
          {q.text}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.points)}
              className="glass-panel"
              style={{ padding: '20px', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <span className="playfair" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ===== CALCULATING ===== */
  if (step === 'calculating') {
    return (
      <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ width: '60px', height: '60px', border: '3px solid rgba(212, 175, 55, 0.1)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '30px' }}></div>
        <h2 className="cinzel" style={{ color: 'var(--gold)', letterSpacing: '2px', marginBottom: '12px' }}>ANALISANDO PERFIL...</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Seu diagnóstico está quase pronto.</p>
      </div>
    );
  }

  /* ===== EMAIL CAPTURE ===== */
  if (step === 'email-capture') {
    return (
      <div className="view-transition" style={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh',
        justifyContent: 'center', padding: '40px 24px',
        textAlign: 'center', background: 'var(--bg-primary)'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 className="cinzel" style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '8px' }}>DIAGNÓSTICO PRONTO</h3>
          <h2 className="cinzel" style={{ fontSize: '22px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '12px' }}>
            Seu resultado está a um passo
          </h2>
          <p className="playfair" style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
            Digite seu e-mail para receber seu diagnóstico completo e o plano de ação personalizado.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '360px', margin: '32px auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${emailError ? 'var(--error)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '4px 4px 4px 16px', transition: 'border-color 0.3s' }}>
            <Mail size={18} color="var(--text-secondary)" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSubmit(); }}
              placeholder="seu@email.com"
              autoFocus
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: '15px', fontFamily: "'Playfair Display', serif",
                padding: '14px 0'
              }}
            />
            <button
              onClick={handleEmailSubmit}
              disabled={submitting}
              className="cinzel"
              style={{
                background: submitting ? '#666' : 'var(--gold)',
                color: '#000', border: 'none', borderRadius: '6px',
                padding: '12px 18px', fontSize: '13px', fontWeight: 'bold',
                letterSpacing: '1px', cursor: submitting ? 'default' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {submitting ? '...' : 'VER'}
            </button>
          </div>
          {emailError && (
            <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '8px', textAlign: 'left' }}>
              {emailError}
            </p>
          )}
          <p style={{ marginTop: '20px', fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Seus dados estão seguros. Nada de spam. Apenas seu diagnóstico e conteúdos da Mente Estoica.
          </p>
        </div>

        <button
          onClick={() => {
            const result = getResult(score);
            useStore.getState().setQuizResult(result, score, email);
            onFinish();
          }}
          className="cinzel"
          style={{ marginTop: '32px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px' }}
        >
          PULAR — QUERO VER O RESULTADO DIRETO
        </button>
      </div>
    );
  }

  /* ===== RESULT ===== */
  const result = getResult(score);
  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '40px 24px', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ marginTop: '40px', marginBottom: '30px' }}>
        <h3 className="cinzel" style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '10px' }}>SEU RESULTADO:</h3>
        <h1 className="cinzel" style={{ fontSize: '32px', color: result.color, letterSpacing: '4px' }}>{result.title}</h1>
      </div>

      <div className="glass-panel" style={{ padding: '30px 20px', marginBottom: '40px', border: `1px solid ${result.color}44` }}>
        <p className="playfair" style={{ fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {result.desc}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'left', marginBottom: '40px' }}>
        <h4 className="cinzel" style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '20px' }}>A SOLUÇÃO PARA O SEU PERFIL:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.bullets.map((bullet, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={18} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      <a
        href="https://pay.kiwify.com.br/QIlYjAh"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          const result = getResult(score);
          useStore.getState().setQuizResult(result, score, email);
          handleCheckoutClick();
        }}
        className="btn-premium"
        style={{
          width: '100%', padding: '20px', background: 'linear-gradient(135deg, var(--gold), #b8860b)',
          color: '#000', border: 'none', fontWeight: 'bold', textDecoration: 'none',
          borderRadius: '4px', animation: 'pulse-gold 2s infinite'
        }}
      >
        <div className="cinzel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', letterSpacing: '2px' }}>
          ADQUIRIR COMBO ELITE <Lock size={18} />
        </div>
      </a>

      <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        7 dias de garantia incondicional
      </p>

      <button
        onClick={() => useStore.getState().setView('auth')}
        style={{ marginTop: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px' }}
        className="cinzel"
      >
        JÁ SOU MEMBRO? FAZER LOGIN
      </button>
    </div>
  );
};
