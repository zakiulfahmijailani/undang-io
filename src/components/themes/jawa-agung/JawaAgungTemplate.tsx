/* Full-page SVG-only Jawa Agung wedding invitation renderer based on the June 5 rebuild brief. */

"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CalendarDays, Check, Copy, Heart, Home, MapPin, MessageCircle, Navigation, Send, UserRound, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import type { FatehaEvent, FatehaGiftAccount, FatehaInvitationData, FatehaRsvpMessage, FatehaStoryItem } from "@/components/themes/fateha";
import { cn } from "@/lib/utils";
import {
  BatikBorder,
  BorderFrame,
  BottomArch,
  CornerOrnament,
  DividerOrnament,
  EventMedallion,
  GununganCrown,
  GununganCrest,
  JasmineGarland,
  JanurArch,
  KawungBackground,
  MelatiCluster,
  RoyalEnvelope,
  SparkleField,
  WayangSilhouette,
} from "./JawaAgungSVG";
import { jawaAgungFontClassName } from "./fonts";

type JawaAgungSectionId = "cover" | "quote" | "couple" | "story" | "event" | "gallery" | "rsvp" | "gift" | "closing";
type AttendanceChoice = "hadir" | "tidak_hadir" | "masih_ragu";
type RsvpFormState = {
  name: string;
  guests: string;
  attendance: AttendanceChoice | "";
  message: string;
};
type MessageResponseItem = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};
type MessageResponse = {
  data: { items: MessageResponseItem[] } | null;
  error: { message?: string } | null;
};

const DEFAULT_SECTION_ORDER: JawaAgungSectionId[] = ["cover", "quote", "couple", "story", "event", "gallery", "rsvp", "gift", "closing"];
const sectionAliases: Record<string, JawaAgungSectionId> = {
  hero: "cover",
  cover: "cover",
  ayat: "quote",
  quote: "quote",
  mempelai: "couple",
  couple: "couple",
  love_story: "story",
  lovestory: "story",
  story: "story",
  acara: "event",
  event: "event",
  galeri: "gallery",
  gallery: "gallery",
  rsvp: "rsvp",
  gift: "gift",
  hadiah: "gift",
  footer: "closing",
  closing: "closing",
  penutup: "closing",
};

const navItems = [
  { href: "#cover", icon: Home, label: "Utama" },
  { href: "#couple", icon: UserRound, label: "Mempelai" },
  { href: "#event", icon: CalendarDays, label: "Acara" },
  { href: "#rsvp", icon: MessageCircle, label: "RSVP" },
  { href: "#closing", icon: Heart, label: "Penutup" },
] as const;

