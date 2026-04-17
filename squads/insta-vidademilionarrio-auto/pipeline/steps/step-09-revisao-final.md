---
execution: inline
agent: reviewer
inputFile: squads/insta-vidademilionarrio-auto/output/design-spec.md
outputFile: squads/insta-vidademilionarrio-auto/output/review-report.md
on_reject: 6
---

# Passo 09: Revisão Final (Elite Quality)

A **Queila Qualidade** vai inspecionar cada detalhe do conteúdo gerado (texto e design) para garantir o padrão "Vida de Milionário".

## Context Loading

Load these files before executing:
- `squads/insta-vidademilionarrio-auto/output/content-draft.md` — O copy original.
- `squads/insta-vidademilionarrio-auto/output/design-spec.md` — As especificações visuais.
- `squads/insta-vidademilionarrio-auto/pipeline/data/quality-criteria.md` — Checklist de qualidade.

## Instructions

### Process
1. Revisar o copy contra erros gramaticais e de tom de voz.
2. Revisar as especificações de design para garantir fidelidade à marca.
3. Aplicar a tarefa `review-content`.
4. Se houver falhas críticas (veto), o pipeline retorna automaticamente para o passo 06 (Redação).

## Output Format

O output deve seguir o formato YAML definido na tarefa `review-content`.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Erro gramatical em qualquer slide.
2. Inconsistência na paleta de cores Black/Gold.
3. Gancho de baixo impacto.
