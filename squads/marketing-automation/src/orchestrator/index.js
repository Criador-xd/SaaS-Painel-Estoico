/**
 * ORQUESTRADOR - Coordena todo o pipeline de automação
 * Workflow: Detectar vídeo → Gerar conteúdo → Criar rascunho → Aprovar → Agendar
 * 
 * EQUIPE DE AGENTES:
 * - 🧠 DONO (Boss): Lucas - O chefão que recebe os relatórios
 * - 🎬 Analista de Conteúdo: MARINA - Classifica vídeos
 * - 📋 Gerente de Fila: RODRIGO - Gerencia prioridade
 * - 📅 Especialista em Programação: BRUNO - Define horários
 * - 📱 Estrategista de Plataforma: CAROL - Adapta para cada plataforma
 * - 📆 Coordenador de Calendário: PEDRO - Consolida calendário
 * - 🔍 Guardião de Qualidade: LUANA - Valida publicações
 * - 📊 Analista de Performance: GUSTAVO - Monitora resultados
 */
const path = require('path');
const fs = require('fs-extra');
const cron = require('node-cron');

// Agentes nomeados
const AGENTS = {
  BOSS: { name: 'Lucas', role: 'DONO', emoji: '👑' },
  ANALISTA: { name: 'Marina', role: 'Analista de Conteúdo', emoji: '🎬' },
  GERENTE: { name: 'Rodrigo', role: 'Gerente de Fila', emoji: '📋' },
  ESPECIALISTA: { name: 'Bruno', role: 'Especialista em Programação', emoji: '📅' },
  ESTRATEGISTA: { name: 'Carol', role: 'Estrategista de Plataforma', emoji: '📱' },
  COORDENADOR: { name: 'Pedro', role: 'Coordenador de Calendário', emoji: '📆' },
  GUARDIAO: { name: 'Luana', role: 'Guardião de Qualidade', emoji: '🔍' },
  ANALISTA_PERF: { name: 'Gustavo', role: 'Analista de Performance', emoji: '📊' }
};

class Orchestrator {
  constructor(config, watcher, publisher, supabase) {
    this.config = config;
    this.watcher = watcher;
    this.publisher = publisher;
    this.supabase = supabase;
    this.isRunning = false;
    this.cronJobs = [];
  }

  // Reportar ao boss (Lucas)
  reportToBoss(message, agent = null) {
    if (agent) {
      console.log(`\n${agent.emoji} ${agent.name} (${agent.role}) → 👑 Lucas: ${message}`);
    } else {
      console.log(`\n👑 DONO LUCAS: ${message}`);
    }
  }

  // Iniciar o orchestrador
  async start() {
    console.log('\n========================================');
    console.log('🎯 EQUIPE DE MARKETING AUTOMATION');
    console.log('========================================');
    console.log(`${AGENTS.BOSS.emoji} Chefe: ${AGENTS.BOSS.name}`);
    console.log(`${AGENTS.ESPECIALISTA.emoji} ${AGENTS.ESPECIALISTA.name} - ${AGENTS.ESPECIALISTA.role}`);
    console.log(`${AGENTS.GUARDIAO.emoji} ${AGENTS.GUARDIAO.name} - ${AGENTS.GUARDIAO.role}`);
    console.log('========================================\n');

    this.isRunning = true;

    // Inicializar publisher
    this.publisher.initialize();

    // Iniciar watcher
    await this.watcher.start();

    // Iniciar agendador de execução periódica
    this.setupCronJobs();

    // Executar pipeline inicial
    await this.runPipeline();

    this.reportToBoss('Sistema iniciado e rodando! ✅');
    console.log('✅ Orchestrator iniciado e rodando');
  }

  // Parar o orchestrador
  async stop() {
    console.log('🛑 Parando orchestrator...');
    this.isRunning = false;
    
    this.cronJobs.forEach(job => job.stop());
    await this.watcher.stop();
    
    console.log('✅ Orchestrator parado');
  }

  // Configurar jobs cron
  setupCronJobs() {
    // Executar pipeline a cada 15 minutos
    const pipelineJob = cron.schedule('*/15 * * * *', async () => {
      console.log('\n⏰ Executando pipeline programado...');
      await this.runPipeline();
    });
    this.cronJobs.push(pipelineJob);

    console.log('⏰ Cron jobs configurados: pipeline (15min)');
  }

