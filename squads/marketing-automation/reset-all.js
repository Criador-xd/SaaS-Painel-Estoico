const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

async function reset() {
  console.log('🗑️ Deletando todos...\n');

  await client.from('publications').delete().eq('user_id', userId).not('scheduled_for', 'is', null);

  console.log('✅ Tudo deletado!\n');
  console.log('Agora me diz: qual a data do PRIMEIRO vídeo agendado?');
  console.log('E qual a data do ÚLTIMO vídeo?');
}

reset().catch(console.error);