import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    const brideName = details?.bride_name || 'Mempelai';
    const spouseName = `${groomName} & ${brideName}`;

    let displayDate = 'TBD';
    if (details?.reception_date) {
        displayDate = new Date(details.reception_date).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }

    let statusLabel = 'Draft';
    let statusClasses = 'bg-surface-container-high text-slate-500';
    
    if (invitation.status === 'active' || (invitation.status as string) === 'paid') {
        statusLabel = 'Live';
        statusClasses = 'bg-emerald-100 text-emerald-700';
    } else if (invitation.status === 'expired') {
        statusLabel = 'Expired';
        statusClasses = 'bg-error-container text-on-error-container';
    }

    const photoUrl = details?.couple_photo_url;
    const initial = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

    const isLive = invitation.status === 'active' || (invitation.status as string) === 'paid';
    const previewHref = isLive
        ? `/invite/${invitation.slug}`
        : `/invite/${invitation.slug}?preview=true`;

    return (
        <div className="bg-white rounded-[32px] overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 group">
            <div className="p-8 flex items-start gap-6">
                <div className="flex-shrink-0">
                    {photoUrl ? (
                        <div className="w-24 h-24 rounded-[24px] overflow-hidden border-4 border-surface-container-low shadow-sm relative">
                            <Image src={photoUrl} alt="Couple" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-primary to-primary-fixed-dim flex items-center justify-center font-black text-2xl text-on-tertiary-container shadow-inner">
                            {initial}
                        </div>
                    )}
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${statusClasses}`}>
                            {statusLabel}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono tracking-tighter">#{invitation.slug}</span>
                    </div>
                    <h3 className="text-2xl font-black text-primary tracking-tighter truncate leading-tight italic font-light">
                        {spouseName}
                    </h3>
                    <div className="flex items-center gap-4 mt-4 text-xs font-['Inter'] text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            <span>{displayDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span>View Venue</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-low/50 p-6 grid grid-cols-3 gap-3 border-t border-outline-variant/5">
                <Link href={`/dashboard/undangan/${invitation.id}`} className="flex flex-col items-center gap-1 py-3 rounded-2xl hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-primary/60 text-xl">analytics</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Stats</span>
                </Link>
                <Link href={previewHref} target="_blank" className="flex flex-col items-center gap-1 py-3 rounded-2xl hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-primary/60 text-xl">visibility</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Preview</span>
                </Link>
                <Link href={`/dashboard/undangan/${invitation.id}/edit`} className="flex flex-col items-center gap-1 py-3 rounded-[20px] bg-primary text-on-primary hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-xl">edit_note</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Edit</span>
                </Link>
            </div>
        </div>
    );
}
