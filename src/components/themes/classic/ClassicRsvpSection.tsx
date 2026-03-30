"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { ClassicThemeAssets, ClassicInvitationData } from "@/types/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type AttendanceStatus = "hadir" | "tidak_hadir" | "masih_ragu";

interface RsvpMessage {
    id: string;
    name: string;
    message: string;
    attendance: AttendanceStatus;
    created_at: string;
}

interface FormState {
    name: string;
    message: string;
    attendance: AttendanceStatus;
}

interface Props {
    assets: ClassicThemeAssets;
    data: ClassicInvitationData;
    invitationId: string;
}

// ─── Attendance badge label ───────────────────────────────────────────────────
const ATTENDANCE_LABEL: Record<AttendanceStatus, string> = {
    hadir: "✓ Hadir",
    tidak_hadir: "✗ Tidak Hadir",
    masih_ragu: "? Masih Ragu",
};

const ATTENDANCE_COLOR: Record<AttendanceStatus, string> = {
    hadir: "#4ade80",
    tidak_hadir: "#f87171",
    masih_ragu: "#fbbf24",
};

// ─── Single ucapan card ───────────────────────────────────────────────────────
function UcapanCard({
    msg,
    index,
    assets,
}: {
    msg: RsvpMessage;
    index: number;
    assets: ClassicThemeAssets;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-4"
            style={{
                backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
                border: `1px solid ${assets.color_primary}1a`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
        >
            {/* Header: nama + badge kehadiran */}
            <div className="mb-2 flex items-start justify-between gap-2">
                <p
                    className="font-semibold text-sm leading-tight"
                    style={{
                        color: assets.color_primary,
                        fontFamily: `var(--classic-font-display)`,
                    }}
                >
                    {msg.name}
                </p>
                <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                        backgroundColor: `${ATTENDANCE_COLOR[msg.attendance]}22`,
                        color: ATTENDANCE_COLOR[msg.attendance],
                    }}
                >
                    {ATTENDANCE_LABEL[msg.attendance]}
                </span>
            </div>

            {/* Isi ucapan */}
            <p
                className="text-sm leading-relaxed"
                style={{
                    color: assets.color_text_body ?? "#3d2e1e",
                    fontFamily: `var(--classic-font-body)`,
                    opacity: 0.85,
                }}
            >
                &ldquo;{msg.message}&rdquo;
            </p>

            {/* Timestamp */}
            <p
                className="mt-2 text-xs opacity-40"
                style={{ color: assets.color_text_body ?? "#3d2e1e" }}
            >
                {new Date(msg.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </p>
        </motion.div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function ClassicRsvpSection({ assets, data, invitationId }: Props) {
    // ── Form state
    const [form, setForm] = useState<FormState>({
        name: "",
        message: "",
        attendance: "hadir",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // ── Messages state
    const [messages, setMessages] = useState<RsvpMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 10;

    const listRef = useRef<HTMLDivElement>(null);

    // ── Fetch ucapan dari Supabase
    const fetchMessages = async (pageNum: number, replace = false) => {
        if (!invitationId) return;

        const supabase = createClient();
        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data: rows, error } = await supabase
            .from("rsvp_messages")
            .select("id, name, message, attendance, created_at")
            .eq("invitation_id", invitationId)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            console.error("[ClassicRsvpSection] fetch error:", error.message);
            setLoading(false);
            return;
        }

        const fetched = (rows ?? []) as RsvpMessage[];
        setMessages(prev => replace ? fetched : [...prev, ...fetched]);
        setHasMore(fetched.length === PAGE_SIZE);
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages(0, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invitationId]);

    // ── Load more
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage);
    };

    // ── Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi minimal
        if (!form.name.trim()) {
            setErrorMsg("Nama tidak boleh kosong.");
            return;
        }
        if (!form.message.trim()) {
            setErrorMsg("Ucapan tidak boleh kosong.");
            return;
        }

        setErrorMsg("");
        setSubmitting(true);

        const supabase = createClient();
        const { error } = await supabase.from("rsvp_messages").insert({
            invitation_id: invitationId,
            name: form.name.trim(),
            message: form.message.trim(),
            attendance: form.attendance,
        });

        if (error) {
            console.error("[ClassicRsvpSection] insert error:", error.message);
            setSubmitStatus("error");
            setErrorMsg("Gagal mengirim ucapan. Silakan coba lagi.");
            setSubmitting(false);
            return;
        }

        // Reset form
        setForm({ name: "", message: "", attendance: "hadir" });
        setSubmitStatus("success");
        setSubmitting(false);

        // Refresh list dari awal
        setPage(0);
        setLoading(true);
        fetchMessages(0, true);

        // Reset status sukses setelah 4 detik
        setTimeout(() => setSubmitStatus("idle"), 4000);
    };

    // ── Attendance toggle options
    const attendanceOptions: { value: AttendanceStatus; label: string }[] = [
        { value: "hadir", label: "Hadir 🎉" },
        { value: "tidak_hadir", label: "Tidak Hadir" },
        { value: "masih_ragu", label: "Masih Ragu" },
    ];

    // ────────────────────────────────────────────────────────────────────────────
    return (
        <section
            id="classic-rsvp"
            className="relative py-20 px-4"
            style={{ backgroundColor: assets.bg_section_5 ?? assets.color_bg_page ?? "#fdfaf6" }}
        >
            {/* Ornament atas */}
            {assets.flower_top_center_url && (
                <img
                    src={assets.flower_top_center_url}
                    alt=""
                    aria-hidden="true"
                    width={220}
                    height={120}
                    loading="lazy"
                    className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-70"
                    style={{ maxWidth: "55vw" }}
                />
            )}

            <div className="mx-auto max-w-xl">

                {/* ── Section heading ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 text-center"
                >
                    {assets.ornament_divider && (
                        <img
                            src={assets.ornament_divider}
                            alt=""
                            aria-hidden="true"
                            width={120}
                            height={24}
                            loading="lazy"
                            className="mx-auto mb-4 opacity-70"
                        />
                    )}
                    <p
                        className="mb-1 text-xs tracking-[0.3em] uppercase opacity-60"
                        style={{ color: assets.color_primary, fontFamily: `var(--classic-font-body)` }}
                    >
                        Konfirmasi Kehadiran
                    </p>
                    <h2
                        className="text-3xl font-semibold"
                        style={{
                            color: assets.color_primary,
                            fontFamily: `var(--classic-font-display)`,
                        }}
                    >
                        RSVP & Ucapan
                    </h2>
                    <p
                        className="mx-auto mt-3 max-w-sm text-sm leading-relaxed opacity-70"
                        style={{
                            color: assets.color_text_body ?? "#3d2e1e",
                            fontFamily: `var(--classic-font-body)`,
                        }}
                    >
                        Kehadiran dan doa restu Anda adalah kebahagiaan terbesar kami.
                    </p>
                </motion.div>

                {/* ── Form ucapan ─────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 rounded-2xl p-6"
                    style={{
                        backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
                        border: `1px solid ${assets.color_primary}22`,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    }}
                >
                    <AnimatePresence mode="wait">
                        {submitStatus === "success" ? (
                            /* ── Success state ── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center py-8 text-center"
                            >
                                <div
                                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                                    style={{ backgroundColor: `${assets.color_primary}18` }}
                                >
                                    🎊
                                </div>
                                <p
                                    className="font-semibold text-lg"
                                    style={{ color: assets.color_primary, fontFamily: `var(--classic-font-display)` }}
                                >
                                    Ucapan Terkirim!
                                </p>
                                <p
                                    className="mt-1 text-sm opacity-70"
                                    style={{ color: assets.color_text_body ?? "#3d2e1e" }}
                                >
                                    Terima kasih atas doa dan konfirmasi kehadirannya. 🙏
                                </p>
                            </motion.div>
                        ) : (
                            /* ── Form ── */
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                                noValidate
                            >
                                {/* Nama */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="rsvp-name"
                                        className="text-xs font-semibold tracking-wider uppercase"
                                        style={{ color: assets.color_primary, opacity: 0.8 }}
                                    >
                                        Nama Lengkap <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="rsvp-name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="Nama kamu"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="rounded-xl px-4 py-3 text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: `${assets.color_primary}0d`,
                                            border: `1px solid ${assets.color_primary}30`,
                                            color: assets.color_text_body ?? "#3d2e1e",
                                            fontFamily: `var(--classic-font-body)`,
                                        }}
                                        onFocus={e => (e.target.style.borderColor = assets.color_primary)}
                                        onBlur={e => (e.target.style.borderColor = `${assets.color_primary}30`)}
                                    />
                                </div>

                                {/* Kehadiran toggle */}
                                <div className="flex flex-col gap-1">
                                    <p
                                        className="text-xs font-semibold tracking-wider uppercase"
                                        style={{ color: assets.color_primary, opacity: 0.8 }}
                                    >
                                        Konfirmasi Kehadiran
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {attendanceOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, attendance: opt.value }))}
                                                className="rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200"
                                                style={{
                                                    backgroundColor:
                                                        form.attendance === opt.value
                                                            ? assets.color_primary
                                                            : `${assets.color_primary}12`,
                                                    color:
                                                        form.attendance === opt.value
                                                            ? "#fff"
                                                            : assets.color_primary,
                                                    border: `1px solid ${assets.color_primary}40`,
                                                }}
                                                aria-pressed={form.attendance === opt.value}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ucapan */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="rsvp-message"
                                        className="text-xs font-semibold tracking-wider uppercase"
                                        style={{ color: assets.color_primary, opacity: 0.8 }}
                                    >
                                        Ucapan & Doa <span aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id="rsvp-message"
                                        required
                                        rows={4}
                                        placeholder="Tulis ucapan dan doa terbaikmu…"
                                        value={form.message}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        className="resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
                                        style={{
                                            backgroundColor: `${assets.color_primary}0d`,
                                            border: `1px solid ${assets.color_primary}30`,
                                            color: assets.color_text_body ?? "#3d2e1e",
                                            fontFamily: `var(--classic-font-body)`,
                                        }}
                                        onFocus={e => (e.target.style.borderColor = assets.color_primary)}
                                        onBlur={e => (e.target.style.borderColor = `${assets.color_primary}30`)}
                                    />
                                </div>

                                {/* Error inline */}
                                {errorMsg && (
                                    <p className="text-xs font-medium text-red-500" role="alert">
                                        {errorMsg}
                                    </p>
                                )}

                                {/* Submit button */}
                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileTap={{ scale: 0.97 }}
                                    className="mt-1 w-full rounded-xl py-3 text-sm font-semibold tracking-wider transition-all duration-200"
                                    style={{
                                        backgroundColor: submitting
                                            ? `${assets.color_primary}80`
                                            : assets.color_primary,
                                        color: "#fff",
                                        cursor: submitting ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {submitting ? "Mengirim…" : "Kirim Ucapan 💌"}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Daftar ucapan ───────────────────────────────────── */}
                <div ref={listRef}>
                    {/* Heading daftar */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-px flex-1" style={{ backgroundColor: `${assets.color_primary}25` }} />
                        <p
                            className="text-xs font-semibold tracking-[0.2em] uppercase"
                            style={{ color: assets.color_primary, opacity: 0.7 }}
                        >
                            Ucapan Tamu
                        </p>
                        <div className="h-px flex-1" style={{ backgroundColor: `${assets.color_primary}25` }} />
                    </div>

                    {/* Loading skeleton */}
                    {loading && messages.length === 0 && (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="h-20 animate-pulse rounded-2xl"
                                    style={{ backgroundColor: `${assets.color_primary}10` }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && messages.length === 0 && (
                        <div
                            className="rounded-2xl py-10 text-center"
                            style={{ backgroundColor: `${assets.color_primary}08` }}
                        >
                            <p className="text-2xl mb-2">💌</p>
                            <p
                                className="text-sm opacity-60"
                                style={{ color: assets.color_text_body ?? "#3d2e1e" }}
                            >
                                Belum ada ucapan. Jadilah yang pertama!
                            </p>
                        </div>
                    )}

                    {/* Message list */}
                    <div className="flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <UcapanCard key={msg.id} msg={msg} index={i} assets={assets} />
                        ))}
                    </div>

                    {/* Load more */}
                    {hasMore && !loading && messages.length > 0 && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider transition-all duration-200"
                                style={{
                                    border: `1px solid ${assets.color_primary}50`,
                                    color: assets.color_primary,
                                    backgroundColor: "transparent",
                                }}
                            >
                                Lihat Lebih Banyak
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Ornamen bawah */}
            {assets.flower_bottom_left_url && (
                <img
                    src={assets.flower_bottom_left_url}
                    alt=""
                    aria-hidden="true"
                    width={140}
                    height={140}
                    loading="lazy"
                    className="pointer-events-none absolute bottom-0 left-0 opacity-40"
                    style={{ maxWidth: "28vw" }}
                />
            )}
            {assets.flower_bottom_right_url && (
                <img
                    src={assets.flower_bottom_right_url}
                    alt=""
                    aria-hidden="true"
                    width={140}
                    height={140}
                    loading="lazy"
                    className="pointer-events-none absolute bottom-0 right-0 opacity-40"
                    style={{ maxWidth: "28vw" }}
                />
            )}
        </section>
    );
}