/**
 * SCHEDULER - Lógica de priorização e programação
 */
const path = require('path');
const fs = require('fs-extra');

class Scheduler {
  constructor(config) {
    this.maxPerDay = parseInt(config.MAX_VIDEOS_PER_DAY) || 4;
    this.maxPerWeek = parseInt(config.MAX_VIDEOS_PER_WEEK) || 28;
    this.minHoursBetween = parseInt(config.MIN_HOURS_BETWEEN_POSTS) || 4;
  }

  // Processar fila de vídeos
  async processQueue(queueFolder) {
    const queueFiles = await fs.readdir(queueFolder).catch(() => []);
    const videos = [];

    for (const file of queueFiles) {
      if (file.endsWith('.json')) {
        const video = await fs.readJson(path.join(queueFolder, file));
        if (video.status === 'pending') {
          videos.push(video);
        }
      }
    }

    // Classificar vídeos
    const classified = this.classifyVideos(videos);
    
    // Calcular prioridade
    const prioritized = this.calculatePriority(classified);

    return prioritized;
  }

  // Classificar vídeos por categoria
  classifyVideos(videos) {
    // Por simplicidade, classifica por número do arquivo
    // Em produção, usaria análise de conteúdo ou metadados
    const categories = {
      viral: [71, 72, 73, 74, 75],
      tutorial: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
      motivational: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      educational: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      behindScenes: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
    };

    return videos.map(video => {
      const num = parseInt(video.filename.replace(/\D/g, '')) || 0;
      let category = 'educational';
      let score = 0.5;

      for (const [cat, nums] of Object.entries(categories)) {
        if (nums.includes(num)) {
          category = cat;
          break;
        }
      }

      // Score base por categoria
      switch (category) {
        case 'viral':
          score = 0.95;
          break;
        case 'tutorial':
          score = 0.75;
          break;
        case 'motivational':
          score = 0.68;
          break;
        case 'educational':
          score = 0.6;
          break;
        case 'behindScenes':
          score = 0.4;
          break;
      }

      return { ...video, category, baseScore: score };
    });
  }

  // Calcular prioridade final
  calculatePriority(videos) {
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;

    return videos.map(video => {
      // Urgência: dias desde detecção
      const detectedTime = new Date(video.detectedAt).getTime();
      const daysSince = (now - detectedTime) / msPerDay;
      const urgency = Math.min(daysSince / 7, 1); // Normaliza para 7 dias

      // Qualidade (por enquanto fixa)
      const quality = 0.8;

      // Relevância
      const relevance = video.baseScore;

      // Novidade
      const novelty = 1 - (urgency * 0.3);

      // Score final
      const finalScore = (
        urgency * 0.3 +
        quality * 0.3 +
        relevance * 0.25 +
        novelty * 0.15
      );

      return {
        ...video,
        priority: Math.round(finalScore * 100),
        urgency,
        quality,
        relevance,
        novelty
      };
    }).sort((a, b) => b.priority - a.priority);
  }

  // Definir horário de publicação
  scheduleVideo(video, existingSchedule, platform) {
    const platformConfig = platform === 'youtube' 
      ? { hours: [18, 19, 20, 21], days: [2, 3, 4, 5, 6] } // terca-sabado
      : { hours: [12, 13, 14, 19, 20, 21], days: [2, 3, 4, 5, 6, 0] }; // terca-domingo

    // Encontrar próximo slot disponível
    const now = new Date();
    let candidateDate = new Date(now);

    for (let i = 0; i < 14; i++) { // Procurar nos próximos 14 dias
      const dayOfWeek = candidateDate.getDay();
      
      if (platformConfig.days.includes(dayOfWeek)) {
        for (const hour of platformConfig.hours) {
          candidateDate.setHours(hour, 0, 0, 0);
          
          // Verificar se slot está livre
          const isFree = !existingSchedule.some(s => {
            const sDate = new Date(s.scheduledAt);
            return sDate.getTime() === candidateDate.getTime();
          });

          // Verificar espaçamento mínimo
          const hasSpacing = !existingSchedule.some(s => {
            const sDate = new Date(s.scheduledAt);
            const diff = Math.abs(candidateDate.getTime() - sDate.getTime());
            return diff < (this.minHoursBetween * 60 * 60 * 1000);
          });

          if (isFree && hasSpacing) {
            return {
              ...video,
              scheduledAt: candidateDate.toISOString(),
              platform,
              scheduleReason: `Slot disponível: ${candidateDate.toLocaleString('pt-BR')}`
            };
          }
        }
      }
      
      candidateDate.setDate(candidateDate.getDate() + 1);
      candidateDate.setHours(0, 0, 0, 0);
    }

    // Se não encontrar slot, agendar para o próximo dia disponível
    candidateDate.setDate(candidateDate.getDate() + 1);
    candidateDate.setHours(platformConfig.hours[0], 0, 0, 0);
    
    return {
      ...video,
      scheduledAt: candidateDate.toISOString(),
      platform,
      scheduleReason: `Slot alternativo: ${candidateDate.toLocaleString('pt-BR')}`
    };
  }

  // Criar programação completa
  createSchedule(prioritizedVideos, existingSchedule = []) {
    const scheduled = [];
    const today = new Date();
    const videosThisWeek = existingSchedule.filter(s => {
      const d = new Date(s.scheduledAt);
      const diff = today - d;
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;

    let count = 0;
    
    for (const video of prioritizedVideos) {
      if (count >= this.maxPerDay) break;
      if (videosThisWeek + scheduled.length >= this.maxPerWeek) break;

      // Alternar entre YouTube e Instagram
      const platform = scheduled.length % 2 === 0 ? 'youtube' : 'instagram';
      const scheduledVideo = this.scheduleVideo(video, [...existingSchedule, ...scheduled], platform);
      
      scheduled.push(scheduledVideo);
      count++;
    }

    return scheduled;
  }
}

module.exports = Scheduler;