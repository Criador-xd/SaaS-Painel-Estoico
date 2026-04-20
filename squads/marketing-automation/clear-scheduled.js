const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const yaml = require('yaml');

const configPath = './config/config.yaml';
const configFile = fs.readFileSync(configPath, 'utf8');
const config = yaml.parse(configFile);

const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY
);

async function clearScheduledVideos() {
  console.log('🔍 Buscando vídeos agendados...\n');

  const { data: scheduled, error: fetchError } = await supabase
    .from('publications')
    .select('id, title, scheduled_for, overall_status, created_at')
    .eq('overall_status', 'scheduled')
    .order('scheduled_for', { ascending: true });

  if (fetchError) {
    console.error('❌ Erro ao buscar:', fetchError.message);
    return;
  }

  if (!scheduled || scheduled.length === 0) {
    console.log('✅ Nenhum vídeo agendado encontrado.');
    return;
  }

  console.log(`📋 Encontrados ${scheduled.length} vídeos agendados:\n`);
  scheduled.forEach((v, i) => {
    console.log(`  ${i + 1}. ${v.title}`);
    console.log(`     ID: ${v.id}`);
    console.log(`     Agendado para: ${new Date(v.scheduled_for).toLocaleString('pt-BR')}`);
    console.log();
  });

  console.log(`⏳ Cancelando ${scheduled.length} vídeos agendados...\n`);

  for (const pub of scheduled) {
    const { error: deleteTargetsError } = await supabase
      .from('publication_targets')
      .delete()
      .eq('publication_id', pub.id);

    if (deleteTargetsError) {
      console.warn(`  ⚠️ Erro ao deletar targets para ${pub.title}:`, deleteTargetsError.message);
    }

    const { error: deletePubError } = await supabase
      .from('publications')
      .delete()
      .eq('id', pub.id);

    if (deletePubError) {
      console.error(`  ❌ Erro ao deletar ${pub.title}:`, deletePubError.message);
    } else {
      console.log(`  ✅ Cancelado: ${pub.title}`);
    }
  }

  console.log(`\n✅ Limpeza completa! ${scheduled.length} vídeos cancelados.`);
}

clearScheduledVideos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });