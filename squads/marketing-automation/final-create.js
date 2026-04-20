const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

const titles = ['Determinacao', 'Forca', 'Coragem', 'Foco', 'Disciplina'];
const emojis = ['🔥', '⚡', '💎', '📈', '🎯'];

async function go() {
  await client.from('publications').delete().eq('user_id', userId).not('scheduled_for', 'is', null);

  console.log('Criando 76 videos...\n');

  let count = 0;

  for (let day = 20; day <= 30 && count < 76; day++) {
    for (let hour of [3, 10, 14, 22]) {
      if (count >= 76) break;

      const date = new Date(2026, 3, day, hour, 0, 0);
      const titleStr = titles[count % titles.length];
      const emoji = emojis[count % emojis.length];

      await client.from('publications').insert({
        user_id: userId,
        title: emoji + ' ' + titleStr,
        caption: titleStr + ' - assista ate o final!',
        hashtags: '#sucesso #' + titleStr.toLowerCase(),
        cta: 'Comenta aqui!',
        content_format: 'reels',
        approval_status: 'approved',
        overall_status: 'pendente',
        scheduled_for: date.toISOString()
      });

      console.log(`${day}/04 ${hour}h | ${titleStr}`);
      count++;
    }
  }

  for (let day = 1; day <= 8 && count < 76; day++) {
    for (let hour of [3, 10, 14, 22]) {
      if (count >= 76) break;

      const date = new Date(2026, 4, day, hour, 0, 0);
      const titleStr = titles[count % titles.length];
      const emoji = emojis[count % emojis.length];

      await client.from('publications').insert({
        user_id: userId,
        title: emoji + ' ' + titleStr,
        caption: titleStr + ' - assista ate o final!',
        hashtags: '#sucesso #' + titleStr.toLowerCase(),
        cta: 'Comenta aqui!',
        content_format: 'reels',
        approval_status: 'approved',
        overall_status: 'pendente',
        scheduled_for: date.toISOString()
      });

      console.log(`${day}/05 ${hour}h | ${titleStr}`);
      count++;
    }
  }

  console.log('\n✅ 76 videos criados!');
  console.log('De 20/04 as 3h ate 08/05 as 22h');
}

go().catch(console.error);