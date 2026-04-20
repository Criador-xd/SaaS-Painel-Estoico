const fs = require('fs-extra');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

async function updatePublications() {
  console.log('🔄 Buscando publicações com vídeos...\n');

  const { data: publications, error } = await client
    .from('publications')
    .select('id,title,caption,hashtags,cta,overall_status')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro:', error.message);
    return;
  }

  console.log(`📋 Encontradas ${publications.length} publicações\n`);

  let updated = 0;

  const sampleKeywords = [
    'determinacao', 'forca', 'coragem', 'foco', 'disciplina',
    'sucesso', 'vitória', 'conquista', 'transformacao',
    'dinheiro', 'riqueza', 'faturamento', 'investimento',
    'amor', 'relacionamento', 'familia',
    'fe', 'deus', 'oracao', 'bencao'
  ];

  for (let i = 0; i < publications.length; i++) {
    const pub = publications[i];

    const kwIndex = i % sampleKeywords.length;
    const keywords = [sampleKeywords[kwIndex]];
    if (i % 3 === 0) keywords.push(sampleKeywords[(kwIndex + 1) % sampleKeywords.length]);
    if (i % 5 === 0) keywords.push(sampleKeywords[(kwIndex + 2) % sampleKeywords.length]);

    const theme = detectTheme(keywords);

    const title = generateTitle(theme, keywords, i);
    const caption = generateCaption(theme, keywords, i);
    const hashtags = generateHashtags(theme, keywords, i);
    const cta = generateCTA(theme);

    await client
      .from('publications')
      .update({
        title: title,
        caption: caption,
        hashtags: hashtags,
        cta: cta
      })
      .eq('id', pub.id);

    console.log(`✅ ${String(i+1).padStart(2,'0')} | ${title.substring(0, 45)}...`);
    updated++;
  }

  console.log(`\n🎉 ${updated} publicações atualizadas!`);
}

function detectTheme(keywords) {
  const text = keywords.join(' ');

  if (/dinheiro|rico|fortuna|milhao|faturar|investimento/.test(text)) return 'dinheiro';
  if (/amor|relacionamento|casal|esposa|marido|familia/.test(text)) return 'relacionamento';
  if (/fe|deus|oracao|igreja|bencao/.test(text)) return 'espiritual';

  return 'sucesso';
}

function generateTitle(theme, keywords, index) {
  const kw = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1);
  
  const titles = [
    `🔥 Por Que ${kw} Funciona`,
    `⚡ O Segredo de ${kw}`,
    `💎 Como ${kw} Mudou Minha Vida`,
    `📈 ${kw} - Guia Completo`,
    `🎯 Por Que Você Precisa de ${kw}`,
    `✨ ${kw}: A Verdade que Ninguém Conta`,
    `🚨 ${kw} - O Que Você Precisa Saber`
  ];

  return titles[index % titles.length];
}

function generateCaption(theme, keywords, index) {
  const kw = keywords.join(', ');

  const templates = {
    sucesso: `🔥 ASSISTA ATE O FINAL!\n\n${kw ? `Neste video voce vai descobrir os segredos sobre: ${kw}` : 'Voce tem poder de transformar sua vida!'}\n\nPrepare-se para uma Transformacao!\n\n💬 Comenta ai qual e o seu maior objetivo!`,
    dinheiro: `💰 ASSISTA ATE O FINAL!\n\n${kw ? `Aprenda sobre: ${kw}` : 'Descubra como aumentar sua renda!'}\n\nSecrets que os ricos nao querem que voce saiba!\n\n💬 Quer saber mais? Comenta "QUERO"!`,
    relacionamento: `❤️ ASSISTA ATE O FINAL!\n\n${kw ? `Tudo sobre: ${kw}` : 'A verdade sobre relacionamentos!'}\n\nCompartilhe com quem voce ama!\n\n💬 Salve para depois!`,
    espiritual: `🙏 ASSISTA ATE O FINAL!\n\n${kw ? `Palavra sobre: ${kw}` : 'Deus tem uma palavra para voce!'}\n\nReceba essa bênção!\n\n💬 Compartilhe essa palavra!`
  };

  return templates[theme] || templates.sucesso;
}

function generateHashtags(theme, keywords, index) {
  const baseTags = {
    sucesso: ['#sucesso', '#motivacao', '#determinacao', '#foco', '#sonho', '#objetivo', '#mindset', '#growth', '#hustle', '#disciplina'],
    dinheiro: ['#dinheiro', '#riqueza', '#faturamento', '#investimento', '#negocio', '#vendas', '#marketing', '#empresa', '#lucro', '#fortuna'],
    relacionamento: ['#amor', '#relacionamento', '#casal', '#familia', '#uniao', '#comunicacao', '#pareja'],
    espiritual: ['#fe', '#deus', '#oracao', '#bencao', '#esperanca', '#transformacao', '#espiritualidade']
  };

  const kwTags = keywords.map(k => '#' + k.toLowerCase());
  const themeTags = baseTags[theme] || baseTags.sucesso;
  
  const allTags = [...kwTags, ...themeTags];
  const uniqueTags = [...new Set(allTags)];
  
  return uniqueTags.slice(0, 15).join(' ');
}

function generateCTA(theme) {
  const ctas = {
    sucesso: '💬 Comenta aqui!',
    dinheiro: '📱 Quer saber mais? Comenta "QUERO"!',
    relacionamento: '❤️ Salve para voce e seu parceiro!',
    espiritual: '🙏 Compartilhe essa palavra!'
  };

  return ctas[theme] || ctas.sucesso;
}

updatePublications().catch(console.error);