import { useState, useEffect } from 'react';
import { ArrowRight, Brain, ShieldAlert, Target, Zap, Lock, Crown, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { text: string; points: number }[];
  icon: any;
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

export const Quiz = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState<'landing' | 'questions' | 'calculating' | 'result'>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleStart = () => setStep('questions');

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('calculating');
    }
  };

  useEffect(() => {
    if (step === 'calculating') {
      const timer = setTimeout(() => setStep('result'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const getResult = () => {
    if (score <= 6) return { title: "MENTE VULNERÁVEL", color: "#ff4444", desc: "Sua mente está aberta a ataques externos. O caos do mundo te domina facilmente." };
    if (score <= 9) return { title: "ESTOICO EM FORMAÇÃO", color: "#ffa500", desc: "Você tem a semente da disciplina, mas a ansiedade ainda vence muitas batalhas." };
    return { title: "MENTE EM EQUILÍBRIO", color: "#44ff44", desc: "Você já possui uma base forte, mas ainda pode alcançar o nível de um Mestre." };
  };

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
          TEMPO ESTIMADO: 1 MINUTO
        </p>
      </div>
    );
  }

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

  if (step === 'calculating') {
    return (
      <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ width: '60px', height: '60px', border: '3px solid rgba(212, 175, 55, 0.1)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '30px' }}></div>
        <h2 className="cinzel" style={{ color: 'var(--gold)', letterSpacing: '2px' }}>ANALISANDO PERFIL PSICOLÓGICO...</h2>
      </div>
    );
  }

  const result = getResult();
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
        <h4 className="cinzel" style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '20px' }}>A SOLUÇÃO IMEDIATA:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <CheckCircle size={18} color="var(--gold)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Blindagem emocional contra estresse e ansiedade.</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <CheckCircle size={18} color="var(--gold)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Acesso ao Painel de Controle Mental Vitalício.</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <CheckCircle size={18} color="var(--gold)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ebook Manual do Estoico Moderno (Download Imediato).</span>
          </div>
        </div>
      </div>

      <a 
        href="https://pay.kiwify.com.br/QIlYjAh"
        target="_blank"
        rel="noopener noreferrer"
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

      <button 
        onClick={onFinish}
        style={{ marginTop: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px' }}
        className="cinzel"
      >
        JÁ SOU MEMBRO? FAZER LOGIN
      </button>
    </div>
  );
};
