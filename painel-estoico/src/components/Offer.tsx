import { useStore } from '../store/useStore';
import { trackCheckoutClick } from '../lib/analytics';

const checkoutUrl = 'https://pay.kiwify.com.br/QIlYjAh';

export const Offer = () => {
  const { quizResult, userEmail } = useStore();

  const handleCheckoutClick = () => {
    trackCheckoutClick(userEmail || undefined, quizResult?.title);
  };

  return (
    <main className="offer-page">
      <style>{`
        body:has(.offer-page) {
          height: auto;
          min-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          width: auto;
        }

        .app-container:has(.offer-page) {
          border-left: 0;
          border-right: 0;
          box-shadow: none;
          height: auto;
          max-width: none;
          min-height: 100vh;
          overflow: visible;
          width: 100%;
        }

        .app-container:has(.offer-page) > div {
          height: auto !important;
          min-height: 100vh;
          overflow: visible;
        }

        .offer-page {
          --offer-bg: #090909;
          --offer-surface: #111111;
          --offer-text: #f7f1e7;
          --offer-muted: #a9a095;
          --offer-soft: #746b5d;
          --offer-line: rgba(247, 241, 231, 0.12);
          --offer-line-strong: rgba(247, 241, 231, 0.2);
          --offer-gold: #d7a84b;
          --offer-gold-2: #ffd275;
          --offer-green: #77d17b;
          background:
            radial-gradient(circle at 50% -8%, rgba(215, 168, 75, 0.18), transparent 34rem),
            linear-gradient(180deg, #111 0%, var(--offer-bg) 52%);
          width: min(1160px, calc(100% - 32px));
          margin: 0 auto;
          padding: 28px 0 46px;
          min-height: 100vh;
          color: var(--offer-text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .offer-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .offer-logo {
          align-items: center;
          display: flex;
          gap: 10px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .offer-logo-mark {
          align-items: center;
          background: linear-gradient(180deg, var(--offer-gold-2), var(--offer-gold));
          border-radius: 8px;
          color: #151008;
          display: flex;
          font-weight: 950;
          height: 34px;
          justify-content: center;
          width: 34px;
        }

        .offer-secure-label {
          align-items: center;
          border: 1px solid var(--offer-line);
          border-radius: 999px;
          color: var(--offer-muted);
          display: flex;
          font-size: 13px;
          gap: 8px;
          padding: 8px 12px;
        }

        .offer-shell {
          border: 1px solid var(--offer-line-strong);
          border-radius: 10px;
          background: rgba(17, 17, 17, 0.96);
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.42);
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(360px, 0.72fr);
          overflow: hidden;
        }

        .offer-left {
          border-right: 1px solid var(--offer-line);
          padding: 34px;
        }

        .offer-right {
          background:
            linear-gradient(180deg, rgba(215, 168, 75, 0.08), rgba(215, 168, 75, 0)),
            var(--offer-surface);
          padding: 28px;
        }

        .offer-step {
          color: var(--offer-gold-2);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.09em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .offer-title {
          color: var(--offer-text);
          font-size: clamp(32px, 5vw, 54px);
          line-height: 0.98;
          letter-spacing: 0;
          margin: 0 0 14px;
        }

        .offer-lead {
          color: var(--offer-muted);
          font-size: 18px;
          line-height: 1.55;
          margin: 0 0 26px;
          max-width: 650px;
        }

        .offer-diagnostic {
          border: 1px solid rgba(215, 168, 75, 0.28);
          border-radius: 8px;
          background: rgba(215, 168, 75, 0.08);
          padding: 18px;
          margin-bottom: 24px;
        }

        .offer-diagnostic strong {
          color: var(--offer-gold-2);
          display: block;
          font-size: 14px;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .offer-diagnostic p {
          color: var(--offer-text);
          line-height: 1.5;
          margin: 0;
        }

        .offer-included {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 24px;
        }

        .offer-item {
          border: 1px solid var(--offer-line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          padding: 15px;
        }

        .offer-item strong {
          color: var(--offer-text);
          display: block;
          font-size: 15px;
          margin-bottom: 5px;
        }

        .offer-item span {
          color: var(--offer-muted);
          display: block;
          font-size: 13px;
          line-height: 1.4;
        }

        .offer-authority {
          border-top: 1px solid var(--offer-line);
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          padding-top: 22px;
        }

        .offer-copy-block {
          color: var(--offer-muted);
          font-size: 14px;
          line-height: 1.55;
        }

        .offer-copy-block strong {
          color: var(--offer-text);
          display: block;
          margin-bottom: 6px;
        }

        .offer-order-card {
          border: 1px solid var(--offer-line-strong);
          border-radius: 10px;
          background: #101010;
          overflow: hidden;
        }

        .offer-product {
          align-items: center;
          border-bottom: 1px solid var(--offer-line);
          display: grid;
          gap: 14px;
          grid-template-columns: 64px 1fr;
          padding: 18px;
        }

        .offer-cover {
          align-items: center;
          background:
            radial-gradient(circle at 40% 20%, rgba(255, 210, 117, 0.45), transparent 38px),
            linear-gradient(135deg, #2a2115, #0d0d0d);
          border: 1px solid rgba(255, 210, 117, 0.32);
          border-radius: 8px;
          color: var(--offer-gold-2);
          display: flex;
          font-size: 23px;
          font-weight: 950;
          height: 64px;
          justify-content: center;
          width: 64px;
        }

        .offer-product h2 {
          color: var(--offer-text);
          font-size: 18px;
          line-height: 1.2;
          margin: 0 0 4px;
        }

        .offer-product p {
          color: var(--offer-muted);
          font-size: 13px;
          line-height: 1.35;
          margin: 0;
        }

        .offer-summary {
          padding: 18px;
        }

        .offer-row {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 10px 0;
        }

        .offer-row span {
          color: var(--offer-muted);
          font-size: 14px;
        }

        .offer-row strong {
          color: var(--offer-text);
          font-size: 14px;
          text-align: right;
        }

        .offer-row-total {
          border-top: 1px solid var(--offer-line);
          margin-top: 8px;
          padding-top: 16px;
        }

        .offer-row-total span {
          color: var(--offer-text);
          font-weight: 800;
        }

        .offer-price {
          color: var(--offer-gold-2) !important;
          font-size: 34px !important;
          font-weight: 950;
          line-height: 1;
        }

        .offer-cta {
          align-items: center;
          background: linear-gradient(180deg, var(--offer-gold-2), var(--offer-gold));
          border-radius: 8px;
          color: #151008;
          display: flex;
          font-size: 16px;
          font-weight: 950;
          justify-content: center;
          margin: 18px 0 10px;
          min-height: 58px;
          padding: 16px 18px;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
        }

        .offer-note {
          color: var(--offer-muted);
          font-size: 13px;
          line-height: 1.45;
          margin: 0;
          text-align: center;
        }

        .offer-trust {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .offer-trust-item {
          align-items: flex-start;
          border: 1px solid var(--offer-line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          display: grid;
          gap: 10px;
          grid-template-columns: 22px 1fr;
          padding: 12px;
        }

        .offer-check {
          color: var(--offer-green);
          font-weight: 950;
        }

        .offer-trust-item strong {
          color: var(--offer-text);
          display: block;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .offer-trust-item span {
          color: var(--offer-muted);
          display: block;
          font-size: 13px;
          line-height: 1.36;
        }

        .offer-methods {
          align-items: center;
          border-top: 1px solid var(--offer-line);
          color: var(--offer-soft);
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          gap: 8px;
          justify-content: center;
          margin-top: 18px;
          padding-top: 16px;
        }

        .offer-method {
          border: 1px solid var(--offer-line);
          border-radius: 999px;
          padding: 6px 9px;
        }

        @media (max-width: 920px) {
          .offer-page {
            width: min(100% - 24px, 680px);
            padding-top: 18px;
          }

          .offer-shell {
            grid-template-columns: 1fr;
          }

          .offer-left {
            border-right: 0;
            border-bottom: 1px solid var(--offer-line);
          }
        }

        @media (max-width: 620px) {
          .offer-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .offer-left,
          .offer-right {
            padding: 20px;
          }

          .offer-included,
          .offer-authority {
            grid-template-columns: 1fr;
          }

          .offer-product {
            grid-template-columns: 54px 1fr;
          }

          .offer-cover {
            height: 54px;
            width: 54px;
          }
        }
      `}</style>

      <header className="offer-header">
        <div className="offer-logo">
          <div className="offer-logo-mark">M</div>
          <span>Mente Estoica</span>
        </div>
        <div className="offer-secure-label">✓ Checkout protegido pela Kiwify</div>
      </header>

      <section className="offer-shell">
        <article className="offer-left">
          <div className="offer-step">Resultado do diagnóstico</div>
          <h1 className="offer-title">Seu plano mental está pronto.</h1>
          <p className="offer-lead">
            Você está a um passo de liberar o Combo Elite, criado para transformar ansiedade,
            distração e reação automática em rotina de foco e autocontrole.
          </p>

          <div className="offer-diagnostic">
            <strong>Perfil identificado: {quizResult?.title || 'estoico em formação'}</strong>
            <p>
              {quizResult?.desc ||
                'Você tem a semente da disciplina, mas precisa de um método simples para agir com clareza quando a mente tenta te puxar para o caos.'}
            </p>
          </div>

          <div className="offer-included">
            <div className="offer-item">
              <strong>Painel de Controle Mental</strong>
              <span>Rotinas guiadas para foco, disciplina emocional e constância.</span>
            </div>
            <div className="offer-item">
              <strong>Método de 5 minutos</strong>
              <span>Um protocolo curto para cortar ansiedade antes que ela cresça.</span>
            </div>
            <div className="offer-item">
              <strong>Manual do Estoico Moderno</strong>
              <span>Ebook direto, prático e aplicável no mesmo dia.</span>
            </div>
            <div className="offer-item">
              <strong>Acesso vitalício</strong>
              <span>Pague uma vez e mantenha acesso ao painel e ao material.</span>
            </div>
          </div>

          <div className="offer-authority">
            <div className="offer-copy-block">
              <strong>Autoridade do método</strong>
              O método foi estruturado para tirar o estoicismo do discurso bonito e levar para uma
              rotina prática: perceber, respirar, decidir e agir melhor sob pressão.
            </div>
            <div className="offer-copy-block">
              <strong>Prova social</strong>
              "Parei de tentar controlar tudo e comecei a controlar minha resposta."
              <br />Felipe Fontana
            </div>
          </div>
        </article>

        <aside className="offer-right">
          <div className="offer-order-card">
            <div className="offer-product">
              <div className="offer-cover">Ω</div>
              <div>
                <h2>Combo Elite Mente Estoica</h2>
                <p>Painel + ebook + método prático de aplicação diária.</p>
              </div>
            </div>

            <div className="offer-summary">
              <div className="offer-row">
                <span>Valor original</span>
                <strong>
                  <s>R$ 97,00</s>
                </strong>
              </div>
              <div className="offer-row">
                <span>Desconto aplicado</span>
                <strong>Diagnóstico liberado</strong>
              </div>
              <div className="offer-row">
                <span>Entrega</span>
                <strong>Digital imediata</strong>
              </div>
              <div className="offer-row">
                <span>Garantia</span>
                <strong>7 dias</strong>
              </div>
              <div className="offer-row offer-row-total">
                <span>Total hoje</span>
                <strong className="offer-price">R$ 27,90</strong>
              </div>

              <a
                className="offer-cta"
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCheckoutClick}
              >
                Finalizar compra segura
              </a>
              <p className="offer-note">
                Você será redirecionado para a Kiwify para pagar com Pix, cartão ou boleto.
              </p>
            </div>
          </div>

          <div className="offer-trust">
            <div className="offer-trust-item">
              <div className="offer-check">✓</div>
              <div>
                <strong>Compra protegida</strong>
                <span>Pagamento processado em ambiente seguro pela Kiwify.</span>
              </div>
            </div>
            <div className="offer-trust-item">
              <div className="offer-check">✓</div>
              <div>
                <strong>Acesso no e-mail</strong>
                <span>Após a confirmação, o acesso é enviado para o e-mail usado na compra.</span>
              </div>
            </div>
            <div className="offer-trust-item">
              <div className="offer-check">✓</div>
              <div>
                <strong>Risco zero por 7 dias</strong>
                <span>Teste o material. Se não fizer sentido, você pode solicitar reembolso.</span>
              </div>
            </div>
          </div>

          <div className="offer-methods">
            <span className="offer-method">Pix</span>
            <span className="offer-method">Cartão</span>
            <span className="offer-method">Boleto</span>
            <span className="offer-method">Garantia 7 dias</span>
          </div>
        </aside>
      </section>
    </main>
  );
};
