import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: '.',
    publicDir: 'public',
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    plugins: [
      {
        name: 'inject-supabase-config',
        transformIndexHtml(html) {
          const config = JSON.stringify({
            url: env.VITE_SUPABASE_URL || '',
            anonKey: env.VITE_SUPABASE_ANON_KEY || '',
          });
          const tag =
            '<script type="application/json" id="supabase-config">' +
            config +
            '</script>\n';
          return html
            .replace(/\.\/public\//g, '/')
            .replace('</body>', tag + '</body>');
        },
      },
    ],
  };
});