const jawaAgungStyles = `
.jawa-agung-theme {
  --jawa-bg-primary: #F5EDD6;
  --jawa-bg-secondary: #EDE0C0;
  --jawa-bg-card: #FAF4E6;
  --jawa-soga: #7B3F1A;
  --jawa-gold: #D4A843;
  --jawa-gold-deep: #C8922A;
  --jawa-green: #2C4A1E;
  --jawa-body: #2A1A0E;
  --jawa-muted: #7A5C3A;
  color: var(--jawa-body);
  font-family: var(--font-jawa-body), Georgia, serif;
  scroll-behavior: smooth;
  background:
    radial-gradient(circle at 50% 0%, rgba(212,168,67,.22), transparent 38rem),
    #d8c093;
}
.jawa-agung-theme main { overflow: hidden; }
.jawa-agung-theme *, .jawa-agung-theme *::before, .jawa-agung-theme *::after { box-sizing: border-box; }
.jawa-agung-theme a { color: inherit; text-decoration: none; }
.jawa-agung-theme button, .jawa-agung-theme input, .jawa-agung-theme textarea, .jawa-agung-theme select { font: inherit; }
.jawa-section {
  position: relative;
  display: flex;
  width: min(100%, 62rem);
  min-height: 100dvh;
  margin-inline: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  overflow: hidden;
  border-inline: 1px solid rgba(123,63,26,.14);
  padding: 6.5rem 1rem;
  box-shadow: 0 0 90px rgba(79,45,13,.12);
}
.jawa-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 8% 12%, rgba(123,63,26,.18) 0 1px, transparent 1.8px),
    radial-gradient(circle at 84% 62%, rgba(212,168,67,.2) 0 1px, transparent 2px),
    radial-gradient(circle at 38% 88%, rgba(123,63,26,.12) 0 1px, transparent 1.8px),
    linear-gradient(112deg, transparent 0 27%, rgba(212,168,67,.1) 28%, transparent 31% 68%, rgba(200,146,42,.08) 69%, transparent 72%);
  background-size: 130px 130px, 180px 180px, 110px 110px, 100% 100%;
  opacity: .48;
  mix-blend-mode: multiply;
  animation: goldPulse 8s ease-in-out infinite;
}
.jawa-section::after {
  content: "";
  position: absolute;
  inset: 1.2rem;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 12% 16%, rgba(212,168,67,.16), transparent 16%),
    radial-gradient(ellipse at 91% 72%, rgba(123,63,26,.1), transparent 19%),
    radial-gradient(ellipse at 38% 96%, rgba(212,168,67,.12), transparent 18%);
  border: 1px solid rgba(123,63,26,.12);
  box-shadow: inset 0 0 0 5px rgba(212,168,67,.035);
  opacity: .78;
}
#cover {
  padding-block: 5rem 6.5rem;
}
#cover .jawa-content {
  gap: .5rem;
}
.jawa-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 34rem;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}
.jawa-display { font-family: var(--font-jawa-display), serif; }
.jawa-heading { font-family: var(--font-jawa-heading), Georgia, serif; }
.jawa-script { font-family: var(--font-jawa-script), cursive; }
.jawa-arabic { font-family: var(--font-jawa-arabic), serif; }
.jawa-gold-text {
  color: #D4A843;
  background: linear-gradient(135deg, #EBD17A 0%, #D4A843 45%, #A96F15 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 16px 40px rgba(123, 63, 26, .16);
}
.jawa-royal-title {
  font-family: var(--font-jawa-heading), Georgia, serif;
  font-weight: 600;
  letter-spacing: -.035em;
  color: #5F3515;
  text-shadow: 0 1px 0 rgba(255,255,255,.7), 0 12px 28px rgba(123,63,26,.1);
}
.jawa-cover-name {
  color: #3D1F0A;
  background: none;
  -webkit-text-fill-color: currentColor;
  -webkit-text-stroke: .35px #B6812C;
  letter-spacing: -.04em;
  white-space: nowrap;
  word-break: keep-all;
  text-shadow:
    0 1px 0 #FFF8E8,
    0 2px 0 rgba(182,129,44,.35),
    0 15px 34px rgba(61,31,10,.14);
}
.jawa-card {
  border: 1px solid rgba(123,63,26,.58);
  background:
    radial-gradient(circle at 50% 0%, rgba(212,168,67,.12), transparent 48%),
    rgba(250,244,230,.94);
  box-shadow:
    inset 0 0 0 4px rgba(212,168,67,.08),
    inset 0 0 0 5px rgba(123,63,26,.12),
    0 22px 60px rgba(123,63,26,.12);
}
.jawa-field {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-bottom: 1px solid rgba(212,168,67,.86);
  background: transparent;
  padding: .7rem 0 .55rem;
  color: var(--jawa-body);
  outline: none;
  transition: border-color .2s ease;
}
.jawa-field::placeholder { color: rgba(122,92,58,.72); }
.jawa-field:focus { border-color: var(--jawa-soga); }
.jawa-reveal {
  opacity: 0;
  transform: translateY(24px);
}
.jawa-revealed {
  animation: jawaReveal .85s ease-out forwards;
}
.jawa-revealed .jawa-stagger > * {
  opacity: 0;
  transform: translateY(16px);
  animation: jawaReveal .8s ease-out forwards;
}
.jawa-revealed .jawa-stagger > *:nth-child(1) { animation-delay: .05s; }
.jawa-revealed .jawa-stagger > *:nth-child(2) { animation-delay: .15s; }
.jawa-revealed .jawa-stagger > *:nth-child(3) { animation-delay: .25s; }
.jawa-revealed .jawa-stagger > *:nth-child(4) { animation-delay: .35s; }
.jawa-revealed .jawa-stagger > *:nth-child(5) { animation-delay: .45s; }
.jawa-revealed .jawa-stagger > *:nth-child(6) { animation-delay: .55s; }
.jawa-divider-line {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
}
.jawa-revealed .jawa-divider-line,
#cover .jawa-divider-line {
  animation: drawDivider 1.4s ease-out .2s forwards;
}
.jawa-melati-particle {
  position: absolute;
  z-index: 7;
  width: .65rem;
  height: .65rem;
  background: rgba(182,129,44,.72);
  clip-path: polygon(50% 0, 58% 41%, 100% 50%, 58% 59%, 50% 100%, 42% 59%, 0 50%, 42% 41%);
  filter: drop-shadow(0 0 5px rgba(212,168,67,.32));
  opacity: 0;
  animation: melatiFloat 4s ease-in-out infinite;
  pointer-events: none;
}
.jawa-melati-particle:nth-child(3n) {
  width: .42rem;
  height: .42rem;
  background: rgba(255,248,232,.9);
}
.jawa-nav {
  border-color: rgba(182,129,44,.7);
  background:
    linear-gradient(90deg, rgba(182,129,44,.06), transparent 18% 82%, rgba(182,129,44,.06)),
    rgba(255,249,235,.94);
  box-shadow:
    inset 0 0 0 3px rgba(255,255,255,.72),
    inset 0 0 0 4px rgba(182,129,44,.14),
    0 18px 45px rgba(123,63,26,.16);
  padding-bottom: max(.25rem, env(safe-area-inset-bottom));
}
.jawa-nav-item {
  position: relative;
}
.jawa-nav-item::after {
  content: "";
  position: absolute;
  left: 28%;
  right: 28%;
  bottom: .15rem;
  height: 1px;
  background: #B6812C;
  opacity: 0;
  transform: scaleX(.25);
  transition: opacity .25s ease, transform .25s ease;
}
.jawa-nav-item[data-active="true"] {
  color: #8A5518;
  background: rgba(212,168,67,.09);
}
.jawa-nav-item[data-active="true"]::after {
  opacity: 1;
  transform: scaleX(1);
}
.jawa-sparkle {
  animation: sparkleTwinkle 3.8s ease-in-out infinite;
  filter: drop-shadow(0 0 4px rgba(212,168,67,.32));
}
.jawa-frame-line {
  stroke-dasharray: 1800;
  stroke-dashoffset: 0;
}
#cover .jawa-frame-line {
  stroke-dashoffset: 1800;
  animation: drawRoyalFrame 1.4s ease-out .35s forwards;
}
.jawa-cover-corners {
  animation: ornateCornerEnter .8s ease-out .15s both;
}
.jawa-cover-crown-enter {
  animation: crownEnter .8s ease-out .55s both;
}
.jawa-cover-label-enter {
  animation: jawaReveal .65s ease-out .75s both;
}
.jawa-cover-bride-enter {
  animation: royalNameEnter .8s ease-out .95s both;
}
.jawa-cover-amp-enter {
  animation: jawaReveal .55s ease-out 1.15s both;
}
.jawa-cover-groom-enter {
  animation: royalNameEnter .8s ease-out 1.3s both;
}
.jawa-cover-arch-enter {
  animation: jawaReveal .75s ease-out 1.55s both;
}
.jawa-copy-bounce {
  animation: copyBounce .42s ease-out;
}
@keyframes melatiFloat {
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  15% { opacity: .65; }
  85% { opacity: .4; }
  100% { transform: translateY(-90px) translateX(18px) rotate(55deg); opacity: 0; }
}
@keyframes jawaReveal {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes goldPulse {
  0%, 100% { opacity: .34; }
  50% { opacity: .55; }
}
@keyframes drawDivider {
  from { stroke-dashoffset: 400; }
  to { stroke-dashoffset: 0; }
}
@keyframes drawRoyalFrame {
  from { stroke-dashoffset: 1800; opacity: .2; }
  to { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes ornateCornerEnter {
  from { opacity: 0; transform: scale(.76); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes crownEnter {
  from { opacity: 0; transform: translateY(-24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes royalNameEnter {
  from { opacity: 0; transform: translateY(22px) scale(.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes sparkleTwinkle {
  0%, 100% { opacity: .18; transform: scale(.8) rotate(0); }
  50% { opacity: .82; transform: scale(1.28) rotate(22deg); }
}
@keyframes copyBounce {
  0% { transform: scale(1); }
  45% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.jawa-envelope-intro {
  position: relative;
  min-height: 100svh;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 42%, rgba(255,249,233,.98) 0 15%, rgba(245,232,200,.86) 47%, transparent 74%),
    linear-gradient(135deg, #D8BD85, #F4E4BB 48%, #CEAC6C);
  padding: 1rem;
  transition: opacity 1s ease-out, transform 1s ease-out, filter 1s ease-out;
}
.jawa-envelope-intro.is-opening {
  opacity: 0;
  transform: translateY(-28px) scale(1.035);
  filter: brightness(1.12);
  pointer-events: none;
}
.jawa-envelope-intro::before {
  content: "";
  position: absolute;
  inset: 1rem;
  z-index: 2;
  pointer-events: none;
  border: 1px solid rgba(123,63,26,.34);
  box-shadow:
    inset 0 0 0 5px rgba(255,249,233,.36),
    inset 0 0 0 6px rgba(182,129,44,.18),
    inset 0 0 100px rgba(123,63,26,.08);
}
.jawa-envelope-intro::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(123,63,26,.08), transparent 13% 87%, rgba(123,63,26,.08)),
    radial-gradient(circle at 50% 50%, transparent 42%, rgba(123,63,26,.13));
  mix-blend-mode: multiply;
}
.jawa-envelope-card {
  position: relative;
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 37%, rgba(255,252,242,.98), rgba(248,238,212,.96) 68%, rgba(225,199,145,.94)),
    #FAF4E6;
  width: 100%;
  max-width: 34rem;
  min-height: min(92dvh, 47rem);
  padding: 2.4rem 2rem 2rem;
  border: 1px solid rgba(123,63,26,.7);
  box-shadow:
    inset 0 0 0 6px rgba(255,250,237,.72),
    inset 0 0 0 7px rgba(182,129,44,.28),
    0 36px 100px rgba(77,38,11,.24);
}
.jawa-envelope-card::before {
  content: "";
  position: absolute;
  inset: 13px;
  border: 1px solid rgba(182,129,44,.46);
  pointer-events: none;
}
.jawa-envelope-card::after {
  content: "";
  position: absolute;
  inset: 20px;
  border: 1px dashed rgba(182,129,44,.22);
  pointer-events: none;
}
.jawa-envelope-heading {
  color: #5A2D0D;
  text-shadow: 0 1px #fff8e8, 0 8px 22px rgba(123,63,26,.12);
}
.jawa-envelope-button {
  position: relative;
  isolation: isolate;
  min-width: min(20rem, 82vw);
  font-family: var(--font-jawa-display), serif;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: #F5EDD6;
  background: linear-gradient(135deg, #5A2D0D, #8C501B 52%, #5A2D0D);
  padding: 1rem 2rem;
  border: 1px solid #C5902B;
  box-shadow: inset 0 0 0 3px #6A350F, inset 0 0 0 4px rgba(240,208,119,.55), 0 12px 28px rgba(77,38,11,.2);
  transition: transform .35s ease, filter .35s ease, box-shadow .35s ease;
  cursor: pointer;
}
.jawa-envelope-button::before,
.jawa-envelope-button::after {
  position: absolute;
  content: "✦";
  color: #EACB70;
  font-size: .7rem;
}
.jawa-envelope-button::before { left: 1.1rem; }
.jawa-envelope-button::after { right: 1.1rem; }
.jawa-envelope-button:hover {
  filter: brightness(1.12);
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 3px #6A350F, inset 0 0 0 4px rgba(240,208,119,.7), 0 18px 34px rgba(77,38,11,.26);
}
.jawa-envelope-illustration {
  position: relative;
  width: min(28rem, 88vw);
  max-width: 100%;
  margin: -.8rem auto -1rem;
  perspective: 1200px;
}
.jawa-envelope-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 22px 30px rgba(77,38,11,.11));
}
.jawa-envelope-letter {
  transform-origin: center bottom;
  transition: transform .9s cubic-bezier(.22,.9,.34,1), opacity .5s ease;
}
.jawa-envelope-flap-vector {
  transform-origin: 240px 153px;
  transition: transform .72s cubic-bezier(.4,0,.2,1), opacity .45s ease;
}
.jawa-envelope-seal-vector {
  transform-origin: 240px 278px;
  transition: transform .45s ease, opacity .35s ease;
}
.is-opening .jawa-envelope-flap-vector {
  transform: rotateX(165deg) translateY(-8px);
  opacity: .42;
}
.is-opening .jawa-envelope-seal-vector {
  transform: translate(240px,278px) scale(.35) rotate(35deg);
  opacity: 0;
}
.is-opening .jawa-envelope-letter {
  transform: translateY(-76px) scale(1.04);
}
@media (min-width: 640px) {
  .jawa-section { padding: 7rem 4.5rem; }
}
@media (max-width: 639px) {
  .jawa-envelope-intro { padding: .45rem; }
  .jawa-envelope-intro::before { inset: .45rem; }
  .jawa-envelope-card {
    min-height: calc(100dvh - .9rem);
    padding: 1.8rem 1rem 1.3rem;
  }
  .jawa-envelope-card::before { inset: 8px; }
  .jawa-envelope-card::after { inset: 14px; }
  .jawa-envelope-illustration {
    width: 100%;
    margin-block: -1.5rem -1.2rem;
  }
}
@media (min-width: 1024px) {
  .jawa-section { padding: 7rem 6rem; }
  .jawa-content { max-width: 58rem; }
  #cover { padding-block: 4.5rem; }
}
@media (min-width: 640px) and (max-height: 800px) {
  #cover { padding-block: 3.8rem 5.5rem; }
  #cover .jawa-cover-crown { width: min(320px, 60vw); }
  #cover .jawa-cover-name { font-size: clamp(4rem, 9vw, 6.7rem); }
}
@media (prefers-reduced-motion: reduce) {
  .jawa-agung-theme *,
  .jawa-agung-theme *::before,
  .jawa-agung-theme *::after {
    animation: none !important;
    transition-duration: .01ms !important;
  }
  .jawa-reveal,
  .jawa-revealed,
  .jawa-revealed .jawa-stagger > *,
  .jawa-melati-particle {
    opacity: 1 !important;
    transform: none !important;
  }
  .jawa-divider-line {
    stroke-dashoffset: 0 !important;
  }
}
`;

