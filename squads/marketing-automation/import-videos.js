const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const configPath = './config/config.yaml';
const config = yaml.parse(fs.readFileSync(configPath, { encoding: 'utf8' }));

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

const WATCH_FOLDER = config.WATCH_FOLDER;
const OUTPUT_FOLDER = config.OUTPUT_FOLDER;
const USER_ID = config.USER_ID;

function generateId() {
  return 'vid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function getMetadata(videoName) {
  const baseName = videoName.replace('.mp4', '');
  
  const files = fs.readdirSync(WATCH_FOLDER);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const jsonPath = path.join(WATCH_FOLDER, file);
      const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      const jsonBaseName = file.replace('.json', '').replace(/^\d+-/, '');
      
      if (baseName.toLowerCase().includes(jsonBaseName.toLowerCase()) ||
          jsonBaseName.toLowerCase().includes(baseName.toLowerCase().split(' ')[0])) {
        return metadata;
      }
    }
  }
  
  return null;
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
  
  let lastScheduledDate = null;
  
  const { data: existing } = await supabase
    .from('publications')
    .select('scheduled_for')
    .eq('overall_status', 'scheduled')
    .order('scheduled_for', { ascending: false })
    .limit(1);
  
  if (existing && existing.length > 0) {
    lastScheduledDate = new Date(existing[0].scheduled_for);
  }
  
  console.log(`⏳ Importando e agendando ${videoFiles.length} vídeos...\n`);
  
  let count = 0;
  
  for (const videoFile of videoFiles) {
    const metadata = await getMetadata(videoFile);
    
    const scheduledAt = findNextSlot(lastScheduledDate);
    lastScheduledDate = new Date(scheduledAt);
    
    let title = metadata?.title || videoFile.replace('.mp4', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let caption = metadata?.caption || '';
    
    const hashtags = metadata?.hashtags || '';
    if (hashtags && caption && !caption.includes(hashtags)) {
      caption = caption + '\n\n' + hashtags;
    }
    
    try {
      const { data: pub, error } = await supabase
        .from('publications')
        .insert({
          user_id: USER_ID,
          title: title,
          caption: caption || title,
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
      console.log(`     Agendado: ${scheduledAt.toLocaleString('pt-BR')}`);
      
      count++;
    } catch (err) {
      console.log(`  ❌ Erro: ${err.message}`);
    }
  }
  
  console.log(`\n✅ Importação completa! ${count} vídeos agendados.`);
}

importVideos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });