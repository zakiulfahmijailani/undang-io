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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${isDragging
                    ? "bg-amber-50 border-amber-300 shadow-lg z-50"
                    : "bg-white border-stone-100 hover:border-stone-200"
                }`}
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            {/* Label */}
            <span className={`flex-1 text-sm font-medium ${visible ? "text-stone-700" : "text-stone-300"}`}>
                {SECTION_LABELS[id] || id}
            </span>

            {/* Toggle */}
            <button
                type="button"
                onClick={onToggle}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${visible ? "bg-amber-500" : "bg-stone-200"
                    }`}
            >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${visible ? "translate-x-5" : "translate-x-0"
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