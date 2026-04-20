const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,scheduled_for')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .order('scheduled_for', { ascending: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    console.log(`Total agendado: ${data.length}`);
    console.log(`De: ${new Date(data[0].scheduled_for).toLocaleDateString('pt-BR')}`);
    console.log(`Ate: ${new Date(data[data.length-1].scheduled_for).toLocaleDateString('pt-BR')}`);
  });