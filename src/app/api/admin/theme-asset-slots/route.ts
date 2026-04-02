/**
 * API Route: /api/admin/theme-asset-slots
 *
 * Handles INSERT/UPDATE/DELETE on `theme_asset_slots` table.
 * Uses getAdminClient() (SERVICE_ROLE_KEY) to bypass RLS — this is intentional
 * because RLS write policies for this table require complex role checks that
 * are simpler to enforce here at the API layer (auth session check).
 *
 * Auth guard: request must carry a valid Supabase session cookie (authenticated user).
 * Role guard: user must have role 'admin' or 'owner' in public.profiles.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

async function requireAdminUser(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'owner'].includes(profile.role)) return null;
  return user;
}

// POST — upsert a single slot
export async function POST(req: NextRequest) {
  const user = await requireAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: 'Server misconfiguration: admin client unavailable' }, { status: 500 });
  }

  const body = await req.json();
  const { theme_id, slot_key, slot_label, asset_url, asset_type, display_order, is_active, is_required } = body;

  if (!theme_id || !slot_key || !asset_url) {
    return NextResponse.json({ error: 'Missing required fields: theme_id, slot_key, asset_url' }, { status: 400 });
  }

  const { data, error } = await admin.from('theme_asset_slots').upsert(
    { theme_id, slot_key, slot_label, asset_url, asset_type, display_order, is_active, is_required },
    { onConflict: 'theme_id, slot_key' }
  ).select().single();

  if (error) {
    console.error('[theme-asset-slots POST] DB error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

// DELETE — remove a slot by theme_id + slot_key
export async function DELETE(req: NextRequest) {
  const user = await requireAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: 'Server misconfiguration: admin client unavailable' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const theme_id = searchParams.get('theme_id');
  const slot_key = searchParams.get('slot_key');

  if (!theme_id || !slot_key) {
    return NextResponse.json({ error: 'Missing query params: theme_id, slot_key' }, { status: 400 });
  }

  const { error } = await admin
    .from('theme_asset_slots')
    .delete()
    .eq('theme_id', theme_id)
    .eq('slot_key', slot_key);

  if (error) {
    console.error('[theme-asset-slots DELETE] DB error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
