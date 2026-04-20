const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

async function fix() {
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

  for (let day = 0; day < 19; day++) {
    const slots = [3, 10, 14, 22];

    for (const hour of slots) {
      if (count >= 76) break;

      const date = new Date('2026-04-20');
      date.setDate(date.getDate() + day);
      date.setHours(hour, 0, 0, 0);

      const title = titles[count % titles.length];
      const emoji = emojis[count % emojis.length];

      const captions = {
        3: `🌙 Madrugada de conhecimento!\n\n${title}: o segredo para transformar sua vida.\n\n💬 Comenta aqui!`,
        10: `☀️ Bom dia! Assista agora!\n\n${title}: o caminho para o sucesso.\n\n💬 Comenta aqui!`,
        14: `🌤️ Tarde perfeita para aprender!\n\n${title}: conhecimentos que vao mudar sua vida.\n\n💬 Comenta aqui!`,
        22: `🌙 Noite de Transformacao!\n\n${title}: aproveite para refletir e agir.\n\n💬 Comenta aqui!`
      };

      await client.from('publications').insert({
        user_id: userId,
        title: `${emoji} ${title} - ${hour}h`,
        caption: captions[hour],
        hashtags: `#${title.toLowerCase()} #sucesso #motivacao #determinacao #foco #mindset #growth`,
        cta: '💬 Comenta aqui!',
        content_format: 'reels',
        approval_status: 'approved',
        overall_status: 'pendente',
        scheduled_for: date.toISOString()
      });

      console.log(`${date.getDate()}/04 ${hour}h | ${title}`);
      count++;
    }
  }

  console.log(`\n✅ ${count} videos criados!`);
  console.log(`De 20/04 a 08/05 (19 dias)`);
}

fix().catch(console.error);