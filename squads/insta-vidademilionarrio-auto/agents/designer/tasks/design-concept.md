---
task: "design-concept"
order: 1
input: |
  - content_draft: "The copy for slides/stories"
  - visual_identity: "Rules from visual-identity.md"
output: |
  - design_specification: "Prompts and layout rules for each asset"
---

# design-concept

Transforma texto em visão. Define o que será visto em cada segundo do conteúdo.

## Process

1. **Análise de Mood**: Determine se o post pede um fundo escuro absoluto ou uma textura de material nobre (pedra, metal).
2. **Prompts de Imagem**: Crie prompts detalhados para o DALL-E/Midjourney que gerem imagens de "B-Roll" de luxo. (Ex: "Macro shot of a high-end mechanical watch movement, gold and silver gears, shallow depth of field, cinematic lighting, 8k").
3. **Mapeamento Tipográfico**: Defina qual parte do texto será Playfair Display (Serif) e qual será Inter (Sans).
4. **Keyword Highlight**: Selecione a palavra ou frase em cada slide que receberá a cor "Empire Gold" (#C5A059).
5. **Layout Blueprint**: Especifique o alinhamento (Esquerda, Centro ou Direita) com base na densidade do texto.

## Output Format

```yaml
design:
  slides:
    - number: 1
      background_prompt: "..."
      font_pairing: "Playfair Hook / Inter Body"
      gold_keywords: ["...", "..."]
      layout: "Centered"
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
design:
  slides:
    - number: 1
      background_prompt: "Atmospheric interior of a modern private library, dark oak wood, soft amber light, minimalist furniture, 3:4 aspect ratio."
      font_pairing: "Playfair / Inter"
      gold_keywords: ["Invisível"]
      layout: "Left-aligned"
```

## Quality Criteria

- [ ] Os prompts geram imagens condizentes com o nicho de luxo?
- [ ] A hierarquia visual está clara?
- [ ] O ouro imperial é usado estrategicamente?

## Veto Conditions

Reject and redo if ANY are true:
1. Sugestão de imagens "stock" (ex: pessoas sorridentes em escritório).
2. Layouts que não cabem na zona de segurança do Instagram (1080x1440).
