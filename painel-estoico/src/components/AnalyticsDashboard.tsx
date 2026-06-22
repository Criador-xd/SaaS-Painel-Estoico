import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, Users, MousePointerClick, ShoppingCart, Calendar } from 'lucide-react';
import { getFunnelSummary, getFunnelDaily } from '../lib/analytics';

interface FunnelSummary {
  quiz_starts: number;
  quiz_completes: number;
  checkout_clicks: number;
  total_sales: number;
}

interface FunnelDaily {
  day: string;
  quiz_starts: number;
  quiz_completes: number;
  checkout_clicks: number;
}

export const AnalyticsDashboard = ({ onBack }: { onBack: () => void }) => {
  const [summary, setSummary] = useState<FunnelSummary | null>(null);
  const [daily, setDaily] = useState<FunnelDaily[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [s, d] = await Promise.all([getFunnelSummary(), getFunnelDaily()]);
    setSummary(s);
    setDaily(d as FunnelDaily[]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const pct = (a: number, b: number) => b === 0 ? '0%' : `${((a / b) * 100).toFixed(1)}%`;

  return (
    <div className="view-transition" style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      padding: '24px 20px', overflowY: 'auto', background: 'var(--bg-primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="cinzel" style={{ fontSize: '18px', color: 'var(--gold)', letterSpacing: '3px' }}>FUNIL DE VENDAS</h2>
        <button onClick={loadData} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner" style={{
            width: '40px', height: '40px', border: '3px solid rgba(212,175,55,0.1)',
            borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <FunnelCard
              icon={<Users size={20} />}
              label="INICIARAM QUIZ"
              value={summary?.quiz_starts ?? 0}
              color="var(--gold)"
            />
            <FunnelCard
              icon={<MousePointerClick size={20} />}
              label="DEIXARAM E-MAIL"
              value={summary?.quiz_completes ?? 0}
              color="#4FC3F7"
            />
            <FunnelCard
              icon={<ShoppingCart size={20} />}
              label="CLIQUES CHECKOUT"
              value={summary?.checkout_clicks ?? 0}
              color="#FFB74D"
            />
            <FunnelCard
              icon={<TrendingUp size={20} />}
              label="VENDAS"
              value={summary?.total_sales ?? 0}
              color="#81C784"
            />
          </div>

          {/* Taxas */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 className="cinzel" style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '16px' }}>TAXAS DE CONVERSÃO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ConversionRow
                label="Início → E-mail"
                from={summary?.quiz_starts ?? 0}
                to={summary?.quiz_completes ?? 0}
              />
              <ConversionRow
                label="E-mail → Checkout"
                from={summary?.quiz_completes ?? 0}
                to={summary?.checkout_clicks ?? 0}
              />
              <ConversionRow
                label="Início → Checkout"
                from={summary?.quiz_starts ?? 0}
                to={summary?.checkout_clicks ?? 0}
              />
            </div>
          </div>

          {/* Tabela diária */}
          {daily.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
              <h3 className="cinzel" style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> ÚLTIMOS DIAS
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif', fontWeight: 400 }}>DIA</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif', fontWeight: 400 }}>INÍCIO</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif', fontWeight: 400 }}>E-MAIL</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif', fontWeight: 400 }}>CHECKOUT</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((row) => (
                    <tr key={row.day} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '8px 4px', fontSize: '12px', color: 'var(--text-primary)' }}>
                        {new Date(row.day + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', fontSize: '12px', color: 'var(--text-primary)' }}>{row.quiz_starts}</td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', fontSize: '12px', color: 'var(--text-primary)' }}>{row.quiz_completes}</td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', fontSize: '12px', color: 'var(--text-primary)' }}>{row.checkout_clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const FunnelCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
  <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
    <div style={{ color, marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
      {value}
    </div>
    <div className="cinzel" style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '4px' }}>
      {label}
    </div>
  </div>
);

const ConversionRow = ({ label, from, to }: { label: string; from: number; to: number }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{from} → {to}</span>
      <span className="cinzel" style={{
        fontSize: '13px', color: to > 0 ? 'var(--gold)' : 'var(--text-secondary)',
        fontWeight: 'bold',
        background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '4px'
      }}>
        {from === 0 ? '0%' : `${((to / from) * 100).toFixed(1)}%`}
      </span>
    </div>
  </div>
);
