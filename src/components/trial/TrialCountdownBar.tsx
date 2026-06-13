"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const { remainingSeconds, status, slug, isExpired, isExpiringSoon } = useTrialTimer({ onExpire });
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
  const paymentTarget = slug ?? invitationId;
  const paymentHref = paymentTarget ? `/pembayaran/${paymentTarget}` : "/dashboard";

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex min-h-12 items-center justify-center border-b px-4 py-2 font-ui text-sm font-semibold shadow-sm",
          isExpired
            ? "border-gray-300 bg-gray-200 text-gray-600"
            : isExpiringSoon
              ? "animate-pulse border-red-400 bg-red-500 text-white"
              : "border-amber-500 bg-amber-400 text-amber-900",
        )}
      >
        <div className="flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true">⏱️</span>
            {isExpired
              ? "Waktu habis. Daftar untuk menyimpan"
              : `Undangan aktif ${formatCountdown(remainingSeconds)} lagi`}
          </span>
          {isExpired && !isLoggedIn ? (
            <Link href="/register?claim=true" className="underline underline-offset-4">
              →
            </Link>
          ) : null}
          {isLoggedIn && isExpiringSoon && !isExpired && paymentTarget ? (
            <Link href={paymentHref} className="underline underline-offset-4">
              Jadikan Permanen — Rp49.000 →
            </Link>
          ) : null}
        </div>
      </div>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setModalDismissed(true)}
        title="Simpan undanganmu sebelum hilang!"
        description="Daftar gratis dan dapatkan total 15 menit untuk melengkapi undangan."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild fullWidth>
            <Link href="/register?claim=true">Daftar Sekarang</Link>
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setModalDismissed(true)}>
            Lanjut dulu
          </Button>
        </div>
      </Modal>
    </>
  );
}
