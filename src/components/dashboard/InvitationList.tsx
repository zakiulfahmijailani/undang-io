"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Eye, Edit, Calendar, Users, MailOpen, MessageSquareHeart,
    Clock, CreditCard, Search, Filter, SlidersHorizontal,
} from "lucide-react";
import DeleteInvitationButton from "@/components/dashboard/DeleteInvitationButton";

interface InvitationItem {
    id: string;
    slug: string;
    title: string;
    date: string;
    status: string;
    statusLabel: string;
    statusClass: string;
    views: number;
    rsvps: number;
    messages: number;
    isPermanent: boolean;
    minutesLeft?: number;
}

type FilterStatus = "all" | "active" | "unpaid" | "draft" | "claimed" | "expired";

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "active", label: "Tayang" },
    { value: "draft", label: "Draft" },
    { value: "claimed", label: "Belum Dibayar" },
    { value: "unpaid", label: "Belum Aktif" },
    { value: "expired", label: "Kedaluwarsa" },
];

export default function InvitationList({ items }: { items: InvitationItem[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

    const filteredItems = useMemo(() => {
        let result = items;

        // Filter by status
        if (filterStatus !== "all") {
            result = result.filter((item) => item.status === filterStatus);
        }

        // Search by title
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((item) => item.title.toLowerCase().includes(q));
        }

        return result;
    }, [items, filterStatus, searchQuery]);

    const activeFilters = STATUS_FILTERS.filter((f) =>
        f.value === "all" ? true : items.some((item) => item.status === f.value)
    );

    return (
        <div className="flex flex-col gap-5">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {activeFilters.map((f) => {
                        const isActive = filterStatus === f.value;
                        const count =
                            f.value === "all"
                                ? items.length
                                : items.filter((i) => i.status === f.value).length;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setFilterStatus(f.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
                                    isActive
                                        ? "bg-primary/10 text-primary border-primary/30"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/20"
                                }`}
                            >
                                {f.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Results */}
            {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Filter className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
                    <p className="text-muted-foreground font-medium">Tidak ada undangan ditemukan</p>
                    <p className="text-sm text-muted-foreground mt-1">Coba ubah filter atau kata kunci pencarianmu.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            className={`overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col bg-card ${
                                item.status === "claimed" ? "border-amber-200 bg-amber-50/20" : ""
                            }`}
                        >
                            {/* Status & Date */}
                            <div className="p-5 pb-0 flex justify-between items-start">
                                <Badge
                                    variant="secondary"
                                    className={`font-semibold px-2.5 py-0.5 rounded-full text-xs border ${item.statusClass}`}
                                >
                                    {item.status === "claimed" && <Clock className="w-3 h-3 inline mr-1" />}
                                    {item.statusLabel}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                    {item.status === "claimed" ? (
                                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {item.minutesLeft} menit tersisa
                                        </span>
                                    ) : (
                                        <>
                                            <Calendar className="w-3.5 h-3.5" />
                                            {item.date}
                                        </>
                                    )}
                                </span>
                            </div>

                            <CardContent className="p-5 flex-1 flex flex-col">
                                <h3 className="font-serif text-2xl font-bold text-foreground mt-2 mb-4 leading-tight">
                                    {item.title}
                                </h3>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/50 mb-auto bg-secondary/10 rounded-lg px-2">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <Users className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{item.views}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Tayangan</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l border-border/50">
                                        <MailOpen className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{item.rsvps}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">RSVP</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l border-border/50">
                                        <MessageSquareHeart className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{item.messages}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Ucapan</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 mt-5">
                                    {item.status === "claimed" ? (
                                        <>
                                            <Link href={`/pembayaran/${item.slug}`} className="flex-1">
                                                <Button className="w-full text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer">
                                                    <CreditCard className="w-3.5 h-3.5" /> Bayar Rp 45.000
                                                </Button>
                                            </Link>
                                            <Link href={`/u/${item.slug}`} target="_blank">
                                                <Button variant="secondary" className="shrink-0 h-9 w-9 p-0 cursor-pointer">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={`/invite/${item.slug}`} target="_blank" className="flex-1">
                                                <Button variant="secondary" className="w-full text-xs gap-1.5 bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 cursor-pointer">
                                                    <Eye className="w-3.5 h-3.5" /> Lihat Undangan
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/undangan/${item.id}/edit`}>
                                                <Button variant="secondary" className="shrink-0 h-9 w-9 p-0 text-accent border border-accent/20 hover:bg-accent/10 cursor-pointer">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteInvitationButton invitationId={item.id} invitationTitle={item.title} />
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
