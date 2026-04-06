'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ActionResult, SectionConfig, AssetKind } from '@/types/theme'

const ADMIN_ROLES = ['admin', 'owner']

async function getAuthorizedUser() {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { supabase, user: null, authorized: false }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const authorized = !!profile && ADMIN_ROLES.includes(profile.role)
  return { supabase, user, authorized }
}

// 1. Buat tema baru
export async function createTheme(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user, authorized } = await getAuthorizedUser()
    if (!user || !authorized) {
      return { success: false, error: 'Unauthorized: Admin/Owner access required' }
    }

    const theme_key = formData.get('theme_key') as string
    const display_name = formData.get('display_name') as string

    if (!theme_key || !display_name) {
      return { success: false, error: 'theme_key and display_name are required' }
    }

    const { data, error } = await supabase
      .from('themes')
      .insert({ theme_key, display_name })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/themes')
    return { success: true, data }
  } catch (error: any) {
    console.error('Error creating theme:', error)
    return { success: false, error: error.message || 'Failed to create theme' }
  }
}

export interface UpdateThemeData {
  display_name?: string;
  culture?: string;
  color_primary?: string;
  color_accent?: string;
  color_text?: string;
  color_cta?: string;
  mood_keywords?: string[];
  is_premium?: boolean;
}

// 2. Update info tema
export async function updateThemeInfo(themeKey: string, data: UpdateThemeData): Promise<ActionResult> {
  try {
    const { supabase, user, authorized } = await getAuthorizedUser()
    if (!user || !authorized) return { success: false, error: 'Unauthorized' }

    const { data: updatedTheme, error } = await supabase
      .from('themes')
      .update(data)
      .eq('theme_key', themeKey)
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/dashboard/themes/${themeKey}/assets`)
    return { success: true, data: updatedTheme }
  } catch (error: any) {
    console.error('Error updating theme:', error)
    return { success: false, error: error.message || 'Failed to update theme info' }
  }
}

// 3. Toggle aktif/nonaktif tema
export async function toggleThemeActive(themeKey: string, is_active: boolean): Promise<ActionResult> {
  try {
    const { supabase, user, authorized } = await getAuthorizedUser()
    if (!user || !authorized) return { success: false, error: 'Unauthorized' }

    const { data, error } = await supabase
      .from('themes')
      .update({ is_active })
      .eq('theme_key', themeKey)
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/dashboard/themes/${themeKey}/assets`)
    revalidatePath('/dashboard/themes')
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to toggle theme status' }
  }
}

// 4. Hapus aset dari storage + database
export async function deleteThemeAsset(themeKey: string, slot: AssetKind): Promise<ActionResult> {
  try {
    const { supabase, user, authorized } = await getAuthorizedUser()
    if (!user || !authorized) return { success: false, error: 'Unauthorized' }

    // Identify the asset
    const { data: asset, error: fetchError } = await supabase
      .from('theme_assets')
      .select('*')
      .eq('theme_key', themeKey)
      .eq('slot', slot)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (asset && asset.storage_path) {
      const { error: storageError } = await supabase
        .storage
        .from('theme-assets')
        .remove([asset.storage_path])

      if (storageError) {
        console.error('Failed to remove from storage, continuing to delete DB record', storageError)
      }
    }

    const { error: deleteError } = await supabase
      .from('theme_assets')
      .delete()
      .eq('theme_key', themeKey)
      .eq('slot', slot)

    if (deleteError) throw deleteError

    revalidatePath(`/dashboard/themes/${themeKey}/assets`)
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    return { success: false, error: error.message || 'Failed to delete asset' }
  }
}

// 5. Update section config
export async function updateSectionConfig(themeKey: string, section_config: SectionConfig): Promise<ActionResult> {
  try {
    const { supabase, user, authorized } = await getAuthorizedUser()
    if (!user || !authorized) return { success: false, error: 'Unauthorized' }

    const { data, error } = await supabase
      .from('themes')
      .update({ section_config })
      .eq('theme_key', themeKey)
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/dashboard/themes/${themeKey}/assets`)
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update section config' }
  }
}

// 6. Save uploaded asset metadata
export async function saveUploadedAsset(
  themeKey: string,
  slot: AssetKind,
  fileUrl: string,
  storagePath: string,
  extra: {
    mime_type?: string;
    file_size_bytes?: number;
    width_px?: number;
    height_px?: number;
    is_transparent?: boolean;
  }
): Promise<ActionResult> {
  try {
    const { supabase, user, authorized } = await getAuthorizedUser()
    if (!user || !authorized) return { success: false, error: 'Unauthorized' }

    // Get theme uuid
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('id')
      .eq('theme_key', themeKey)
      .single()

    if (themeError) throw themeError

    const { data, error } = await supabase
      .from('theme_assets')
      .upsert({
        theme_id: theme.id,
        theme_key: themeKey,
        slot,
        file_url: fileUrl,
        storage_path: storagePath,
        uploaded_by: user.id,
        uploaded_at: new Date().toISOString(),
        ...extra
      }, { onConflict: 'theme_id, slot' })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/dashboard/themes/${themeKey}/assets`)
    return { success: true, data }
  } catch (error: any) {
    console.error('Error saving asset metadata:', error)
    return { success: false, error: error.message || 'Failed to save asset info' }
  }
}
