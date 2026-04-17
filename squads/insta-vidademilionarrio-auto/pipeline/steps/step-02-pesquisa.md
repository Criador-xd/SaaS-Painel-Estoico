---
execution: subagent
agent: researcher
model_tier: powerful
inputFile: squads/insta-vidademilionarrio-auto/output/research-focus.md
outputFile: squads/insta-vidademilionarrio-auto/output/research-results.md
---

# Passo 02: Pesquisa de Tendências

O **Renato Raio-X** vai investigar a internet com base no foco definido para encontrar as 5 pautas com maior potencial de viralização.

## Context Loading

Load these files before executing:
- `squads/insta-vidademilionarrio-auto/output/research-focus.md` — O foco definido pelo usuário.
- `squads/insta-vidademilionarrio-auto/pipeline/data/research-brief.md` — Framework de pesquisa da marca.

## Instructions

### Process
1. Ler o foco da pesquisa no arquivo de entrada.
2. Executar buscas usando as habilidades `web_search` e `web_fetch`.
3. Selecionar e classificar as 5 melhores pautas seguindo a tarefa `find-and-rank-news`.
4. Salvar o resultado estruturado em YAML no arquivo de saída.

## Output Format

O output deve seguir o formato YAML definido na tarefa `find-and-rank-news`.

## Output Example

```yaml
news:
  - title: "A revolução dos Tokens de Ouro"
    summary: "Como a tokenização de ativos reais está mudando o luxo..."
    viral_reason: "Gera curiosidade sobre investimentos modernos."
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Nenhuma pauta encontrada.
2. Pautas fora do nicho Business/Luxo.
