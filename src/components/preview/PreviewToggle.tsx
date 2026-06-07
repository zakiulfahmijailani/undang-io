"use client";

import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreviewMode } from "./PreviewShell";

type PreviewToggleProps = {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
};

const options = [
  { mode: "desktop" as const, label: "Desktop", icon: Monitor },
  { mode: "mobile" as const, label: "Mobile", icon: Smartphone },
];

export function PreviewToggle({ mode, onModeChange }: PreviewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Mode pratinjau"
      className="inline-flex rounded-lg border border-landing-border bg-landing-cream p-1 shadow-sm"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = mode === option.mode;

        return (
          <button
            key={option.mode}
            type="button"
            aria-label={`Tampilkan pratinjau ${option.label.toLowerCase()}`}
            aria-pressed={active}
            title={option.label}
            onClick={() => onModeChange(option.mode)}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 font-ui text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-maroon/30",
              active ? "bg-white text-landing-maroon shadow-sm" : "text-landing-muted hover:text-landing-ink",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
