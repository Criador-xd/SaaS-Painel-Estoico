---
execution: subagent
agent: poster
model_tier: powerful
inputFile: squads/insta-vidademilionarrio-auto/output/publication-auth.md
outputFile: squads/insta-vidademilionarrio-auto/output/publication-receipt.md
---

# Passo 11: Publicação (Instagram)

A **Paula Postagem** vai realizar o upload do carrossel e da legenda para o Instagram.

## Context Loading

Load these files before executing:
- `squads/insta-vidademilionarrio-auto/output/publication-auth.md` — Autorização de publicação.
- `squads/insta-vidademilionarrio-auto/output/final-assets/` — Pasta com as imagens finais.
- `squads/insta-vidademilionarrio-auto/output/content-draft.md` — A legenda aprovada.

## Instructions

### Process
1. Validar as credenciais nas variáveis de ambiente (`INSTAGRAM_ACCESS_TOKEN`).
2. Fazer o upload sequencial das imagens para o Instagram Graph API.
3. Criar o container do carrossel com a legenda e as configurações solicitadas.
4. Publicar o container.
5. Salvar o recibo da publicação com o link direto no arquivo de saída.

## Output Format

```yaml
publication:
  status: "Success / Failure"
  post_id: "..."
  permalink: "..."
  timestamp: "..."
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Erro de autenticação (Token inválido).
2. Falha de rede persistente.
