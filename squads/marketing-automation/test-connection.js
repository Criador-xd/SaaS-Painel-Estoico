/**
 * Teste com configuração carregada do YAML
 */
const fs = require('fs');
const yaml = require('yaml');
const { createClient } = require('@supabase/supabase-js');

const config = yaml.parse(fs.readFileSync('./config/config.yaml', 'utf8'));

console.log('Config loaded:');
console.log('URL:', config.SUPABASE_URL);
console.log('Key (first 50):', config.SUPABASE_SERVICE_KEY?.substring(0, 50));
console.log('Key length:', config.SUPABASE_SERVICE_KEY?.length);

async function test() {
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  
  console.log('\n🔗 Testando conexão...');
  
  const { data, error } = await supabase
    .from('publications')
    .select('id')
    .limit(1);

  if (error) {
    console.log('❌ Erro:', error.message);
  } else {
    console.log('✅ Conexão OK!');
  }
}

test();