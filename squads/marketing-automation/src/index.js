/**
 * MARKETING AUTOMATION - Ponto de entrada principal
 * Sistema autônomo de marketing para YouTube e Instagram
 * 
 * Workflow:
 * 1. Detectar vídeo novo na pasta
 * 2. Gerar conteúdo (título, legendas, hashtags, CTA)
 * 3. Criar rascunho no Supabase
 * 4. Aprovar publicação
 * 5. Agendar para próximo slot (10-11h, 12-14h, 18-22h, 2-3h)
 */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');

// Carregar configuração
const configPath = path.join(__dirname, '..', 'config', 'config.yaml');
let config = {};

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = yaml.parse(configFile);
  console.log('📄 Configuração carregada');
} catch (error) {
  console.error('❌ Erro ao carregar config:', error.message);
}

// Importar módulos
const VideoWatcher = require('./watcher');
const Publisher = require('./publisher');
const Orchestrator = require('./orchestrator');
const SupabaseClient = require('./supabase');
const { server: dashboardServer, addLog } = require('./server');

// Inicializar componentes
const watcher = new VideoWatcher({
  WATCH_FOLDER: config.WATCH_FOLDER || 'D:\\Videos Prontos projeto 2- ja postado',
  OUTPUT_FOLDER: config.OUTPUT_FOLDER || path.join(__dirname, '..', '_output')
});

const publisher = new Publisher(config);

const supabase = new SupabaseClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

const orchestrator = new Orchestrator(config, watcher, publisher, supabase);

// Função principal
async function main() {
  console.log('\n========================================');
  console.log('🎬 MARKETING AUTOMATION SYSTEM');
  console.log('========================================\n');
  
  console.log('📋 Regras de Publicação:');
  console.log('   • 4 publicações por dia');
  console.log('   • Manhã: 10h - 11h');
  console.log('   • Tarde: 12h - 14h');
  console.log('   • Noite: 18h - 22h');
  console.log('   • Madrugada: 2h - 3h');
  console.log('   • Conteúdo: YouTube + Instagram\n');

  // Iniciar orchestrador
  await orchestrator.start();

  // Mostrar status
  const status = await orchestrator.getStatus();
  console.log('\n📊 STATUS DO SISTEMA:');
  console.log(`   • Executando: ${status.running ? '✅ Sim' : '❌ Não'}`);
  console.log(`   • Vídeos pendentes: ${status.pendingVideos}`);

  console.log('\n🌐 Dashboard: http://localhost:3000');
  console.log('🚀 Abrindo dashboard automaticamente...');

  // Abrir dashboard automaticamente no navegador padrão
  const { exec } = require('child_process');
  exec('start http://localhost:3000', (error) => {
    if (error) {
      console.log('⚠️  Não foi possível abrir o dashboard automaticamente');
      console.log('    Acesse manualmente: http://localhost:3000');
    } else {
      console.log('✅ Dashboard aberto com sucesso!');
    }
  });

  console.log('⏰ Sistema rodando... Pressione Ctrl+C para parar.');

  addLog('Sistema iniciado');
}

// Tratamento de encerramento gracioso
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Encerrando sistema...');
  await orchestrator.stop();
  dashboardServer.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Encerrando sistema...');
  await orchestrator.stop();
  dashboardServer.close();
  process.exit(0);
});

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});