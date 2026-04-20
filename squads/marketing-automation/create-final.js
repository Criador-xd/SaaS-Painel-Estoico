const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

async function createFinal() {
  console.log('Deletando e recriando...\n');

  await client.from('publications').delete().eq('user_id', userId).not('scheduled_for', 'is', null);

  const titles = [
    'Determinacao', 'Forca Interior', 'Coragem', 'Foco', 'Disciplina',
    'Mentalidade', 'Transformacao', 'Vitoria', 'Conquista', 'Crescimento',
    'Acao', 'Resultados', 'Motivacao', 'Sucesso', 'Forca',
    'Coragem', 'Foco', 'Determinacao', 'Disciplina', 'Mentalidade'
  ];

  const emojis = ['🔥', '⚡', '💎', '📈', '🎯'];

  let count = 0;
  let currentDate = new Date('2026-04-20T03:00:00');

  for (let day = 0; day < 19; day++) {
    for (let slot = 0; slot < 4; slot++) {
      if (count >= 76) break;

      const hour = slot === 0 ? 3 : slot === 1 ? 10 : slot === 2 ? 14 : 22;

      const date = new Date(currentDate);
      date.setHours(hour, 0, 0, 0);

      if (slot === 0) {
        date.setDate(date.getDate() + day);
      }

      const title = titles[count % titles.length];
      const emoji = emojis[count % emojis.length];

      await client.from('publications').insert({
        user_id: userId,
        title: `${emoji} ${title}`,
        caption: `Assista ate o final!\n\n${title}: o segredo para transformar sua vida.\n\n💬 Comenta aqui!`,
        hashtags: `#${title.toLowerCase()} #sucesso #motivacao #determinacao #foco #mindset`,
        cta: '💬 Comenta aqui!',
        content_format: 'reels',
        approval_status: 'approved',
        overall_status: 'pendente',
        scheduled_for: date.toISOString()
      });

      const dia = date.getDate();
      console.log(`${dia}/04 ${hour}h | ${title}`);
      count++;
    }
  }

  console.log(`\n✅ ${count} videos criados!`);
  console.log(`De 20/04 a 08/05`);
}

createFinal().catch(console.error);