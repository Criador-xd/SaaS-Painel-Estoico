import { useStore } from '../store/useStore';
import { ArrowLeft, Award, Calendar as CalendarIcon, Zap } from 'lucide-react';

export const Timeline = () => {
  const { setView, logs, streak } = useStore();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const monthName = today.toLocaleString('pt-BR', { month: 'long' });

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 24px' }}>
      <header style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
      </header>

      <div className="brand" style={{ textAlign: 'center' }}>A Jornada</div>
      <h2 className="view-title">Linha do Tempo</h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: 'var(--gold)', marginBottom: '8px' }}><Zap size={20} style={{ margin: '0 auto' }} /></div>
          <div className="cinzel" style={{ fontSize: '24px', color: 'var(--gold)' }}>{streak}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Dias Invictos</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: 'var(--bronze)', marginBottom: '8px' }}><Award size={20} style={{ margin: '0 auto' }} /></div>
          <div className="cinzel" style={{ fontSize: '24px', color: 'var(--bronze)' }}>{Object.values(logs).filter(l => l.completed).length}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vitórias Totais</div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--gold)' }}>
          <CalendarIcon size={16} />
          <span className="cinzel" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'capitalize' }}>
            {monthName} {year}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '12px' }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '10px', color: 'var(--bronze)', fontWeight: 'bold' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isCompleted = logs[dateStr]?.completed;
            const isToday = day === today.getDate();
            
            return (
              <div 
                key={day} 
                style={{
                  aspectRatio: '1',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: isCompleted || isToday ? 'bold' : 'normal',
                  color: isCompleted ? '#000' : (isToday ? 'var(--gold)' : 'var(--text-secondary)'),
                  backgroundColor: isCompleted ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                  border: isToday ? '1px solid var(--gold)' : '1px solid transparent',
                  boxShadow: isCompleted ? '0 0 15px rgba(212, 175, 55, 0.3)' : 'none'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => setView('home')} className="btn-premium" style={{ marginTop: '30px', marginBottom: '20px' }}>
        Voltar à Cidadela
      </button>
    </div>
  );
};
