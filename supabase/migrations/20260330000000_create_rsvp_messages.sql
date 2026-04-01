create table public.rsvp_messages (
  id             uuid         default gen_random_uuid() primary key,
  invitation_id  text         not null,
  name           text         not null,
  message        text         not null,
  attendance     text         not null,
  created_at     timestamptz  default now() not null,
  constraint rsvp_attendance_check
    check (attendance in ('hadir', 'tidak_hadir', 'masih_ragu'))
);

create index idx_rsvp_invitation_id
  on public.rsvp_messages (invitation_id, created_at desc);

alter table public.rsvp_messages enable row level security;

create policy "rsvp_read_public"
  on public.rsvp_messages for select using (true);

create policy "rsvp_insert_public"
  on public.rsvp_messages for insert with check (true);
