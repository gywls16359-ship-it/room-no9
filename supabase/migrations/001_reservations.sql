-- Room No.9 예약 (랜딩 폼: 이름, 연락처, 날짜, 시간, 인원, 메모)
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  date date not null,
  time time not null,
  people integer not null default 1 check (people >= 1 and people <= 20),
  memo text,
  order_category text,
  order_items text[],
  created_at timestamptz not null default now()
);

comment on table public.reservations is 'Room No.9 랜딩 예약 신청';
comment on column public.reservations.name is '예약자 이름';
comment on column public.reservations.contact is '연락처';
comment on column public.reservations.date is '예약 날짜';
comment on column public.reservations.time is '예약 시간';
comment on column public.reservations.people is '인원';
comment on column public.reservations.memo is '메모';
comment on column public.reservations.order_category is '간편 주문 카테고리';
comment on column public.reservations.order_items is '간편 주문 선택 항목';

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
