import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
        <h1 className="text-2xl font-bold tracking-tight">Akun &amp; Langganan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi profil dan paket langganan Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil Akun */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-4">
            <h3 className="font-semibold leading-none tracking-tight">Profil Akun</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Data diri pengguna.</p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
              <p className="mt-1 font-medium">{fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 font-medium">{email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bergabung Sejak</label>
              <p className="mt-1 font-medium">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Status Langganan */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-4">
            <h3 className="font-semibold leading-none tracking-tight">Status Langganan</h3>
            <p className="text-sm text-muted-foreground mt-1.5">Paket undangan digital Anda.</p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Paket Saat Ini</label>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                  Basic (Gratis)
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Batas Kuota Undangan</label>
              <p className="mt-1 font-medium">1 / 1 Undangan</p>
            </div>
            <div className="pt-2">
              <a
                href="/dashboard/transaksi"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto"
              >
                Upgrade Paket
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
