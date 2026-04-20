const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,created_at,scheduled_for,title')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .lt('scheduled_for', '2026-04-15')
  .order('scheduled_for', { ascending: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    console.log(`📋 ${data.length} videos ate 14/04:\n`);
    data.forEach(p => {
      const date = new Date(p.scheduled_for).toLocaleDateString('pt-BR');
      console.log(`${date} | ${p.title?.substring(0,40)}`);
    });
  });