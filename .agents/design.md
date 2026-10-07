# GTA Cheats Hub — Design Specification

## 1. Overview & Subject Matter

**GTA Cheats Hub** is an interactive, fast-access web catalog for Grand Theft Auto cheats across all franchise titles and gaming platforms (PC, PlayStation, Xbox, Nintendo Switch, Mobile).

### User Need & Context
Players consult cheats during active gameplay. They require:
- Instant visual scanning without decorative clutter.
- Rapid filtering by game, platform, and category (Weapons, Vehicles, Health, World, etc.).
- Direct one-click cheat code copying.
- Zero latency and high legibility across mobile and desktop.

### Explicit Visual Directives
- **Default-Looking Design**: Clean, utilitarian, standard browser/system appearance. Avoids arbitrary decorative gradients, neon gamer aesthetics, oversized card bubbles, and heavy drop shadows. Focuses on crisp borders, standard spacing, high contrast, and structured tables.
- **Strictly No Icons**: No icon libraries (no Lucide, SVGs, icon fonts, or emoji used as UI symbols). All actions, navigation elements, platform indicators, and statuses are conveyed via plain, descriptive text and semantic HTML elements (e.g., `<kbd>`, `<span>`, `<button>`).

---

## 2. Design Tokens

### 2.1 Color Palette
A standard, high-contrast neutral palette with a classic system web accent:

| Token Name | Hex Value | Usage / Semantic Role |
| :--- | :--- | :--- |
| `color-bg-base` | `#FFFFFF` | Main page background (pure clean canvas) |
| `color-bg-surface` | `#F9FAFB` | Table headers, secondary cards, filter bars |
| `color-bg-subtle` | `#F3F4F6` | Key caps (`<kbd>`), badges, hover states |
| `color-border` | `#E5E7EB` | 1px clean container dividers, table borders, inputs |
| `color-border-hover`| `#D1D5DB` | Subtle interactive border emphasis |
| `color-text-main` | `#111827` | Headings, primary body text, cheat codes |
| `color-text-muted`| `#4B5563` | Subtitles, release dates, categories, secondary metadata |
| `color-accent` | `#2563EB` | Active tabs, primary text links, focus rings |
| `color-accent-hover`| `#1D4ED8` | Hover state for interactive primary actions |
| `color-success` | `#059669` | "Copied" feedback state text |

### 2.2 Typography
Uses the native operating system font stack to ensure zero font-download overhead, instant rendering, and a crisp, native-feeling UI:

- **Body & Headings (System Sans)**:
  `font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;`
- **Cheat Codes & Keystrokes (System Mono)**:
  `font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`

#### Type Scale
- **H1 (Page Title)**: `1.75rem` (`28px`), `font-weight: 700`, `line-height: 1.25`
- **H2 (Section Heading / Game Title)**: `1.25rem` (`20px`), `font-weight: 600`, `line-height: 1.35`
- **H3 (Subheading / Card Title)**: `1.0rem` (`16px`), `font-weight: 600`, `line-height: 1.4`
- **Body**: `0.875rem` (`14px`), `font-weight: 400`, `line-height: 1.5`
- **Small / Metadata / Badges**: `0.75rem` (`12px`), `font-weight: 500`, `line-height: 1.4`
- **Cheat Code Display**: `0.875rem` (`14px`), `font-family: monospace`, `font-weight: 600`, letter-spacing `0.05em`

### 2.3 Spacing & Layout Metrics
- **Container**: Max width `1024px` (`max-w-5xl`), centered horizontally with `16px` padding on mobile, `24px` on desktop.
- **Border Radius**: Subdued `4px` (`rounded`) to `6px` (`rounded-md`). No pill-shaped buttons or heavy rounded corners.
- **Borders**: Standard `1px solid #E5E7EB`.
- **Shadows**: None or minimal (`shadow-sm`) to retain a classic, default document/app aesthetic.

---

## 3. Component Architecture & Conventions

### 3.1 Header
- **Layout**: Full-width container with bottom border (`1px solid #E5E7EB`), internal max-width container.
- **Branding**: Text-only brand `GTA Cheats Hub` (no gamepad icons or logos).
- **Navigation**: Clean text links: `[All Games]`, `[About]`. Active link underlined or styled in `color-accent`.

### 3.2 Keycaps & Code Presentation (`<kbd>`)
Cheat inputs must be formatted for rapid identification:
- Text button combinations rendered as individual `<kbd>` blocks:
  - Example PC: `<kbd className="px-1.5 py-0.5 border border-gray-300 bg-gray-100 rounded text-xs font-mono font-semibold">HESOYAM</kbd>`
  - Example Controller: `<kbd className="...">R1</kbd> <kbd className="...">R2</kbd> <kbd className="...">L1</kbd> <kbd className="...">X</kbd>`
- Multiple keys separated by standard spacing.

### 3.3 Text-Only Action Buttons (Zero Icons)
- **Copy Button**:
  - Default: `<button>Copy</button>`
  - Copied state: `<button className="text-emerald-700 font-medium">Copied</button>`
