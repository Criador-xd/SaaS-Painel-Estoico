/**
 * Verificar o que foi salvo no Supabase
 */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { createClient } = require('@supabase/supabase-js');

async function checkSupabase() {
  const configPath = path.join(__dirname, 'config', 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile);

  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  
  console.log('🔍 Verificando tabelas...\n');
  
  // Ver publications
  const { data: pubs, error: errPubs } = await supabase
    .from('publications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  console.log('Tabela publications:', pubs?.length || 0, 'registros');
  if (pubs?.length) {
    console.log('Últimos registros:');
    pubs.forEach(p => console.log(`  - ${p.title} | ${p.overall_status} | ${p.scheduled_for}`));
  }
  
  console.log('\n');
  
  // Ver publication_targets
  const { data: targets, error: errTargets } = await supabase
    .from('publication_targets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  console.log('Tabela publication_targets:', targets?.length || 0, 'registros');
  
  // Verificar outras tabelas
  console.log('\n📋 Outras tabelas disponíveis:');
  const tables = ['videos', 'posts', 'schedules', 'contents'];
  for (const table of tables) {
    try {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      console.log(`  - ${table}: ${count || 0} registros`);
    } catch(e) {
      console.log(`  - ${table}: não existe`);
    }
  }
}

checkSupabase().catch(console.error);