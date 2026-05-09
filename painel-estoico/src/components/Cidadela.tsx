import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Book, Flame, Shield, X, Target, Circle } from 'lucide-react';

export const Cidadela = () => {
  const { setView, concerns, addConcern, removeConcern } = useStore();
  const [newConcern, setNewConcern] = useState('');

  const handleAdd = (inControl: boolean) => {
    if (!newConcern.trim()) return;
    addConcern(newConcern, inControl);
    setNewConcern('');
  };

  const inControlCount = concerns.filter(c => c.inControl).length;
  const outOfControlCount = concerns.filter(c => !c.inControl).length;
  const total = concerns.length;
  const controlPercentage = total > 0 ? Math.round((inControlCount / total) * 100) : 100;

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 24px' }}>
      <header style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
      </header>

      <div className="brand" style={{ textAlign: 'center' }}>Laboratório da Razão</div>
      <h2 className="view-title">Círculo do Controle</h2>

      {/* Circle Stats */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <div className="cinzel" style={{ fontSize: '11px', color: 'var(--bronze)', marginBottom: '8px' }}>EFICIÊNCIA MENTAL</div>
        <div style={{ fontSize: '32px', color: 'var(--gold)', fontWeight: 'bold' }}>{controlPercentage}%</div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Energia em coisas controláveis</div>
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: '30px' }}>
        <label>O que está te preocupando?</label>
        <input 
          type="text" 
          className="premium-input" 
          placeholder="Ex: O julgamento dos outros..." 
          value={newConcern}
          onChange={(e) => setNewConcern(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleAdd(true)} className="btn-premium" style={{ flex: 1, padding: '12px', fontSize: '10px', borderColor: 'var(--success)' }}>
            Eu Controlo
          </button>
          <button onClick={() => handleAdd(false)} className="btn-premium" style={{ flex: 1, padding: '12px', fontSize: '10px', borderColor: 'var(--error)' }}>
            Fora de Controle
          </button>
        </div>
      </div>

      {/* Visual Circle */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gold)' }}>Dentro do Círculo (Focar)</label>
          {concerns.filter(c => c.inControl).map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>{c.text}</span>
              <button onClick={() => removeConcern(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={14} /></button>
            </div>
          ))}
        </div>

        <div>
          <label style={{ color: 'var(--error)' }}>Fora do Círculo (Desapegar)</label>
          {concerns.filter(c => !c.inControl).map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
              <span style={{ fontSize: '14px', textDecoration: 'line-through' }}>{c.text}</span>
              <button onClick={() => removeConcern(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Scale = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/>
  </svg>
);
