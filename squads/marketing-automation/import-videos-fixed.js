const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const config = yaml.parse(fs.readFileSync('./config/config.yaml', 'utf8'));
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

const WATCH_FOLDER = config.WATCH_FOLDER;
const USER_ID = config.USER_ID;

function cleanTitle(name) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-ZãáàéêíóõúâîôûçÇ0-9\s]/g, '')
    .trim();
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trim() + '...';
}

function getMainKeyword(filename) {
  return filename.toLowerCase();
}

function detectTheme(filename) {
  const name = filename.toLowerCase();
  if (name.includes('dinheiro') || name.includes('rico') || name.includes('milhao') || name.includes('faturamento') || name.includes('investimento') || name.includes('riqueza')) return 'dinheiro';
  if (name.includes('deus') || name.includes('fe') || name.includes('oracao') || name.includes('amor') || name.includes('espiritual') || name.includes('deus')) return 'espiritual';
  if (name.includes('amor') || name.includes('relacionamento') || name.includes('casal') || name.includes('esposa') || name.includes('marido')) return 'relacionamento';
  return 'sucesso';
}

function generateTitle(filename) {
  const mainKeyword = getMainKeyword(filename);
  const shortKey = mainKeyword.length > 30 ? mainKeyword.slice(0, 30) + '...' : mainKeyword;
  const themes = {
    dinheiro: ['💰', '💎', '⚡'],
    sucesso: ['🔥', '⚡', '✨'],
    espiritual: ['🙏', '💫', '⭐'],
    relacionamento: ['❤️', '💕', '💘']
  };
  const theme = detectTheme(filename);
  const emoji = themes[theme][Math.floor(Math.random() * themes[theme].length)];
  
  const formulas = [
    `${emoji} ${shortKey}`,
    `${emoji} ${shortKey}: A Verdade que Ninguém Conta`,
    `${emoji} ${shortKey} - O Segredo Que Ninguém Fala`,
    `${emoji} ${shortKey} É o Que Realmente Importa`,
    `${emoji} ${shortKey}: Historia que Vai Te Chocar`
  ];
  
  return truncate(formulas[Math.floor(Math.random() * formulas.length)], 80);
}

function generateCaption(filename) {
  const shortFilename = filename.length > 50 ? filename.slice(0, 50) + '...' : filename;
  const theme = detectTheme(filename);
  
  const hooks = [
    `🔥 Você já ouviu falar sobre "${shortFilename}"?`,
    `💎 Hoje vou te contar a verdade sobre "${shortFilename}"...`,
    `⚡ Isso vai mudar como você vê "${shortFilename}"!`,
    `✨ Pronto para descobrir o segredo de "${shortFilename}"?`
  ];
  
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  
  const bodies = [
    `\n\nAssista até o final e me conta nos comentários: você já passou por isso?\n\n📌 Siga para mais conteúdo como esse!`,
    `\n\nAssista até ofim e deixe sua opinião!\n\n💬 Comente o que você pensa:`,
    `\n\nNão esqueça de compartilhar com alguém que precisa ver isso!\n\n📤Tag alguém:`,
    `\n\nQual sua experiência com isso? Comenta aí! 👇`
  ];
  
  const body = bodies[Math.floor(Math.random() * bodies.length)];
  
  let hashtags = '#motivacao #sucesso #transformacao #mentalidade #crescimento';
  if (theme === 'dinheiro') hashtags = '#dinheiro #riqueza #milhao #sucesso #faturamento #negocios #empreendedorismo';
  if (theme === 'espiritual') hashtags = '#fe #deus #amor #espiritual #oracao #biblia #bencao';
  if (theme === 'relacionamento') hashtags = '#relacionamento #amor #casal #familia #parceiro';
  
  return hook + body + '\n\n' + hashtags;
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
  console.log('🔍 Escaneando vídeos...\n');
  
  const files = fs.readdirSync(WATCH_FOLDER);
  const videoFiles = files.filter(f => f.endsWith('.mp4'));
  
  console.log(`📹 Encontrados ${videoFiles.length} vídeos\n`);
  
  let lastScheduledDate = null;
  
  console.log(`⏳ Gerando títulos e legendas...\n`);
  
  let count = 0;
  
  for (const videoFile of videoFiles) {
    const originalName = cleanTitle(videoFile.replace('.mp4', ''));
    const title = generateTitle(originalName);
    const caption = generateCaption(originalName);
    
    const scheduledAt = findNextSlot(lastScheduledDate);
    lastScheduledDate = new Date(scheduledAt);
    
    try {
      const { data: pub, error } = await supabase
        .from('publications')
        .insert({
          user_id: USER_ID,
          title: title,
          caption: caption,
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
      console.log(`     📅 ${scheduledAt.toLocaleString('pt-BR')}`);
      
      count++;
    } catch (err) {
      console.log(`  ❌ Erro em ${videoFile}: ${err.message}`);
    }
  }
  
  console.log(`\n✅ Completo! ${count} vídeos agendados.`);
}

importVideos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });