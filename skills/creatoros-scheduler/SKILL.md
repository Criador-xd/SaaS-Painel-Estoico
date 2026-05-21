---
name: creatoros-scheduler
description: >
  Agendamento de Reels/Shorts no CreatorOS AI (creatorosai.lovable.app).
  Faz upload de vídeos, analisa conteúdo via OCR, gera copy AIDA sem rótulos,
  preenche Título, Legenda, Hashtags, CTA, Configurações por Plataforma 
  (Instagram + YouTube), comentário automático em 5 min e agendamento.
  Após agendar, move os vídeos para a pasta de publicados.
type: prompt
version: 1.0.0
categories: [social-media, scheduling, content, instagram, youtube, automation]
---

# CreatorOS AI Scheduler

## Quando usar

Use esta skill SEMPRE que o usuário quiser agendar vídeos (Reels/Shorts) no CreatorOS AI, seja um único vídeo ou múltiplos vídeos de uma pasta. Esta skill cobre o workflow completo desde a análise do conteúdo até o agendamento.

## Workflow Completo

### 1. Acessar o Publisher

- Navegue para `https://creatorosai.lovable.app/publisher`
- Confirme que o usuário está logado (verificar menu lateral com "Sair da conta")

### 2. Analisar o Vídeo com OCR

- Para cada vídeo, extraia frames com ffmpeg:
  ```
  ffmpeg -i "{video_path}" -ss 00:00:02 -vframes 1 -update 1 "{temp_frame}.jpg" -y
  ```
- Execute OCR com Tesseract (idioma: português):
  ```
  tesseract "{frame}.jpg" stdout -l por
  ```
- Se o OCR não detectar texto no primeiro frame, tente em 1s, 3s, 5s
- Use o texto detectado como BASE para gerar o copywriting

### 3. Gerar Copywriting (AIDA IMPLÍCITO)

**REGRAS DE OURO:**
- NUNCA escreva "ATENÇÃO:", "INTERESSE:", "DESEJO:", "AÇÃO:" no texto — soa amador
- A estrutura AIDA deve estar IMPLÍCITA na narrativa
- Títulos em CAIXA ALTA com gatilhos de curiosidade
- Legendas em caixa alta e baixa natural, com copywriting persuasivo
- Emojis estratégicos (🔥, 🦁, 💬, 📌) para engajamento
- Hashtags de alto alcance e relevantes ao nicho

**Estrutura gerada para cada vídeo:**

#### Título Interno
Nome curto de organização: `Reels - {tema do video}`

#### Título para Instagram
Gatilho + curiosidade em CAIXA ALTA. Máximo 1-2 linhas.
Ex: `VOCÊ É UM LEÃO OU UMA OVELHA? A RESPOSTA DEFINE SEU DESTINO`

#### Legenda Principal
- Abre com a frase principal do vídeo (em CAIXA ALTA)
- Parágrafo de gancho (pergunta ou afirmação impactante)
- Desenvolvimento da ideia (o problema, a verdade)
- Projeção do resultado desejado
- Chamada para ação sutil

#### Hashtags
Máximo 15-17 hashtags, mix de volume alto + nicho.
Ex: `#estoicismo #filosofia #lideranca #menteestoica #disciplina #superacao #motivacao #estoico #foco #mentalidadeforte #leao #forcainterior #resiliencia #autocontrole #sabedoria #coragem`

#### CTA
Chamada direta para o link da bio.
Ex: `CLICA NO LINK DA BIO E DESCUBRA COMO SER O LEÃO DA SUA PRÓPRIA HISTÓRIA`

### 4. Preencher no CreatorOS AI

**Upload:**
```javascript
const fileInput = page.locator('input[type="file"]');
await fileInput.setInputFiles(['{caminho_do_video}']);
await page.waitForTimeout(3000);
```

**Formato e Plataformas:**
- Clique em "Reels" (botão com SVG, não img)
- Clique em "Instagram" (botão com SVG, não img)
- Clique em "YouTube Shorts" (botão com SVG, não img)
- Para clicar: `document.querySelectorAll('button').forEach(b => { if (b.textContent.includes('{nome}') && b.querySelector('svg')) b.click(); })`