- **Back Navigation**:
  - Link styled as: `[← All Games]` or `Back to All Games` (plain text arrow or plain text).
- **Clear Search**:
  - Text button: `Clear`

---

## 4. Pages Structure & Wireframes

### 4.1 Global Layout
```
+--------------------------------------------------------------------------+
|  GTA Cheats Hub                                 [All Games]  [About]     |  <- Header
+--------------------------------------------------------------------------+
|                                                                          |
|  [ Main Page Content Area - max-w-5xl, centered ]                        |
|                                                                          |
+--------------------------------------------------------------------------+
|  GTA Cheats Hub. Educational and reference purpose.                      |  <- Footer
+--------------------------------------------------------------------------+
```

### 4.2 Homepage (Games Directory)
- **Purpose**: List all supported GTA games chronologically with platform coverage and direct links.
- **Features**:
  - Header with title: "GTA Cheats Catalog" and brief 1-line description.
  - Search input: Text filter to search game titles ("Filter games...").
  - Game Grid / List: Standard bordered cards or table layout with:
    - Game Title (e.g., *Grand Theft Auto: San Andreas*)
    - Release Year (e.g., *2004*)
    - Platforms available (text badges: `[PC]` `[PS2]` `[Xbox]`)
    - Action text link: `View Cheats →`

```
+--------------------------------------------------------------------------+
|  GTA Cheats Hub                                                          |
|  Quick reference for cheat codes across all Grand Theft Auto titles.     |
|                                                                          |
|  [ Search games by title...                                     ] [Clear]|
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  | Grand Theft Auto V (2013)                                          |  |
|  | Platforms: PC | PS5 | PS4 | PS3 | Xbox Series | Xbox One | Xbox 360|  |
|  | [View Cheats]                                                      |  |
|  +--------------------------------------------------------------------+  |
|  | Grand Theft Auto: San Andreas (2004)                               |  |
|  | Platforms: PC | PS2 | Xbox | Mobile                                |  |
|  | [View Cheats]                                                      |  |
|  +--------------------------------------------------------------------+  |
|  | Grand Theft Auto: Vice City (2002)                                 |  |
|  | Platforms: PC | PS2 | Xbox | Mobile                                |  |
|  | [View Cheats]                                                      |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

### 4.3 Cheats Page (Selected Game)
- **Path**: `/cheats/[gameId]` (e.g., `/cheats/san-andreas`)
- **Structure**:
  1. **Breadcrumb / Return**: `[← Back to All Games]`
  2. **Game Header**: Title, year, subtitle, and platform selector.
  3. **Controls Bar**:
     - **Platform Tabs**: Text buttons/tabs (`PC`, `PlayStation`, `Xbox`, `Mobile`). Active tab highlighted with solid background or underline.
     - **Category Filter**: `All`, `Weapons`, `Health & Armor`, `Vehicles`, `Wanted Level`, `World & Weather`.
     - **Search Bar**: "Filter cheats by name or effect..." with instant result count.
  4. **Cheats Table**:
     - Columns:
       - **Effect / Name** (e.g., "Full Health, Armor & $250k")
       - **Category** (e.g., "Health & Player")
       - **Code / Input Sequence** (rendered with `<kbd>` tags)
       - **Action** (plain text `[Copy]` button)

```
+--------------------------------------------------------------------------+
|  [← Back to All Games]                                                   |
|                                                                          |
|  Grand Theft Auto: San Andreas (2004)                                    |
|  Select a platform and category to view cheat codes.                     |
|                                                                          |
|  Platform:  [ PC (Selected) ]  [ PlayStation ]  [ Xbox ]  [ Mobile ]     |
|                                                                          |
|  Category:  [ All ] [ Weapons ] [ Health ] [ Vehicles ] [ Wanted Level ] |
|                                                                          |
|  [ Filter cheats by effect or code...                           ] [Clear]|
|  Showing 24 cheats for PC                                                |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  | Effect / Description       | Category | Code               | Action|  |
|  +----------------------------+----------+--------------------+-------+  |
|  | Full Health, Armor & $250k | Health   | [HESOYAM]          | [Copy]|  |
|  | Infinite Ammo              | Weapons  | [FULLCLIP]         | [Copy]|  |
|  | Spawn Jetpack              | Vehicles | [ROCKETMAN]        | [Copy]|  |
|  | Lower Wanted Level         | Wanted   | [TURNDOWNTHEHEAT]  | [Copy]|  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

---

## 5. Interaction & Usability Standards

1. **Copy to Clipboard**:
   - Clicking `[Copy]` writes the raw cheat code/key sequence to `navigator.clipboard`.
   - The button label changes to `[Copied]` for 2 seconds with `color-success`, then resets.
2. **Keyboard Accessibility**:
   - All interactive controls (`button`, `input`, `a`) have visible focus rings (`focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1`).
3. **Empty / Filter States**:
   - When search yields zero matches, display straightforward text:
     *"No cheats found matching your search. [Reset Filters]"*
4. **Mobile Responsiveness**:
   - On screens under `640px`, table rows transition cleanly into bordered list items with stacked fields, preserving one-tap copy functionality.
