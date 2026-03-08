"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StoryItem {
    date: string;
    title: string;
    description: string;
    photo: string;
}

interface LoveStorySectionProps {
    stories: StoryItem[];
}

const LoveStorySection = ({ stories }: LoveStorySectionProps) => {
    return (
        <section id="story" className="py-20 px-6 bg-card">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Kisah Kami
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Love Story</h2>
            </motion.div>

            <div className="max-w-3xl mx-auto relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-accent/30 -translate-x-1/2" />

                {stories.map((story, i) => {
                    const isEven = i % 2 === 0;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`relative flex flex-col items-start mb-16 last:mb-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent border-2 border-card -translate-x-1/2 mt-2 z-10" />

                            {/* Content */}
                            <div className={`ml-10 md:ml-0 md:w-1/2 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                                <span className="font-serif-wedding text-accent text-sm tracking-widest uppercase">
                                    {story.date}
                                </span>
                                <h3 className="font-script text-2xl text-foreground mt-1 mb-2">{story.title}</h3>
                                <p className="font-serif-wedding text-muted-foreground text-sm leading-relaxed">
                                    {story.description}
                                </p>
                                <img
                                    src={story.photo}
                                    alt={story.title}
                                    className="mt-4 rounded-xl w-full h-48 object-cover shadow-md"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default LoveStorySection;
