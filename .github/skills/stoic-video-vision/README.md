# Stoic Video Vision Skill 🦅

Esta skill foi desenvolvida para automatizar a criação de material visual baseado em vídeos do Telegram, focando na marca **Mente Estoica**.

## Como Usar

Basta pedir para o seu assistente (Antigravity/Claude):
> "Analisar os vídeos do telegram e gerar imagens estoicas"

A skill irá:
1. Ler os vídeos de `C:\Users\vibec\Downloads\Telegram Desktop\menteestoica`.
2. Criar novos prompts baseados no que ela "viu" ou no contexto estoico.
3. Chamar o DALL-E 3 para criar imagens inéditas.
4. Salvar tudo em `D:\IMAGENS SALVAS  IA`.

## Requisitos

- **API Key**: Você deve ter a variável de ambiente `OPENAI_API_KEY` configurada.
- **Python**: Necessário para rodar o script de geração.
- **FFMPEG (Opcional)**: Recomendado para que a IA consiga extrair frames e ter uma análise visual mais precisa.

## Estrutura
- `SKILL.md`: O "cérebro" da automação.
- `scripts/generate_stoic_image.py`: O executor da API da OpenAI.
