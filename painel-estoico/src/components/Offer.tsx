import { Crown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { trackCheckoutClick } from '../lib/analytics';

export const Offer = () => {
  const { quizResult, quizScore, userEmail } = useStore();

  const handleCheckoutClick = () => {
    trackCheckoutClick(userEmail || undefined, quizResult?.title);
  };

  return (
    <main style={{
      width: 'min(1160px, calc(100% - 32px))',
      margin: '0 auto',
      padding: '28px 0 46px',
      minHeight: '100vh',
    }}>
      <style>{`
        @media (max-width: 920px) {
          .offer-shell { grid-template-columns: 1fr !important; }
          .offer-left { border-right: 0 !important; border-bottom: 1px solid rgba(247, 241, 231, 0.12) !important; }
          .offer-main { width: min(100% - 24px, 680px) !important; padding-top: 18px !important; }
        }
        @media (max-width: 620px) {
          .offer-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .offer-left, .offer-right { padding: 20px !important; }
          .offer-grid, .offer-authority { grid-template-columns: 1fr !important; }
          .offer-product { grid-template-columns: 54px 1fr !important; }
          .offer-cover { width: 54px !important; height: 54px !important; }
        }
      `}</style>

      <header className="offer-header" style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: '10px', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          <div style={{
            alignItems: 'center',
            background: 'linear-gradient(180deg, #ffd275, #d7a84b)',
            borderRadius: '8px',
            color: '#151008',
            display: 'flex',
            fontWeight: 950,
            height: '34px',
            justifyContent: 'center',
            width: '34px',
            fontSize: '18px',
          }}>
            M
          </div>
          <span>Mente Estoica</span>
        </div>
        <div style={{
          alignItems: 'center',
          border: '1px solid rgba(247, 241, 231, 0.12)',
          borderRadius: '999px',
          color: '#a9a095',
          display: 'flex',
          fontSize: '13px',
          gap: '8px',
          padding: '8px 12px',
        }}>
          ✓ Checkout protegido pela Kiwify
        </div>
      </header>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '22px',
        fontSize: '14px',
        color: '#a9a095',
      }}>
        <span>Diagnóstico concluído</span>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a9a095' }}></span>
        <strong style={{ color: '#f7f1e7' }}>Etapa final: liberar acesso</strong>
      </div>

      <div className="offer-shell" style={{
        border: '1px solid rgba(247, 241, 231, 0.2)',
        borderRadius: '10px',
        background: 'rgba(17, 17, 17, 0.96)',
        boxShadow: '0 28px 90px rgba(0, 0, 0, 0.42)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.95fr) minmax(360px, 0.72fr)',
        overflow: 'hidden',
      }}>
        <article className="offer-left" style={{
          borderRight: '1px solid rgba(247, 241, 231, 0.12)',
          padding: '34px',
        }}>
          <div style={{
            color: '#ffd275',
            fontSize: '12px',
            fontWeight: 900,
            letterSpacing: '0.09em',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}>
            Resultado do diagnóstico
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            lineHeight: 0.98,
            letterSpacing: 0,
            margin: '0 0 14px',
            fontWeight: 700,
            color: '#f7f1e7',
          }}>
            Seu plano mental está pronto.
          </h1>

          <p style={{
            color: '#a9a095',
            fontSize: '18px',
            lineHeight: 1.55,
            margin: '0 0 26px',
            maxWidth: '650px',
          }}>
            Você está a um passo de liberar o Combo Elite, criado para transformar ansiedade,
            distração e reação automática em rotina de foco e autocontrole.
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Entrega imediata', desc: 'Acesso enviado após a confirmação.' },
              { label: 'Compra segura', desc: 'Pagamento processado pela Kiwify.' },
              { label: '7 dias de garantia', desc: 'Teste antes de decidir ficar.' },
            ].map(item => (
              <div key={item.label} style={{
                border: '1px solid rgba(247, 241, 231, 0.12)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px 16px',
                flex: '1 1 160px',
              }}>
                <strong style={{ display: 'block', fontSize: '14px', color: '#f7f1e7', marginBottom: '4px' }}>
                  {item.label}
                </strong>
                <span style={{ color: '#a9a095', fontSize: '13px', lineHeight: 1.4 }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            border: '1px solid rgba(215, 168, 75, 0.28)',
            borderRadius: '8px',
            background: 'rgba(215, 168, 75, 0.08)',
            padding: '18px',
            marginBottom: '24px',
          }}>
            <strong style={{
              color: '#ffd275',
              display: 'block',
              fontSize: '14px',
              letterSpacing: '0.05em',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              Perfil identificado: {quizResult?.title || 'estoico em formação'}
            </strong>
            <p style={{ color: '#f7f1e7', lineHeight: 1.5, margin: 0 }}>
              {quizResult?.desc || 'Você tem a semente da disciplina, mas precisa de um método simples para agir com clareza quando a mente tenta te puxar para o caos.'}
            </p>
          </div>

          <div className="offer-grid" style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: '1fr 1fr',
            marginBottom: '24px',
          }}>
            {[
              { title: 'Painel de Controle Mental', desc: 'Rotinas guiadas para foco, disciplina emocional e constância.' },
              { title: 'Método de 5 minutos', desc: 'Um protocolo curto para cortar ansiedade antes que ela cresça.' },
              { title: 'Manual do Estoico Moderno', desc: 'Ebook direto, prático e aplicável no mesmo dia.' },
              { title: 'Acesso vitalício', desc: 'Pague uma vez e mantenha acesso ao painel e ao material.' },
            ].map(item => (
              <div key={item.title} style={{
                border: '1px solid rgba(247, 241, 231, 0.12)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '15px',
              }}>
                <strong style={{ display: 'block', fontSize: '15px', color: '#f7f1e7', marginBottom: '5px' }}>
                  {item.title}
                </strong>
                <span style={{ color: '#a9a095', display: 'block', fontSize: '13px', lineHeight: 1.4 }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="offer-authority" style={{
            borderTop: '1px solid rgba(247, 241, 231, 0.12)',
            display: 'grid',
            gap: '18px',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '22px',
          }}>
            <div style={{ color: '#a9a095', fontSize: '14px', lineHeight: 1.55 }}>
              <strong style={{ color: '#f7f1e7', display: 'block', marginBottom: '6px' }}>
                Autoridade do método
              </strong>
              O método foi estruturado para tirar o estoicismo do discurso bonito e levar para uma
              rotina prática: perceber, respirar, decidir e agir melhor sob pressão.
            </div>
            <div style={{ color: '#a9a095', fontSize: '14px', lineHeight: 1.55 }}>
              <strong style={{ color: '#f7f1e7', display: 'block', marginBottom: '6px' }}>
                Prova social
              </strong>
              "Parei de tentar controlar tudo e comecei a controlar minha resposta."
              <br />Felipe Fontana
            </div>
          </div>
        </article>

        <aside className="offer-right" style={{
          background: 'linear-gradient(180deg, rgba(215, 168, 75, 0.08), rgba(215, 168, 75, 0)), #111',
          padding: '28px',
        }}>
          <div style={{
            border: '1px solid rgba(247, 241, 231, 0.2)',
            borderRadius: '10px',
            background: '#101010',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px',
              borderBottom: '1px solid rgba(247, 241, 231, 0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <strong style={{ fontSize: '14px', color: '#f7f1e7' }}>Resumo da compra</strong>
              <span style={{ fontSize: '12px', color: '#ffd275', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Oferta desbloqueada
              </span>
            </div>

            <div style={{
              alignItems: 'center',
              borderBottom: '1px solid rgba(247, 241, 231, 0.12)',
              display: 'grid',
              gap: '14px',
              gridTemplateColumns: '64px 1fr',
              padding: '18px',
            }}>
              <div style={{
                alignItems: 'center',
                background: 'radial-gradient(circle at 40% 20%, rgba(255, 210, 117, 0.45), transparent 38px), linear-gradient(135deg, #2a2115, #0d0d0d)',
                border: '1px solid rgba(255, 210, 117, 0.32)',
                borderRadius: '8px',
                color: '#ffd275',
                display: 'flex',
                fontSize: '23px',
                fontWeight: 950,
                height: '64px',
                justifyContent: 'center',
                width: '64px',
              }}>
                Ω
              </div>
              <div>
                <h2 style={{ fontSize: '18px', lineHeight: 1.2, margin: '0 0 4px', color: '#f7f1e7' }}>
                  Combo Elite Mente Estoica
                </h2>
                <p style={{ color: '#a9a095', fontSize: '13px', lineHeight: 1.35, margin: 0 }}>
                  Painel + ebook + método prático de aplicação diária.
                </p>
              </div>
            </div>

            <div style={{ padding: '18px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                background: 'rgba(215, 168, 75, 0.08)',
                borderRadius: '6px',
                padding: '8px 12px',
                border: '1px solid rgba(215, 168, 75, 0.2)',
              }}>
                <span style={{ color: '#ffd275', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Diagnóstico aplicado
                </span>
                <span style={{ color: '#77d17b', fontSize: '14px', fontWeight: 700 }}>
                  -R$ 69,10
                </span>
              </div>

              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: '18px', padding: '10px 0' }}>
                <span style={{ color: '#a9a095', fontSize: '14px' }}>Valor original</span>
                <strong style={{ color: '#f7f1e7', fontSize: '14px', textAlign: 'right' }}><s>R$ 97,00</s></strong>
              </div>
              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: '18px', padding: '10px 0' }}>
                <span style={{ color: '#a9a095', fontSize: '14px' }}>Desconto aplicado</span>
                <strong style={{ color: '#77d17b', fontSize: '14px', textAlign: 'right' }}>Diagnóstico liberado</strong>
              </div>
              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: '18px', padding: '10px 0' }}>
                <span style={{ color: '#a9a095', fontSize: '14px' }}>Entrega</span>
                <strong style={{ color: '#f7f1e7', fontSize: '14px', textAlign: 'right' }}>Digital imediata</strong>
              </div>
              <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: '18px', padding: '10px 0' }}>
                <span style={{ color: '#a9a095', fontSize: '14px' }}>Garantia</span>
                <strong style={{ color: '#f7f1e7', fontSize: '14px', textAlign: 'right' }}>7 dias</strong>
              </div>

              <div style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '18px',
                padding: '16px 0 10px',
                borderTop: '1px solid rgba(247, 241, 231, 0.12)',
                marginTop: '8px',
              }}>
                <span style={{ color: '#f7f1e7', fontWeight: 800, fontSize: '14px' }}>Total hoje</span>
                <strong style={{ color: '#ffd275', fontSize: '34px', fontWeight: 950, lineHeight: 1 }}>
                  R$ 27,90
                </strong>
              </div>

              <a
                href="https://pay.kiwify.com.br/QIlYjAh"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCheckoutClick}
                style={{
                  alignItems: 'center',
                  background: 'linear-gradient(180deg, #ffd275, #d7a84b)',
                  borderRadius: '8px',
                  color: '#151008',
                  display: 'flex',
                  fontSize: '16px',
                  fontWeight: 950,
                  justifyContent: 'center',
                  margin: '18px 0 10px',
                  minHeight: '58px',
                  padding: '16px 18px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Finalizar compra segura
              </a>

              <p style={{ color: '#746b5d', fontSize: '13px', lineHeight: 1.45, margin: '0 0 10px', textAlign: 'center' }}>
                Leva menos de 1 minuto. Pix, cartão ou boleto.
              </p>
              <p style={{ color: '#a9a095', fontSize: '13px', lineHeight: 1.45, margin: 0, textAlign: 'center' }}>
                Você será redirecionado para a Kiwify para pagar com Pix, cartão ou boleto.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
            {[
              { title: 'Compra protegida', desc: 'Pagamento processado em ambiente seguro pela Kiwify.' },
              { title: 'Acesso no e-mail', desc: 'Após a confirmação, o acesso é enviado para o e-mail usado na compra.' },
              { title: 'Risco zero por 7 dias', desc: 'Teste o material. Se não fizer sentido, você pode solicitar reembolso.' },
            ].map(item => (
              <div key={item.title} style={{
                alignItems: 'flex-start',
                border: '1px solid rgba(247, 241, 231, 0.12)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'grid',
                gap: '10px',
                gridTemplateColumns: '22px 1fr',
                padding: '12px',
              }}>
                <div style={{ color: '#77d17b', fontWeight: 950 }}>✓</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#f7f1e7', marginBottom: '2px' }}>
                    {item.title}
                  </strong>
                  <span style={{ color: '#a9a095', display: 'block', fontSize: '13px', lineHeight: 1.36 }}>
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            alignItems: 'center',
            borderTop: '1px solid rgba(247, 241, 231, 0.12)',
            color: '#746b5d',
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: '12px',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '18px',
            paddingTop: '16px',
          }}>
            {['Pix', 'Cartão', 'Boleto', 'Garantia 7 dias'].map(m => (
              <span key={m} style={{
                border: '1px solid rgba(247, 241, 231, 0.12)',
                borderRadius: '999px',
                padding: '6px 9px',
                color: '#746b5d',
              }}>
                {m}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <strong style={{ color: '#f7f1e7', display: 'block', fontSize: '13px', marginBottom: '4px' }}>
              Garantia clara, sem letra miúda
            </strong>
            <span style={{ color: '#a9a095', fontSize: '13px', lineHeight: 1.45 }}>
              Se o material não fizer sentido para você, solicite reembolso dentro de 7 dias.
              O risco fica do nosso lado.
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
};
