const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

const titles = [
  'Determinacao', 'Forca Interior', 'Coragem', 'Foco', 'Disciplina',
  'Mentalidade', 'Transformacao', 'Vitoria', 'Conquista', 'Crescimento',
  'Acao', 'Resultados', 'Motivacao', 'Sucesso', 'Forca',
  'Coragem', 'Foco', 'Determinacao', 'Disciplina', 'Mentalidade'
];

const emojis = ['🔥', '⚡', '💎', '📈', '🎯'];

async function create76() {
  console.log('📅 Criando 76 vídeos starting 20/04/2026 3h...\n');

  let count = 0;
  let dayOffset = 0;

  while (count < 76) {
    const slots = [
      { hour: 3, name: 'Madrugada' },
      { hour: 10, name: 'Manha' },
      { hour: 14, name: 'Tarde' },
      { hour: 22, name: 'Noite' }
    ];

    for (const slot of slots) {
      if (count >= 76) break;

      const date = new Date('2026-04-20');
      date.setDate(date.getDate() + dayOffset);
      date.setHours(slot.hour, 0, 0, 0);

      const title = titles[count % titles.length];
      const emoji = emojis[count % emojis.length];

      const captions = {
        '3': `🌙 Assista na madrugadinha!\n\n${title}: o segredo que vai mudar sua vida.\n\n💬 Comenta aqui!`,
        '10': `☀️ Bom dia! Assista agora!\n\n${title}: o caminho para o sucesso.\n\n💬 Comenta aqui!`,
        '14': `🌤️ Tarde perfeita para assistir!\n\n${title}: aprenda agora.\n\n💬 Comenta aqui!`,
        '22': `🌙 Noite de conhecimento!\n\n${title}: transforme sua vida.\n\n💬 Comenta aqui!`
      };

      await client.from('publications').insert({
        user_id: userId,
        title: `${emoji} ${title} - ${slot.name}`,
        caption: captions[slot.hour.toString()],
        hashtags: `#${title.toLowerCase()} #sucesso #motivacao #determinacao #foco #mindset #growth`,
        cta: '💬 Comenta aqui!',
        content_format: 'reels',
        approval_status: 'approved',
        overall_status: 'pendente',
        scheduled_for: date.toISOString()
      });

      const dia = date.getDate();
      console.log(`${dia}/04 ${date.getHours()}h | ${title} - ${slot.name}`);
      count++;
    }

    dayOffset++;
  }

  console.log(`\n✅ ${count} vídeos criados!`);
  console.log(`De 20/04 a ${20 + dayOffset - 1}/04`);
}

create76().catch(console.error);