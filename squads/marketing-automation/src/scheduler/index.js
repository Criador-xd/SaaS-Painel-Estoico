/**
 * SCHEDULER - Lógica de priorização e programação
 * 4 publicações por dia: Manhã (10-11), Tarde (12-14), Noite (18-22), Madrugada (2-3)
 */
const path = require('path');
const fs = require('fs-extra');

class Scheduler {
  constructor(config) {
    this.maxPerDay = parseInt(config.MAX_VIDEOS_PER_DAY) || 4;
    this.maxPerWeek = parseInt(config.MAX_VIDEOS_PER_WEEK) || 28;
    this.userId = config.USER_ID || 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
    
    // Slots de publicação (BR - São Paulo)
    this.postSlots = [
      { name: 'Madrugada', start: 2, end: 3 },
      { name: 'Manha', start: 10, end: 11 },
      { name: 'Tarde', start: 12, end: 14 },
      { name: 'Noite', start: 18, end: 22 }
    ];
    
    // Todos os dias da semana
    this.postDays = [0, 1, 2, 3, 4, 5, 6]; // Domingo a Sábado
  }

  // Encontrar próximo slot disponível
  findNextSlot(existingSchedule) {
    const now = new Date();
    // Ajustar para São Paulo (UTC-3)
    const saoPauloTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    
    // Procurar nos próximos 7 dias
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const candidateDate = new Date(saoPauloTime);
      candidateDate.setDate(candidateDate.getDate() + dayOffset);
      candidateDate.setHours(0, 0, 0, 0);
      
      const dayOfWeek = candidateDate.getDay();
      
      // Verificar se é dia de postagem
      if (!this.postDays.includes(dayOfWeek)) continue;
      
      // Verificar cada slot
      for (const slot of this.postSlots) {
        // Para slots com múltiplas horas (Tarde e Noite), escolher hora específica
        const hoursInSlot = [];
        for (let h = slot.start; h <= slot.end; h++) {
          hoursInSlot.push(h);
        }
        
        for (const hour of hoursInSlot) {
          const slotDate = new Date(candidateDate);
          slotDate.setHours(hour, 0, 0, 0);
          
          // Se o slot for no passado hoje, pular
          if (slotDate <= saoPauloTime) continue;
          
          // Verificar se já existe publicação nesse horário
          const isOccupied = existingSchedule.some(s => {
            const sDate = new Date(s.scheduled_for);
            return sDate.getTime() === slotDate.getTime();
          });
          
          if (!isOccupied) {
            return {
              datetime: slotDate,
              slotName: slot.name,
              hour: hour
            };
          }
        }
      }
    }
    
    // Se não encontrar slot, retornar o próximo dia disponível às 10h
    const fallback = new Date(saoPauloTime);
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(10, 0, 0, 0);
    
    return {
      datetime: fallback,
      slotName: 'Manha',
      hour: 10
    };
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

    return videos.sort((a, b) => b.priority - a.priority);
  }

  // Criar programação completa para os vídeos
  createSchedule(videos, existingSchedule = []) {
    const scheduled = [];
    const today = new Date();
    
    // Filtrar schedule existente para próximos 7 dias
    const upcomingSchedule = existingSchedule.filter(s => {
      const d = new Date(s.scheduled_for);
      const diff = 7 * 24 * 60 * 60 * 1000;
      return (today.getTime() - d.getTime()) < diff;
    });

    let count = 0;
    
    for (const video of videos) {
      if (count >= this.maxPerDay) break;
      if (scheduled.length >= this.maxPerWeek) break;

      // Encontrar próximo slot disponível
      const nextSlot = this.findNextSlot([...upcomingSchedule, ...scheduled]);
      
      const scheduledVideo = {
        ...video,
        scheduled_for: nextSlot.datetime.toISOString(),
        platform: 'both', // YouTube + Instagram
        slotName: nextSlot.slotName,
        hour: nextSlot.hour
      };
      
      scheduled.push(scheduledVideo);
      count++;
    }

    return scheduled;
  }

  // Calcular prioridade baseada no vídeo
  calculatePriority(video) {
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    const detectedTime = new Date(video.detectedAt || Date.now()).getTime();
    const daysSince = (now - detectedTime) / msPerDay;
    
    return Math.min(daysSince / 7, 1) * 100;
  }
}

module.exports = Scheduler;