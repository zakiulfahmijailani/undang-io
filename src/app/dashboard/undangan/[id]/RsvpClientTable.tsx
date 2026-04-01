"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, MailOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

type AttendanceStatus = "hadir" | "tidak_hadir" | "masih_ragu";

interface RsvpMessage {
    id: string;
    name: string;
    attendance: AttendanceStatus;
    message: string | null;
    created_at: string;
}

const ATTENDANCE_CONFIG: Record<AttendanceStatus | "default", { text: string; className: string }> = {
    hadir: { text: "Hadir", className: "bg-green-50 text-green-700 border-green-200" },
    tidak_hadir: { text: "Tidak Hadir", className: "bg-red-50 text-red-700 border-red-200" },
    masih_ragu: { text: "Masih Ragu", className: "bg-amber-50 text-amber-700 border-amber-200" },
    default: { text: "Belum Pasti", className: "bg-secondary text-muted-foreground border-border" },
};

const ATTENDANCE_ICON: Record<AttendanceStatus | "default", React.ReactNode> = {
    hadir: <CheckCircle2 className="w-4 h-4" />,
    tidak_hadir: <XCircle className="w-4 h-4" />,
    masih_ragu: <HelpCircle className="w-4 h-4" />,
    default: <HelpCircle className="w-4 h-4" />,
};

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateStr;
    }
}

export default function RsvpClientTable({
    initialMessages,
    invitationSlug,
    totalCount,
}: {
    initialMessages: RsvpMessage[];
    invitationSlug: string;
    totalCount: number;
}) {
    const [messages, setMessages] = useState<RsvpMessage[]>(initialMessages);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<AttendanceStatus | "all">("all");
    const limit = 10;
    const totalPages = Math.ceil(totalCount / limit);

    const toggleExpand = (message: RsvpMessage) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(message.id)) {
            newExpanded.delete(message.id);
        } else {
            newExpanded.add(message.id);
        }
        setExpandedIds(newExpanded);
    };

    const loadPage = async (newPage: number) => {
        setIsLoading(true);
        try {
            const filterParam = filterStatus !== "all" ? `&attendance=${filterStatus}` : "";
            const res = await fetch(
                `/api/public/invitations/${invitationSlug}/messages?page=${newPage}&limit=${limit}${filterParam}`
            );
            const json = await res.json();
            if (json.data) {
                setMessages(json.data.items || json.data);
                setPage(newPage);
                setExpandedIds(new Set());
            }
        } catch (error) {
            console.error("Failed to load page", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMessages =
        filterStatus === "all"
            ? messages
            : messages.filter((m) => m.attendance === filterStatus);

    const getAttConfig = (status: string) =>
        ATTENDANCE_CONFIG[status as AttendanceStatus] ?? ATTENDANCE_CONFIG.default;

    const getAttIcon = (status: string) =>
        ATTENDANCE_ICON[status as AttendanceStatus] ?? ATTENDANCE_ICON.default;

    if (totalCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-border rounded-3xl text-center shadow-sm">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <MailOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground">Belum Ada RSVP</h3>
                <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                    Masih belum ada tamu yang mengonfirmasi kehadiran atau memberikan ucapan.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm overflow-hidden flex flex-col">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-4 border-b border-border bg-secondary/30 overflow-x-auto">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {(["all", "hadir", "tidak_hadir", "masih_ragu"] as const).map((status) => {
                    const isActive = filterStatus === status;
                    const label =
                        status === "all"
                            ? `Semua (${totalCount})`
                            : ATTENDANCE_CONFIG[status].text;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                                isActive
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/20 hover:text-foreground"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-secondary/50 border-b border-border text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nama Tamu</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kehadiran</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-1/2">Pesan</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredMessages.map((msg) => {
                            const att = getAttConfig(msg.attendance);
                            const attIcon = getAttIcon(msg.attendance);
                            const isExpanded = expandedIds.has(msg.id);
                            const hasMessage = !!msg.message?.trim();

                            return (
                                <tr
                                    key={msg.id}
                                    className={`group transition-colors hover:bg-secondary/30 ${hasMessage ? "cursor-pointer" : ""}`}
                                    onClick={() => hasMessage && toggleExpand(msg)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground">{msg.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${att.className}`}
                                        >
                                            {attIcon}
                                            {att.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground min-w-[200px]">
                                        {hasMessage ? (
                                            <div className="flex flex-col items-start gap-1">
                                                <div
                                                    className={`transition-all duration-300 relative ${
                                                        isExpanded
                                                            ? "line-clamp-none whitespace-pre-wrap"
                                                            : "line-clamp-1 italic text-muted-foreground pr-6"
                                                    }`}
                                                >
                                                    &ldquo;{msg.message}&rdquo;
                                                    {!isExpanded && (
                                                        <ChevronDown className="w-4 h-4 absolute right-0 top-0.5 text-muted-foreground group-hover:text-primary" />
                                                    )}
                                                    {isExpanded && (
                                                        <ChevronUp className="w-4 h-4 ml-2 inline text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic text-xs">- Tanpa pesan -</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-muted-foreground text-xs text-nowrap">
                                        {formatDate(msg.created_at)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="border-t border-border bg-secondary/30 p-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-medium">
                        Halaman {page} dari {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page === 1 || isLoading}
                            onClick={() => loadPage(page - 1)}
                            className="h-8 text-xs"
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page === totalPages || isLoading}
                            onClick={() => loadPage(page + 1)}
                            className="h-8 text-xs"
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
