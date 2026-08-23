---
name: Educational Excellence System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#F0F4FF'
  primary: '#0037b1'
  on-primary: '#ffffff'
  primary-container: '#1f4fd8'
  on-primary-container: '#ccd4ff'
  inverse-primary: '#b7c4ff'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#ff7a19'
  on-secondary-container: '#5e2700'
  tertiary: '#7f2700'
  on-tertiary: '#ffffff'
  tertiary-container: '#a73600'
  on-tertiary-container: '#ffcab9'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#822800'
  background: '#FFFFFF'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  success: '#10B981'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-trust educational platform that balances institutional authority with modern accessibility. The visual identity is **Corporate / Modern**, leaning into clarity and precision to guide users through learning paths and career information without visual friction.

The style prioritizes a "Safe" aesthetic, utilizing a deep primary blue to evoke stability and intelligence, paired with an energetic orange accent to highlight calls to action and milestones. The interface relies on generous whitespace, a structured grid, and high-quality typography to ensure that complex information remains digestible and inviting. It targets students and professionals who require a reliable, focused environment for educational advancement.

## Colors

This design system utilizes a high-contrast palette optimized for readability and clear hierarchical signaling.

*   **Primary Blue (`#1F4FD8`):** Used for core branding, primary navigation, and interactive states. It represents the "Institutional" anchor of the brand.
*   **Secondary Orange (`#FF7A18`):** Reserved for high-priority accents, progress indicators, and primary call-to-action buttons. It provides a warm, motivating counterpoint to the blue.
*   **Surface Tint (`#F0F4FF`):** A soft, cool-toned neutral used for card backgrounds, section offsets, and subtle UI layering to reduce eye strain.
*   **Neutrals:** A scale of grays derived from a cool-slate base to maintain harmony with the primary blue, ensuring text contrast meets AA/AAA accessibility standards.

## Typography

The typographic strategy pairs **Plus Jakarta Sans** for headlines with **Inter** for body content. 

- **Plus Jakarta Sans** provides a friendly, contemporary geometric feel for titles, making the platform feel approachable yet organized.
- **Inter** is utilized for all functional text, data, and long-form reading due to its exceptional legibility and neutral, systematic character.

We employ a strict hierarchy where headlines use heavier weights (600-700) to anchor the page, while body copy remains at a standard 400 weight for optimal reading flow. Label styles are slightly tighter and occasionally uppercase to distinguish functional UI elements from narrative content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop, transitioning to a fluid model for mobile devices.

- **Desktop (1280px+):** A 12-column grid with a 1280px max-width, 24px gutters, and 48px outer margins. 
- **Tablet (768px - 1279px):** An 8-column fluid grid with 24px gutters and 32px margins.
- **Mobile (Up to 767px):** A 4-column fluid grid with 16px gutters and 16px margins.

The spacing rhythm is based on a **4px/8px baseline shift**. Vertical spacing between sections should scale from 48px on mobile to 80px on desktop to maintain a sense of openness and "breathing room" in an information-dense environment.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Base):** The main background (`#FFFFFF`).
2.  **Level 1 (Subtle):** Using the Surface Tint (`#F0F4FF`) for sectioning background areas or inactive cards.
3.  **Level 2 (Raised):** Standard cards and interactive elements use a very soft, diffused shadow: `0 4px 20px rgba(31, 79, 216, 0.08)`. This tinting ties the shadow to the primary brand color.
4.  **Level 3 (Overlay):** Modals, dropdowns, and active tooltips use a more defined shadow: `0 12px 32px rgba(0, 0, 0, 0.12)` to clearly separate them from the content beneath.

Avoid heavy borders; use light-gray outlines (`#E2E8F0`) only when elements need to be defined against a white background without adding depth.

## Shapes

The design system uses a **Rounded** shape language to reinforce the "Safe" and "Approachable" visual identity. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) corner radius.
- **Large Containers:** Hero sections and primary content cards use a 1rem (16px) radius.
- **Pill Elements:** Search bars and status chips use a fully rounded (pill) radius to distinguish them from structural components.
- **Iconography:** Icons should feature slightly rounded terminals and corners to match the UI's softness.

## Components

### Buttons
- **Primary:** Solid `#1F4FD8` background with White text. High-emphasis action.
- **Secondary:** Solid `#FF7A18` background. Used for "Start Now" or "Join" actions.
- **Outline:** 2px border in `#1F4FD8` with matching text. For secondary page actions.

### Input Fields
- Text inputs use a 1px border (`#CBD5E1`), 8px border-radius, and 12px horizontal padding.
- Focused state: 2px border in `#1F4FD8` with a subtle blue outer glow.

### Cards
- Standard cards feature a white background, 16px border-radius, and the Level 2 ambient shadow.
- Header cards or "featured" content may use the `#F0F4FF` tint to stand out from the main grid.

### Chips & Tags
- Used for categories (e.g., "Engineering," "Management").
- Soft rounded corners (8px) with a light version of the primary blue (`#E0E7FF`) and dark blue text.

### Progress Indicators
- Linear bars using the secondary orange (`#FF7A18`) for the "fill" to provide high-visibility feedback on course completion.