  // Executar pipeline completo
  async runPipeline() {
    if (!this.isRunning) return;

    console.log('\n--- PIPELINE EXECUTION ---');
    
    try {
      // 1. Obter fila de vídeos pendentes
      const queueFolder = path.join(this.config.OUTPUT_FOLDER, 'queue');
      await fs.ensureDir(queueFolder);

      const queueFiles = await fs.readdir(queueFolder).catch(() => []);
      const pendingVideos = [];

      for (const file of queueFiles) {
        if (file.endsWith('.json')) {
          const video = await fs.readJson(path.join(queueFolder, file));
          if (video.status === 'pending') {
            video.filepath = video.filepath || path.join(config.WATCH_FOLDER, video.filename);
            pendingVideos.push(video);
          }
        }
      }

      console.log(`📋 Vídeos pendentes: ${pendingVideos.length}`);

      if (pendingVideos.length === 0) {
        console.log('✅ Nenhum vídeo pendente');
        return;
      }

// 2. Obter programming existente para evitar conflito de horários
      const existingSchedule = await this.publisher.getExistingSchedule();
      console.log(`📅 Já agendados: ${existingSchedule.length}`);

      // 3. Buscar a data do último vídeo publicado para continuar a partir dele
      let lastPublishedDate = null;
      if (this.supabase && this.supabase.getLastPublishedDate) {
        lastPublishedDate = await this.supabase.getLastPublishedDate();
        if (lastPublishedDate) {
          console.log(`📅 Último vídeo publicado: ${lastPublishedDate.toLocaleString('pt-BR')}`);
          this.reportToBoss(`Último vídeo encontrado no banco: ${lastPublishedDate.toLocaleDateString('pt-BR')}`, AGENTS.ESPECIALISTA);
        }
      }

      // 4. Processar cada vídeo: criar rascunho → aprovar → agendar
      for (const video of pendingVideos.slice(0, 4)) { // Máximo 4 por execução
        console.log(`\n🎬 ${AGENTS.ANALISTA.emoji} ${AGENTS.ANALISTA.name} processando: ${video.filename}`);
        
        const result = await this.publisher.publishVideo(video, existingSchedule, lastPublishedDate);
        
        if (result.success) {
          console.log(`   ${AGENTS.GUARDIAO.emoji} ${AGENTS.GUARDIAO.name} aprovou: ${result.title}`);
          console.log(`   📅 Agendado: ${new Date(result.scheduledFor).toLocaleString('pt-BR')}`);
          console.log(`   ⏰ Slot: ${result.slotName}`);
          
          // Reportar ao boss
          this.reportToBoss(`Novo vídeo agendado!\n   📺 Título: ${result.title}\n   📅 Data: ${new Date(result.scheduledFor).toLocaleString('pt-BR')}\n   ⏰ Horário: ${result.slotName}`, AGENTS.ESPECIALISTA);
          
          // Marcar como processado
          await this.watcher.markAsProcessed(video.id);
          
          // Atualizar lastPublishedDate para o próximo vídeo
          lastPublishedDate = new Date(result.scheduledFor);
          
          // Adicionar ao schedule existente para evitar conflito
          existingSchedule.push({
            scheduled_for: result.scheduledFor
          });
        } else {
          console.error(`   ❌ Erro em ${result.stage}: ${result.error}`);
        }
      }

      console.log('\n--- PIPELINE COMPLETO ---\n');
    } catch (error) {
      console.error('❌ Erro no pipeline:', error.message);
    }
  }

  // Obter status do sistema
  async getStatus() {
    const queueFolder = path.join(this.config.OUTPUT_FOLDER, 'queue');
    
    let pendingCount = 0;
    try {
      const files = await fs.readdir(queueFolder);
      pendingCount = files.filter(f => f.endsWith('.json')).length;
    } catch (e) {
      pendingCount = 0;
    }

    return {
      running: this.isRunning,
      pendingVideos: pendingCount
    };
  }

  // Forçar execução manual do pipeline
  async forceRun() {
    console.log('🔄 Execução forçada iniciada...');
    await this.runPipeline();
  }
}

module.exports = Orchestrator;