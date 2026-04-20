const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const yaml = require('yaml');

const config = yaml.parse(fs.readFileSync('./config/config.yaml', 'utf8'));
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

async function clearAllScheduledVideos() {
  console.log('🔍 Buscando TODOS os videos agendados...\n');

  const { data: publications, error } = await supabase
    .from('publications')
    .select('id, title, scheduled_for, overall_status, user_id')
    .in('overall_status', ['scheduled', 'pending', 'draft', 'approved'])
    .order('scheduled_for', { ascending: true });

  if (error) {
    console.error('❌ Erro ao buscar:', error.message);
    return;
  }

  if (!publications || publications.length === 0) {
    console.log('✅ Nenhum video agendado encontrado.');
    return;
  }

  console.log(`📋 Encontrados ${publications.length} videos:\n`);
  publications.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title}`);
    console.log(`     Status: ${p.overall_status}`);
    console.log(`     Agendado: ${p.scheduled_for ? new Date(p.scheduled_for).toLocaleString('pt-BR') : 'N/A'}`);
    console.log();
  });

  console.log(`⏳ Excluindo ${publications.length} videos...\n`);

  for (const pub of publications) {
    await supabase.from('publication_targets').delete().eq('publication_id', pub.id);
    await supabase.from('publications').delete().eq('id', pub.id);
    console.log(`  ✅ Excluido: ${pub.title}`);
  }

  console.log(`\n✅ Limpeza completa! ${publications.length} videos removidos.`);
}

clearAllScheduledVideos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });