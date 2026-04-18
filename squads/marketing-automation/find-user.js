/**
 * Buscar usuário para testar publicação
 */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { createClient } = require('@supabase/supabase-js');

async function findUser() {
  const configPath = path.join(__dirname, 'config', 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile);

  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  
  // Buscar usuários
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, created_at')
    .limit(5);
  
  console.log('Usuários encontrados:');
  if (users) {
    users.forEach(u => console.log(`  ID: ${u.id} | Email: ${u.email}`));
  }
  
  // Também ver publicações existentes para ver que user_id está sendo usado
  const { data: pubs } = await supabase
    .from('publications')
    .select('id, user_id, title')
    .limit(5);
  
  console.log('\nPublicações existentes:');
  if (pubs) {
    pubs.forEach(p => console.log(`  user_id: ${p.user_id} | ${p.title}`));
  }
}

findUser().catch(console.error);