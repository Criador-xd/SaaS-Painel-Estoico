---
task: "generate-angles"
order: 1
input: |
  - news_item: "The selected story/news object"
output: |
  - strategic_angles: "List of 5 different ways to present this news"
---

# generate-angles

Define como a notícia será "vendida" para a audiência, focando em diferentes gatilhos mentais.

## Process

1. **Desconstrução**: Identifique o conflito central da notícia (ex: Antigo vs Novo, Pobre vs Rico).
2. **Seleção de Gatilho**: Mapeie 5 gatilhos (Escassez, Autoridade, Curiosidade, Pertencimento, Prova Social).
3. **Draft de Hooks**: Escreva um título provisório para cada ângulo de forma que um mude a percepção da notícia em relação ao outro.
4. **Alinhamento de CTA**: Sugira um comando específico para cada ângulo que faça sentido com a jornada do usuário.

## Output Format

```yaml
angles:
  - hook_title: "..."
    driver: "Ex: Status"
    description: "Por que esse ângulo funciona?"
    potential_cta: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
angles:
  - hook_title: "O fim do turismo de massa: Como a privacidade se tornou o novo Rolex."
    driver: "Status/Exclusividade"
    description: "Foca no fato de que ter dinheiro não é mais sobre ser visto, mas sobre não ser incomodado."
    potential_cta: "Comente PRIVACIDADE"
```

## Quality Criteria

- [ ] Os 5 ângulos são distintos?
- [ ] O tom "Vida de Milionário" é mantido?
- [ ] O CTA é acionável?

## Veto Conditions

Reject and redo if ANY are true:
1. Ângulos repetitivos (apenas mudando palavras).
2. Tom de voz infantil ou excessivamente agressivo.
3. Ângulo que prejudica a imagem de marca do Lucas.
