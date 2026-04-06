"use server"

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const guestSessionToken = formData.get('guestSessionToken') as string | null

    const supabase = await createServerSupabaseClient()
    if (!supabase) redirect('/login?message=Supabase is not configured')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        redirect('/login?message=Could not authenticate user')
    }

    // If there's a guest session token, call the claim API
    if (guestSessionToken) {
        try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            await fetch(`${siteUrl}/api/guest-sessions/${guestSessionToken}/claim`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (e) {
            console.error('Failed to claim guest session after login:', e)
        }
        redirect(`/u/${guestSessionToken}?claimed=true`)
    }

    redirect('/dashboard')
}


export async function signup(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    if (!supabase) redirect('/register?message=Supabase is not configured')

    const guestSessionToken = formData.get('guestSessionToken') as string | null;

    const options: { data: { [key: string]: any; }; emailRedirectTo?: string; } = {
        data: {
            full_name: formData.get('fullName') as string,
        }
    };

    if (guestSessionToken) {
        const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
        url.pathname = '/auth/callback';
        url.searchParams.set('guest_session_token', guestSessionToken);
        options.emailRedirectTo = url.toString();
    }

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/register?message=Could not authenticate user')
    }

    redirect('/login?message=Check email to continue sign in process')
}

export async function signOut() {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
        await supabase.auth.signOut()
    }
    return redirect('/login')
}
