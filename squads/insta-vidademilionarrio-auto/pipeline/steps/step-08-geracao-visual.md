---
execution: subagent
agent: designer
model_tier: powerful
inputFile: squads/insta-vidademilionarrio-auto/output/content-approved.md
outputFile: squads/insta-vidademilionarrio-auto/output/design-spec.md
---

# Passo 08: Geração Visual (Design)

O **Dante Designer** vai criar o conceito visual e os prompts para as imagens de fundo de cada slide, seguindo o padrão "Milionário".

## Context Loading

Load these files before executing:
- `squads/insta-vidademilionarrio-auto/output/content-approved.md` — O copy aprovado.
- `squads/insta-vidademilionarrio-auto/pipeline/data/visual-identity.md` — Identidade visual Black/Gold.
- `squads/insta-vidademilionarrio-auto/pipeline/data/template-reference.html` — Template de referência.

## Instructions

### Process
1. Analisar o tom do copy e o objetivo do post.
2. Definir o conceito visual de cada slide seguindo a tarefa `design-concept`.
3. Gerar prompts de imagem de alta qualidade para o `image-creator`.
4. Especificar as Keywords que ficarão em Dourado.

## Output Format

O output deve seguir o formato YAML definido na tarefa `design-concept`.

## Veto Conditions

Reject and redo if ANY are true:
1. Sugestão de imagens stock genéricas.
2. Desvio da identidade visual Black/Gold.
