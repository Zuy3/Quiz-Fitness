# Guia de Integração: Quiz @zuy_silva! -> Cloudflare Worker -> EmailOctopus

Este documento descreve a arquitetura e os passos para conectar o Quiz à infraestrutura existente do projeto ZuyZelia ou a um novo Cloudflare Worker.

---

## 1. Arquitetura da Solução

```
[ Navegador do Usuário ]
          │
          │  POST { name, email, consent, tags, utm }
          ▼
[ Cloudflare Worker (Proxy Seguro) ]  <── Variáveis secretas (EMAIL_OCTOPUS_API_KEY, EMAIL_OCTOPUS_LIST_ID)
          │
          │  POST /api/1.6/lists/{list_id}/contacts
          ▼
[ API EmailOctopus ]
```

### Por que esta arquitetura é obrigatória?
1. **Segurança de Credenciais:** As chaves de API do EmailOctopus concedem acesso total à sua conta. Se fossem colocadas no frontend React, qualquer visitante poderia inspecioná-las no navegador.
2. **CORS e Confiabilidade:** O Cloudflare Worker responde aos cabeçalhos CORS do navegador (`Access-Control-Allow-Origin`) de forma rápida e segura na borda (Edge).
3. **Prevenção de Falhas:** O aplicativo trata o status de envio e, caso o endpoint não esteja configurado no momento do teste, informa com transparência sem simulações falsas.

---

## 2. Como Configurar no Quiz

No arquivo de variáveis de ambiente da aplicação (`.env`):

```bash
VITE_EMAIL_OCTOPUS_WORKER_URL="https://seu-worker-existente.workers.dev"
```

Substitua pela URL do Cloudflare Worker já existente no seu projeto ZuyZelia (ou pelo novo Worker criado com o código em `/cloudflare-worker/worker.js`).

---

## 3. Código do Cloudflare Worker

O arquivo completo pronto para publicação encontra-se em:
`/cloudflare-worker/worker.js`

### Variáveis e Secrets no Cloudflare:
No painel do Cloudflare Workers (ou via `wrangler secret put`):
- `EMAIL_OCTOPUS_API_KEY`: Sua chave de API do EmailOctopus.
- `EMAIL_OCTOPUS_LIST_ID`: O ID da lista de contatos do EmailOctopus para o qual os leads devem entrar.

---

## 4. Rastreamento e Parâmetros Preservados
O serviço envia automaticamente:
- **Nome** e **Sobrenome**
- **E-mail** (validado e em letras minúsculas)
- **Tags**: `quiz_barriga_chapada_7d` e a tag do perfil identificado
- **Origem UTM**: `utm_source`, `utm_medium`, `utm_campaign`, etc.
