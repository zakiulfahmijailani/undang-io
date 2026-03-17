import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Eye, Pencil } from 'lucide-react';

export interface InvitationCardProps {
    invitation: {
        id: string;
        slug: string;
        status: 'unpaid' | 'active' | 'expired' | 'draft';
        created_at: string;
        invitation_details: {
            groom_name: string | null;
            bride_name: string | null;
            couple_photo_url: string | null;
            akad_date: string | null;
            reception_date: string | null;
        } | null;
    };
}

export default function InvitationCard({ invitation }: InvitationCardProps) {
    const details = invitation.invitation_details;
    const groomName = details?.groom_name || 'Nama';
    const brideName = details?.bride_name || 'Belum Diisi';
    const spouseName = `${groomName} & ${brideName}`;

    let displayDate = 'Tanggal belum ditentukan';
    if (details?.reception_date) {
        displayDate = new Date(details.reception_date).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    } else if (details?.akad_date) {
        displayDate = new Date(details.akad_date).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    }

    let badgeColor = 'bg-slate-100 text-slate-700';
    let badgeLabel = 'Draft';
    if (invitation.status === 'unpaid') {
        badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        badgeLabel = 'Belum Aktif';
    } else if (invitation.status === 'active') {
        badgeColor = 'bg-green-100 text-green-800 border-green-200';
        badgeLabel = 'Aktif';
    } else if (invitation.status === 'expired') {
        badgeColor = 'bg-red-100 text-red-800 border-red-200';
        badgeLabel = 'Kedaluwarsa';
    }

    const photoUrl = details?.couple_photo_url;
    const initial = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

    // Always allow preview:
    // - active/paid: open live URL (no preview param)
    // - draft/unpaid/other: open with ?preview=true
    const isLive = invitation.status === 'active' || (invitation.status as string) === 'paid';
    const previewHref = isLive
        ? `/invite/${invitation.slug}`
        : `/invite/${invitation.slug}?preview=true`;

    return (
        <Card className="overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col group">
            <CardContent className="p-0 flex flex-col h-full">
                <div className="p-6 flex gap-4">
                    <div className="flex-shrink-0">
                        {photoUrl ? (
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 relative">
                                <Image src={photoUrl} alt="Couple Photo" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-200 to-amber-100 flex items-center justify-center font-serif text-xl font-bold text-gold-700 shadow-inner">
                                {initial}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-grow justify-center min-w-0">
                        <h3 className="font-serif font-bold text-lg text-slate-800 truncate" title={spouseName}>
                            {spouseName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                            📅 {displayDate}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                            🔗 undang.io/invite/{invitation.slug}
                        </p>
                        <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badgeColor}`}>
                                {badgeLabel}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto border-t border-slate-100 bg-slate-50/50 p-4 flex items-center gap-3">
                    <Link href={`/dashboard/undangan/${invitation.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full h-9 flex items-center justify-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <BarChart2 className="w-4 h-4" />
                            <span>Dasbor</span>
                        </Button>
                    </Link>

                    {/* Lihat / Preview — always clickable, uses ?preview=true for non-live */}
                    <Link href={previewHref} target="_blank" className="flex-1">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full h-9 flex items-center justify-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            <span>{isLive ? 'Lihat' : 'Preview'}</span>
                        </Button>
                    </Link>

                    <Link href={`/dashboard/undangan/${invitation.id}/edit`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full h-9 flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white border-0 shadow-md">
                            <Pencil className="w-4 h-4" />
                            <span>Edit</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
