"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuestConversion() {
    const router = useRouter();

    useEffect(() => {
        // After login/register, claim is already done in login/register page.
        // Here we just force a server-side refresh so dashboard re-fetches
        // guest_sessions from Supabase with the updated user_id.
        router.refresh();
    }, [router]);

    return null;
}
