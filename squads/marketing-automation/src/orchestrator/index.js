/**
 * ORQUESTRADOR - Coordena todo o pipeline de automação
 * Workflow: Detectar vídeo → Gerar conteúdo → Criar rascunho → Aprovar → Agendar
 */
const path = require('path');
const fs = require('fs-extra');
const cron = require('node-cron');

class Orchestrator {
  constructor(config, watcher, publisher) {
    this.config = config;
    this.watcher = watcher;
    this.publisher = publisher;
    this.isRunning = false;
    this.cronJobs = [];
  }

  // Iniciar o orchestrador
  async start() {
    console.log('🎯 Starting Marketing Automation Orchestrator...');
    this.isRunning = true;

    // Inicializar publisher
    this.publisher.initialize();

    // Iniciar watcher
    await this.watcher.start();

    // Iniciar agendador de execução periódica
    this.setupCronJobs();

    // Executar pipeline inicial
    await this.runPipeline();

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
            pendingVideos.push(video);
          }
        }
      }

      console.log(`📋 Vídeos pendentes: ${pendingVideos.length}`);

      if (pendingVideos.length === 0) {
        console.log('✅ Nenhum vídeo pendente');
        return;
      }

      // 2. Obter programação existente para evitar conflito de horários
      const existingSchedule = await this.publisher.getExistingSchedule();
      console.log(`📅 Já agendados: ${existingSchedule.length}`);

      // 3. Processar cada vídeo: criar rascunho → aprovar → agendar
      for (const video of pendingVideos.slice(0, 4)) { // Máximo 4 por execução
        console.log(`\n🎬 Processando: ${video.filename}`);
        
        const result = await this.publisher.publishVideo(video, existingSchedule);
        
        if (result.success) {
          console.log(`   ✅ Título: ${result.title}`);
          console.log(`   📅 Agendado: ${new Date(result.scheduledFor).toLocaleString('pt-BR')}`);
          console.log(`   ⏰ Slot: ${result.slotName}`);
          
          // Marcar como processado
          await this.watcher.markAsProcessed(video.id);
          
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