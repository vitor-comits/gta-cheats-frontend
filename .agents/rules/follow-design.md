# Rule: Follow Frontend Design Specification

## Scope & Authority

When implementing or modifying frontend code in this project, you must strictly adhere to the guidelines and specifications documented in `.agents/design.md`.

## Core Constraints

### 1. Strictly No Icons

- **Do not import or use any icon library** (including `lucide-react`, `@heroicons`, `react-icons`, or custom SVG icon sets).
- **Do not use decorative SVG icons or emoji as UI symbols**.
- All interactive elements, navigation links, status indicators, and actions must use plain, descriptive text (e.g., use `Copy` / `Copied`, `Clear`, `Search`, `← Back to All Games`).
- Keystrokes and controller buttons must be rendered using semantic HTML `<kbd>` elements with plain text names (e.g., `<kbd>R1</kbd>`, `<kbd>L2</kbd>`, `<kbd>HESOYAM</kbd>`).

### 2. Default-Looking & Clean Aesthetic

- Maintain a standard, utilitarian, browser-default appearance.
- Use native system fonts (`system-ui` for text, `ui-monospace` for cheat codes and buttons).
- Use clean, standard 1px borders (`border-gray-200`, `border-gray-300`).
- Avoid decorative gradients, glowing gamer effects, neon colors, pill-shaped bubbles, or heavy shadows (`shadow-sm` or `shadow-none` only).
- Keep border-radius modest (`rounded` / `rounded-md`, 4px to 6px).
- Respect the color palette defined in `design.md`:
  - Background: `#FFFFFF`
  - Secondary/Surface: `#F9FAFB` / `#F3F4F6`
  - Text Primary: `#111827`
  - Text Muted: `#4B5563`
  - Borders: `#E5E7EB`
  - Accent / Links: `#2563EB` (hover: `#1D4ED8`)
  - Success Feedback: `#059669`

### 3. Application Layout & Architecture

Implement the specified layout hierarchy and page routes:

- **Header**: Text-only branding (`GTA Cheats Hub`) with straightforward navigation links (`[All Games]`, `[About]`).
- **Homepage (`/`)**:
  - Filter input for games.
  - Grid or list of all GTA games with release year, available platform tags, and a direct `View Cheats` text link.
- **Cheats Page (`/cheats/[gameId]`)**:
  - Breadcrumb / back navigation (`← Back to All Games`).
  - Platform selector tabs (`PC`, `PlayStation`, `Xbox`, `Mobile`).
  - Category filters (`All`, `Weapons`, `Health`, `Vehicles`, etc.).
  - Real-time search/filter input.
  - Cheats table/list with columns: `Effect / Description`, `Category`, `Code / Sequence`, and a text `[Copy]` button.
  - Responsive behavior: collapses into clean bordered cards on small mobile screens while maintaining instant copy functionality.
