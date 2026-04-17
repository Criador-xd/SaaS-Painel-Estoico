---
execution: inline
agent: copywriter
format: instagram-feed
inputFile: squads/insta-vidademilionarrio-auto/output/selected-angle.md
outputFile: squads/insta-vidademilionarrio-auto/output/content-draft.md
---

# Passo 06: Produção de Conteúdo (Copy)

O **Cadu Copy** vai escrever o conteúdo completo para o carrossel (10 slides) e a legenda viral do post.

## Context Loading

Load these files before executing:
- `squads/insta-vidademilionarrio-auto/output/selected-angle.md` — O ângulo e a pauta selecionados.
- `squads/insta-vidademilionarrio-auto/pipeline/data/tone-of-voice.md` — Guia de tons da marca.
- `_opensquad/core/best-practices/copywriting.md` — Melhores práticas globais de copy.

## Instructions

### Process
1. Ler o ângulo selecionado e a pauta original.
2. Selecionar um tom de voz do arquivo `tone-of-voice.md`.
3. Escrever os 10 slides do carrossel seguindo a estrutura de retenção (Tarefa `create-instagram-feed`).
4. Escrever a legenda viral com o Keyword CTA.
5. Apresentar o rascunho completo para aprovação do usuário.

## Output Format

O output deve seguir o formato YAML definido na tarefa `create-instagram-feed`.

## Veto Conditions

Reject and redo if ANY are true:
1. Mais de 25 palavras por slide.
2. Falta de CTA Keyword.
3. Tom de voz inconsistente com o nicho de luxo.
