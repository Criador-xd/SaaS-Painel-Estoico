const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

const slots = [
  { hour: 10, name: 'Manha' },
  { hour: 14, name: 'Tarde' },
  { hour: 22, name: 'Noite' },
  { hour: 3, name: 'Madrugada', nextDay: true }
];

const startDate = new Date('2026-04-15T10:00:00');

async function reschedule() {
  console.log('🔄 Gerando agendamentos de 15/04 a 24/04...\n');

  const titles = [
    'Determinacao - O Segredo do Sucesso',
    'Forca Interior - Guia Completo',
    'Coragem para Vencer',
    'Foco e Disciplina',
    'Mentalidade Milionaria',
    'Transformacao Pessoal',
    'Vitoria e Conquista',
    'Crescimento Interior',
    'Acao e Resultados',
    'Forca Interior'
  ];

  let currentDate = new Date(startDate);
  let count = 0;

  for (let day = 15; day <= 24; day++) {
    for (const slot of slots) {
      const publishDate = new Date(currentDate);
      publishDate.setDate(day);
      publishDate.setHours(slot.hour, 0, 0, 0);

      if (slot.nextDay) {
        publishDate.setDate(publishDate.getDate() + 1);
      }

      if (publishDate > new Date()) {
        const title = titles[count % titles.length] + ` ${count + 1}`;
        const emoji = ['🔥', '⚡', '💎', '📈', '🎯'][count % 5];

        await client
          .from('publications')
          .insert({
            user_id: userId,
            title: emoji + ' ' + title,
            caption: 'Assista ate o final! ' + title + '\n\n💬 Comenta aqui!',
            hashtags: '#sucesso #motivacao #determinacao #foco #mindset',
            cta: '💬 Comenta aqui!',
            content_format: 'reels',
            approval_status: 'approved',
            overall_status: 'pendente',
            scheduled_for: publishDate.toISOString()
          });

        console.log(`${publishDate.toLocaleDateString('pt-BR')} ${publishDate.getHours()}h | ${title}`);
        count++;
      }
    }
  }

  console.log(`\n✅ ${count} novos agendamentos criados!`);
}

reschedule().catch(console.error);