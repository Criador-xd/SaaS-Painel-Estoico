import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '60px 30px', justifyContent: 'center' }}>
      <div className="glow-orb" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}></div>
      
      <div style={{ textAlign: 'center', marginBottom: '50px', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: 'rgba(212,175,55,0.05)', border: '1px solid var(--border-gold)', marginBottom: '24px' }}>
          <ShieldCheck size={48} color="var(--gold)" />
        </div>
        <h1 className="cinzel" style={{ fontSize: '28px', color: 'var(--gold)', letterSpacing: '4px', marginBottom: '16px' }}>INICIAÇÃO</h1>
        <p className="playfair" style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Prepare sua mente. O protocolo de autodomínio exige um compromisso irrevogável com a verdade.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="cinzel" style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--bronze)' }}>NOME COMPLETO</label>
          <input 
            type="text" 
            className="premium-input" 
            placeholder="Como devemos chamá-lo?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="cinzel" style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--bronze)' }}>E-MAIL DE CONTATO</label>
          <input 
            type="email" 
            className="premium-input" 
            placeholder="seu@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-premium" style={{ marginTop: '20px', background: 'var(--gold)', color: '#000', border: 'none', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            SELAR MEU COMPROMISSO <ArrowRight size={18} />
          </div>
        </button>
      </form>

      <footer style={{ textAlign: 'center', marginTop: '60px', zIndex: 1 }}>
        <p className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-secondary)', opacity: 0.5 }}>
          © A CIDADELA INTERIOR - ESTOICISMO DE ELITE
        </p>
      </footer>
    </div>
  );
};
