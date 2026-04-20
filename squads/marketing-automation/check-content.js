const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

client
  .from('publications')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(3)
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro:', error.message);
      return;
    }
    // Mostrar só os campos principais
    data.forEach(p => {
      console.log('---');
      console.log('ID:', p.id);
      console.log('Título:', p.title?.substring(0, 60));
      console.log('Hashtags:', p.hashtags?.substring(0, 80));
      console.log('CTA:', p.cta);
      console.log('Legenda:', p.caption?.substring(0, 150));
      console.log('Status:', p.overall_status);
    });
  });