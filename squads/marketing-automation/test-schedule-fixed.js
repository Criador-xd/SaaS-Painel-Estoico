/**
 * Script de teste - Agendar vídeo no Supabase (COM USER_ID CORRETO)
 */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { createClient } = require('@supabase/supabase-js');

async function testSchedule() {
  const configPath = path.join(__dirname, 'config', 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile);

  console.log('📡 Conectando ao Supabase...');
  
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  
  // USER_ID CORRETO DO SEU SAAS
  const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
  
  // Teste: Criar agendamento para 25/04/2026 03:00
  const scheduledDate = new Date('2026-04-25T03:00:00');
  
  console.log(`📅 Agendando para: ${scheduledDate.toLocaleString('pt-BR')}`);
  console.log(`👤 User ID: ${userId}`);
  
  const { data, error } = await supabase
    .from('publications')
    .insert({
      user_id: userId,
      title: 'TESTE AUTOMACAO - Video Automacao',
      caption: 'Agendado via Marketing Automation - TESTE',
      scheduled_for: scheduledDate.toISOString(),
      overall_status: 'pendente'
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao agendar:', error.message);
    return;
  }

  console.log('✅ Agendamento criado!');
  console.log('ID:', data.id);
  console.log('Título:', data.title);
  console.log('Agendado para:', data.scheduled_for);
  console.log('Status:', data.overall_status);
  
  // Criar targets
  await supabase.from('publication_targets').insert([
    { publication_id: data.id, platform: 'youtube', status: 'pendente', privacy_status: 'public' },
    { publication_id: data.id, platform: 'instagram', status: 'pendente', privacy_status: 'public' }
  ]);
  
  console.log('✅ Targets criados para YouTube e Instagram');
  console.log('\n🎯 Agora vá no seu SaaS e atualize a página de Histórico de Publicações!');
}

testSchedule().catch(console.error);