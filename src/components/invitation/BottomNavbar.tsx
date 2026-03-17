"use client";

import { Home, Users, MapPin, Camera, MessageSquare } from "lucide-react";

const items = [
    { id: "hero", label: "Beranda", icon: Home },
    { id: "couple", label: "Mempelai", icon: Users },
    { id: "event", label: "Acara", icon: MapPin },
    { id: "gallery", label: "Galeri", icon: Camera },
    { id: "rsvp", label: "RSVP", icon: MessageSquare },
];

const BottomNavbar = () => {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-2">
            <div className="flex items-center gap-1 px-4 py-2.5 rounded-full skeu-card bg-white/90 backdrop-blur-md border border-white/60">
                {items.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full hover:bg-wedding-gold/10 transition-colors group skeu-raised"
                        title={label}
                    >
                        <Icon className="w-4 h-4 text-stone-500 group-hover:text-wedding-gold transition-colors" />
                        <span className="text-[9px] text-stone-400 group-hover:text-wedding-gold transition-colors">{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavbar;
