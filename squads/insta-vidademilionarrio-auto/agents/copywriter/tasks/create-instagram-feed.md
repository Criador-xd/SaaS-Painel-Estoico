---
task: "create-instagram-feed"
order: 1
input: |
  - angle: "The selected strategic angle"
  - brand_tone: "Selected from tone-of-voice.md"
output: |
  - carousel: "10 slides of copy"
  - caption: "Viral caption for Instagram"
---

# create-instagram-feed

Escreve um carrossel de 10 slides e a legenda viral, focando em máxima retenção no celular.

## Process

1. **Slide 1 (Hook)**: Deve ser impossível de ignorar. Use uma afirmação ousada ou uma pergunta que crie um loop aberto.
2. **Slide 2 (The Hook Expansion)**: Valide a dor ou o desejo do slide 1. Prometa a solução.
3. **Slides 3-6 (The Value Delivery)**: Explique o conceito em sentenças curtas. Use analogias de alto status. 
4. **Slide 7-8 (The Shift)**: Mostre o que acontece se o seguidor não mudar ou o benefício ignorado.
5. **Slide 9 (The Vision)**: Uma frase de efeito que resuma o post.
6. **Slide 10 (The Keyword CTA)**: Comando direto para comentar a Keyword selecionada.
7. **Legenda**: Comece com um novo hook. Use parágrafos de 1 sentença. Termine com CTA e 5 hashtags seletas.

## Output Format

```yaml
feed:
  slides:
    - number: 1
      hook: "..."
      subtext: "..."
    # ... up to 10
  caption: |
    [Texto da legenda]
  keyword: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
feed:
  slides:
    - number: 1
      hook: "Sua paz vai custar caro. Pague o preço."
      subtext: "O luxo do silêncio no mundo do barulho."
    - number: 10
      hook: "Quer o guia de blindagem mental?"
      subtext: "Comente SILENCIO agora."
  caption: |
    Você não precisa ser amado por todos. 
    
    A busca por aprovação é a maior âncora do seu progresso. Milionários não buscam aplausos, buscam ativos. 
    
    E o maior ativo que você tem é sua paz mental. 
    
    Se você concorda, comente SILENCIO. 
```

## Quality Criteria

- [ ] Todos os parágrafos têm menos de 3 linhas?
- [ ] O tom selecionado foi mantido do início ao fim?
- [ ] O Slide 10 usa a Keyword correta?

## Veto Conditions

Reject and redo if ANY are true:
1. Texto com mais de 25 palavras por slide.
2. Uso de gírias ou tom infantil.
3. Falta de CTA na legenda.
