/**
 * ORQUESTRADOR - Coordena todo o pipeline de automação
 */
const path = require('path');
const fs = require('fs-extra');
const cron = require('node-cron');

class Orchestrator {
  constructor(config, watcher, scheduler, supabase) {
    this.config = config;
    this.watcher = watcher;
    this.scheduler = scheduler;
    this.supabase = supabase;
    this.isRunning = false;
    this.cronJobs = [];
  }

  // Iniciar o orchestrador
  async start() {
    console.log('🎯 Starting Marketing Automation Orchestrator...');
    this.isRunning = true;

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
    
    // Parar cron jobs
    this.cronJobs.forEach(job => job.stop());
    
    // Parar watcher
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

    // Executar publicação a cada 5 minutos
    const publishJob = cron.schedule('*/5 * * * *', async () => {
      await this.checkAndPublish();
    });
    this.cronJobs.push(publishJob);

    console.log('⏰ Cron jobs configurados: pipeline (15min), publish (5min)');
  }

  // Executar pipeline completo
  async runPipeline() {
    if (!this.isRunning) return;

    console.log('\n--- PIPELINE EXECUTION ---');
    
    try {
      // 1. Obter fila de vídeos pendentes
      const queueFolder = path.join(this.config.OUTPUT_FOLDER, 'queue');
      await fs.ensureDir(queueFolder);

      const pendingVideos = await this.scheduler.processQueue(queueFolder);
      console.log(`📋 Vídeos pendentes: ${pendingVideos.length}`);

      if (pendingVideos.length === 0) {
        console.log('✅ Nenhum vídeo pendente');
        return;
      }

      // 2. Obter programação existente
      const existingSchedule = await this.supabase.getScheduledVideos();
      console.log(`📅 Já agendados: ${existingSchedule.length}`);

      // 3. Criar nova programação
      const newSchedule = this.scheduler.createSchedule(pendingVideos, existingSchedule);
      console.log(`🆕 Novos agendamentos: ${newSchedule.length}`);

      // 4. Agendar vídeos na plataforma
      for (const video of newSchedule) {
        const result = await this.supabase.scheduleVideo(video);
        if (!result.error && !result.offline) {
          // Marcar como processado no watcher
          await this.watcher.markAsProcessed(video.id);
        }
      }

      // 5. Salvar programação local
      await this.saveSchedule(newSchedule);

      console.log('--- PIPELINE COMPLETO ---\n');
    } catch (error) {
      console.error('❌ Erro no pipeline:', error.message);
    }
  }

  // Verificar e publicar vídeos prontos
  async checkAndPublish() {
    if (!this.isRunning) return;

    try {
      // Obter próximo vídeo para publicar
      const nextVideo = await this.supabase.getNextVideoToPublish();

      if (!nextVideo) {
        return; // Nenhum vídeo pronto para publicar
      }

      console.log(`📤 Publicando: ${nextVideo.filename}`);

      // Aqui entraria a lógica de publicação na plataforma
      // Por enquanto, apenas marca como publicado
      const publishResult = await this.supabase.markAsPublished(nextVideo.id, {
        published: true,
        platform: nextVideo.platform,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Vídeo publicado: ${nextVideo.filename}`);
    } catch (error) {
      console.error('❌ Erro ao publicar:', error.message);
    }
  }

  // Salvar programação localmente
  async saveSchedule(schedule) {
    const scheduleFile = path.join(this.config.OUTPUT_FOLDER, 'schedule.json');
    await fs.ensureDir(path.dirname(scheduleFile));
    await fs.writeJson(scheduleFile, {
      schedule,
      generatedAt: new Date().toISOString()
    }, { spaces: 2 });
  }

  // Obter status do sistema
  async getStatus() {
    const stats = await this.supabase.getStats();
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
      supabaseConnected: this.supabase.isConnected(),
      stats,
      pendingVideos: pendingCount
    };
  }

  // Forçar execução manual do pipeline
  async forceRun() {
    console.log('🔄 Execução forçada iniciada...');
    await this.runPipeline();
  }

  // Forçar verificação de publicação
  async forcePublish() {
    console.log('🔄 Verificação de publicação forçada...');
    await this.checkAndPublish();
  }
}

module.exports = Orchestrator;