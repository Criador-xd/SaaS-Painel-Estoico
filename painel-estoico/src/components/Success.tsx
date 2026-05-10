import { CheckCircle, Download, LayoutDashboard, Mail, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Success = () => {
  const { setView, user } = useStore();

  return (
    <div className="view-transition" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      padding: '40px 24px',
      alignItems: 'center',
      textAlign: 'center',
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)'
    }}>
      {/* Ícone de Sucesso Animado */}
      <div style={{ marginBottom: '30px', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '120px', 
          height: '120px', 
          background: 'var(--gold)', 
          filter: 'blur(60px)', 
          opacity: 0.2 
        }}></div>
        <CheckCircle size={80} color="var(--gold)" strokeWidth={1} style={{ position: 'relative', zIndex: 1 }} />
      </div>

      <h1 className="cinzel" style={{ 
        fontSize: '28px', 
        color: 'var(--gold)', 
        letterSpacing: '4px', 
        marginBottom: '10px' 
      }}>
        BEM-VINDO À ELITE
      </h1>
      
      <p className="playfair" style={{ 
        fontSize: '16px', 
        color: 'var(--text-primary)', 
        marginBottom: '40px',
        maxWidth: '400px',
        lineHeight: 1.6
      }}>
        {user?.name ? `${user.name}, seu` : 'Seu'} acesso ao <strong>Método Mente Estoica Absoluta</strong> foi liberado com sucesso. O seu império mental começa agora.
      </p>

      {/* Painel de Próximos Passos */}
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '30px 20px', 
        border: '1px solid rgba(212, 175, 55, 0.3)',
        textAlign: 'left'
      }}>
        <h3 className="cinzel" style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '20px', letterSpacing: '2px' }}>
          PRÓXIMOS PASSOS:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Passo 1: Ebook */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
              <Download size={20} color="var(--gold)" />
            </div>
            <div>
              <h4 className="cinzel" style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>1. BAIXE SEU MANUAL</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>O Ebook "Manual do Estoico Moderno" é o seu guia teórico.</p>
              <button style={{ 
                marginTop: '10px', 
                background: 'var(--gold)', 
                color: '#000', 
                border: 'none', 
                padding: '6px 16px', 
                fontSize: '11px', 
                fontWeight: 'bold', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                DOWNLOAD PDF
              </button>
            </div>
          </div>

          {/* Passo 2: App */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
              <LayoutDashboard size={20} color="var(--gold)" />
            </div>
            <div>
              <h4 className="cinzel" style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>2. ACESSE O PAINEL</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Comece agora o seu diário e treine suas virtudes.</p>
              <button 
                onClick={() => setView('home')}
                style={{ 
                  marginTop: '10px', 
                  background: 'transparent', 
                  color: 'var(--gold)', 
                  border: '1px solid var(--gold)', 
                  padding: '6px 16px', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ENTRAR NO APP
              </button>
            </div>
          </div>

          {/* Passo 3: Email */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
              <Mail size={20} color="var(--text-secondary)" />
            </div>
            <div>
              <h4 className="cinzel" style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>3. CONFIRME SEU E-MAIL</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Enviamos seus dados de acesso e recibo para o seu e-mail cadastrado.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
        <ShieldCheck size={16} color="var(--gold)" />
        <span className="cinzel" style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-secondary)' }}>PLATAFORMA CRIPTOGRAFADA & SEGURA</span>
      </div>
    </div>
  );
};
