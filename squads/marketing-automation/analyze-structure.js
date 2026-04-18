/**
 * Analisar estrutura das tabelas de publicação
 */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { createClient } = require('@supabase/supabase-js');

async function analyzeStructure() {
  const configPath = path.join(__dirname, 'config', 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile);

  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  
  // Ver estrutura da tabela publications
  console.log('=== ESTRUTURA DA TABELA PUBLICATIONS ===\n');
  
  // Buscar uma publicação para ver os campos
  const { data: pub } = await supabase
    .from('publications')
    .select('*')
    .limit(1)
    .single();
  
  if (pub) {
    console.log('Campos existentes em publications:');
    Object.keys(pub).forEach(key => {
      console.log(`  - ${key}: ${typeof pub[key]} = ${JSON.stringify(pub[key]).substring(0, 50)}`);
    });
  }
  
  console.log('\n=== CAMPOS POSSÍVEIS PARA PUBLICAÇÃO ===');
  console.log(`
  title - Título interno
  caption - Legenda principal
  description - Descrição (pode ser para YouTube)
  hashtags - Hashtags
  cta - Call to Action
  
  instagram_caption - Legenda para Instagram
  youtube_title - Título para YouTube
  youtube_description - Descrição para YouTube
  
  overall_status - Status (rascunho, pendente, agendado, publicado)
  `);
  
  // Ver tabela publication_targets
  console.log('\n=== ESTRUTURA DA TABELA PUBLICATION_TARGETS ===\n');
  const { data: target } = await supabase
    .from('publication_targets')
    .select('*')
    .limit(1)
    .single();
  
  if (target) {
    console.log('Campos em publication_targets:');
    Object.keys(target).forEach(key => {
      console.log(`  - ${key}: ${typeof target[key]}`);
    });
  }
}

analyzeStructure().catch(console.error);