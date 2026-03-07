"use server"

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // SIMPLE LOGIN BYPASS (Requested by user)
    if (email === 'admin' && password === 'admin') {
        const cookieStore = await cookies()
        cookieStore.set('nikahku-mock-session', 'true', { path: '/' })
        redirect('/dashboard')
    }

    const supabase = await createClient()
    if (!supabase) redirect('/login?message=Supabase is not configured')

    // Use string inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?message=Could not authenticate user')
    }

    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    if (!supabase) redirect('/register?message=Supabase is not configured')

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('fullName') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/register?message=Could not authenticate user')
    }

    redirect('/login?message=Check email to continue sign in process')
}

export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete('nikahku-mock-session')

    const supabase = await createClient()
    if (supabase) {
        await supabase.auth.signOut()
    }
    return redirect('/login')
}
