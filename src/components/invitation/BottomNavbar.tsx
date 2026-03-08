"use client";

import { useEffect, useState } from "react";
import { Heart, Users, MapPin, Image, MessageCircle } from "lucide-react";

export const invitationSections = [
    { id: "hero", icon: Heart, label: "Home" },
    { id: "mempelai", icon: Users, label: "Mempelai" },
    { id: "lokasi", icon: MapPin, label: "Lokasi" },
    { id: "galeri", icon: Image, label: "Galeri" },
    { id: "ucapan", icon: MessageCircle, label: "Ucapan" },
];

const BottomNavbar = () => {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        invitationSections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.3 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border shadow-lg">
            <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
                {invitationSections.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${activeSection === id
                                ? "text-accent"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-serif-wedding">{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavbar;
