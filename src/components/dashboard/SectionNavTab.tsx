"use client";

import { LockKeyhole, GripVertical, type LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type SectionItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  enabled?: boolean;
  locked?: boolean;
  draggable?: boolean;
  onToggle?: (enabled: boolean) => void;
};

export type SectionNavTabProps = {
  sections: SectionItem[];
  activeSection: string;
  onSelect: (key: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
  className?: string;
};

function SortableItem({
  section,
  activeSection,
  onSelect,
}: {
  section: SectionItem;
  activeSection: string;
  onSelect: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.key });

  const Icon = section.icon;
  const active = section.key === activeSection;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "relative flex min-h-[48px] items-center border-l-3 transition-colors",
        active ? "border-landing-maroon bg-landing-maroon/5" : "border-transparent bg-white",
        isDragging && "z-50 shadow-md ring-1 ring-border"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="ml-2 flex h-8 w-6 cursor-grab items-center justify-center text-landing-muted hover:text-landing-ink active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onSelect(section.key)}
        className="flex min-h-[48px] min-w-0 flex-1 items-center gap-2 px-2 text-left font-ui text-sm font-semibold text-landing-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-maroon"
      >
        <Icon className={cn("h-4 w-4 shrink-0 text-landing-muted", active && "text-landing-maroon")} aria-hidden="true" />
        <span className="truncate">{section.label}</span>
      </button>

      {section.locked ? (
        <LockKeyhole className="mr-2 h-4 w-4 shrink-0 text-landing-muted" aria-label="Terkunci" />
      ) : section.enabled !== undefined && section.onToggle ? (
        <Switch
          className="mr-2 shrink-0"
          checked={section.enabled}
          onCheckedChange={section.onToggle}
          aria-label={`${section.enabled ? "Sembunyikan" : "Tampilkan"} ${section.label}`}
        />
      ) : null}
    </div>
  );
}

export function SectionNavTab({ sections, activeSection, onSelect, onReorder, className }: SectionNavTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorder) {
      onReorder(active.id as string, over.id as string);
    }
  };

  const sortableKeys = sections.filter(s => s.draggable).map(s => s.key);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <nav className={cn("flex flex-col gap-1", className)} aria-label="Bagian editor undangan">
        <SortableContext items={sortableKeys} strategy={verticalListSortingStrategy}>
          {sections.map((section) => {
            if (section.draggable) {
              return (
                <SortableItem
                  key={section.key}
                  section={section}
                  activeSection={activeSection}
                  onSelect={onSelect}
                />
              );
            }

            // Fixed item
            const Icon = section.icon;
            const active = section.key === activeSection;

            return (
              <div
                key={section.key}
                className={cn(
                  "relative flex min-h-[48px] items-center border-l-3 transition-colors",
                  active ? "border-landing-maroon bg-landing-maroon/5" : "border-transparent"
                )}
              >
                <div className="ml-2 w-6" /> {/* spacer for alignment */}
                <button
                  type="button"
                  onClick={() => onSelect(section.key)}
                  className="flex min-h-[48px] min-w-0 flex-1 items-center gap-2 px-2 text-left font-ui text-sm font-semibold text-landing-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-maroon"
                >
                  <Icon className={cn("h-4 w-4 shrink-0 text-landing-muted", active && "text-landing-maroon")} aria-hidden="true" />
                  <span className="truncate">{section.label}</span>
                </button>
                {section.locked ? (
                  <LockKeyhole className="mr-2 h-4 w-4 shrink-0 text-landing-muted" aria-label="Terkunci" />
                ) : section.enabled !== undefined && section.onToggle ? (
                  <Switch
                    className="mr-2 shrink-0"
                    checked={section.enabled}
                    onCheckedChange={section.onToggle}
                    aria-label={`${section.enabled ? "Sembunyikan" : "Tampilkan"} ${section.label}`}
                  />
                ) : null}
              </div>
            );
          })}
        </SortableContext>
      </nav>
    </DndContext>
  );
}