function formatDate(value: string | null) {
  if (!value) return "Tanggal akan diumumkan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatDateUpper(value: string | null) {
  return formatDate(value).replace(",", " -").toUpperCase();
}

function formatTime(event: FatehaEvent) {
  const value = event.time ?? event.date;
  if (!value) return "Waktu menyusul";
  if (/^\d{2}:\d{2}/.test(value)) return `${value.slice(0, 5)} WIB`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(date)} WIB`;
}

function safeArabic(value: string | null | undefined) {
  if (!value || value.includes("Ã") || value.includes("Ù")) return "";
  return value;
}

function getVisibleSections(data: FatehaInvitationData): JawaAgungSectionId[] {
  const order = Array.isArray(data.sections_order) && data.sections_order.length > 0 ? data.sections_order : DEFAULT_SECTION_ORDER;
  const normalized = order.map((section) => sectionAliases[section] ?? null).filter((section): section is JawaAgungSectionId => section !== null);
  const safeOrder = normalized.length > 0 ? normalized : DEFAULT_SECTION_ORDER;
  return safeOrder.filter((section) => isSectionVisible(data, section));
}

function isSectionVisible(data: FatehaInvitationData, section: JawaAgungSectionId) {
  const visibility = data.sections_visibility;
  if (!visibility) return true;
  if (visibility[section] === false) return false;
  return !Object.entries(sectionAliases).some(([alias, normalized]) => normalized === section && visibility[alias] === false);
}

function parentText(kind: "Putra" | "Putri", father: string | null, mother: string | null) {
  const names = [father, mother].filter(Boolean).join(" dan ");
  if (!names) return `${kind} tercinta dari keluarga besar`;
  return `${kind} dari ${names}`;
}

function eventExists(event: FatehaEvent) {
  return Boolean(event.date || event.time || event.venue || event.address);
}

function cityFromEvent(event: FatehaEvent) {
  const parts = event.address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) || event.venue || "Lokasi akan diumumkan";
}

function closingGreeting(data: FatehaInvitationData) {
  const marker = `${data.quote.translation} ${data.quote.source} ${data.quote.arabic} ${data.wedding.akad.venue} ${data.wedding.reception.venue}`.toLowerCase();
  if (/assalamu|allah|ar-rum|bismillah|quran|masjid|akad/i.test(marker)) return "Wassalamualaikum Warahmatullahi Wabarakatuh";
  return "Salam Rahayu";
}

export function JawaAgungTemplate({ data }: { data: FatehaInvitationData }) {
  const sectionOrder = useMemo(() => getVisibleSections(data), [data]);
  const [closingVisible, setClosingVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<JawaAgungSectionId>("cover");
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const elements = document.querySelectorAll(".jawa-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.style.animationDelay = `${index * 0.1}s`;
          element.classList.add("jawa-revealed");
          observer.unobserve(element);
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    const closing = document.getElementById("closing");
    let closingObserver: IntersectionObserver | null = null;
    if (closing) {
      closingObserver = new IntersectionObserver(([entry]) => setClosingVisible(Boolean(entry?.isIntersecting)), { threshold: 0.35 });
      closingObserver.observe(closing);
    }

    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveSection(visible.target.id as JawaAgungSectionId);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    sectionOrder.forEach((section) => {
      const element = document.getElementById(section);
      if (element) navObserver.observe(element);
    });

    return () => {
      observer.disconnect();
      closingObserver?.disconnect();
      navObserver.disconnect();
    };
  }, [sectionOrder, opened]);

  return (
    <div className={cn("jawa-agung-theme min-h-screen bg-[#E8D6AD]", jawaAgungFontClassName)}>
      <style>{jawaAgungStyles}</style>
      
      {!opened ? (
        <JawaEnvelopeIntro data={data} onOpen={() => setOpened(true)} />
      ) : null}
      
      {opened ? (
        <>
          <MusicToggle musicUrl={data.musicUrl} closingVisible={closingVisible} />
          <JawaNav activeSection={activeSection} />
          <main>
            {sectionOrder.map((section) => {
              if (section === "cover") return <CoverSection key={section} data={data} />;
              if (section === "quote" && (safeArabic(data.quote.arabic) || data.quote.translation)) return <OpeningQuoteSection key={section} data={data} />;
              if (section === "couple") return <CoupleSection key={section} data={data} />;
              if (section === "story" && data.loveStory.length > 0) return <LoveStorySection key={section} items={data.loveStory} />;
              if (section === "event") return <EventSection key={section} data={data} />;
              if (section === "gallery" && data.show_prewed_gallery !== false && data.gallery.length > 0) return <GallerySection key={section} data={data} />;
              if (section === "rsvp") return <RsvpSection key={section} data={data} />;
              if (section === "gift" && data.show_gift_section !== false && (data.giftAccounts.length > 0 || data.giftAddress)) return <GiftSection key={section} data={data} />;
              if (section === "closing") return <ClosingSection key={section} data={data} />;
              return null;
            })}
          </main>
        </>
      ) : null}
    </div>
  );
}

function JawaEnvelopeIntro({ data, onOpen }: { data: FatehaInvitationData; onOpen: () => void }) {
  const [phase, setPhase] = useState<"ready" | "opening">("ready");

  function handleOpen() {
    if (phase === "opening") return;
    setPhase("opening");
    setTimeout(onOpen, 1050);
  }

  const initials = data.monogram || `${data.bride.nickname[0]}&${data.groom.nickname[0]}`;

  return (
    <section className={cn("jawa-envelope-intro", phase === "opening" && "is-opening")}>
      <KawungBackground color="#D4A843" opacity={0.05} />
      <SparkleField count={15} color="#B6812C" opacity={0.6} />
      <BatikBorder color="#D4A843" opacity={0.4} className="absolute left-0 top-0 w-full z-[1]" />
      <BatikBorder color="#D4A843" opacity={0.4} className="absolute bottom-0 left-0 w-full rotate-180 z-[1]" />

      <div className="jawa-envelope-card">
        <BorderFrame color="#B6812C" opacity={0.78} inset={7} className="z-[1]" />
        <GununganCrown color="#8A5518" opacity={0.9} className="relative z-[3] -mb-2 w-[min(240px,58vw)]" />
        <p className="jawa-display relative z-[3] text-[0.55rem] font-bold uppercase tracking-[0.34em] text-[#7B3F1A]">Pahargyan Temanten</p>

        <div className="jawa-envelope-illustration">
          <RoyalEnvelope initials={initials} color="#7B3F1A" opacity={0.96} />
        </div>

        <h2 className="jawa-envelope-heading jawa-heading relative z-[3] -mt-2 mb-1 text-[clamp(2rem,7vw,3.4rem)] font-bold leading-none">
          {data.bride.nickname} <span className="text-[#B6812C] italic font-normal">&amp;</span> {data.groom.nickname}
        </h2>

        <DividerOrnament color="#B6812C" width={230} className="relative z-[3] -my-1 w-[min(230px,58vw)]" />
        <p className="jawa-display relative z-[3] mb-5 text-[0.5rem] font-bold uppercase tracking-[0.22em] text-[#7A5C3A]">
          {formatDateUpper(data.wedding.date)}
        </p>

        <button type="button" onClick={handleOpen} disabled={phase === "opening"} className="jawa-envelope-button relative z-[3] flex min-h-[52px] items-center justify-center gap-3">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Buka Undangan
        </button>
      </div>
    </section>
  );
}

function SectionFrame({
  id,
  children,
  className,
  contentClassName,
  withKawung = true,
  withFrame = true,
  reveal = true,
}: {
  id: JawaAgungSectionId;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  withKawung?: boolean;
  withFrame?: boolean;
  reveal?: boolean;
}) {
  return (
    <section id={id} className={cn("jawa-section", reveal && "jawa-reveal", className)}>
      {withKawung ? <KawungBackground opacity={id === "cover" ? 0.022 : 0.032} color="#D4A843" /> : null}
      <SparkleField count={id === "cover" ? 19 : 10} color="#B6812C" opacity={id === "cover" ? 0.72 : 0.42} className="z-[2]" />
      {withFrame ? <BorderFrame color="#B6812C" opacity={id === "closing" ? 0.82 : 0.72} className={cn("z-[4]", id === "cover" && "jawa-cover-corners")} /> : null}
      {withFrame ? (
        <>
          <BatikBorder color="#B6812C" opacity={0.46} className="absolute inset-x-0 top-0 z-[3]" />
          <BatikBorder color="#B6812C" opacity={0.46} className="absolute inset-x-0 bottom-0 z-[3]" />
        </>
      ) : null}
      <div className={cn("jawa-content", contentClassName)}>{children}</div>
    </section>
  );
}

function CoverSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionFrame
      id="cover"
      className="bg-[#F5EDD6] text-center"
      contentClassName="max-w-[48rem]"
      withKawung
      withFrame
      reveal={false}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_72%_62%_at_50%_43%,rgba(212,168,67,0.19)_0%,transparent_68%)]" aria-hidden="true" />
      <div className="jawa-stagger relative z-10 flex w-full flex-col items-center">
        <GununganCrown color="#8A5518" opacity={0.94} className="jawa-cover-crown jawa-cover-crown-enter h-auto w-[min(350px,82vw)] drop-shadow-[0_14px_24px_rgba(123,63,26,0.1)]" />
        <p className="jawa-cover-label-enter jawa-display -mt-1 bg-[#F5EDD6]/88 px-5 text-[0.5rem] font-bold uppercase tracking-[0.36em] text-[#6D421C] sm:text-[0.6rem]">Mengundang Anda Untuk Hadir</p>
        <DividerOrnament color="#B6812C" width={220} className="jawa-cover-label-enter mt-1 w-[min(220px,62vw)] opacity-80" />
        <h1 className="mt-2 max-w-full text-center">
          <span className="jawa-cover-name jawa-cover-bride-enter jawa-heading block text-[clamp(4rem,16vw,7rem)] font-bold leading-[0.78]">{data.bride.nickname}</span>
          <span className="jawa-cover-amp-enter jawa-heading block py-2 text-[1.8rem] italic leading-none text-[#7B3F1A]" aria-hidden="true">&amp;</span>
          <span className="jawa-cover-name jawa-cover-groom-enter jawa-heading block text-[clamp(4rem,16vw,7rem)] font-bold leading-[0.78]">{data.groom.nickname}</span>
        </h1>
        <div className="jawa-cover-arch-enter relative mt-2 flex min-h-36 w-[min(360px,86vw)] flex-col items-center justify-center pt-14">
          <BottomArch color="#B6812C" opacity={0.86} width={360} className="absolute inset-x-0 top-0 mx-auto h-auto w-full" />
          <p className="jawa-display relative z-10 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[#6D421C]">{formatDateUpper(data.wedding.date)}</p>
          <p className="jawa-script relative z-10 mt-2 text-[1.15rem] leading-6 text-[#7A5C3A]">{cityFromEvent(data.wedding.akad)}</p>
        </div>
      </div>
    </SectionFrame>
  );
}

function OpeningQuoteSection({ data }: { data: FatehaInvitationData }) {
  const arabic = safeArabic(data.quote.arabic);

  return (
    <SectionFrame id="quote" className="bg-[#EDE0C0]" contentClassName="max-w-3xl">
      <WayangSilhouette color="#7B3F1A" opacity={0.05} height={420} width={180} className="absolute -right-8 top-1/2 z-[2] h-[65%] w-auto -translate-y-1/2 lg:right-[5%]" />
      <JasmineGarland color="#8A5518" opacity={0.24} className="absolute bottom-8 left-1/2 z-[2] w-[min(520px,88vw)] -translate-x-1/2" />
      <div className="jawa-stagger relative z-10 flex flex-col items-center gap-7">
        <DividerOrnament color="#D4A843" width={320} className="w-[min(320px,78vw)]" />
        {arabic ? <p className="jawa-arabic max-w-3xl text-center text-[1.8rem] leading-[2.2] text-[#7B3F1A] sm:text-[2.2rem]">{arabic}</p> : null}
        {data.quote.translation ? <p className="mx-auto max-w-[52ch] text-center text-base italic leading-[1.9] text-[#2A1A0E]">{data.quote.translation}</p> : null}
        {data.quote.source ? <p className="jawa-display text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#7A5C3A]">{data.quote.source}</p> : null}
        <DividerOrnament color="#D4A843" width={320} className="w-[min(320px,78vw)] rotate-180" />
      </div>
    </SectionFrame>
  );
}

function CoupleSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionFrame id="couple" className="bg-[#FAF4E6]" contentClassName="max-w-5xl">
      <JasmineGarland color="#8A5518" opacity={0.25} className="absolute left-1/2 top-8 z-[2] w-[min(540px,90vw)] -translate-x-1/2" />
      <div className="jawa-stagger flex w-full flex-col items-center">
        <SectionHeading eyebrow="Mempelai" title="Putra & Putri" />
        <div className="mt-10 flex w-full flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:justify-center lg:gap-0">
          <PersonCard
            label="Mempelai Wanita"
            person={data.bride}
            kind="Putri"
            showPhoto={data.show_couple_photos !== false}
          />
          <div className="hidden flex-col items-center justify-center px-12 lg:flex" aria-hidden="true">
            <DividerOrnament color="#D4A843" width={200} className="rotate-90 opacity-80" />
          </div>
          <PersonCard
            label="Mempelai Pria"
            person={data.groom}
            kind="Putra"
            showPhoto={data.show_couple_photos !== false}
          />
        </div>
      </div>
    </SectionFrame>
  );
}

function PersonCard({
  label,
  person,
  kind,
  showPhoto,
}: {
  label: string;
  person: FatehaInvitationData["bride"];
  kind: "Putra" | "Putri";
  showPhoto: boolean;
}) {
  return (
    <article className="relative flex max-w-[280px] flex-1 flex-col items-center text-center">
      {showPhoto ? (
        <div className="relative grid h-[132px] w-[132px] place-items-center bg-[#D4A843] p-[2px] shadow-[0_12px_34px_rgba(123,63,26,0.2)] [clip-path:polygon(20%_0%,80%_0%,100%_20%,100%_80%,80%_100%,20%_100%,0%_80%,0%_20%)] sm:h-[152px] sm:w-[152px]">
          <div className="grid h-full w-full place-items-center bg-[#FAF4E6] p-[5px] [clip-path:polygon(20%_0%,80%_0%,100%_20%,100%_80%,80%_100%,20%_100%,0%_80%,0%_20%)]">
            {person.photo ? (
              <img
                src={person.photo}
                alt={`Foto ${person.fullName}`}
                width={140}
                height={140}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover [clip-path:polygon(20%_0%,80%_0%,100%_20%,100%_80%,80%_100%,20%_100%,0%_80%,0%_20%)]"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-[#EDE0C0] text-[#D4A843] [clip-path:polygon(20%_0%,80%_0%,100%_20%,100%_80%,80%_100%,20%_100%,0%_80%,0%_20%)]" aria-hidden="true">
                <MelatiCluster count={5} spread={84} color="#D4A843" opacity={0.7} />
              </div>
            )}
          </div>
          <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border border-[#B6812C] bg-[#FAF4E6]" aria-hidden="true" />
          <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border border-[#B6812C] bg-[#FAF4E6]" aria-hidden="true" />
        </div>
      ) : null}
      <p className="jawa-display mt-7 text-[0.5rem] font-bold uppercase tracking-[0.2em] text-[#7A5C3A]">{label}</p>
      <h3 className="jawa-heading mt-2 text-[1.35rem] font-bold leading-tight text-[#7B3F1A]">{person.fullName}</h3>
      <p className="mt-3 text-[0.8rem] italic text-[#7A5C3A]">{parentText(kind, person.father, person.mother)}</p>
      {person.child ? <p className="mt-2 text-[0.85rem] leading-6 text-[#2A1A0E]">{person.child}</p> : null}
      <MelatiCluster count={3} spread={54} color="#D4A843" opacity={0.52} className="mt-4" />
    </article>
  );
}

function LoveStorySection({ items }: { items: FatehaStoryItem[] }) {
  return (
    <SectionFrame id="story" className="bg-[#F5EDD6]" contentClassName="max-w-3xl">
      <div className="jawa-stagger w-full">
        <SectionHeading eyebrow="Perjalanan Cinta Kami" title="Kisah" />
        <div className="relative mx-auto mt-10 w-full max-w-[600px]">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-[#C8922A]/65" aria-hidden="true" />
          <div className="grid gap-8">
            {items.map((item, index) => (
              <article key={`${item.year}-${item.title}-${index}`} className="relative mx-auto w-full max-w-md bg-[#FAF4E6]/72 px-6 py-7 text-center shadow-[0_18px_44px_rgba(123,63,26,0.08)]">
                <CornerOrnament position="tl" color="#D4A843" size={28} className="absolute left-3 top-3" />
                <p className="jawa-display text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#C8922A]">{item.year}</p>
                <h3 className="jawa-heading mt-2 text-[1.2rem] font-bold text-[#7B3F1A]">{item.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-7 text-[#2A1A0E]">{item.description}</p>
                <DividerOrnament color="#D4A843" opacity={0.42} width={160} className="mx-auto mt-5" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function EventSection({ data }: { data: FatehaInvitationData }) {
  const hasAkad = eventExists(data.wedding.akad);
  const hasReception = eventExists(data.wedding.reception);

  return (
    <SectionFrame id="event" className="bg-[#EDE0C0]" contentClassName="max-w-5xl">
      <JasmineGarland color="#8A5518" opacity={0.22} className="absolute bottom-4 left-1/2 z-[2] w-[min(560px,92vw)] -translate-x-1/2 rotate-180" />
      <div className="jawa-stagger w-full">
        <SectionHeading eyebrow="Rangkaian Acara" title="Hari Bahagia" />
        <div className="mt-10 flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-8">
          {hasAkad ? <EventCard title="Akad Nikah" event={data.wedding.akad} /> : null}
          {hasAkad && hasReception ? <KerisSeparator /> : null}
          {hasReception ? <EventCard title="Resepsi Pernikahan" event={data.wedding.reception} /> : null}
        </div>
      </div>
    </SectionFrame>
  );
}

function EventCard({ title, event }: { title: string; event: FatehaEvent }) {
  const kind = title.startsWith("Akad") ? "akad" : "resepsi";

  return (
    <article className="jawa-card relative w-full max-w-[360px] p-8 text-center lg:p-10">
      <CornerOrnament position="tl" color="#D4A843" opacity={0.42} size={48} className="absolute left-3 top-3" />
      <CornerOrnament position="tr" color="#D4A843" opacity={0.42} size={48} className="absolute right-3 top-3" />
      <GununganCrown color="#8A5518" opacity={0.52} className="pointer-events-none absolute inset-x-0 top-2 mx-auto h-auto w-[110px]" />
      <EventMedallion kind={kind} color="#8A5518" opacity={0.84} size={86} className="mx-auto mb-5" />
      <p className="jawa-display text-[0.55rem] font-bold uppercase tracking-[0.25em] text-[#7B3F1A]">{title}</p>
      <DividerOrnament color="#D4A843" width={160} className="mx-auto my-6" />
      <h3 className="jawa-heading text-[1.3rem] font-bold leading-tight text-[#7B3F1A]">{formatDate(event.date)}</h3>
      <p className="mt-3 text-[0.9rem] italic text-[#7A5C3A]">{formatTime(event)}</p>
      <p className="jawa-heading mt-6 text-[1.08rem] font-semibold text-[#2A1A0E]">{event.venue || "Tempat acara menyusul"}</p>
      <p className="mt-2 line-clamp-2 text-[0.82rem] leading-6 text-[#7A5C3A]">{event.address || "Alamat lengkap akan diumumkan."}</p>
      {event.mapsUrl ? (
        <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="jawa-display mt-7 inline-flex min-h-11 items-center justify-center gap-2 border border-[#7B3F1A] px-6 py-2.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#7B3F1A] transition duration-300 hover:bg-[#7B3F1A] hover:text-[#F5EDD6]">
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Lihat Lokasi
        </a>
      ) : null}
    </article>
  );
}

function KerisSeparator() {
  return (
    <svg width="44" height="128" viewBox="0 0 44 128" className="hidden opacity-45 lg:block" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M22 2C18 14 25 22 20 34C17 42 26 50 20 62C16 72 24 80 21 92L18 126L22 116L26 126L23 92C20 80 28 72 24 62C18 50 27 42 24 34C19 22 26 14 22 2Z" fill="#7B3F1A" />
      <path d="M22 14C20 26 24 35 22 49C20 63 24 76 22 91" fill="none" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13 102H31M15 109H29" stroke="#D4A843" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function GallerySection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionFrame id="gallery" className="bg-[#FAF4E6]" contentClassName="max-w-5xl">
      <div className="jawa-stagger w-full">
        <SectionHeading eyebrow="Kenangan Kami" title="Galeri" />
        <div className="mt-10 grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-3">
          {data.gallery.slice(0, 9).map((item, index) => (
            <figure key={`${item.src}-${index}`} className="group relative overflow-hidden bg-[#EDE0C0]">
              <img
                src={item.src}
                alt={item.alt || "Foto galeri"}
                width={420}
                height={index % 3 === 1 ? 420 : 560}
                className={cn("h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:sepia-[0.2]", index % 3 === 1 ? "aspect-square" : "aspect-[3/4]")}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[#D4A843]/0 transition-colors duration-500 group-hover:bg-[#D4A843]/10" aria-hidden="true" />
              {item.caption ? <figcaption className="absolute inset-x-0 bottom-0 bg-[#2A1A0E]/55 px-3 py-2 text-center text-xs italic text-[#F5EDD6]">{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function RsvpSection({ data }: { data: FatehaInvitationData }) {
  const [form, setForm] = useState<RsvpFormState>({ name: "", guests: "1", attendance: "", message: "" });
  const [messages, setMessages] = useState<FatehaRsvpMessage[]>(data.rsvpMessages);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = Boolean(data.slug) && !data.isPreview;

  useEffect(() => {
    if (!data.slug || data.isPreview) return;
    let isMounted = true;

    async function loadMessages() {
      try {
        const response = await fetch(`/api/public/invitations/${data.slug}/messages`);
        const json = (await response.json()) as MessageResponse;
        if (!response.ok || !json.data || !isMounted) return;
        setMessages(
          json.data.items.map((item) => ({
            id: item.id,
            name: item.guest_name,
            attendance: null,
            message: item.message,
            createdAt: item.created_at,
          })),
        );
      } catch {
        // Seed messages stay visible when public messages cannot be loaded.
      }
    }

    void loadMessages();
    return () => {
      isMounted = false;
    };
  }, [data.isPreview, data.slug]);

  function update<K extends keyof RsvpFormState>(key: K, value: RsvpFormState[K]) {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.attendance) {
      setError("Mohon lengkapi nama dan status kehadiran.");
      return;
    }

    if (!canSubmit || !data.slug) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/public/invitations/${data.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: form.name.trim(),
          attendance_status: form.attendance,
          number_of_guests: Number.parseInt(form.guests, 10),
          message: form.message.trim(),
        }),
      });
      const json = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(json.error?.message || "Konfirmasi belum dapat dikirim.");

      if (form.message.trim()) {
        await fetch(`/api/public/invitations/${data.slug}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guest_name: form.name.trim(), message: form.message.trim() }),
        });
      }

      setMessages((current) => [
        {
          id: `local-${Date.now()}`,
          name: form.name.trim(),
          attendance: form.attendance,
          message: form.message.trim() || "Terima kasih, kami akan hadir.",
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setSubmitted(true);
      toast.success("Konfirmasi berhasil dikirim.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Konfirmasi belum dapat dikirim.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionFrame id="rsvp" className="bg-[#EDE0C0]" contentClassName="max-w-3xl">
      <WayangSilhouette color="#7B3F1A" opacity={0.04} height={420} width={180} className="absolute -left-12 top-1/2 z-[2] h-[68%] w-auto -translate-y-1/2" />
      <div className="jawa-stagger w-full">
        <SectionHeading eyebrow="Konfirmasi Kehadiran" title="RSVP" subtitle="Kehadiran Anda adalah kehormatan bagi kami." />
        <div className="jawa-card mx-auto mt-10 w-full max-w-[440px] p-6 sm:p-8">
          {submitted ? (
            <div className="py-9 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#7B3F1A] text-[#F5EDD6]">
                <Check className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="jawa-heading mt-5 text-4xl font-semibold text-[#7B3F1A]">Terima Kasih</h3>
              <p className="mt-3 text-sm leading-6 text-[#7A5C3A]">
                {canSubmit ? "Konfirmasi dan doa Anda telah kami terima." : "Ini adalah pratinjau. Form aktif setelah undangan dipublikasikan permanen."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <JawaField label="Nama">
                <input className="jawa-field" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Masukkan nama Anda" autoComplete="name" />
              </JawaField>
              <JawaField label="Jumlah Tamu">
                <select className="jawa-field" value={form.guests} onChange={(event) => update("guests", event.target.value)}>
                  {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} orang</option>)}
                </select>
              </JawaField>
              <div>
                <p className="jawa-display mb-3 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#7B3F1A]">Kehadiran</p>
                <div className="grid gap-2">
                  {[
                    ["hadir", "Hadir"],
                    ["tidak_hadir", "Tidak Hadir"],
                    ["masih_ragu", "Belum Pasti"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-left">
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={form.attendance === value}
                        onChange={(event) => update("attendance", event.target.value as AttendanceChoice)}
                        className="sr-only"
                      />
                      <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2 border-[#7B3F1A] transition duration-200", form.attendance === value && "border-[#D4A843] bg-[#D4A843]")} aria-hidden="true">
                        {form.attendance === value ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                      </span>
                      <span className="text-sm text-[#2A1A0E]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <JawaField label="Pesan / Ucapan">
                <textarea className="jawa-field min-h-28 resize-none" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis doa atau ucapan untuk kami..." />
              </JawaField>
              {error ? <p className="border border-[#7B3F1A]/20 bg-[#EDE0C0] px-4 py-3 text-sm text-[#7B3F1A]">{error}</p> : null}
              <button type="submit" className="jawa-display min-h-[52px] w-full bg-[#7B3F1A] px-8 py-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F5EDD6] transition duration-300 hover:bg-[#C8922A] active:scale-[0.98]" disabled={loading}>
                <span className="inline-flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {loading ? "Mengirim" : "Kirim Konfirmasi"}
                </span>
              </button>
            </form>
          )}
        </div>
        {messages.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-[440px] gap-3">
            {messages.slice(0, 3).map((message) => (
              <article key={message.id} className="border border-[#D4A843]/30 bg-[#FAF4E6]/72 p-4 text-left">
                <strong className="text-sm text-[#7B3F1A]">{message.name}</strong>
                <p className="mt-2 text-sm italic leading-6 text-[#7A5C3A]">&ldquo;{message.message}&rdquo;</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </SectionFrame>
  );
}

function GiftSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionFrame id="gift" className="bg-[#FAF4E6]" contentClassName="max-w-3xl">
      <div className="jawa-stagger w-full">
        <SectionHeading eyebrow="Doa & Hadiah" title="Amplop Digital" subtitle="Doa restu Anda adalah hadiah yang paling bermakna bagi kami." />
        <div className="mx-auto mt-10 grid max-w-lg gap-4">
          {data.giftAccounts.map((account) => <GiftAccountCard key={`${account.bank}-${account.number}`} account={account} />)}
          {data.giftAddress ? (
            <article className="jawa-card relative p-7 text-center">
              <MapPin className="mx-auto h-7 w-7 text-[#7B3F1A]" aria-hidden="true" />
              <h3 className="jawa-heading mt-3 text-2xl font-semibold text-[#7B3F1A]">Alamat Hadiah</h3>
              <p className="mt-3 text-sm leading-7 text-[#7A5C3A]">{data.giftAddress}</p>
            </article>
          ) : null}
        </div>
      </div>
    </SectionFrame>
  );
}

function GiftAccountCard({ account }: { account: FatehaGiftAccount }) {
  const [copied, setCopied] = useState(false);

  function copyNumber() {
    void navigator.clipboard.writeText(account.number);
    setCopied(true);
    toast.success("Nomor rekening disalin.");
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="jawa-card relative mx-auto w-full max-w-[320px] p-8 text-center">
      <CornerOrnament position="tl" color="#D4A843" opacity={0.5} size={42} className="absolute left-3 top-3" />
      <CornerOrnament position="tr" color="#D4A843" opacity={0.5} size={42} className="absolute right-3 top-3" />
      <p className="jawa-display text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#7B3F1A]">{account.bank}</p>
      <strong className="jawa-heading mt-4 block text-[1.3rem] font-bold text-[#7B3F1A]">{account.number}</strong>
      <p className="mt-2 text-sm text-[#7A5C3A]">a.n. {account.name}</p>
      <button
        type="button"
        className={cn("mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-[#7B3F1A] px-4 py-3 text-xs font-semibold text-[#7B3F1A] transition hover:bg-[#7B3F1A] hover:text-[#F5EDD6]", copied && "jawa-copy-bounce")}
        onClick={copyNumber}
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        {copied ? "Tersalin ✓" : "Salin Nomor Rekening"}
      </button>
    </article>
  );
}

function ClosingSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionFrame id="closing" className="bg-[#EDE0C0]" contentClassName="max-w-4xl">
      <WayangSilhouette color="#7B3F1A" opacity={0.055} height={480} width={206} className="absolute -left-12 top-1/2 z-[2] h-[70%] w-auto -translate-y-1/2 lg:left-[8%]" />
      <WayangSilhouette color="#7B3F1A" opacity={0.055} height={480} width={206} className="absolute -right-12 top-1/2 z-[2] h-[70%] w-auto -translate-y-1/2 -scale-x-100 lg:right-[8%]" />
      <JasmineGarland color="#8A5518" opacity={0.48} className="absolute left-1/2 top-10 z-[3] w-[min(600px,92vw)] -translate-x-1/2" />
      <div className="jawa-stagger relative z-10 flex flex-col items-center gap-7 text-center">
        <GununganCrest color="#8A5518" opacity={0.84} className="h-auto w-[92px]" />
        <DividerOrnament color="#D4A843" width={340} className="w-[min(340px,82vw)]" />
        <p className="jawa-script text-[clamp(1.3rem,5vw,2.2rem)] leading-tight text-[#D4A843]">{closingGreeting(data)}</p>
        <h2 className="jawa-script text-[clamp(1.8rem,6vw,3.5rem)] leading-none text-[#7B3F1A]">
          {data.bride.fullName}
          <span className="jawa-heading block py-3 text-2xl italic text-[#D4A843]">&amp;</span>
          {data.groom.fullName}
        </h2>
        <p className="text-[0.9rem] italic leading-7 text-[#7A5C3A]">Terima kasih atas doa dan kehadiran Anda</p>
        <MelatiCluster count={9} spread={200} color="#D4A843" opacity={0.5} />
        <DividerOrnament color="#D4A843" width={340} className="w-[min(340px,82vw)] rotate-180" />
      </div>
      <JanurArch color="#D4A843" opacity={0.48} width={300} className="absolute bottom-8 left-1/2 z-[3] w-[min(300px,82vw)] -translate-x-1/2" />
    </SectionFrame>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <header className="relative mx-auto max-w-xl text-center">
      <GununganCrest color="#8A5518" opacity={0.72} className="mx-auto h-auto w-12 sm:w-14" />
      <DividerOrnament color="#D4A843" width={260} className="mx-auto w-[min(260px,72vw)]" />
      <p className="jawa-display mt-5 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#7B3F1A]">{eyebrow}</p>
      <h2 className="jawa-heading mt-4 text-4xl font-bold text-[#7B3F1A]">{title}</h2>
      <DividerOrnament color="#D4A843" width={260} className="mx-auto my-5 w-[min(260px,72vw)] rotate-180" />
      {subtitle ? <p className="text-sm italic leading-7 text-[#7A5C3A]">{subtitle}</p> : null}
    </header>
  );
}

function JawaField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-left">
      <span className="jawa-display text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#7B3F1A]">{label}</span>
      {children}
    </label>
  );
}

function JawaNav({ activeSection }: { activeSection: JawaAgungSectionId }) {
  return (
    <nav className="jawa-nav fixed bottom-3 left-3 right-3 z-40 flex items-center justify-center overflow-hidden rounded-t-2xl border p-1 backdrop-blur-xl sm:left-1/2 sm:right-auto sm:w-[500px] sm:-translate-x-1/2" aria-label="Navigasi undangan">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="jawa-nav-item flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[9px] font-semibold uppercase tracking-wide text-[#7A5C3A] transition hover:bg-[#EDE0C0] hover:text-[#7B3F1A]"
          data-active={activeSection === item.href.slice(1)}
          aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
        >
          <item.icon className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
          <span className="truncate">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function MusicToggle({ musicUrl, closingVisible }: { musicUrl: string | null; closingVisible: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicUrl) return;

    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [musicUrl, playing]);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        type="button"
        aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
        onClick={() => setPlaying((current) => !current)}
        className={cn(
          "fixed bottom-24 right-4 z-50 grid min-h-11 min-w-11 place-items-center border border-[#D4A843] bg-[#FAF4E6]/92 text-[#7B3F1A] opacity-80 shadow-[0_14px_36px_rgba(123,63,26,0.18)] backdrop-blur-xl transition duration-500 hover:bg-[#EDE0C0]",
          playing && "bg-[#7B3F1A] text-[#F5EDD6]",
          closingVisible && "opacity-100",
        )}
      >
        <CornerOrnament position="tl" color="#D4A843" opacity={0.5} size={22} className="absolute left-0 top-0" />
        {playing ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
      </button>
    </>
  );
}
