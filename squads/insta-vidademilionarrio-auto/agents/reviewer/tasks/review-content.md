---
task: "review-content"
order: 1
input: |
  - assets: "The generated PNG/JPG files"
  - criteria: "quality-criteria.md"
output: |
  - review_decision: "Approved or Rejected"
  - feedback: "Detailed list of required changes if rejected"
---

# review-content

Aplica a barra de qualidade de elite. Garante que nada mediano chegue ao perfil do Lucas.

## Process

1. **Check Gramatical**: Leia cada slide e legenda em voz alta. Verifique concordância, pontuação e digitação.
2. **Check de Status**: A imagem gerada parece luxuosa ou parece "inteligência artificial barata"? Se houver artefatos de IA ou pessoas com 6 dedos, rejeite.
3. **Consistência de Ouro**: A cor #C5A059 está aplicada corretamente nos pontos de ênfase?
4. **Legibilidade**: O texto está com contraste suficiente? Ele respira (margens de 80px)?
5. **Impacto do Gancho**: Se você visse esse Slide 1 no seu feed agora, você pararia? Seja brutalmente honesto.

## Output Format

```yaml
review:
  decision: "Approved / Rejected"
  errors_found: []
  visual_score: 9/10
  comments: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
review:
  decision: "Rejected"
  errors_found: 
    - "Erro de digitação no Slide 3: 'Ativos' escrito como 'Ativosss'."
    - "Imagem do Slide 5 está muito clara, dificultando a leitura do texto branco."
  visual_score: 6/10
  comments: "Redator, corrija o erro no slide 3. Designer, adicione um overlay escuro de 40% no slide 5."
```

## Quality Criteria

- [ ] A revisão foi feita com base no `quality-criteria.md`?
- [ ] O feedback é acionável e claro?
- [ ] O tom de voz da marca foi preservado?

## Veto Conditions

Reject and redo if ANY are true:
1. Erro gramatical no primeiro slide.
2. Imagem pixelizada ou com baixa resolução.
3. CTA ausente ou confuso.