**Campos principais:**
- `getByPlaceholder('Ex: Carrossel sobre Hábitos')` → Título Interno
- `getByPlaceholder('Título que aparecerá no Instagram')` → Título Instagram
- `getByRole('textbox', { name: 'Escreva a legenda principal...' })` → Legenda
- `getByPlaceholder('#hashtags')` → Hashtags
- `getByPlaceholder('Call to action')` → CTA

### 5. Configurações por Plataforma

**IMPORTANTE:** O accordion das plataformas só permite UM aberto por vez. Siga esta ordem:

**Passo A — Instagram:**
1. Expanda Instagram: clique em `button[aria-expanded]` com texto "Instagram" e estado "false"
2. Aguarde 400ms
3. Preencha `getByPlaceholder('Legenda específica para Instagram')` com versão adaptada para Instagram

**Passo B — YouTube Shorts:**
1. Expanda YouTube Shorts: clique em `button[aria-expanded]` com texto "YouTube Shorts" e estado "false"
2. Aguarde 400ms
3. Preencha `getByPlaceholder('Título para YouTube')` com título próprio para YouTube
4. Preencha `getByPlaceholder('Descrição para YouTube')` com descrição completa

### 6. Comentário Automático

- Ative o switch: `button[role="switch"]` (primeiro)
- Preencha o texto do comentário com CTA usando gatilhos de curiosidade
- Selecione "5 min"

### 7. Aprovação

- Ative o switch: `button[role="switch"]` (segundo) se ainda não estiver ativo

### 8. Agendar

- Preencha `input[type="datetime-local"]` com a data/hora desejada (formato: `YYYY-MM-DDTHH:mm`)
- Clique em `button:has-text("Agendar")`
- Confirme a mensagem "Publicação agendada com sucesso!"

### 9. Mover Vídeo

- Após agendar, mova o vídeo da pasta origem para `D:\Videos publicados\menteestoicaabsoluta\`

## Lida com Múltiplos Vídeos

- A plataforma suporta upload de até 10 arquivos por vez
- Para múltiplos vídeos, AGENDE UM POR VEZ (cada um precisa de análise e copy próprio)
- Após cada agendamento bem-sucedido, navegue novamente para `/publisher`
- Repita o ciclo para cada vídeo
- Se o OCR de um vídeo falhar (sem texto detectado), use o contexto do canal e nome do arquivo para inferir o tema

## Tratamento de Erros

- Se `getByPlaceholder` falhar, o campo pode estar em accordion fechado
- Se o botão "Agendar" estiver desabilitado, verifique: upload, título, plataforma, aprovação
- Se o accordion não expandir, use `page.evaluate()` com clique direto no DOM
- Se a página redirecionar para `/publisher/history`, navegue de volta para `/publisher`
- Para clicar em botões de plataforma/formato, use `b.querySelector('svg')` (são SVGs, não IMGs)

## Exemplo de Código (Upload + Config Completa)

```javascript
// Upload
await page.locator('input[type="file"]').setInputFiles(['{video}.mp4']);

// Formato e plataformas
await page.evaluate(() => {
  document.querySelectorAll('button').forEach(b => {
    if (b.textContent.includes('{nome}') && b.querySelector('svg')) b.click();
  });
});

// Campos
await page.getByPlaceholder('Ex: Carrossel sobre Hábitos').fill('{titulo_interno}');
await page.getByPlaceholder('Título que aparecerá no Instagram').fill('{titulo_instagram}');
await page.getByRole('textbox', { name: 'Escreva a legenda principal...' }).fill('{legenda}');
await page.getByPlaceholder('#hashtags').fill('{hashtags}');
await page.getByPlaceholder('Call to action').fill('{cta}');

// Instagram config
await page.evaluate(() => { /* expande Instagram, preenche legenda */ });

// YouTube config
await page.evaluate(() => { /* expande YouTube, preenche título + descrição */ });

// Comment + approval + schedule
// ... switches, datetime-local, agendar
```