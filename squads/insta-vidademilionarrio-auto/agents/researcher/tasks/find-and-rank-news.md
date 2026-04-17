---
task: "find-and-rank-news"
order: 1
input: |
  - focus: "The specific niche or topic to search (from user or strategy)"
  - period: "Timeframe for the news (default: last 24h)"
output: |
  - top_stories: "List of 3-5 viral pautas with sources and impact analysis"
---

# find-and-rank-news

Este processo identifica notícias e pautas de alto impacto emocional no nicho de negócios e luxo.

## Process

1. **Varredura**: Use `web_search` para buscar por temas como "IA em negócios", "Marketing Digital 2025", "Luxo e Status" e "Fatos históricos curiosos sobre riqueza".
2. **Filtragem**: Remova pautas superficiais ou puramente políticas/negativas que não permitam um ângulo aspiracional.
3. **Cruzamento de Dados**: Verifique se a pauta já está gerando comentários em redes como X ou Instagram (usando ferramentas de busca).
4. **Análise de Impacto**: Classifique cada pauta de 0-10 em: Curiosidade, Urgência e Status.
5. **Dossiê**: Entregue os top 3 com um "Por que isso importa para o nosso público?".

## Output Format

```yaml
news:
  - title: "..."
    source_url: "..."
    summary: "..."
    viral_reason: "..."
    emotional_triggers: ["...", "..."]
    fact_check: "Fatos reais confirmados"
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
news:
  - title: "A ascensão dos Micro-Hotéis de Luxo: O fim dos Resorts Massivos?"
    source_url: "https://forbes.com/lux-travel"
    summary: "Dados mostram que milionários estão trocando grandes hotéis por experiências hiper-exclusivas de apenas 4 quartos. A privacidade se tornou a moeda mais cara de 2025."
    viral_reason: "Toca no desejo de exclusividade e na mudança de comportamento do 1%."
    emotional_triggers: ["Status", "Privacidade", "Exclusividade"]
    fact_check: "Mercado de micro-hospitalidade cresceu 42% no último semestre."
```

## Quality Criteria

- [ ] A pauta é genuinamente interessante (não óbvia)?
- [ ] O link da fonte é válido?
- [ ] O resumo permite que o estrategista entenda o cerne da notícia em 10 segundos?

## Veto Conditions

Reject and redo if ANY are true:
1. Pauta é sobre fofoca de celebridades sem relação com business.
2. Nenhuma fonte confiável foi encontrada.
