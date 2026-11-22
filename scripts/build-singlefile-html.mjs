import fs from 'node:fs/promises';
import path from 'node:path';

// Garantir build de produção mesmo quando NODE_ENV=development estiver ativo no ambiente
process.env.NODE_ENV = 'production';

const { build } = await import('vite');
const { default: react } = await import('@vitejs/plugin-react');
const { default: tailwindcss } = await import('@tailwindcss/vite');

const rootDir = path.resolve(import.meta.dirname, '..');
const outDir = path.join(rootDir, 'dist-html');
const tmpDir = path.join(rootDir, '.tmp-singlefile-build');

function escapeScriptClose(jsCode) {
  return jsCode.replace(/<\/script/gi, '<\\/script');
}

function escapeStyleClose(cssCode) {
  return cssCode.replace(/<\/style/gi, '<\\/style');
}

async function main() {
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.rm(outDir, { recursive: true, force: true });

  await build({
    root: rootDir,
    envDir: rootDir,
    mode: 'production',
    configFile: false,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    base: './',
    build: {
      outDir: tmpDir,
      emptyOutDir: true,
      copyPublicDir: false,
      assetsInlineLimit: 100 * 1024 * 1024, // Incorporar todas as imagens em base64
      cssCodeSplit: false,
      chunkSizeWarningLimit: 10000,
      rolldownOptions: {
        output: {
          codeSplitting: false,
        },
      },
    },
  });

  const builtHtmlPath = path.join(tmpDir, 'index.html');
  let html = await fs.readFile(builtHtmlPath, 'utf8');

  const assetsDir = path.join(tmpDir, 'assets');
  const assetFiles = await fs.readdir(assetsDir);

  const cssChunks = [];
  const jsChunks = [];
  const leftoverAssets = [];

  for (const fileName of assetFiles) {
    const filePath = path.join(assetsDir, fileName);
    if (fileName.endsWith('.css')) {
      cssChunks.push(await fs.readFile(filePath, 'utf8'));
    } else if (fileName.endsWith('.js')) {
      jsChunks.push(await fs.readFile(filePath, 'utf8'));
    } else {
      leftoverAssets.push(fileName);
    }
  }

  if (leftoverAssets.length > 0) {
    throw new Error(
      `Assets não incorporados no HTML único: ${leftoverAssets.join(', ')}`
    );
  }

  // Remover links externos de CSS, modulepreload e scripts externos do build
  html = html.replace(/<link[^>]+rel=["']modulepreload["'][^>]*>\s*/gi, '');
  html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*href=["'][^"']*assets\/[^"']+\.css["'][^>]*>\s*/gi, '');
  html = html.replace(/<script[^>]+src=["'][^"']*assets\/[^"']+\.js["'][^>]*>\s*<\/script>\s*/gi, '');

  if (cssChunks.length > 0) {
    const styleTag = `<style>\n${escapeStyleClose(cssChunks.join('\n'))}\n</style>`;
    html = html.replace(/<\/head>/i, () => `    ${styleTag}\n  </head>`);
  }

  if (jsChunks.length > 0) {
    const scriptTag = `<script type="module">\n${escapeScriptClose(jsChunks.join('\n'))}\n</script>`;
    html = html.replace(/<\/body>/i, () => `    ${scriptTag}\n  </body>`);
  }

  await fs.mkdir(outDir, { recursive: true });
  const finalHtmlPath = path.join(outDir, 'index.html');
  await fs.writeFile(finalHtmlPath, html, 'utf8');
  await fs.rm(tmpDir, { recursive: true, force: true });

  const stats = await fs.stat(finalHtmlPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`HTML único de produção gerado em dist-html/index.html (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error('Erro ao gerar HTML único:', err);
  process.exit(1);
});
