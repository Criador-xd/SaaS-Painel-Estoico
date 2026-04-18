# MARKETING AUTOMATION - Como Executar

## Pré-requisitos

1. Node.js instalado (v18+)
2. Chave da API do Supabase (service_role key)

## Instalação

```bash
cd squads/marketing-automation
npm install
```

## Configuração

1. Edite o arquivo `config/config.yaml`
2. Substitua `your_service_role_key_here` pela sua chave do Supabase

## Execução

### Modo produção (com tudo)
```bash
npm start
```

### Apenas monitorar pasta
```bash
npm run watch
```

### Apenas ver/programação
```bash
npm run schedule
```

## Estrutura de Saída

```
_output/
├── queue/           # Vídeos pendentes
├── schedule.json    # Programação atual
└── processed-files.json  # Arquivos já processados
```

## Comandos Úteis

- **Status:** O sistema mostra status a cada execução
- **Ctrl+C:** Para o sistema graciosamente