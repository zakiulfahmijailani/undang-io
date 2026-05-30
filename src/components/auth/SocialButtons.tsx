/* Social authentication buttons based on docs/design/authlogin & authregister — Authentication Pages.png. */

import { FaFacebook, FaGoogle } from "react-icons/fa";

type SocialButtonsProps = {
  mode: "login" | "register";
  disabled?: boolean;
  onGoogle: () => void;
};

export function SocialButtons({ mode, disabled = false, onGoogle }: SocialButtonsProps) {
  const action = mode === "login" ? "masuk" : "daftar";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 font-ui text-sm text-landing-muted">
        <span className="h-px flex-1 bg-landing-border" />
        atau {action} dengan
        <span className="h-px flex-1 bg-landing-border" />
      </div>
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="flex h-14 w-full items-center justify-center gap-5 rounded-lg border border-landing-border bg-white font-ui text-base font-semibold text-landing-ink transition hover:border-landing-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaGoogle className="h-6 w-6 text-[#4285F4]" aria-hidden="true" />
        Lanjutkan dengan Google
      </button>
      <button
        type="button"
        disabled
        className="flex h-14 w-full items-center justify-center gap-5 rounded-lg border border-landing-border bg-white font-ui text-base font-semibold text-landing-ink opacity-70"
      >
        <FaFacebook className="h-6 w-6 text-[#1877F2]" aria-hidden="true" />
        Lanjutkan dengan Facebook
      </button>
    </div>
  );
}
