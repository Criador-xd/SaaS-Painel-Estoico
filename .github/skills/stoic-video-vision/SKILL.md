# stoic-video-vision

## Purpose
Analisar vídeos de conteúdo estoico em pastas locais, gerar prompts criativos baseados na essência desses vídeos (porém com detalhes únicos) e automatizar a criação de imagens via DALL-E, salvando-as organizadamente em um diretório de alta performance.

## Triggers
- "analisar videos menteestoica"
- "gerar prompts de video telegram"
- "processar videos e criar imagens"
- "criar imagem baseada no video [nome]"

## Core Workflow

1. **Escaneamento**: Varre o diretório `C:\Users\vibec\Downloads\Telegram Desktop\menteestoica` em busca de arquivos `.mp4`, `.mov` ou `.mkv`.
2. **Análise de Contexto**:
   - Identifica o tema estoico (ex: persistência, tempo, serenidade).
   - Extrai metadados ou frames (se o ffmpeg estiver disponível) para entender a estética.
3. **Engenharia de Prompt**:
   - Cria um prompt para o DALL-E 3 que mantenha o "vibe" estoico, mas altere elementos como cenário, iluminação ou personagens para criar algo novo.
4. **Geração de Imagem**:
   - Executa o script `scripts/generate_stoic_image.py`.
   - Passa o prompt gerado e o nome sugerido.
5. **Arquivamento**:
   - Salva o resultado final em `D:\IMAGENS SALVAS IA` com o formato `[NOME_ORIGINAL]_[DESCRICAO_CURTA].png`.

## Principles
- **Estética Premium**: Todos os prompts gerados devem focar em iluminação cinematográfica, tons sóbrios (estética Mente Estoica) e alta definição.
- **Autonomia**: Se um vídeo falhar, registra o erro e continua para o próximo.
- **Fidelidade**: O nome da imagem deve ser descritivo para fácil busca futura.

## Technical Requirements
- Python 3.x
- OpenAI API Key (configurada como variável de ambiente `OPENAI_API_KEY`)
- Diretório de saída: `D:\IMAGENS SALVAS IA`
