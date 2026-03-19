import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Eye, Pencil, Calendar, Link as LinkIcon } from 'lucide-react';

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
    const groomName = details?.groom_name || 'Mempelai';
    const brideName = details?.bride_name || 'Pasangan';
    const spouseName = `${groomName} & ${brideName}`;

    let displayDate = 'TBA';
    if (details?.reception_date) {
        displayDate = new Date(details.reception_date).toLocaleDateString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } else if (details?.akad_date) {
        displayDate = new Date(details.akad_date).toLocaleDateString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }

    let badgeStyles = 'bg-surface-container-high-stitch text-secondary-stitch';
    let badgeLabel = 'Draft';
    if (invitation.status === 'unpaid') {
        badgeStyles = 'bg-tertiary-stitch/10 text-tertiary-stitch border-tertiary-stitch/20';
        badgeLabel = 'Pending Payment';
    } else if (invitation.status === 'active') {
        badgeStyles = 'bg-primary-stitch text-white';
        badgeLabel = 'Active';
    } else if (invitation.status === 'expired') {
        badgeStyles = 'bg-error-container-stitch text-error-stitch border-error-stitch/20';
        badgeLabel = 'Expired';
    }

    const photoUrl = details?.couple_photo_url;
    const initial = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

    const isLive = invitation.status === 'active' || (invitation.status as string) === 'paid';
    const previewHref = isLive
        ? `/invite/${invitation.slug}`
        : `/invite/${invitation.slug}?preview=true`;

    return (
        <Card className="overflow-hidden border-outline-variant-stitch/20 rounded-[40px] shadow-glow-stitch hover:shadow-2xl transition-all duration-700 bg-white group">
            <CardContent className="p-0 flex flex-col h-full">
                <div className="p-8 flex gap-6">
                    <div className="flex-shrink-0">
                        {photoUrl ? (
                            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-surface-container-low-stitch relative shadow-xl rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
                                <Image src={photoUrl} alt="Couple Photo" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-[32px] bg-primary-stitch flex items-center justify-center font-black text-2xl text-white shadow-xl rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
                                {initial}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-grow justify-center min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${badgeStyles}`}>
                                {badgeLabel}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-primary-stitch tracking-tighter truncate leading-tight" title={spouseName}>
                            {spouseName}
                        </h3>
                        <div className="flex flex-col gap-1 mt-3">
                            <p className="text-xs text-secondary-stitch/60 flex items-center gap-2 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-on-tertiary-container-stitch" />
                                {displayDate}
                            </p>
                            <p className="text-xs text-secondary-stitch/60 flex items-center gap-2 font-medium truncate">
                                <LinkIcon className="w-3.5 h-3.5 text-on-tertiary-container-stitch" />
                                undang.io/{invitation.slug}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 border-t border-outline-variant-stitch/10 p-6 pt-0 flex flex-wrap items-center gap-4">
                    <Link href={`/dashboard/undangan/${invitation.id}`} className="flex-1 min-w-[120px]">
                        <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full border border-outline-variant-stitch/30 text-primary-stitch text-xs font-bold hover:bg-surface-container-low-stitch transition-all active:scale-95">
                            <BarChart2 className="w-4 h-4" />
                            <span>Analytics</span>
                        </button>
                    </Link>

                    <Link href={previewHref} target="_blank" className="flex-1 min-w-[120px]">
                        <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full border border-outline-variant-stitch/30 text-primary-stitch text-xs font-bold hover:bg-surface-container-low-stitch transition-all active:scale-95">
                            <Eye className="w-4 h-4" />
                            <span>{isLive ? 'Visit' : 'Preview'}</span>
                        </button>
                    </Link>

                    <Link href={`/dashboard/undangan/${invitation.id}/edit`} className="flex-1 min-w-[120px]">
                        <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-primary-stitch text-white text-xs font-bold shadow-lg shadow-primary-stitch/20 hover:scale-105 transition-all active:scale-95">
                            <Pencil className="w-4 h-4" />
                            <span>Edit Design</span>
                        </button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
