import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Shield, ArrowRight, Lock, Mail, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const { setUser } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser({ name: data.user?.user_metadata?.name || 'Mestre', email });
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        
        // Supabase often requires email confirmation. If no session is returned, alert the user.
        if (!data.session && data.user) {
          setErrorMsg('Confirme seu e-mail para abrir os portões da Cidadela.');
        } else {
          setUser({ name, email });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Credenciais inválidas.' : 'Ocorreu um erro no ritual de passagem.');
    } finally {
      setLoading(false);
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
      <div className="glow-orb" style={{ top: '10%', left: '10%', width: '400px', height: '400px', opacity: 0.3 }}></div>
      <div className="glow-orb" style={{ bottom: '5%', right: '0%', width: '300px', height: '300px', opacity: 0.2, background: 'radial-gradient(circle, var(--bronze) 0%, transparent 70%)' }}></div>
      
      <div style={{ zIndex: 1, textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', position: 'relative', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'var(--gold)', filter: 'blur(40px)', opacity: 0.3 }}></div>
          <Shield size={64} color="var(--gold)" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 10px var(--gold-glow))' }} />
        </div>
        
        <h1 className="cinzel" style={{ fontSize: '32px', color: 'var(--gold)', letterSpacing: '8px', marginBottom: '8px', textShadow: '0 0 20px var(--gold-glow)' }}>
          {isLogin ? 'RETORNO' : 'PROTOCOLO'}
        </h1>
        <div style={{ height: '1px', width: '60px', background: 'var(--gold)', margin: '0 auto 20px', opacity: 0.5 }}></div>
        <p className="playfair" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', padding: '0 20px' }}>
          {isLogin ? '"A constância é a marca de uma mente inabalável."' : '"A porta da sabedoria nunca se abre para quem não está disposto a sacrificar quem era."'}
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '30px', zIndex: 1, border: '1px solid var(--border-gold)', boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(212,175,55,0.05)' }}>
        
        {errorMsg && (
          <div style={{ background: 'rgba(255, 82, 82, 0.1)', border: '1px solid var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={16} color="var(--error)" />
            <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={10} color="var(--gold)" />
                <label className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--gold)', fontWeight: 'bold' }}>IDENTIFICAÇÃO</label>
              </div>
              <input 
                type="text" 
                className="premium-input" 
                placeholder="Como deseja ser chamado?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                required={!isLogin}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={10} color="var(--text-secondary)" />
              <label className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-secondary)' }}>E-MAIL PARA O CÓDICE</label>
            </div>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={10} color="var(--text-secondary)" />
              <label className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-secondary)' }}>SENHA DE ACESSO</label>
            </div>
            <input 
              type="password" 
              className="premium-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-premium" 
            disabled={loading}
            style={{ 
              marginTop: '10px', 
              background: 'linear-gradient(135deg, var(--gold), #b8860b)', 
              color: '#000', 
              border: 'none', 
              fontWeight: 'bold',
              height: '55px',
              animation: loading ? 'none' : 'pulse-gold 3s infinite',
              opacity: loading ? 0.7 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', letterSpacing: '2px' }}>
              {loading ? 'PROCESSANDO...' : (isLogin ? 'RETOMAR JORNADA' : 'SELAR COMPROMISSO')} <ArrowRight size={18} />
            </div>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '11px', letterSpacing: '1px', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isLogin ? 'Não é um iniciado? Comece seu protocolo.' : 'Já selou o compromisso? Retorne.'}
          </button>
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', zIndex: 1, opacity: 0.4 }}>
        <p className="cinzel" style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--text-secondary)' }}>
          MEMORANDUM ESTOICISMO DE ELITE
        </p>
      </footer>
    </div>
  );
};
