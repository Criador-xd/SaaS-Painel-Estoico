import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, X } from 'lucide-react';

export const Cidadela = () => {
  const { setView, concerns, addConcern, removeConcern, resetData } = useStore();
  const [newConcern, setNewConcern] = useState('');

  const handleAdd = (inControl: boolean) => {
    if (!newConcern.trim()) return;
    addConcern(newConcern, inControl);
    setNewConcern('');
  };

  const inControlCount = concerns.filter(c => c.inControl).length;
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

      <div className="brand" style={{ textAlign: 'center', opacity: 0.7 }}>Laboratório da Razão</div>
      <h2 className="view-title" style={{ fontSize: '18px' }}>Círculo do Controle</h2>

      {/* Circle Stats */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <div className="cinzel" style={{ fontSize: '10px', color: 'var(--bronze)', marginBottom: '8px' }}>EFICIÊNCIA MENTAL</div>
        <div style={{ fontSize: '32px', color: 'var(--gold)', fontWeight: 'bold', textShadow: '0 0 10px var(--gold-glow)' }}>{controlPercentage}%</div>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Energia em coisas controláveis</div>
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: '30px' }}>
        <label className="cinzel" style={{ fontSize: '9px', color: 'var(--bronze)', display: 'block', marginBottom: '8px' }}>O que está te preocupando?</label>
        <input 
          type="text" 
          className="premium-input" 
          placeholder="Ex: O julgamento dos outros..." 
          value={newConcern}
          onChange={(e) => setNewConcern(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleAdd(true)} className="btn-premium" style={{ flex: 1, padding: '12px', fontSize: '9px', borderColor: 'var(--success)' }}>
            EU CONTROLO
          </button>
          <button onClick={() => handleAdd(false)} className="btn-premium" style={{ flex: 1, padding: '12px', fontSize: '9px', borderColor: 'var(--error)' }}>
            FORA DE CONTROLE
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label className="cinzel" style={{ fontSize: '9px', color: 'var(--gold)', display: 'block', marginBottom: '10px' }}>DENTRO DO CÍRCULO (FOCAR)</label>
          {concerns.filter(c => c.inControl).map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px' }}>{c.text}</span>
              <button onClick={() => removeConcern(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={14} /></button>
            </div>
          ))}
        </div>

        <div>
          <label className="cinzel" style={{ fontSize: '9px', color: 'var(--error)', display: 'block', marginBottom: '10px' }}>FORA DO CÍRCULO (DESAPEGAR)</label>
          {concerns.filter(c => !c.inControl).map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
              <span style={{ fontSize: '13px', textDecoration: 'line-through' }}>{c.text}</span>
              <button onClick={() => removeConcern(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={() => {
            if (confirm("Deseja apagar toda a sua jornada? Isso resetará seu nível e registros.")) {
              resetData();
            }
          }}
          className="btn-premium" 
          style={{ borderColor: 'rgba(255,82,82,0.3)', color: 'var(--error)', fontSize: '9px' }}
        >
          REINICIAR TODA A JORNADA
        </button>
        <button onClick={() => setView('home')} className="btn-premium" style={{ fontSize: '10px' }}>
          VOLTAR AO TEMPLO
        </button>
      </div>
    </div>
  );
};
