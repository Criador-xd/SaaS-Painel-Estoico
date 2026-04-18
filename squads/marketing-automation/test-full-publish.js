/**
 * Teste completo do sistema de publicação
 */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');
const Publisher = require('./src/publisher');

async function testPublish() {
  // Carregar config
  const configPath = path.join(__dirname, 'config', 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile);
  
  console.log('🧪 Testando Publisher...\n');
  
  const publisher = new Publisher(config);
  publisher.initialize();
  
  // Vídeo de teste
  const testVideo = {
    id: 'test-001',
    filename: '7.mp4',
    path: 'D:\\Videos Prontos projeto 2- ja postado\\7.mp4',
    detectedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  // Obter schedule existente
  const existingSchedule = await publisher.getExistingSchedule();
  console.log(`📅 Schedule existente: ${existingSchedule.length} publicações\n`);
  
  // Testar pipeline completo
  const result = await publisher.publishVideo(testVideo, existingSchedule);
  
  if (result.success) {
    console.log('\n✅ RESULTADO DO TESTE:');
    console.log(`   📋 ID: ${result.publicationId}`);
    console.log(`   📝 Título: ${result.title}`);
    console.log(`   📅 Agendado: ${new Date(result.scheduledFor).toLocaleString('pt-BR')}`);
    console.log(`   ⏰ Slot: ${result.slotName}`);
  } else {
    console.log('\n❌ ERRO NO TESTE:');
    console.log(`   Stage: ${result.stage}`);
    console.log(`   Error: ${result.error}`);
  }
}

testPublish().catch(console.error);