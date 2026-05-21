-- 기존 reservations 테이블이 message 컬럼만 있는 경우 업그레이드
alter table public.reservations
  add column if not exists contact text,
  add column if not exists memo text;

-- message에 연락처가 들어가 있던 데이터 이전
update public.reservations
set
  contact = trim(replace(split_part(message, E'\n', 1), '연락처:', '')),
  memo = nullif(trim(substring(message from position(E'\n' in message) + 1)), '')
where contact is null
  and message is not null
  and message like '연락처:%';

update public.reservations
set contact = coalesce(contact, '미입력')
where contact is null;

alter table public.reservations
  alter column contact set not null;

alter table public.reservations
  drop column if exists message;
