"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Text } from "@/components/ui/typography"
import { ChevronRight, ChevronLeft, Save, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react"

const STEPS = [
    "Data Mempelai",
    "Jadwal & Lokasi",
    "Pilih Tema",
    "Konten & Media",
    "Amplop & QRIS",
    "Preview & Publish"
]

export default function EditInvitationWizard({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { id } = params

    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Form State
    const [formData, setFormData] = useState({
        groomName: "",
        groomNickname: "",
        brideName: "",
        brideNickname: "",
        eventType: "akad_resepsi",
        eventDate: "",
        eventTime: "",
        venueName: "",
        venueAddress: "",
        themeId: "minimalist-white",
        greetingText: "",
        qrisEnabled: false,
        qrisAccount: "",
    })

    useEffect(() => {
        // Fetch existing data
        const loadData = async () => {
            try {
                const res = await fetch(`/api/invitations/${id}`)
                const json = await res.json()

                if (!res.ok) throw new Error(json.error?.message || 'Gagal memuat')

                const { data } = json
                const content = data.content || {}

                setFormData({
                    groomName: content.groom_name || "",
                    groomNickname: content.groom_nickname || "",
                    brideName: content.bride_name || "",
                    brideNickname: content.bride_nickname || "",
                    eventType: content.event_type || "akad_resepsi",
                    eventDate: content.event_date ? new Date(content.event_date).toISOString().split('T')[0] : "",
                    eventTime: content.event_time || "",
                    venueName: content.venue_name || "",
                    venueAddress: content.venue_address || "",
                    themeId: data.themes?.slug || "minimalist-white",
                    greetingText: content.greeting_text || "",
                    qrisEnabled: !!content.qris_image_url,
                    qrisAccount: content.qris_image_url || "",
                })
            } catch (err: any) {
                console.error(err)
                alert(err.message)
                router.push("/dashboard")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [id, router])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(s => s + 1)
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(s => s - 1)
        }
    }

    const handleSave = async () => {
        setIsSubmitting(true)
        try {
            // Find theme ID ideally through lookup, for simplicity assume slug matches frontend logic
            // In a full implementation, we would GET /themes to match slug to ID

            const res = await fetch(`/api/invitations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Only send content updates for MVP
                    content: {
                        groom_name: formData.groomName,
                        groom_nickname: formData.groomNickname,
                        bride_name: formData.brideName,
                        bride_nickname: formData.brideNickname,
                        event_type: formData.eventType,
                        event_date: formData.eventDate,
                        event_time: formData.eventTime,
                        venue_name: formData.venueName,
                        venue_address: formData.venueAddress,
                        greeting_text: formData.greetingText,
                        qris_image_url: formData.qrisEnabled ? formData.qrisAccount : null
                    }
                })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error?.message || 'Gagal menyimpan undangan')

            router.push("/dashboard")
        } catch (error: any) {
            console.error(error)
            alert(error.message || 'Terjadi kesalahan sistem')
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center my-20"><Loader2 className="animate-spin text-primary" /></div>
    }

    return (
        <div className="container-md max-w-3xl flex flex-col gap-6 pb-20">
            {/* Same UI as Create, just updating state and calling handleSave */}
            <div className="mb-4">
                <h1 className="text-h2 font-display font-bold text-[var(--color-neutral-900)]">Edit Undangan</h1>
                <Text variant="md" muted>Perbarui data undangan pernikahan Anda.</Text>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                {STEPS.map((step, idx) => (
                    <div key={idx} className="flex flex-col gap-2 min-w-[100px] flex-1">
                        <div className={`h-2 rounded-full w-full transition-colors ${idx <= currentStep ? 'bg-[var(--color-primary-500)]' : 'bg-[var(--color-neutral-200)]'}`} />
                        <span className={`text-caption font-semibold ${idx <= currentStep ? 'text-[var(--color-primary-700)]' : 'text-[var(--color-neutral-400)]'}`}>
                            Langkah {idx + 1}
                        </span>
                        <span className={`text-body-xs ${idx === currentStep ? 'text-[var(--color-neutral-900)] font-bold' : 'text-[var(--color-neutral-500)]'} hidden md:block truncate`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep]}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* STEP 1: Data Mempelai */}
                    {currentStep === 0 && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nama Lengkap Pria" placeholder="Mohammad Andi" value={formData.groomName} onChange={e => setFormData({ ...formData, groomName: e.target.value })} required />
                                <Input label="Nama Panggilan Pria" placeholder="Andi" value={formData.groomNickname} onChange={e => setFormData({ ...formData, groomNickname: e.target.value })} required />
                            </div>
                            <div className="border-t border-[var(--color-neutral-200)] my-2" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nama Lengkap Wanita" placeholder="Rina Angelina" value={formData.brideName} onChange={e => setFormData({ ...formData, brideName: e.target.value })} required />
                                <Input label="Nama Panggilan Wanita" placeholder="Rina" value={formData.brideNickname} onChange={e => setFormData({ ...formData, brideNickname: e.target.value })} required />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Jadwal & Lokasi */}
                    {currentStep === 1 && (
                        <div className="flex flex-col gap-6">
                            <Select label="Jenis Acara" value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })}>
                                <option value="akad">Akad Nikah Saja</option>
                                <option value="resepsi">Resepsi Saja</option>
                                <option value="akad_resepsi">Akad & Resepsi</option>
                            </Select>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Tanggal Acara" type="date" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} required />
                                <Input label="Waktu Acara" type="time" placeholder="09:00 - Selesai" value={formData.eventTime} onChange={e => setFormData({ ...formData, eventTime: e.target.value })} required />
                            </div>
                            <Input label="Nama Venue / Gedung" placeholder="Gedung Sabuga" value={formData.venueName} onChange={e => setFormData({ ...formData, venueName: e.target.value })} required />
                            <Input label="Alamat Lengkap" placeholder="Jl. Tamansari No.73..." value={formData.venueAddress} onChange={e => setFormData({ ...formData, venueAddress: e.target.value })} required />
                        </div>
                    )}

                    {/* STEP 3: Pilih Tema (Disabled in Edit for MVP brevity) */}
                    {currentStep === 2 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--color-neutral-500)] bg-[var(--color-neutral-50)] rounded border border-dashed border-[var(--color-neutral-200)]">
                            <p>Tema saat ini: <strong>{formData.themeId}</strong>.</p>
                            <p className="text-sm mt-2">Untuk mengganti tema, buat undangan baru (MVP).</p>
                        </div>
                    )}

                    {/* STEP 4: Konten & Media */}
                    {currentStep === 3 && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="text-label-sm sm:text-label-lg mb-1 block text-[var(--color-neutral-700)]">Teks Sambutan</label>
                                <textarea
                                    className="w-full rounded-md border text-body-md bg-[var(--color-surface-card)] px-3 py-2 border-[var(--color-neutral-300)] min-h-[120px]"
                                    value={formData.greetingText}
                                    onChange={e => setFormData({ ...formData, greetingText: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Amplop Digital & QRIS */}
                    {currentStep === 4 && (
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="qrisEnabled"
                                    className="w-5 h-5 rounded"
                                    checked={formData.qrisEnabled}
                                    onChange={e => setFormData({ ...formData, qrisEnabled: e.target.checked })}
                                />
                                <label htmlFor="qrisEnabled" className="font-semibold text-[var(--color-neutral-900)]">Aktifkan Fitur Amplop Digital</label>
                            </div>

                            {formData.qrisEnabled && (
                                <div className="p-4 bg-[var(--color-neutral-50)] rounded-lg border border-[var(--color-neutral-200)] flex flex-col gap-4">
                                    <Input label="Nomor Rekening / Dana / GoPay" placeholder="BCA 12345678 a/n Rina" value={formData.qrisAccount} onChange={e => setFormData({ ...formData, qrisAccount: e.target.value })} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 6: Preview & Publish */}
                    {currentStep === 5 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <h3 className="text-h3 font-display font-bold mb-2">Simpan Perubahan</h3>
                            <p className="text-body-md text-[var(--color-neutral-600)] max-w-md">
                                Klik tombol simpan untuk memperbarui undangan Anda.
                            </p>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between border-t border-[var(--color-neutral-100)] pt-6">
                    <Button
                        variant="ghost"
                        onClick={handlePrev}
                        disabled={currentStep === 0 || isSubmitting}
                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                    >
                        Kembali
                    </Button>

                    {currentStep < STEPS.length - 1 ? (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                            Lanjut
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSubmitting}
                            loadingText="Menyimpan..."
                            leftIcon={<Save className="w-4 h-4" />}
                        >
                            Simpan Perubahan
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
