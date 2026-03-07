import { notFound } from "next/navigation"
import MinimalistWhite from "@/components/themes/MinimalistWhite"
import GardenRomance from "@/components/themes/GardenRomance"
import ClassicJavanese from "@/components/themes/ClassicJavanese"
import ModernBold from "@/components/themes/ModernBold"
import RusticBoho from "@/components/themes/RusticBoho"
import SundaneseElegance from "@/components/themes/SundaneseElegance"
import { createClient } from "@/lib/supabase/server"

export default async function PublicInvitationPage({
    params
}: {
    params: { slug: string }
}) {
    const supabase = await createClient()
    let invitation = null
    let error = null

    if (supabase) {
        const result = await supabase
            .from('invitations')
            .select('*, themes(slug), invitation_content(*)')
            .eq('slug', params.slug)
            .single()
        invitation = result.data
        error = result.error
    }

    // For MVP if no database seeded, just show dummy UI for testing
    const dummyContent = {
        groom_name: "Mohammad Andi",
        groom_nickname: "Andi",
        groom_parents: "Bapak Budi & Ibu Ani",
        bride_name: "Rina Angelina",
        bride_nickname: "Rina",
        bride_parents: "Bapak Joko & Ibu Siti",
        event_type: "akad_resepsi",
        event_date: "2026-08-17T09:00:00Z",
        event_time: "09:00 - Selesai",
        venue_name: "Gelora Bung Karno",
        venue_address: "Senayan, Jakarta Pusat",
        greeting_text: "Assalamu'alaikum Wr. Wb. Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.",
        qris_image_url: null,
        bank_accounts: [{ bank: "BCA", account_number: "1234567890", account_name: "Andi" }, { bank: "GoPay", account_number: "081234567890", account_name: "Rina" }]
    }

    const content = invitation?.invitation_content?.[0] || dummyContent
    const themeId = invitation?.themes?.slug || 'garden-romance' // Check garden romance by default if no db

    // Dynamic Theme Selection
    switch (themeId) {
        case 'minimalist-white':
            return <MinimalistWhite content={content} invitationId={invitation?.id || 'mock-id'} />
        case 'garden-romance':
        case 'garden romance':
            return <GardenRomance content={content} invitationId={invitation?.id || 'mock-id'} />
        case 'classic-javanese':
            return <ClassicJavanese content={content} invitationId={invitation?.id || 'mock-id'} />
        case 'modern-bold':
            return <ModernBold content={content} invitationId={invitation?.id || 'mock-id'} />
        case 'rustic-boho':
            return <RusticBoho content={content} invitationId={invitation?.id || 'mock-id'} />
        case 'sundanese-elegance':
            return <SundaneseElegance content={content} invitationId={invitation?.id || 'mock-id'} />
        default:
            return <MinimalistWhite content={content} invitationId={invitation?.id || 'mock-id'} />
    }
}
