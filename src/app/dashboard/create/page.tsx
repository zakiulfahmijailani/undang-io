"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Text } from "@/components/ui/typography"
import { ChevronRight, ChevronLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react"

// Note: MVP simple state management without React Hook Form for brevity, 
// but functional enough for the wizard flow.

const STEPS = [
    "Data Mempelai",
    "Jadwal & Lokasi",
    "Pilih Tema",
    "Konten & Media",
    "Amplop & QRIS",
    "Preview & Publish"
]

export default function CreateInvitationWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

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
        greetingText: "Assalamu'alaikum Wr. Wb. Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.",
        qrisEnabled: false,
        qrisAccount: "",
    })

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

    const handlePublish = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groom: { full_name: formData.groomName, nickname: formData.groomNickname },
                    bride: { full_name: formData.brideName, nickname: formData.brideNickname },
                    events: [{
                        type: formData.eventType,
                        date: formData.eventDate,
                        start_time: formData.eventTime,
                        venue_name: formData.venueName,
                        venue_address: formData.venueAddress
                    }],
                    theme_id: formData.themeId,
                    opening_text: formData.greetingText,
                    digital_gift: formData.qrisEnabled ? { qris_image_url: formData.qrisAccount } : null,
                    status: 'published'
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

    return (
        <div className="container-md max-w-3xl flex flex-col gap-6 pb-20">
            <div className="mb-4">
                <h1 className="text-h2 font-display font-bold text-[var(--color-neutral-900)]">Buat Undangan</h1>
                <Text variant="md" muted>Lengkapi data berikut untuk membuat undangan digital Anda.</Text>
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
                    <CardDescription>
                        {currentStep === 0 && "Masukkan data lengkap pengantin pria dan wanita."}
                        {currentStep === 1 && "Tentukan waktu dan tempat acara diselenggarakan."}
                        {currentStep === 2 && "Pilih tema undangan yang sesuai dengan selera Anda."}
                        {currentStep === 3 && "Tambahkan foto prewedding dan kata-kata sambutan."}
                        {currentStep === 4 && "Aktifkan fitur amplop digital untuk menerima hadiah secara cashless."}
                        {currentStep === 5 && "Periksa kembali undangan Anda sebelum membagikannya ke tamu."}
                    </CardDescription>
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

                    {/* STEP 3: Pilih Tema */}
                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Minimalist White', 'Garden Romance', 'Classic Javanese (Premium)', 'Modern Bold'].map((theme, i) => (
                                <div
                                    key={i}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.themeId === theme.toLowerCase().replace(/ \(.+\)/, '').replace(' ', '-')
                                        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                                        : 'border-[var(--color-neutral-200)] hover:border-[var(--color-primary-300)]'
                                        }`}
                                    onClick={() => setFormData({ ...formData, themeId: theme.toLowerCase().replace(/ \(.+\)/, '').replace(' ', '-') })}
                                >
                                    <div className="w-full h-32 bg-[var(--color-neutral-200)] rounded flex items-center justify-center mb-3">
                                        <ImageIcon className="text-[var(--color-neutral-400)] w-8 h-8" />
                                    </div>
                                    <h4 className="font-semibold">{theme}</h4>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 4: Konten & Media */}
                    {currentStep === 3 && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="text-label-sm sm:text-label-lg mb-1 block text-[var(--color-neutral-700)]">Teks Sambutan</label>
                                <textarea
                                    className="w-full rounded-md border text-body-md bg-[var(--color-surface-card)] px-3 py-2 border-[var(--color-neutral-300)] min-h-[120px] focus-visible:outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)]"
                                    value={formData.greetingText}
                                    onChange={e => setFormData({ ...formData, greetingText: e.target.value })}
                                />
                                <Button variant="secondary" size="sm" className="mt-2 text-[var(--color-primary-600)] border-[var(--color-primary-200)] hover:bg-[var(--color-primary-50)]" onClick={() => { }} leftIcon={<Sparkles className="w-4 h-4" />}>
                                    Bantu tulis dengan AI
                                </Button>
                            </div>
                            <div className="border border-dashed border-[var(--color-neutral-300)] rounded-lg p-8 flex flex-col items-center justify-center text-center bg-[var(--color-neutral-50)]">
                                <ImageIcon className="w-8 h-8 text-[var(--color-neutral-400)] mb-2" />
                                <h4 className="font-semibold text-[var(--color-neutral-700)]">Upload Foto Galeri</h4>
                                <p className="text-caption text-[var(--color-neutral-500)] mt-1 mb-4">Maksimal 6 foto. Format JPG, PNG.</p>
                                <Button variant="secondary" size="sm">Pilih File</Button>
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
                                    className="w-5 h-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                                    checked={formData.qrisEnabled}
                                    onChange={e => setFormData({ ...formData, qrisEnabled: e.target.checked })}
                                />
                                <label htmlFor="qrisEnabled" className="font-semibold text-[var(--color-neutral-900)]">Aktifkan Fitur Amplop Digital</label>
                            </div>

                            {formData.qrisEnabled && (
                                <div className="p-4 bg-[var(--color-neutral-50)] rounded-lg border border-[var(--color-neutral-200)] flex flex-col gap-4">
                                    <Input label="Nomor Rekening / Dana / GoPay" placeholder="BCA 12345678 a/n Rina" value={formData.qrisAccount} onChange={e => setFormData({ ...formData, qrisAccount: e.target.value })} />
                                    <div className="border border-dashed border-[var(--color-neutral-300)] rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white">
                                        <p className="text-body-sm font-semibold mb-2">Upload QRIS (Opsional)</p>
                                        <Button variant="secondary" size="sm">Pilih Gambar QRIS</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 6: Preview & Publish */}
                    {currentStep === 5 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--color-success-light)] text-[var(--color-success-base)] flex items-center justify-center mb-4">
                                <Save className="w-8 h-8" />
                            </div>
                            <h3 className="text-h3 font-display font-bold mb-2">Undangan Siap Diterbitkan</h3>
                            <p className="text-body-md text-[var(--color-neutral-600)] max-w-md">
                                Mohon periksa kembali semua data. Anda masih bisa mengubahnya nanti melalui dashboard.
                            </p>

                            <div className="mt-8 p-4 bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-lg w-full text-left">
                                <h4 className="font-semibold border-b border-[var(--color-neutral-200)] pb-2 mb-2">Ringkasan</h4>
                                <div className="grid grid-cols-2 gap-y-2 text-body-sm">
                                    <span className="text-[var(--color-neutral-500)]">Mempelai:</span>
                                    <span className="font-medium">{formData.groomNickname} & {formData.brideNickname}</span>
                                    <span className="text-[var(--color-neutral-500)]">Tema:</span>
                                    <span className="font-medium capitalize">{formData.themeId.replace('-', ' ')}</span>
                                    <span className="text-[var(--color-neutral-500)]">Amplop Digital:</span>
                                    <span className="font-medium">{formData.qrisEnabled ? 'Aktif' : 'Nonaktif'}</span>
                                </div>
                            </div>
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
                            onClick={handlePublish}
                            isLoading={isSubmitting}
                            loadingText="Menerbitkan..."
                            leftIcon={<Save className="w-4 h-4" />}
                        >
                            Terbitkan Undangan
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
