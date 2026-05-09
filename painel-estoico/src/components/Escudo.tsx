import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Check, Compass, ShieldAlert } from 'lucide-react';

export const Escudo = () => {
  const { setView, saveLog } = useStore();
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState('');
  const [premeditation, setPremeditation] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsSealing(true);
      // Simulate the ritual process for a premium feel
      setTimeout(() => {
        saveLog(today, { focus, premeditation });
        setView('home');
      }, 1500);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 24px' }}>
      <header style={{ marginBottom: '40px' }}>
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : setView('home')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}
        >
          <ArrowLeft size={14} /> {step > 1 ? 'Anterior' : 'Voltar'}
        </button>
      </header>

      <div className="ritual-progress">
        <div className="ritual-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step === 1 && (
          <div className="view-transition">
            <div style={{ color: 'var(--gold)', marginBottom: '16px' }}><Compass size={40} /></div>
            <h2 className="cinzel" style={{ fontSize: '24px', marginBottom: '12px' }}>A Intenção</h2>
            <p className="playfair" style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.5 }}>
              Para onde você irá direcionar sua força vital hoje? Defina seu **Foco Único**.
            </p>
            <textarea 
              className="premium-input"
              placeholder="Minha única missão hoje é..." 
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="view-transition">
            <div style={{ color: 'var(--gold)', marginBottom: '16px' }}><ShieldAlert size={40} /></div>
            <h2 className="cinzel" style={{ fontSize: '24px', marginBottom: '12px' }}>Premeditatio Malorum</h2>
            <p className="playfair" style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.5 }}>
              O que pode tentar roubar sua paz hoje? Como você irá **reagir**?
            </p>
            <textarea 
              className="premium-input"
              placeholder="Se o caos surgir, eu irei..." 
              value={premeditation}
              onChange={(e) => setPremeditation(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="view-transition" style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', border: '2px solid var(--gold)', 
              display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 30px',
              animation: isSealing ? 'rotate 1s linear infinite' : 'pulse-gold 2s infinite', color: 'var(--gold)'
            }}>
              {isSealing ? <div style={{ width: '40px', height: '40px', border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'rotate 1s linear infinite' }}></div> : <Check size={48} style={{ margin: 'auto' }} />}
            </div>
            <h2 className="cinzel" style={{ fontSize: '28px', marginBottom: '20px' }}>
              {isSealing ? 'Gravando em Pedra...' : 'O Selo'}
            </h2>
            <p className="playfair" style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '40px' }}>
              {isSealing ? 'Sua disciplina está sendo registrada na eternidade.' : 'Sua mente está blindada. O mundo não pode te atingir sem sua permissão.'}
            </p>
          </div>
        )}
      </main>

      <button 
        onClick={handleNext} 
        className="btn-premium" 
        disabled={isSealing || (step === 1 && !focus) || (step === 2 && !premeditation)}
        style={{ marginTop: 'auto', marginBottom: '20px', opacity: isSealing ? 0.7 : 1 }}
      >
        {isSealing ? 'Processando...' : (step < 3 ? 'Continuar Ritual' : 'Selar Compromisso')}
      </button>

      <footer style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <p className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--bronze)', opacity: 0.6 }}>
          ESTOICISMO APLICADO • MENTE INABALÁVEL
        </p>
      </footer>
    </div>
  );
};
