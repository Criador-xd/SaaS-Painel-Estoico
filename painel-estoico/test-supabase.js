import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qltuguhvvepusmglppyi.supabase.co',
  'sb_publishable_odjtoI9sKaqL6rfRSwm1uQ_FIaqHoEX'
);

async function runTest() {
  console.log('🛡️ Iniciando Teste da IA no Supabase...');
  
  // Teste 1: Conexão e criação de conta falsa
  console.log('1. Tentando cadastrar o usuário: mestre.ia@stoic.com');
  const { data, error } = await supabase.auth.signUp({
    email: 'mestre.ia@stoic.com',
    password: 'senha_inabalavel_123',
    options: { data: { name: 'Mestre IA' } }
  });

  if (error) {
    console.log('❌ Erro no cadastro:', error.message);
  } else {
    console.log('✅ Cadastro realizado com sucesso!');
    if (!data.session) {
      console.log('📧 O Supabase barrou o login automático porque a confirmação de e-mail está ATIVA (como você configurou).');
    }
  }

  // Teste 2: Checando a tabela de Perfis
  console.log('\n2. Verificando a Tabela de Perfis...');
  const { data: profiles, error: profileError } = await supabase.from('profiles').select('*').limit(1);
  
  if (profileError) {
    console.log('❌ Erro ao acessar a tabela profiles:', profileError.message);
  } else {
    console.log('✅ Conexão com a tabela de perfis confirmada. Dados retornados:', profiles);
  }
}

runTest();
