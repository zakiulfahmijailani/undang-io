"use client";

import {
    DndContext, closestCenter, PointerSensor,
    KeyboardSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
    SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, useSortable, arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
    hero: "Hero / Cover Foto",
    couple: "Data Mempelai",
    quote: "Ayat & Quote",
    lovestory: "Kisah Cinta",
    countdown: "Hitung Mundur",
    event: "Detail Acara",
    gallery: "Galeri Foto",
    gift: "Amplop Digital",
    rsvp: "RSVP / Ucapan",
};

function SortableRow({ id, visible, onToggle }: {
    id: string; visible: boolean; onToggle: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`flex items-center gap-4 px-5 py-4 rounded-[24px] border transition-all duration-300 ${isDragging
                    ? "bg-white border-primary-stitch shadow-2xl z-50 scale-105"
                    : "bg-white border-outline-variant-stitch/10 hover:border-primary-stitch/40 hover:bg-surface-container-low-stitch"
                }`}
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="text-secondary-stitch/20 hover:text-primary-stitch cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
            >
                <GripVertical className="w-5 h-5" />
            </button>
 
            {/* Label */}
            <span className={`flex-1 text-[11px] font-black uppercase tracking-widest ${visible ? "text-primary-stitch" : "text-secondary-stitch/30"}`}>
                {SECTION_LABELS[id] || id}
            </span>
 
            {/* Toggle */}
            <button
                type="button"
                onClick={onToggle}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 shadow-inner ${visible ? "bg-tertiary-stitch" : "bg-surface-container-high-stitch"
                    }`}
            >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ${visible ? "translate-x-5" : "translate-x-0"
                    }`} />
            </button>
        </div>
    );
}

interface Props {
    sections: string[];
    visibility: Record<string, boolean>;
    onSectionsChange: (sections: string[]) => void;
    onVisibilityChange: (visibility: Record<string, boolean>) => void;
}

export default function DndSectionsEditor({ sections, visibility, onSectionsChange, onVisibilityChange }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.indexOf(active.id as string);
            const newIndex = sections.indexOf(over.id as string);
            onSectionsChange(arrayMove(sections, oldIndex, newIndex));
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                    {sections.map((id) => (
                        <SortableRow
                            key={id}
                            id={id}
                            visible={visibility[id] !== false}
                            onToggle={() => onVisibilityChange({
                                ...visibility,
                                [id]: !(visibility[id] !== false)
                            })}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}