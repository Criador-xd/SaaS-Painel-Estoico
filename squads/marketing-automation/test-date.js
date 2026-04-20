const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://wjzxntgpuimiubrnqfnz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqenhudGdwdWltaXVicm5xZm56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk5NDA3NCwiZXhwIjoyMDg4NTcwMDc0fQ.3mCvnyfSm_M1yctEJ64Qj9fWqRh4RAASlKFphkIdIGA'
);

const userId = 'ca424590-39cc-4e47-a5fc-a0b72fdcf131';

async function test() {
  const d = new Date(2026, 3, 20, 3, 0, 0);
  console.log(d.toISOString());
}

test();