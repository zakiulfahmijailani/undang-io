"use client"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        if (supabase) {
            await supabase.auth.signOut()
        }
        router.push("/login")
    }

    return (
        <Button variant="ghost" className="w-full justify-start text-[var(--color-error-base)] hover:text-[var(--color-error-dark)] hover:bg-[var(--color-error-light)]" onClick={handleSignOut} leftIcon={<LogOut className="w-4 h-4" />}>
            Keluar
        </Button>
    )
}
