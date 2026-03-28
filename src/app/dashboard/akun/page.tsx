import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AkunPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna';
  const email = user.email || '-';
  const joinedDate = new Date(user.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Akun &amp; Langganan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi profil dan paket langganan Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil Akun */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-4">
            <h3 className="font-semibold leading-none tracking-tight text-foreground">Profil Akun</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Data diri pengguna.</p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
              <p className="mt-1 font-medium text-foreground">{fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 font-medium text-foreground">{email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bergabung Sejak</label>
              <p className="mt-1 font-medium text-foreground">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Status Langganan */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-4">
            <h3 className="font-semibold leading-none tracking-tight text-foreground">Status Langganan</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Paket undangan digital Anda.</p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Paket Saat Ini</label>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                  Basic (Gratis)
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Batas Kuota Undangan</label>
              <p className="mt-1 font-medium text-foreground">1 / 1 Undangan</p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard/transaksi">
                <Button className="w-full md:w-auto cursor-pointer">
                  Upgrade Paket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
