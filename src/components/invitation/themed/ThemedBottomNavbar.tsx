"use client";

import { useEffect, useState } from 'react';
import { Heart, Users, MapPin, Image, MessageCircle } from 'lucide-react';
import { useInvitationTheme } from './ThemeContext';

const sections = [
  { id: 'hero', icon: Heart, label: 'Home' },
  { id: 'mempelai', icon: Users, label: 'Mempelai' },
  { id: 'lokasi', icon: MapPin, label: 'Lokasi' },
  { id: 'galeri', icon: Image, label: 'Galeri' },
  { id: 'ucapan', icon: MessageCircle, label: 'Ucapan' },
];

export default function ThemedBottomNavbar() {
  const { theme } = useInvitationTheme();
  const c = theme.colors;
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveSection(id); }, { threshold: 0.3 });
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t shadow-lg"
      style={{ background: `hsl(${c.surface} / 0.9)`, borderColor: `hsl(${c.accent} / 0.2)` }}
    >
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {sections.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => scrollTo(id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors"
            style={{ color: activeSection === id ? `hsl(${c.accent})` : `hsl(${c.textSecondary})` }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]" style={{ fontFamily: `'${theme.typography.bodyFont}', serif` }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
