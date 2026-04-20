const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const yaml = require('yaml');

const config = yaml.parse(fs.readFileSync('./config/config.yaml', 'utf8'));
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

const WATCH_FOLDER = config.WATCH_FOLDER;
const USER_ID = config.USER_ID;

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
  
  console.log(`⏳ Agendando vídeos (legendas serao geradas pelo SaaS)...\n`);
  
  let count = 0;
  
  for (const videoFile of videoFiles) {
    const scheduledAt = findNextSlot(lastScheduledDate);
    lastScheduledDate = new Date(scheduledAt);
    
    try {
      const { data: pub, error } = await supabase
        .from('publications')
        .insert({
          user_id: USER_ID,
          title: videoFile.replace('.mp4', ''),
          caption: '',
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
      
      console.log(`  ✅ ${count + 1}. ${videoFile}`);
      console.log(`     📅 ${scheduledAt.toLocaleString('pt-BR')}`);
      
      count++;
    } catch (err) {
      console.log(`  ❌ Erro em ${videoFile}: ${err.message}`);
    }
  }
  
  console.log(`\n✅ Completo! ${count} vídeos agendados.`);
  console.log(`\n📝 O SaaS ira gerar os titulos, legendas e hashtags automaticamente.`);
}

importVideos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });