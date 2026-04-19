/**
 * SCHEDULER - Lógica de priorização e programação
 * Slots: 10h (Manhã), 14h (Tarde), 22h (Noite), 3h (Madrugada próximo dia)
 * Sequência: 10h → 14h → 22h → 3h(dia seguinte) → 10h → ...
 * Regra: Usar o último scheduled_for do banco como referência
 */
const path = require('path');
const fs = require('fs-extra');

class Scheduler {
  constructor(config) {
    this.maxPerDay = parseInt(config.MAX_VIDEOS_PER_DAY) || 4;
    this.maxPerWeek = parseInt(config.MAX_VIDEOS_PER_WEEK) || 28;
    this.userId = config.USER_ID || 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';
    
    // Slots de publicação (BR - São Paulo) - ordem sequencial
    // 10h → 14h → 22h → 3h (próximo dia) → 10h → ...
    this.postSlots = [
      { name: 'Manha', hour: 10 },
      { name: 'Tarde', hour: 14 },
      { name: 'Noite', hour: 22 },
      { name: 'Madrugada', hour: 3 }
    ];
    
    // Todos os dias da semana
    this.postDays = [0, 1, 2, 3, 4, 5, 6]; // Domingo a Sábado
  }

  // Encontrar próximo slot após o último agendamento
  findNextSlot(lastScheduledDate, existingSchedule = []) {
    // O banco já armazena em UTC-3 (São Paulo), não precisa converter
    const now = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));

    // Se não tem último agendamento, usar data atual
    let baseDate = lastScheduledDate ? new Date(lastScheduledDate) : new Date(now);
    
    // Se a base for no passado, usar agora
    if (baseDate < now) {
      baseDate = new Date(now);
    }

    // Determinar o próximo slot baseado no último horário
    let nextSlotIndex = 0;
    let dayOffset = 0;
    
    if (lastScheduledDate) {
      const lastHour = baseDate.getHours();
      
      // Se último foi 22h ou mais, próximo é 3h (índice 3)
      if (lastHour >= 22) {
        nextSlotIndex = 3; // Madrugada (3h) - Próximo after 22h
        dayOffset = 1;
      } 
      // Se último foi 14h ou mais, próximo é 22h (índice 2)
      else if (lastHour >= 14) {
        nextSlotIndex = 2; // Noite (22h) - Próximo after 14h
        dayOffset = 0;
      }
      // Se último foi 10h ou mais, próximo é 14h (índice 1)
      else if (lastHour >= 10) {
        nextSlotIndex = 1; // Tarde (14h) - Próximo after 10h
        dayOffset = 0;
      }
      // Se último foi antes das 10h, próximo é 10h (índice 0)
      else {
        nextSlotIndex = 0; // Manhã (10h)
        dayOffset = 0;
      }
    }

    // Procurar próximo slot livre nos próximos dias
    for (let attempt = 0; attempt < 14; attempt++) {
      const candidateDate = new Date(baseDate);
      candidateDate.setDate(candidateDate.getDate() + dayOffset + attempt);
      
      const dayOfWeek = candidateDate.getDay();
      if (!this.postDays.includes(dayOfWeek)) continue;

      // Tentar cada slot a partir do índice determinado
      for (let i = 0; i < this.postSlots.length; i++) {
        const slotIndex = (nextSlotIndex + i) % this.postSlots.length;
        const slot = this.postSlots[slotIndex];
        
        // Se é madrugada (3h), sempre próxima data
        const currentDayOffset = (slot.hour < 10 && slotIndex === 3) ? 1 : 0;
        
        const slotDate = new Date(candidateDate);
        slotDate.setDate(slotDate.getDate() + currentDayOffset);
        slotDate.setHours(slot.hour, 0, 0, 0);
        
        // Se o slot for no passado, pular
        if (slotDate <= now) continue;
        
        // Verificar se já está ocupado no schedule existente
        const isOccupied = existingSchedule.some(s => {
          if (!s.scheduled_for) return false;
          const sDate = new Date(s.scheduled_for);
          return sDate.getTime() === slotDate.getTime();
        });
        
        if (!isOccupied) {
          return {
            datetime: slotDate,
            slotName: slot.name,
            hour: slot.hour
          };
        }
      }
    }

    // Fallback: retornar 10h do próximo dia
    const fallback = new Date(now);
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