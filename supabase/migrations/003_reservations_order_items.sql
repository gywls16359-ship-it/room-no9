-- 간편 주문 항목 (카테고리 + 선택 메뉴)
alter table public.reservations
  add column if not exists order_category text,
  add column if not exists order_items text[];

comment on column public.reservations.order_category is '간편 주문 카테고리 (wine, signature, food)';
comment on column public.reservations.order_items is '간편 주문 선택 항목';
