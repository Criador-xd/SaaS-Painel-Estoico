import { useStore } from '../store/useStore';
import { Sparkles, MessageCircle } from 'lucide-react';

export const Home = () => {
  const { streak, setView, currentChallenge, virtues, level } = useStore();
  
  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 24px', position: 'relative' }}>
      <div className="glow-orb" style={{ top: '-100px', right: '-100px' }}></div>
      
      <header style={{ textAlign: 'center', marginBottom: '40px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div className="brand" style={{ opacity: 0.8, fontSize: '14px', letterSpacing: '4px' }}>Mente Estoica</div>
          <div style={{ padding: '4px 12px', background: 'var(--gold)', borderRadius: '4px', fontSize: '10px', color: '#000', fontWeight: 'bold', boxShadow: '0 0 15px var(--gold-glow)' }}>NÍVEL {level}</div>
        </div>
        
        {/* Memento Mori Progress */}
        <div style={{ marginTop: '20px', padding: '0 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--bronze)', letterSpacing: '2px', marginBottom: '6px', fontWeight: 'bold' }}>
            <span>MEMENTO MORI</span>
            <span>68% DA JORNADA RESTANTE</span>
          </div>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--bronze))', boxShadow: '0 0 10px var(--gold-glow)' }}></div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', zIndex: 1 }}>
        
        {/* Parchment Challenge */}
        <div className="parchment" style={{ width: '100%', marginBottom: '40px', animation: 'float 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={14} color="#8b6b23" />
            <div className="cinzel" style={{ fontSize: '10px', letterSpacing: '2px', color: '#8b6b23', fontWeight: 'bold' }}>MISSÃO SAGRADA</div>
          </div>
          <p className="playfair" style={{ fontSize: '15px', color: '#2c2416', fontWeight: '600', lineHeight: 1.4, fontStyle: 'italic' }}>
            "{currentChallenge || 'Mantenha a serenidade diante do caos.'}"
          </p>
        </div>

        {/* Virtue Columns */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
          {Object.entries(virtues).map(([v, val]) => (
            <div key={v} className="virtue-column" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div className="virtue-column-fill" style={{ height: `${Math.min(val, 100)}%` }}></div>
              <div className="cinzel" style={{ fontSize: '7px', letterSpacing: '1px', color: 'var(--gold)', zIndex: 1, textTransform: 'uppercase', marginBottom: '4px' }}>{v.substring(0, 3)}</div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-primary)', zIndex: 1 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Invictus Streak */}
        <div 
          className="streak-circle"
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
            boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(212,175,55,0.05)',
            marginBottom: '40px'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
            borderRadius: '50%',
            border: '1px solid transparent',
            borderTopColor: 'var(--gold)',
            opacity: 0.4,
            animation: 'rotate 8s linear infinite'
          }}></div>
          
          <div className="cinzel" style={{ fontSize: '9px', letterSpacing: '4px', color: 'var(--bronze)', fontWeight: 'bold' }}>INVICTUS</div>
          <div className="cinzel" style={{ fontSize: '60px', fontWeight: '700', color: 'var(--gold)', lineHeight: 1, textShadow: '0 0 20px var(--gold-glow)' }}>{streak}</div>
          <div className="cinzel" style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>DIAS DE DOMÍNIO</div>
        </div>

        {/* Action Grid */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <button onClick={() => setView('escudo')} className="btn-premium" style={{ padding: '15px 10px', fontSize: '10px', borderLeft: '3px solid var(--gold)' }}>
            ESCUDO
          </button>
          <button onClick={() => setView('navalha')} className="btn-premium" style={{ padding: '15px 10px', fontSize: '10px', borderLeft: '3px solid var(--bronze)' }}>
            NAVALHA
          </button>
        </div>

        <button onClick={() => setView('meditation')} className="btn-premium" style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.05), transparent)',
          borderColor: 'var(--border-gold)',
          color: 'var(--gold)',
          marginBottom: '20px'
        }}>
          A VISÃO DO ALTO
        </button>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button onClick={() => setView('timeline')} className="btn-premium" style={{ flex: 1, padding: '12px', fontSize: '9px', opacity: 0.7 }}>PROGRESSO</button>
          <button onClick={() => setView('cidadela')} className="btn-premium" style={{ flex: 1, padding: '12px', fontSize: '9px', opacity: 0.7 }}>CIDADELA</button>
        </div>
      </main>

      {/* Floating Oracle Button */}
      <button 
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--gold)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(212,175,55,0.4)',
          cursor: 'pointer',
          zIndex: 10
        }}
        onClick={() => alert("O Oráculo diz: O que não te mata, te torna mais sábio. Continue sua jornada.")}
      >
        <MessageCircle size={24} color="#000" />
      </button>

      <footer style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px', zIndex: 1, opacity: 0.6 }}>
        <p className="playfair" style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--text-primary)' }}>
          "Amor Fati."
        </p>
      </footer>
    </div>
  );
};
