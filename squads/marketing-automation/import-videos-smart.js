const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const config = yaml.parse(fs.readFileSync('./config/config.yaml', 'utf8'));
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

const WATCH_FOLDER = config.WATCH_FOLDER;
const USER_ID = config.USER_ID;

class SmartAnalyzer {
  constructor() {
    this.niche = 'motivacao_negocios';
    this.titlePatterns = {
      hook: ['Ninguem Te Conta', 'O Segredo de', 'Por Que', 'O Que', 'Como', 'A Verdade Sobre', 'Descubra'],
      emotion: ['Emocionante', 'Impactante', 'Chocante', 'Incrível', 'Espetacular', 'Transformador'],
      urgency: ['Agora', 'Hoje', 'Antes Que', 'Não Espere', 'Você Precisa']
    };
    this.powerWords = {
      dinheiro: ['Milhão', 'Riqueza', 'Dinheiro', 'Faturamento', 'Lucro', 'Renda', 'Fortuna', 'Investimento'],
      sucesso: ['Sucesso', 'Vencedor', 'Topo', 'Vitória', 'Conquista', 'Glória', 'Transformação', 'Crescimento'],
      emocional: ['Chocado', 'Incrível', 'Impossível', 'Secreto', 'Oculto', 'Revelado'],
      acao: ['Faça', 'Comece', 'Pare', 'Continue', 'Aprenda', 'Descubra', 'Entenda', 'Execute']
    };
    this.nicheHashtags = {
      dinheiro: ['#dinheiro', '#riqueza', '#milhao', '#sucesso', '#faturamento', '#negocios', '#empreendedorismo', '#finanças', '#investimento', '#prosperidade'],
      sucesso: ['#sucesso', '#motivação', '#vencedor', '#foco', '#disciplina', '#mentalidade', '#sonho', '#objetivo', '#determinação', '#força'],
      espiritual: ['#fé', '#deus', '#amor', '#espiritual', '#oração', '#biblia', '#benção', '#esperança', '#universo'],
      relacionamento: ['#relacionamento', '#amor', '#casal', '#família', '#parceiro']
    };
  }

  detectTheme(filename) {
    const name = filename.toLowerCase();
    if (name.includes('dinheiro') || name.includes('rico') || name.includes('milhao') || name.includes('faturamento') || name.includes('investimento')) return 'dinheiro';
    if (name.includes('deus') || name.includes('fe') || name.includes('oracao') || name.includes('amor') || name.includes('espiritual')) return 'espiritual';
    if (name.includes('amor') || name.includes('relacionamento') || name.includes('casal') || name.includes('esposa')) return 'relacionamento';
    return 'sucesso';
  }

  extractKeywords(filename) {
    const name = filename.toLowerCase().replace(/[-_]/g, ' ');
    const words = name.split(' ').filter(w => w.length > 3);
    return words.slice(0, 5);
  }

  generateYoutubeTitle(videoInfo) {
    const { originalName, theme } = videoInfo;
    const formulas = [
      `O Segredo de ${this.capitalizeWords(originalName)} que Ninguém Te Conta`,
      `Como ${this.capitalizeWords(originalName)} Mudou Minha Vida`,
      `A Verdade Sobre ${this.capitalizeWords(originalName)} que Ninguém Fala`,
      `${this.capitalizeWords(originalName)} - O Que Ninguem Te Conta`,
      `Por Que ${this.capitalizeWords(originalName)} é Importante Agora`
    ];
    return formulas[Math.floor(Math.random() * formulas.length)];
  }

  generateCaption(videoInfo) {
    const { originalName, theme } = videoInfo;
    const hooks = [
      `🔥 Você precisa ouvir isso sobre ${originalName.toLowerCase()}!`,
      `💎 Hoje eu vou te contar a verdade sobre ${originalName.toLowerCase()}...`,
      `⚡ Isso vai mudar a forma como você vê ${originalName.toLowerCase()}!`,
      `✨ Você está pronto para descobrir o segredo de ${originalName.toLowerCase()}?`
    ];
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    const body = `\n\nAssista até o final e me conta nos comentários: você já passou por isso?\n\n📌 Siga para mais conteúdo como esse!\n\n#motivação #sucesso #transformação #mentalidade #crescimento`;
    return hook + body;
  }

  generateHashtags(theme, keywords) {
    const base = this.nicheHashtags[theme] || this.nicheHashtags.sucesso;
    const selected = base.slice(0, 12);
    const keywordTags = keywords.map(k => '#' + k.replace(/[^a-zA-Z]/g, '')).slice(0, 5);
    return [...selected, ...keywordTags].join(' ');
  }

