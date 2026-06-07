"use client";

import { LockKeyhole, type LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type SectionItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  enabled?: boolean;
  locked?: boolean;
  onToggle?: (enabled: boolean) => void;
};

export type SectionNavTabProps = {
  sections: SectionItem[];
  activeSection: string;
  onSelect: (key: string) => void;
  className?: string;
};

export function SectionNavTab({ sections, activeSection, onSelect, className }: SectionNavTabProps) {
  return (
    <nav className={cn("grid gap-1", className)} aria-label="Bagian editor undangan">
      {sections.map((section) => {
        const Icon = section.icon;
        const active = section.key === activeSection;

        return (
          <div
            key={section.key}
            className={cn(
              "relative flex min-h-[52px] items-center border-l-3 border-transparent transition-colors",
              active && "border-landing-maroon bg-landing-maroon/5",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(section.key)}
              className="flex min-h-[52px] min-w-0 flex-1 items-center gap-3 px-3 text-left font-ui text-sm font-semibold text-landing-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-maroon"
            >
              <Icon className={cn("h-4 w-4 shrink-0 text-landing-muted", active && "text-landing-maroon")} aria-hidden="true" />
              <span className="truncate">{section.label}</span>
            </button>
            {section.locked ? (
              <LockKeyhole className="mr-3 h-4 w-4 shrink-0 text-landing-muted" aria-label="Terkunci" />
            ) : section.enabled !== undefined && section.onToggle ? (
              <Switch
                className="mr-3 shrink-0"
                checked={section.enabled}
                onCheckedChange={section.onToggle}
                aria-label={`${section.enabled ? "Sembunyikan" : "Tampilkan"} ${section.label}`}
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
