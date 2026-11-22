import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {defineConfig, type Plugin} from 'vite';

function htmlDownloadMiddlewarePlugin(): Plugin {
  const distHtmlPath = path.resolve(import.meta.dirname, 'dist-html/index.html');

  const attachRoutes = (middlewares: {
    use: (
      handler: (
        req: {url?: string},
        res: {
          statusCode: number;
          setHeader: (name: string, value: string) => void;
          end: (body?: string | Buffer) => void;
        },
        next: () => void,
      ) => void,
    ) => void;
  }) => {
    middlewares.use((req, res, next) => {
      const urlPath = (req.url || '').split('?')[0];

      if (urlPath === '/download-html' || urlPath === '/download-html/index.html') {
        if (!fs.existsSync(distHtmlPath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end('Arquivo dist-html/index.html ainda não foi gerado. Execute npm run build:html.');
          return;
        }
        const fileBuffer = fs.readFileSync(distHtmlPath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="index.html"');
        res.setHeader('Content-Length', String(fileBuffer.byteLength));
        res.setHeader('Cache-Control', 'no-store');
        res.end(fileBuffer);
        return;
      }

      if (urlPath === '/baixar' || urlPath === '/baixar.html' || urlPath === '/baixar-html') {
        const exists = fs.existsSync(distHtmlPath);
        const sizeMb = exists
          ? (fs.statSync(distHtmlPath).size / (1024 * 1024)).toFixed(2)
          : '0.00';

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Baixar Projeto em HTML | Quiz @zuy_silva! emagrecer</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #FAF9F6; color: #1F2937; margin: 0; padding: 24px; display: flex; min-height: 100vh; align-items: center; justify-content: center; box-sizing: border-box; }
      .card { max-width: 560px; width: 100%; background: #fff; border: 1px solid #E5E7EB; border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(26, 62, 49, 0.08); }
      .eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #15803D; margin: 0 0 8px; }
      h1 { font-size: 26px; line-height: 1.2; color: #1A3E31; margin: 0 0 12px; }
      p { font-size: 15px; line-height: 1.55; color: #4B5563; margin: 0 0 16px; }
      .meta { background: #E8F3EE; border-radius: 14px; padding: 14px 16px; font-size: 14px; color: #1A3E31; margin-bottom: 22px; }
      .btn { display: inline-flex; width: 100%; justify-content: center; align-items: center; gap: 10px; background: #15803D; color: #fff; border: 0; border-radius: 14px; padding: 16px 20px; font-size: 16px; font-weight: 700; cursor: pointer; text-decoration: none; box-sizing: border-box; }
      .btn:hover { background: #166534; }
      .btn:disabled { opacity: 0.6; cursor: wait; }
      .link-back { display: inline-block; margin-top: 18px; font-size: 14px; color: #1A3E31; font-weight: 600; text-decoration: none; }
      .link-back:hover { text-decoration: underline; }
      ul { padding-left: 20px; margin: 12px 0 0; font-size: 14px; color: #4B5563; line-height: 1.6; }
    </style>
  </head>
  <body>
    <main class="card">
      <p class="eyebrow">Exportação Standalone</p>
      <h1>Projeto completo em HTML único</h1>
      <p>Este arquivo contém todo o quiz, CSS, JavaScript, checkout oficial da Hotmart e todas as imagens embutidas em um único <strong>index.html</strong> (${sizeMb} MB).</p>
      <div class="meta">
        <strong>Pronto para publicar:</strong> envie apenas o arquivo <code>index.html</code> para Hostinger, cPanel, Cloudflare Pages, Netlify ou Vercel.
      </div>
      <button id="btn-download" class="btn" type="button">Baixar index.html completo</button>
      <ul>
        <li>Sem dependências externas de pasta <code>assets/</code></li>
        <li>Checkout Hotmart preservado (<code>checkoutMode=10</code>)</li>
        <li>Sincronização EmailOctopus não-bloqueante preservada</li>
      </ul>
      <a class="link-back" href="/">&larr; Voltar ao Quiz</a>
    </main>
    <script>
      document.getElementById('btn-download').addEventListener('click', async function () {
        var btn = this;
        btn.disabled = true;
        btn.textContent = 'Preparando download...';
        try {
          var res = await fetch('/download-html');
          if (!res.ok) throw new Error('Falha ao baixar arquivo');
          var blob = await res.blob();
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'index.html';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
          btn.textContent = 'Download iniciado (index.html)';
        } catch (err) {
          window.location.href = '/download-html';
        } finally {
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = 'Baixar index.html completo';
          }, 1500);
        }
      });
    </script>
  </body>
</html>`);
        return;
      }

      next();
    });
  };

  return {
    name: 'html-download-middleware',
    configureServer(server) {
      attachRoutes(server.middlewares);
    },
    configurePreviewServer(server) {
      attachRoutes(server.middlewares);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), htmlDownloadMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
