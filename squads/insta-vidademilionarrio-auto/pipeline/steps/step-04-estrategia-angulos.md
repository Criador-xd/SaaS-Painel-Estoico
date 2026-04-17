---
execution: inline
agent: strategist
inputFile: squads/insta-vidademilionarrio-auto/output/selected-news.md
outputFile: squads/insta-vidademilionarrio-auto/output/content-strategy.md
---

# Passo 04: Estratégia de Ângulos

A **Silvia Strategia** vai analisar a pauta selecionada e criar 5 ângulos psicológicos diferentes para atacarmos a audiência.

## Context Loading

Load these files before executing:
- `squads/insta-vidademilionarrio-auto/output/selected-news.md` — A pauta escolhida pelo usuário.
- `squads/insta-vidademilionarrio-auto/pipeline/data/domain-framework.md` — Framework estratégico da marca.

## Instructions

### Process
1. Analisar a notícia e identificar os gatilhos emocionais dominantes.
2. Gerar 5 ângulos competitivos usando a tarefa `generate-angles`.
3. Escolher o CTA (Keyword) ideal para cada um.
4. Apresentar as opções para o usuário escolher.

## Output Format

O output deve seguir o formato YAML definido na tarefa `generate-angles`.

## Veto Conditions

Reject and redo if ANY are true:
1. Ângulos muito parecidos entre si.
2. Falta de driver psicológico em cada ângulo.
