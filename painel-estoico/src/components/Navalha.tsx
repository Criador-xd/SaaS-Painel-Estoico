import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Check, Moon, PenTool, Scale } from 'lucide-react';

export const Navalha = () => {
  const { setView, saveLog, updateStreak, addVirtuePoints } = useStore();
  const [step, setStep] = useState(1);
  const [goodThings, setGoodThings] = useState('');
  const [failures, setFailures] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mentorAdvice, setMentorAdvice] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const advices = [
    "Sêneca diria: Ninguém é mais infeliz do que aquele que passa por uma vida sem desafios, pois não lhe foi permitido provar a si mesmo.",
    "Marco Aurélio diria: A felicidade da sua vida depende da qualidade dos seus pensamentos. Corrija a percepção, e o sofrimento cessará.",
    "Epicteto diria: Não são os eventos que nos perturbam, mas sim o julgamento que fazemos sobre eles. Recupere o controle.",
    "Musônio Rufo diria: Se você realizar algo difícil com virtude, o esforço passa, mas a virtude permanece.",
    "Zeno diria: O bem estar é alcançado por pequenos passos, mas não é uma coisa pequena."
  ];

  const handleNext = () => {
    if (step < 4) {
      if (step === 3) {
        const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
        setMentorAdvice(randomAdvice);
      }
      setStep(step + 1);
    }
    else {
      setIsSaving(true);
      setTimeout(() => {
        saveLog(today, { goodThings, failures, masteryRating: rating || 0, completed: true, mentorAdvice });
        updateStreak();
        
        // Give points based on completion
        addVirtuePoints('sabedoria', 15);
        if (rating && rating > 7) addVirtuePoints('temperanca', 20);
        addVirtuePoints('justica', 10);
        
        setView('home');
      }, 2500);
    }
  };

  const progress = (step / 4) * 100;

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
            <div style={{ color: 'var(--gold)', marginBottom: '16px' }}><PenTool size={40} /></div>
            <h2 className="cinzel" style={{ fontSize: '24px', marginBottom: '12px' }}>O Exame</h2>
            <p className="playfair" style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.5 }}>
              Olhe para o seu dia com justiça. O que você fez de **bom**?
            </p>
            <textarea 
              className="premium-input"
              placeholder="Minhas vitórias de hoje..." 
              value={goodThings}
              onChange={(e) => setGoodThings(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="view-transition">
            <div style={{ color: 'var(--bronze)', marginBottom: '16px' }}><Scale size={40} /></div>
            <h2 className="cinzel" style={{ fontSize: '24px', marginBottom: '12px' }}>A Verdade</h2>
            <p className="playfair" style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.5 }}>
              Onde você permitiu que a paixão vencesse a razão? Onde você **falhou**?
            </p>
            <textarea 
              className="premium-input"
              placeholder="O que devo corrigir amanhã..." 
              value={failures}
              onChange={(e) => setFailures(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="view-transition">
            <div style={{ color: 'var(--gold)', marginBottom: '16px' }}><Moon size={40} /></div>
            <h2 className="cinzel" style={{ fontSize: '24px', marginBottom: '12px' }}>O Julgamento</h2>
            <p className="playfair" style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: 1.5 }}>
              De 1 a 10, qual foi o seu nível de **Autodomínio**?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  style={{
                    backgroundColor: rating === num ? 'var(--gold)' : 'var(--surface-color)',
                    border: `1px solid ${rating === num ? 'var(--gold)' : 'var(--border)'}`,
                    color: rating === num ? '#000' : 'var(--text-secondary)',
                    padding: '15px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: rating === num ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="view-transition" style={{ textAlign: 'center', paddingTop: '20px' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--gold)', 
              display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 20px',
              animation: isSaving ? 'rotate 1s linear infinite' : 'pulse-gold 2s infinite', color: 'var(--gold)'
            }}>
              {isSaving ? <div style={{ width: '30px', height: '30px', border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'rotate 1s linear infinite' }}></div> : <Check size={40} style={{ margin: 'auto' }} />}
            </div>
            
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', border: '1px solid var(--border-gold)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', left: '20px', background: 'var(--bg-color)', padding: '0 8px', fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px', fontWeight: 'bold' }}>
                CONSELHO DO MENTOR
              </div>
              <p className="playfair" style={{ fontSize: '16px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                "{mentorAdvice}"
              </p>
            </div>

            <h2 className="cinzel" style={{ fontSize: '24px', marginBottom: '10px' }}>
              {isSaving ? 'Analisando...' : 'Serenidade'}
            </h2>
            <p className="playfair" style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '30px' }}>
              {isSaving ? 'Seus atos de hoje estão sendo pesados pela razão.' : 'O dia está encerrado. O passado não te pertence mais.'}
            </p>
          </div>
        )}
      </main>

      <button 
        onClick={handleNext} 
        className="btn-premium" 
        disabled={isSaving || (step === 3 && rating === null)}
        style={{ marginTop: 'auto', marginBottom: '20px', opacity: isSaving ? 0.7 : 1 }}
      >
        {isSaving ? 'Gravando...' : (step < 4 ? 'Próximo Passo' : 'Encerrar Dia')}
      </button>

      <footer style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <p className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--bronze)', opacity: 0.6 }}>
          ESTOICISMO APLICADO • AUDITORIA DA MENTE
        </p>
      </footer>
    </div>
  );
};
