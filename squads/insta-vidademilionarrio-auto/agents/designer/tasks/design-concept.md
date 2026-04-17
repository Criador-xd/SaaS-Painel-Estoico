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
2. **Prompts de Imagem**: Crie prompts detalhados que gerem imagens de "B-Roll" de luxo. **Obrigatoriamente** inclua tags de qualidade: "hyper-realistic, photorealistic, 8k, cinematic lighting, sharp focus, high contrast". Evite fundos com muitos detalhes claros onde o texto ficará posicionado.
3. **Mapeamento Tipográfico**: Defina qual parte do texto será Playfair Display (Serif) e qual será Inter (Sans).
4. **Keyword Highlight**: Selecione a palavra ou frase em cada slide que receberá a cor "Empire Gold" (#C5A059).
5. **Layout & Overlay**: Especifique o alinhamento e a força do overlay preto (60%, 70% ou 80%) necessário para garantir legibilidade.

## Output Format

```yaml
design:
  slides:
    - number: 1
      background_prompt: "..."
      font_pairing: "Playfair Hook / Inter Body"
      gold_keywords: ["...", "..."]
      layout: "Centered"
      background_overlay: "70%"
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
