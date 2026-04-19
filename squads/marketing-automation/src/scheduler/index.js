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
    // Converter para São Paulo (UTC-3)
    const toSaoPaulo = (date) => {
      return new Date(date.getTime() - (3 * 60 * 60 * 1000));
    };

    const now = toSaoPaulo(new Date());

    // Se não tem último agendamento, usar data atual
    let baseDate = lastScheduledDate ? toSaoPaulo(lastScheduledDate) : now;
    
    // Se a base for no passado, usar agora
    if (baseDate < now) {
      baseDate = now;
    }

    // Determinar o próximo slot baseado no último horário
    let nextSlotIndex = 0;
    let dayOffset = 0;
    
    if (lastScheduledDate) {
      const lastHour = baseDate.getHours();
      
      // Se último foi às 22h ou mais, próximo é 3h do dia seguinte
      if (lastHour >= 22) {
        nextSlotIndex = 3; // Madrugada
        dayOffset = 1; // Próximo dia
      } 
      // Se último foi entre 14h e 22h, próximo é 22h
      else if (lastHour >= 14) {
        nextSlotIndex = 2; // Noite
        dayOffset = 0;
      }
      // Se último foi entre 10h e 14h, próximo é 14h
      else if (lastHour >= 10) {
        nextSlotIndex = 1; // Tarde
        dayOffset = 0;
      }
      // Se último foi antes das 10h (ou 3h), próximo é 10h
      else {
        nextSlotIndex = 0; // Manhã
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
          const sDate = toSaoPaulo(new Date(s.scheduled_for));
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

  // Encontrar próximo slot após o último agendamento
  findNextSlot(lastScheduledDate, existingSchedule = []) {
    // Converter para São Paulo (UTC-3)
    const toSaoPaulo = (date) => {
      return new Date(date.getTime() - (3 * 60 * 60 * 1000));
    };

    // Se não tem último agendamento, usar data atual
    let baseDate = lastScheduledDate ? toSaoPaulo(lastScheduledDate) : toSaoPaulo(new Date());
    
    // Se a base for no passado, usar agora
    const now = toSaoPaulo(new Date());
    if (baseDate < now) {
      baseDate = now;
    }

    // Procurar próximo slot livre
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const candidateDate = new Date(baseDate);
      candidateDate.setDate(candidateDate.getDate() + dayOffset);
      
      const dayOfWeek = candidateDate.getDay();
      if (!this.postDays.includes(dayOfWeek)) continue;

      // Encontrar índice do último slot usado
      let startIndex = 0;
      if (lastScheduledDate && dayOffset === 0) {
        const lastHour = baseDate.getHours();
        for (let i = 0; i < this.postSlots.length; i++) {
          if (this.postSlots[i].hour <= lastHour) {
            startIndex = i + 1;
          }
        }
      }

      // Tentar cada slot a partir do início
      for (let i = 0; i < this.postSlots.length; i++) {
        const slotIndex = (startIndex + i) % this.postSlots.length;
        const slot = this.postSlots[slotIndex];
        
        const slotDate = new Date(candidateDate);
        slotDate.setHours(slot.hour, 0, 0, 0);
        
        // Se o slot for no passado hoje, pular
        if (slotDate <= now && dayOffset === 0) continue;
        
        // Verificar se já está ocupado no schedule existente
        const isOccupied = existingSchedule.some(s => {
          if (!s.scheduled_for) return false;
          const sDate = toSaoPaulo(new Date(s.scheduled_for));
          return sDate.getTime() === slotDate.getTime();
        });
        
        if (!isOccupied) {
          return {
            datetime: slotDate,
            slotName: slot.name,
            hour: slot.hour
          };
        }
        
        // Se reachou o final da lista, começar do início no próximo dia
        if (slotIndex === this.postSlots.length - 1) {
          startIndex = 0;
        }
      }
    }

    // Fallback: retornar 3h do próximo dia
    const fallback = toSaoPaulo(new Date());
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(3, 0, 0, 0);
    
    return {
      datetime: fallback,
      slotName: 'Madrugada',
      hour: 3
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
        platform: 'both',
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