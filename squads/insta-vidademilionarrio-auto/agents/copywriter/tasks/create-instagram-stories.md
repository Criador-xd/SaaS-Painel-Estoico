---
task: "create-instagram-stories"
order: 2
input: |
  - angle: "The selected strategic angle"
output: |
  - stories: "Sequence of 5 strategic stories copy"
---

# create-instagram-stories

Cria uma sequência de 5 stories que levam o usuário de um ponto de curiosidade até uma ação.

## Process

1. **Story 1 (The Pattern Interrupt)**: Uma imagem impactante ou frase curta que quebre o padrão de "consumo passivo".
2. **Story 2 (The Insight/Fact)**: Um dado ou fato curioso que valide o Story 1. 
3. **Story 3 (The Relatability)**: Como isso afeta o Lucas ou a audiência dele especificamente.
4. **Story 4 (The Tease)**: Mostre uma "espiada" de algo exclusivo ou de um benefício.
5. **Story 5 (The Call to Interaction)**: Enquete, Barra de Reação ou Resposta por Keyword (DM).

## Output Format

```yaml
stories:
  - sequence: 1
    type: "Visual Hook"
    text: "..."
    interaction: "None"
  - sequence: 5
    type: "Final CTA"
    text: "..."
    interaction: "Poll/DM Keyword"
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
stories:
  - sequence: 1
    text: "Muitos estão vendo o preço. Poucos estão vendo o valor."
  - sequence: 5
    text: "Quer o convite para o evento privado?"
    interaction: "Comente CONVITE"
```

## Quality Criteria

- [ ] A sequência tem um arco lógico?
- [ ] O texto cabe numa tela de celular (max 15 palavras por story)?
- [ ] A interação final é clara?

## Veto Conditions

Reject and redo if ANY are true:
1. Stories desconexos entre si.
2. Story 1 sem impacto visual/textual.
