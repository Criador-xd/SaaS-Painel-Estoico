import { Crown, Lock, ArrowRight, Check } from 'lucide-react';

export const Paywall = ({ featureName, onBack }: { featureName: string, onBack: () => void }) => {
  return (
    <div className="view-transition" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      padding: '40px 24px', 
      position: 'relative',
      overflowY: 'auto'
    }}>
      {/* Botão Voltar */}
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', border: 'none', color: 'var(--text-secondary)', 
          display: 'flex', alignItems: 'center', gap: '8px', 
          cursor: 'pointer', marginBottom: '20px', zIndex: 10 
        }}
      >
        <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
        <span className="cinzel" style={{ fontSize: '10px', letterSpacing: '2px' }}>RETORNAR</span>
      </button>

      <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
        <div style={{ display: 'inline-flex', position: 'relative', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'var(--gold)', filter: 'blur(40px)', opacity: 0.3 }}></div>
          <Crown size={64} color="var(--gold)" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 10px var(--gold-glow))' }} />
        </div>
        
        <h1 className="cinzel" style={{ fontSize: '26px', color: 'var(--gold)', letterSpacing: '4px', marginBottom: '8px' }}>
          ACESSO RESTRITO
        </h1>
        <div style={{ height: '1px', width: '60px', background: 'var(--gold)', margin: '0 auto 20px', opacity: 0.5 }}></div>
        <p className="playfair" style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '0 10px' }}>
          O acesso a <strong>{featureName}</strong> é um privilégio reservado aos membros da Irmandade Elite.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '30px 20px', border: '1px solid var(--gold)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 15px', background: 'var(--gold)', color: '#000', fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', borderBottomLeftRadius: '10px' }} className="cinzel">
          PLANO IMPERIAL
        </div>

        <h3 className="cinzel" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', marginTop: '10px' }}>O QUE VOCÊ DESBLOQUEIA:</h3>
        
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Check size={16} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Acesso total à <strong>Cidadela Interior</strong> (Controle de ansiedade e foco).</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Check size={16} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Acesso à <strong>Linha do Tempo</strong> para auditar sua evolução.</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Check size={16} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Armazenamento eterno dos seus logs na nuvem.</span>
          </li>
        </ul>

        <button 
          className="btn-premium" 
          style={{ 
            marginTop: '30px', 
            background: 'linear-gradient(135deg, var(--gold), #b8860b)', 
            color: '#000', 
            border: 'none', 
            fontWeight: 'bold',
            height: '55px',
            animation: 'pulse-gold 3s infinite',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', letterSpacing: '2px' }}>
            DESBLOQUEAR ACESSO <Lock size={16} />
          </div>
        </button>
      </div>

    </div>
  );
};
