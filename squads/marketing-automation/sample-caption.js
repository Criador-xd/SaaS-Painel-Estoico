const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

client
  .from('publications')
  .select('title,caption,hashtags')
  .eq('user_id', userId)
  .not('scheduled_for', 'is', null)
  .order('scheduled_for', { ascending: true })
  .limit(3)
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    console.log('Exemplos de legendas:\n');
    data.forEach(p => {
      console.log('---');
      console.log('Titulo:', p.title);
      console.log('Legenda:', p.caption.substring(0, 200) + '...');
      console.log('Hashtags:', p.hashtags);
    });
  });