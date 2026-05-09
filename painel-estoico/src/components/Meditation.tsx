import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Wind } from 'lucide-react';

export const Meditation = () => {
  const { setView, addVirtuePoints } = useStore();
  const [phase, setPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [timer, setTimer] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Observe seus pensamentos como nuvens passando.",
    "Você não é suas emoções. Você é quem as observa.",
    "Onde quer que você esteja, esteja lá por completo.",
    "A paz é encontrada dentro, não fora.",
    "Retorne ao seu centro de comando."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev + 1) % 12); // 12 second cycle
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer < 4) setPhase('inspire');
    else if (timer < 8) setPhase('hold');
    else setPhase('expire');

    if (timer === 0) setQuoteIndex((prev) => (prev + 1) % quotes.length);
  }, [timer]);

  const handleFinish = () => {
    addVirtuePoints('temperanca', 10);
    setView('home');
  };

  return (
    <div className="view-transition" style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 24px',
      background: 'radial-gradient(circle at center, #1A1A1A 0%, #000 100%)',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center'
    }}>
      <button 
        onClick={() => setView('home')} 
        style={{ position: 'absolute', top: '40px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
      >
        <X size={24} />
      </button>

      <div style={{ marginBottom: '60px' }}>
        <div style={{ color: 'var(--gold)', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>
          <Wind size={48} />
        </div>
        <h2 className="cinzel" style={{ fontSize: '24px', color: 'var(--gold)', letterSpacing: '4px' }}>A VISÃO DO ALTO</h2>
      </div>

      {/* Breathing Circle */}
      <div style={{ 
        width: '200px', height: '200px', borderRadius: '50%', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        marginBottom: '60px'
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'var(--gold)', opacity: 0.1,
          transform: phase === 'inspire' ? 'scale(1.5)' : (phase === 'expire' ? 'scale(1)' : 'scale(1.5)'),
          transition: 'transform 4s linear'
        }}></div>
        
        <div className="cinzel" style={{ position: 'absolute', fontSize: '14px', letterSpacing: '2px', color: 'var(--gold)' }}>
          {phase === 'inspire' && 'INSPIRE'}
          {phase === 'hold' && 'MANTENHA'}
          {phase === 'expire' && 'EXPIRE'}
        </div>
      </div>

      <p className="playfair" style={{ fontSize: '18px', fontStyle: 'italic', color: 'var(--text-primary)', minHeight: '60px', padding: '0 20px' }}>
        "{quotes[quoteIndex]}"
      </p>

      <button onClick={handleFinish} className="btn-premium" style={{ marginTop: '60px', width: '200px' }}>
        Encerrar Ritual
      </button>

      <footer style={{ marginTop: 'auto', opacity: 0.5 }}>
        <p className="cinzel" style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--bronze)' }}>
          TEMPERANÇA +10
        </p>
      </footer>
    </div>
  );
};