  capitalizeWords(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').slice(0, 60);
  }
}

const POST_SLOTS = [
  { name: 'Manha', hour: 10 },
  { name: 'Tarde', hour: 14 },
  { name: 'Noite', hour: 22 },
  { name: 'Madrugada', hour: 3 }
];

function findNextSlot(lastDate) {
  const now = new Date();
  now.setHours(now.getHours() - 3);
  
  let baseDate = lastDate || now;
  let nextSlotIndex = 0;
  let dayOffset = 0;
  
  if (lastDate) {
    const lastHour = baseDate.getHours();
    if (lastHour >= 22) { nextSlotIndex = 3; dayOffset = 1; }
    else if (lastHour >= 14) { nextSlotIndex = 2; dayOffset = 0; }
    else if (lastHour >= 10) { nextSlotIndex = 1; dayOffset = 0; }
    else { nextSlotIndex = 0; dayOffset = 0; }
  } else {
    const currentHour = now.getHours();
    if (currentHour >= 22) { nextSlotIndex = 3; dayOffset = 1; }
    else if (currentHour >= 14) { nextSlotIndex = 2; dayOffset = 0; }
    else if (currentHour >= 10) { nextSlotIndex = 1; dayOffset = 0; }
    else { nextSlotIndex = 0; dayOffset = 0; }
  }
  
  for (let attempt = 0; attempt < 30; attempt++) {
    const candidateDate = new Date(baseDate);
    candidateDate.setDate(candidateDate.getDate() + dayOffset + attempt);
    
    const dayOfWeek = candidateDate.getDay();
    if ([0, 1, 2, 3, 4, 5, 6].includes(dayOfWeek)) {
      for (let i = 0; i < POST_SLOTS.length; i++) {
        const slotIndex = (nextSlotIndex + i) % POST_SLOTS.length;
        const slot = POST_SLOTS[slotIndex];
        
        const slotDate = new Date(candidateDate);
        if (slot.hour < 10 && slotIndex === 3) {
          slotDate.setDate(slotDate.getDate() + 1);
        }
        slotDate.setHours(slot.hour, 0, 0, 0);
        
        if (slotDate > now) {
          return slotDate;
        }
      }
    }
  }
  
  const fallback = new Date(now);
  fallback.setDate(fallback.getDate() + 1);
  fallback.setHours(10, 0, 0, 0);
  return fallback;
}

async function importVideos() {
  console.log('🔍 Escaneando vídeos na pasta...\n');
  
  const files = fs.readdirSync(WATCH_FOLDER);
  const videoFiles = files.filter(f => f.endsWith('.mp4'));
  
  console.log(`📹 Encontrados ${videoFiles.length} vídeos\n`);
  
  const analyzer = new SmartAnalyzer();
  let lastScheduledDate = null;
  
  console.log(`⏳ Gerando conteúdo e agendando ${videoFiles.length} vídeos...\n`);
  
  let count = 0;
  
  for (const videoFile of videoFiles) {
    const originalName = videoFile.replace('.mp4', '').replace(/-/g, ' ');
    const theme = analyzer.detectTheme(originalName);
    const keywords = analyzer.extractKeywords(originalName);
    
    const videoInfo = { originalName, theme, keywords };
    
    const title = analyzer.generateYoutubeTitle(videoInfo);
    const caption = analyzer.generateCaption(videoInfo);
    const hashtags = analyzer.generateHashtags(theme, keywords);
    
    const scheduledAt = findNextSlot(lastScheduledDate);
    lastScheduledDate = new Date(scheduledAt);
    
    const fullCaption = caption + '\n\n' + hashtags;
    
    try {
      const { data: pub, error } = await supabase
        .from('publications')
        .insert({
          user_id: USER_ID,
          title: title,
          caption: fullCaption,
          scheduled_for: scheduledAt.toISOString(),
          overall_status: 'scheduled'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await supabase.from('publication_targets').insert([
        { publication_id: pub.id, platform: 'youtube', status: 'pendente', privacy_status: 'public' },
        { publication_id: pub.id, platform: 'instagram', status: 'pendente', privacy_status: 'public' }
      ]);
      
      console.log(`  ✅ ${count + 1}. ${title}`);
      console.log(`     Tema: ${theme} | Agendado: ${scheduledAt.toLocaleString('pt-BR')}`);
      
      count++;
    } catch (err) {
      console.log(`  ❌ Erro: ${err.message}`);
    }
  }
  
  console.log(`\n✅ Importação completa! ${count} vídeos agendados com conteúdo gerado.`);
}

importVideos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });