import { defineConfig, loadEnv } from 'vite';

const DEFAULT_SUPABASE_URL = 'https://temwlevjlyaivfltyeca.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbXdsZXZqbHlhaXZmbHR5ZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNTA2MDIsImV4cCI6MjA5NDkyNjYwMn0.RIWdd6j9puuUmoplrWsN-8UWhkvpL1-45sNMEEovKCU';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

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
            url: supabaseUrl,
            anonKey: supabaseAnonKey,
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
