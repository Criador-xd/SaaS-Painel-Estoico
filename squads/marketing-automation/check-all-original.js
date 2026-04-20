const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,scheduled_for,title')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .order('scheduled_for', { ascending: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    console.log(`TODOS ${data.length} Videos agendados:\n`);
    data.forEach(p => {
      const d = new Date(p.scheduled_for);
      const mes = d.getMonth()+1;
      const dia = d.getDate();
      const hora = d.getHours();
      console.log(`${dia}/${mes} ${hora}h | ${p.title?.substring(0,40)}`);
    });
  });