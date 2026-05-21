-- Room No.9 예약 (이름, 연락처, 날짜, 시간, 인원, 간편 주문, 메모)
-- Supabase에 이미 테이블이 있으면 실행하지 않아도 됩니다.
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  date date not null,
  time time not null,
  people integer not null default 1 check (people >= 1 and people <= 6),
  order_categories text[] not null default '{}'::text[],
  order_items text[] not null default '{}'::text[],
  memo text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.reservations is 'Room No.9 랜딩 예약 신청';

alter table public.reservations enable row level security;

drop policy if exists "Allow anonymous insert" on public.reservations;
drop policy if exists "Deny anonymous read" on public.reservations;

create policy "Allow anonymous insert"
  on public.reservations
  for insert
  to anon
  with check (true);

create policy "Deny anonymous read"
  on public.reservations
  for select
  to anon
  using (false);
