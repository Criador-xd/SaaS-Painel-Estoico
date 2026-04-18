/**
 * MARKETING AUTOMATION - Ponto de entrada principal
 * Sistema autônomo de marketing para YouTube e Instagram
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
  console.log('Usando configuração padrão...');
}

// Importar módulos
const VideoWatcher = require('./watcher');
const Scheduler = require('./scheduler');
const SupabaseClient = require('./supabase');
const Orchestrator = require('./orchestrator');
const { server: dashboardServer, addLog } = require('./server');

// Inicializar componentes
const watcher = new VideoWatcher({
  WATCH_FOLDER: config.WATCH_FOLDER || 'D:\\Videos Prontos projeto 2- ja postado',
  OUTPUT_FOLDER: config.OUTPUT_FOLDER || path.join(__dirname, '..', '_output')
});

const scheduler = new Scheduler(config);

const supabase = new SupabaseClient(
  config.SUPABASE_URL || 'https://wjzxntgpuimiubrnqfnz.supabase.co',
  config.SUPABASE_SERVICE_KEY || 'your_service_role_key_here'
);

const orchestrator = new Orchestrator(config, watcher, scheduler, supabase);

// Interceptar logs do orchestrator
const originalRunPipeline = orchestrator.runPipeline.bind(orchestrator);
orchestrator.runPipeline = async function() {
  addLog('Pipeline executado');
  return originalRunPipeline();
};

// Função principal
async function main() {
  console.log('\n========================================');
  console.log('🎬 MARKETING AUTOMATION SYSTEM');
  console.log('========================================\n');

  // Inicializar Supabase
  supabase.initialize();
  if (!supabase.isConnected()) {
    addLog('Supabase não configurado - modo offline');
  }

  // Iniciar orchestrador
  await orchestrator.start();

  // Mostrar status
  const status = await orchestrator.getStatus();
  console.log('\n📊 STATUS DO SISTEMA:');
  console.log(`   • Executando: ${status.running ? '✅ Sim' : '❌ Não'}`);
  console.log(`   • Supabase: ${status.supabaseConnected ? '✅ Conectado' : '⚠️ Não configurado'}`);
  console.log(`   • Vídeos pendentes: ${status.pendingVideos}`);
  console.log(`   • Agendados: ${status.stats?.scheduled || 0}`);
  console.log(`   • Publicados: ${status.stats?.published || 0}`);

  console.log('\n🌐 Dashboard: http://localhost:3000');
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