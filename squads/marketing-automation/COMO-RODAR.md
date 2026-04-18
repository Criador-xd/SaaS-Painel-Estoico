# Como Executar o Sistema de Automação

## Quick Start

```bash
cd squads/marketing-automation
npm start
```

## Requisitos

1. **Node.js** instalado (v18+)
2. **Chave do Supabase** configurada (opcional para modo offline)

## Configuração da Chave do Supabase

1. Acesse: https://supabase.com/dashboard/project/wjzxntgpuimiubrnqfnz/settings/api
2. Clique em "Reveal" na **service_role key**
3. Copie a chave (começa com `eyJ...`)
4. Cole no arquivo `config/config.yaml` na linha `SUPABASE_SERVICE_KEY`

## Estrutura de Comandos

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o sistema completo |
| `npm run watch` | Apenas monitora a pasta |
| `npm run schedule` | Apenas executa programação |

## Como Parar

Pressione **Ctrl+C** no terminal

## O que o Sistema Faz

1. **Watch** → Detecta novos vídeos na pasta
2. **Classify** → Classifica por categoria
3. **Priority** → Define ordem de publicação
4. **Schedule** → Agenda melhor dia/hora
5. **Publish** → Envia para a plataforma

## Pasta de Saída

Os dados ficam em: `squads/marketing-automation/_output/`
- `queue/` → Vídeos pendentes
- `schedule.json` → Programação atual
- `processed-files.json` → Arquivos já processados