/** Supabase — Vite env 우선, 없으면 Room No.9 프로젝트 기본값(anon 공개 키) */
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://uvrlchwzcdmfpwdllbpi.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cmxjaHd6Y2RtZnB3ZGxsYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzQzMDYsImV4cCI6MjA5NDkxMDMwNn0.Qy--uf_XduKU5aZdeeroclCUe3DCc35NiuDyrqz1_6E';
