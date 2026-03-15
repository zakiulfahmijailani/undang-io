"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function GuestSessionClearer() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const shouldClear = searchParams.get('clear_guest_session');
        if (shouldClear === 'true') {
            console.log("Clearing guest session from localStorage...");
            localStorage.removeItem('guest_session');
            // To avoid re-clearing on re-renders, we might want to update the URL
            // but for now, this is fine as it only runs once on mount.
        }
    }, [searchParams]);

    return null; // This component renders nothing.
}
