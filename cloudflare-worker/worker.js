/**
 * Cloudflare Worker: Integração Quiz @zuy_silva! emagrecer -> EmailOctopus
 * 
 * Este worker atua como ponte segura (proxy) entre a aplicação do Quiz e a API do EmailOctopus,
 * garantindo que a sua chave de API (EMAIL_OCTOPUS_API_KEY) e o ID da Lista (EMAIL_OCTOPUS_LIST_ID)
 * NUNCA sejam expostos no navegador do usuário.
 * 
 * Variáveis de ambiente configuradas no Cloudflare Dashboard / wrangler.toml:
 * - EMAIL_OCTOPUS_API_KEY (Secret)
 * - EMAIL_OCTOPUS_LIST_ID (Secret ou Var)
 * - ALLOWED_ORIGIN (Opcional, ex: https://seu-dominio.com ou * para permitir o applet)
 */

export default {
  async fetch(request, env) {
    // 1. Configurar cabeçalhos CORS
    const origin = request.headers.get('Origin') || '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Resposta rápida para requisições preflight do navegador
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Apenas permitir método POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      // 2. Validar variáveis de ambiente do Cloudflare Worker
      if (!env.EMAIL_OCTOPUS_API_KEY || !env.EMAIL_OCTOPUS_LIST_ID) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Configuração incompleta no Cloudflare Worker: EMAIL_OCTOPUS_API_KEY ou EMAIL_OCTOPUS_LIST_ID não definidos.',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // 3. Ler corpo da requisição do quiz
      const body = await request.json();
      const { name, email, consent, tags, utm } = body;

      if (consent !== true) {
        return new Response(
          JSON.stringify({
            success: false,
            skippedNoConsent: true,
            error: 'Contato não inscrito por ausência de consentimento de marketing.',
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!email || !email.includes('@')) {
        return new Response(
          JSON.stringify({ success: false, error: 'E-mail inválido ou ausente.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Separar primeiro nome e sobrenome se houver
      const nameParts = (name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 4. Montar payload oficial da API do EmailOctopus (v1.6)
      // Documentação: https://emailoctopus.com/api-documentation/lists/create-contact
      const emailOctopusPayload = {
        api_key: env.EMAIL_OCTOPUS_API_KEY,
        email_address: email.trim().toLowerCase(),
        status: 'SUBSCRIBED',
        fields: {
          FirstName: firstName,
          LastName: lastName,
        },
        tags: Array.isArray(tags) ? tags : ['quiz_barriga_chapada_7d'],
      };

      // Adicionar campos personalizados se existirem no EmailOctopus
      if (utm?.utm_source) {
        emailOctopusPayload.fields.Source = utm.utm_source;
      }

      // 5. Enviar para a API do EmailOctopus
      const apiUrl = `https://emailoctopus.com/api/1.6/lists/${env.EMAIL_OCTOPUS_LIST_ID}/contacts`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailOctopusPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tratar caso de contato já existente na lista (código MEMBER_EXISTS_WITH_EMAIL_ADDRESS)
        if (data?.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
          // Atualizar tags do contato existente
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Contato já cadastrado anteriormente. Dados e tags atualizados.',
              alreadySubscribed: true,
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: data?.error?.message || 'Falha ao registrar contato no EmailOctopus.',
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Sucesso na inclusão do contato
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lead registrado com sucesso no EmailOctopus!',
          contactId: data?.id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erro no servidor do Cloudflare Worker: ${err.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
