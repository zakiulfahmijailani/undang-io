import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const guestSessionToken = searchParams.get('guest_session_token')
  
  // The 'next' param is used for redirection after successful login
  let next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (!sessionError) {
      // --- GUEST CONVERSION LOGIC ---
      if (guestSessionToken) {
        console.log("Guest session token found, attempting conversion:", guestSessionToken);
        const supabaseAdmin = getAdminClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (supabaseAdmin && user) {
          // 1. Find the guest session
          const { data: guestSession, error: guestError } = await supabaseAdmin
            .from('guest_sessions')
            .select('*')
            .eq('session_token', guestSessionToken)
            .single()

          if (guestError) console.error("Error fetching guest session:", guestError.message);

          if (guestSession && !guestSession.converted_to_invitation_id) {
            console.log("Found valid guest session for user:", user.id);
            
            // 2. Create a new invitation from guest data
            const { invitation_data, theme_id, slug } = guestSession
            const { data: newInvitation, error: invitationError } = await supabaseAdmin
              .from('invitations')
              .insert({
                user_id: user.id,
                slug,
                theme_id,
                ...invitation_data, // Spread the JSONB data
                status: 'draft',
                is_trial: true,
                expires_at: guestSession.expires_at,
              })
              .select('id')
              .single()

            if (invitationError) console.error("Error creating invitation from guest session:", invitationError.message);

            if (newInvitation) {
              console.log("Successfully created new invitation:", newInvitation.id);

              // 3. Mark guest session as converted
              const { error: updateError } = await supabaseAdmin
                .from('guest_sessions')
                .update({ converted_to_invitation_id: newInvitation.id, updated_at: new Date().toISOString() })
                .eq('id', guestSession.id)
              
              if (updateError) console.error("Error marking guest session as converted:", updateError.message);

              // 4. Redirect user to their new invitation
              next = `/dashboard/undangan/${newInvitation.id}`
              console.log("Redirecting to new invitation:", next);

              // 5. Clean up localStorage on the client
              // We can't do this from the server, but we can send a flag.
              const url = new URL(request.url)
              const cleanNextUrl = new URL(next, url.origin)
              cleanNextUrl.searchParams.set('clear_guest_session', 'true')
              next = `${cleanNextUrl.pathname}${cleanNextUrl.search}`
            }
          }
        } else {
          if (!user) console.error("Conversion failed: could not get user.");
          if (!supabaseAdmin) console.error("Conversion failed: could not get admin client.");
        }
      }
      // --- END GUEST CONVERSION LOGIC ---

      // Standard redirect logic
      const forwardedHost = request.headers.get('x-forwarded-host') // Vercel
      const isLocalhost = origin.includes('localhost')

      if (isLocalhost) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
        console.error("Auth callback sessionError:", sessionError.message);
    }
  }

  // return the user to an error page with instructions
  console.log("Auth callback failed, redirecting to login.");
  return NextResponse.redirect(`${origin}/login?message=Could not login with provider`)
}
