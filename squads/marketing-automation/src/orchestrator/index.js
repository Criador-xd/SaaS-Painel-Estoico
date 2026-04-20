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
    console.log('\n');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║        📋 EQUIPE DE MARKETING - OPEN SQUAD         ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║ ${AGENTS.BOSS.emoji} DONO:        ${AGENTS.BOSS.name}                       ║`);
    console.log(`║ ${AGENTS.ANALISTA.emoji} ANALISTA:   ${AGENTS.ANALISTA.name}                       ║`);
    console.log(`║ ${AGENTS.GERENTE.emoji} GERENTE:    ${AGENTS.GERENTE.name}                       ║`);
    console.log(`║ ${AGENTS.ESPECIALISTA.emoji} PROGRAMA:  ${AGENTS.ESPECIALISTA.name}                       ║`);
    console.log(`║ ${AGENTS.GUARDIAO.emoji} GUARDIÃO:  ${AGENTS.GUARDIAO.name}                       ║`);
    console.log('╚════════════════════════════════════════════════╝\n');

    this.isRunning = true;

    // Inicializar publisher
    this.publisher.initialize();

    // Iniciar watcher
    await this.watcher.start();

    // Iniciar agendador de execução periódica
    this.setupCronJobs();

    // Executar pipeline inicial
    await this.runPipeline();

    this.reportToBoss('Sistema iniciado e rodando! ✅', AGENTS.ESPECIALISTA);
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

// 3. Buscar a data do último VÍDEO AGENDADO no banco
      let lastScheduledDate = null;
      if (this.supabase && this.supabase.getLastScheduledDate) {
        lastScheduledDate = await this.supabase.getLastScheduledDate();
        if (lastScheduledDate) {
          console.log(`📅 Último vídeo agendado: ${lastScheduledDate.toLocaleString('pt-BR')}`);
          this.reportToBoss(`Último agendamento encontrado: ${lastScheduledDate.toLocaleDateString('pt-BR')} às ${lastScheduledDate.getHours()}h`, AGENTS.ESPECIALISTA);
        } else {
          console.log(`📅 Nenhum vídeo agendado - iniciando a partir de agora`);
        }
      }

      // 4. Processar cada vídeo: criar rascunho → aprobar → agendar
      for (const video of pendingVideos) { // Processar todos os vídeos pendentes
        console.log(`\n┌────────────────────────────────────────────`);
        console.log(`│ ${AGENTS.ANALISTA.emoji} ${AGENTS.ANALISTA.name} pegou vídeo: ${video.filename}`);
        console.log(`└────────────────────────────────────────────`);
        
        const result = await this.publisher.publishVideo(video, existingSchedule, lastScheduledDate);
        
        if (result.success) {
          // Agente de conteúdo delivers
          console.log(`   ${AGENTS.ANALISTA.emoji} ${AGENTS.ANALISTA.name} →Gerou conteúdo`);
          console.log(`      📺 Título: "${result.title}"`);
          console.log(`      🏷️ Hashtags geradas`);
          
          // Guardião aprova
          console.log(`   ${AGENTS.GUARDIAO.emoji} ${AGENTS.GUARDIAO.name} →Revisou e aprovou`);
          
          // Especialista agenda
          console.log(`   ${AGENTS.ESPECIALISTA.emoji} ${AGENTS.ESPECIALISTA.name} →Agendou`);
          console.log(`      📅 Data: ${new Date(result.scheduledFor).toLocaleString('pt-BR')}`);
          console.log(`      ⏰ Horário: ${result.slotName}`);
          
          // Reportar ao boss (entrega na mesa)
          console.log(`\n   ╔══════════════════════════════════════════╗`);
          console.log(`   ║ 📬 ENTREGA NA MESA DO BOSS ${AGENTS.BOSS.name}        ║`);
          console.log(`   ╠══════════════════════════════════════════╣`);
          console.log(`   ║ 📺 Título: ${result.title.substring(0, 30)}... ║`);
          console.log(`   ║ 📅-Agende: ${new Date(result.scheduledFor).toLocaleDateString('pt-BR')}        ║`);
          console.log(`   ║ ⏰-Slot: ${result.slotName}                   ║`);
          console.log(`   ║ 📁 Vídeo: ${video.filename.substring(0, 20)}...     ║`);
          console.log(`   ╚══════════════════════════════════════════╝\n`);
          
          // Marcar como processado
          await this.watcher.markAsProcessed(video.id);
          
          // Atualizar lastScheduledDate para o próximo vídeo
          lastScheduledDate = new Date(result.scheduledFor);
          
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
      for (const file of files) {
        if (file.endsWith('.json')) {
          const video = await fs.readJson(path.join(queueFolder, file));
          if (video.status === 'pending') {
            pendingCount++;
          }
        }
      }
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