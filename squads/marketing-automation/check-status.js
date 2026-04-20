const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('id,title,scheduled_for,overall_status,approval_status')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .order('scheduled_for', { ascending: false })
  .limit(50)
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    console.log(`📋 ${data.length} publicações com horario agendado:\n`);
    console.log('Status disponiveis: overall_status | approval_status\n');
    data.slice(0,15).forEach(p => {
      console.log(`${p.overall_status} | ${p.approval_status} | ${p.title?.substring(0,30)}`);
    });
  });