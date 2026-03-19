# Design System Document

## 1. Overview & Creative North Star: "The Digital Concierge"

This design system is built to transform the wedding invitation process from a utility into a high-end editorial experience. Inspired by the precision of the iPhone 17 Pro Max, the aesthetic direction moves away from "web-standard" layouts and toward a **"Digital Concierge"** philosophy.

**The Creative North Star:**
*   **Intentional Asymmetry:** Break the rigid 12-column grid. Use the spacing scale to create offset headlines and staggered image galleries that mimic a luxury fashion magazine.
*   **Tonal Depth:** We do not use lines to separate ideas. We use light. By layering monochromatic surfaces, we create a tactile UI that feels like stacked sheets of premium titanium and frosted glass.
*   **Breathing Room:** Whitespace is not empty; it is a luxury. We utilize the upper ends of our spacing scale (Scale 16, 20, 24) to isolate key information, ensuring the user never feels overwhelmed by the complexity of wedding planning.

---

## 2. Colors: The Metallic Spectrum

Our palette is rooted in the "Titanium" aesthetic—deep, moody indigos paired with architectural greys and a fleeting touch of Rose Gold (Tertiary) for romantic highlights.

### Surface Hierarchy & The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content.
Boundaries must be defined solely through background color shifts or tonal transitions. Use `surface_container_low` for the main canvas and `surface_container_highest` for elevated interactive elements.

*   **Primary (`#1a274b`):** The Deep Indigo. Use this for high-authority moments and primary actions.
*   **Secondary (`#5f5e5c`):** The Titanium Grey. Used for supporting UI elements and metadata.
*   **Tertiary (`#3f201d` / Container `#ce9e99`):** The Rose Gold Accent. Reserve this for moments of celebration—"Send Invitation," "Save Date," or live wedding status.
*   **Glass & Gradient Rule:** For hero sections and primary CTAs, use a subtle linear gradient from `primary` to `primary_container`. For floating navigation or modal overlays, apply a `surface_container_low` fill at 80% opacity with a `backdrop-blur` of 20px to achieve the iPhone-inspired glass effect.

---

## 3. Typography: Editorial Authority

We use **Inter** to achieve a clean, technical look that mirrors the Apple SF Pro aesthetic.

*   **Display (Lg/Md):** These are your "vibe" setters. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines.
*   **Headline (Lg/Md/Sm):** Used for section headers. Always pair a `headline-lg` with a large vertical spacing block (Scale 12 or 16) to let the typography command the page.
*   **Title (Lg/Md/Sm):** Reserved for card titles and dashboard navigation items.
*   **Body (Lg/Md):** The workhorse. Maintain a line-height of 1.6 for `body-lg` to ensure the editorial feel persists even in long-form text.
*   **Labels:** Use `label-md` in all-caps with 0.05em tracking for category tags or small metadata to provide a technical, "Pro" device feel.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "web 2.0." We achieve depth through the **Layering Principle.**

*   **The Stack:** 
    1. Base Canvas: `surface`
    2. Section Block: `surface_container_low`
    3. Floating Card: `surface_container_lowest`
*   **Ambient Shadows:** If a card must float (e.g., a wedding preview), use a shadow with a 40px blur, 0px offset, and 6% opacity using a tint of the `primary` color. It should feel like an atmospheric glow, not a shadow.
*   **The Ghost Border:** If accessibility requires a stroke (e.g., input fields), use `outline_variant` at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** Navigation bars should always be `surface_container_lowest` at 70% opacity with a heavy background blur. This allows the sophisticated metallic colors of the content to bleed through as the user scrolls.

---

## 5. Components

### Buttons
*   **Primary:** A gradient-filled container (`primary` to `primary_container`) with `on_primary` text. Radius: `full`. No border.
*   **Secondary:** `surface_container_highest` background with `primary` text. This creates a "soft-touch" button feel.
*   **Tertiary (The "Rose" Action):** Use the `tertiary_fixed` background for romantic triggers.

### Input Fields
*   **Style:** Background `surface_container_high`, no border, `md` (0.75rem) corner radius. On focus, shift background to `surface_container_lowest` and apply the "Ghost Border."
*   **Typography:** Use `label-md` for floating labels.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Structure:** Separate list items using Spacing Scale `3` (1rem). Separate cards using background color shifts (e.g., a `surface_container_lowest` card on a `surface_container_low` background).
*   **Visual Invitation Editor:** Use the "Glass & Gradient" rule for the editor's sidebars to keep the focus on the invitation canvas while maintaining the premium titanium UI.

### Chips (Wedding Categories)
*   **Style:** `surface_container_highest` with `label-md` text. Roundedness: `full`. These should feel like physical pebbles or buttons on a high-end device.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. If the left margin is Scale 8, try a right margin of Scale 16 for a high-end editorial look.
*   **Do** use `display-lg` typography for "The Names" in wedding invitations—let the type be the hero.
*   **Do** lean into the "Deep Indigo" for dark-mode-inspired dashboard states.

### Don't
*   **Don't** use 1px #000000 or high-contrast borders. It breaks the "Titanium" illusion.
*   **Don't** use standard "blue" for links. Use the `primary` or `tertiary` (Rose Gold) for a more bespoke feel.
*   **Don't** clutter the screen. If you have more than 5 elements in a view, use a `surface_container` nested layer to group them.

---

## 7. Spacing Tokens (The Rhythm)
Use these specific values to maintain the "iPhone" precision:
*   **Tight (Scale 1.5 - 2):** Inside components (button padding, label-to-input).
*   **Medium (Scale 4 - 6):** Between related elements in a card.
*   **Executive (Scale 12 - 20):** Between major page sections or hero elements. This is the "Luxury Gap."

*Document End.*