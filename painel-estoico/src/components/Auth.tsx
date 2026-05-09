import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export const Auth = () => {
  const { setUser } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setUser({ name, email });
    }
  };

  return (
    <div className="view-transition" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      padding: '40px 24px', 
      justifyContent: 'center',
      position: 'relative',
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)'
    }}>
      {/* Background Decorative Elements */}
      <div className="glow-orb" style={{ top: '10%', left: '10%', width: '400px', height: '400px', opacity: 0.3 }}></div>
      <div className="glow-orb" style={{ bottom: '5%', right: '0%', width: '300px', height: '300px', opacity: 0.2, background: 'radial-gradient(circle, var(--bronze) 0%, transparent 70%)' }}></div>
      
      <div style={{ zIndex: 1, textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          display: 'inline-flex', 
          position: 'relative',
          marginBottom: '30px'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: '80px', height: '80px', 
            background: 'var(--gold)', 
            filter: 'blur(40px)', 
            opacity: 0.3 
          }}></div>
          <Shield size={64} color="var(--gold)" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 10px var(--gold-glow))' }} />
        </div>
        
        <h1 className="cinzel" style={{ 
          fontSize: '32px', 
          color: 'var(--gold)', 
          letterSpacing: '8px', 
          marginBottom: '8px',
          textShadow: '0 0 20px var(--gold-glow)'
        }}>PROTOCOLO</h1>
        <div style={{ height: '1px', width: '60px', background: 'var(--gold)', margin: '0 auto 20px', opacity: 0.5 }}></div>
        <p className="playfair" style={{ 
          fontSize: '15px', 
          color: 'var(--text-secondary)', 
          lineHeight: 1.6,
          fontStyle: 'italic',
          padding: '0 20px'
        }}>
          "A porta da sabedoria nunca se abre para quem não está disposto a sacrificar quem era."
        </p>
      </div>

      <div className="glass-panel" style={{ 
        padding: '30px', 
        zIndex: 1, 
        border: '1px solid var(--border-gold)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(212,175,55,0.05)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={10} color="var(--gold)" />
              <label className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--gold)', fontWeight: 'bold' }}>IDENTIFICAÇÃO DO INICIADO</label>
            </div>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-secondary)' }}>E-MAIL PARA O CÓDICE</label>
            <input 
              type="email" 
              className="premium-input" 
              placeholder="seu@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-premium" 
            style={{ 
              marginTop: '10px', 
              background: 'linear-gradient(135deg, var(--gold), #b8860b)', 
              color: '#000', 
              border: 'none', 
              fontWeight: 'bold',
              height: '60px',
              animation: 'pulse-gold 3s infinite'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', letterSpacing: '2px' }}>
              SELAR COMPROMISSO <ArrowRight size={18} />
            </div>
          </button>
        </form>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '50px', zIndex: 1, opacity: 0.4 }}>
        <p className="cinzel" style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--text-secondary)' }}>
          MEMORANDUM ESTOICISMO DE ELITE
        </p>
      </footer>
    </div>
  );
};
