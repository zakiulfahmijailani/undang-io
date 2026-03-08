"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PersonData {
    fullName: string;
    father: string;
    mother: string;
    photo: string;
}

interface CoupleSectionProps {
    groom: PersonData;
    bride: PersonData;
}

const PersonCard = ({ person, direction }: { person: PersonData; direction: "left" | "right" }) => (
    <motion.div
        initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center"
    >
        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-accent/50 animate-pulse-soft" />
            <img
                src={person.photo}
                alt={person.fullName}
                className="w-full h-full rounded-full object-cover border-4 border-accent"
                loading="lazy"
            />
        </div>
        <h3 className="font-script text-3xl md:text-4xl text-foreground mb-3">{person.fullName}</h3>
        <p className="font-serif-wedding text-muted-foreground text-sm md:text-base">
            Putra/i dari
        </p>
        <p className="font-serif-wedding text-foreground/80 text-sm md:text-base">{person.father}</p>
        <p className="font-serif-wedding text-foreground/80 text-sm md:text-base">{person.mother}</p>
    </motion.div>
);

const CoupleSection = ({ groom, bride }: CoupleSectionProps) => {
    return (
        <section id="mempelai" className="py-20 px-6 bg-card">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Mempelai
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Bride & Groom</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
                <PersonCard person={groom} direction="left" />
                <PersonCard person={bride} direction="right" />
            </div>
        </section>
    );
};

export default CoupleSection;
