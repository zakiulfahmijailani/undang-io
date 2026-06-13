"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { useTrialTimer } from "@/hooks/useTrialTimer";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type TrialCountdownBarProps = {
  invitationId?: string;
  onExpire?: () => void;
};

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrialCountdownBar({ invitationId, onExpire }: TrialCountdownBarProps) {
  const { remainingSeconds, status, isExpired, isExpiringSoon } = useTrialTimer({ onExpire });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    void supabase.auth
      .getUser()
      .then((result: { data: { user: unknown | null } }) => setIsLoggedIn(Boolean(result.data.user)));
  }, []);

  if (status === "none" || status === "converted") return null;

  const showRegisterModal = !isLoggedIn && remainingSeconds > 0 && remainingSeconds < 120 && !modalDismissed;
  const paymentHref = invitationId ? `/dashboard/checkout/${invitationId}` : "/dashboard";

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-50 flex min-h-12 items-center justify-center border-b px-4 py-2 font-ui text-sm font-semibold shadow-sm",
          isExpired
            ? "border-stone-300 bg-stone-200 text-stone-700"
            : isExpiringSoon
              ? "animate-pulse border-red-300 bg-red-600 text-white"
              : "border-amber-300 bg-amber-100 text-amber-950",
        )}
      >
        <div className="flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {isExpired
              ? "Waktu habis. Daftar untuk menyimpan"
              : `Undangan aktif ${formatCountdown(remainingSeconds)} lagi`}
          </span>
          {isExpired && !isLoggedIn ? (
            <Link href="/register?claim=true" className="underline underline-offset-4">
              Daftar sekarang →
            </Link>
          ) : null}
          {isLoggedIn && isExpiringSoon && !isExpired ? (
            <Link href={paymentHref} className="underline underline-offset-4">
              Jadikan permanen selamanya mulai Rp49.000 →
            </Link>
          ) : null}
        </div>
      </div>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setModalDismissed(true)}
        title="Simpan undanganmu"
        description="Daftar gratis sekarang dan hemat sisa undanganmu — total 15 menit!"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild fullWidth>
            <Link href="/register?claim=true">Daftar Sekarang</Link>
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setModalDismissed(true)}>
            Tutup
          </Button>
        </div>
      </Modal>
    </>
  );
}
