"use client";

import { useEffect } from "react";

export default function GuestConversion() {
    useEffect(() => {
        // After login, the guest session has already been claimed via /api/auth/callback
        // or /api/guest-sessions/[token]/claim (email login).
        // We just need to clear localStorage — no conversion to invitations yet.
        // Permanent conversion only happens after payment.
        const raw = localStorage.getItem("guest_session");
        if (raw) {
            try {
                const session = JSON.parse(raw);
                if (session.sessionToken) {
                    localStorage.removeItem("guest_session");
                    localStorage.removeItem("guest_return_slug");
                }
            } catch (e) {}
        }
    }, []);

    return null;
}
