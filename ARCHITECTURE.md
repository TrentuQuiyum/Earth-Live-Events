# 🏗️ Architecture Overview

## Project Structure Visualization

```
🌍 NASA EONET Earth Live Dashboard
│
├── 📄 Documentation
│   ├── README.md                (✅ Full guide)
│   ├── DEVELOPMENT.md           (✅ Dev setup)
│   ├── API_REFERENCE.md         (✅ API docs)
│   ├── PROJECT_SUMMARY.md       (✅ Overview)
│   ├── QUICKSTART.md            (✅ Quick ref)
│   └── DELIVERY_REPORT.md       (✅ Status)
│
├── ⚙️ Configuration
│   ├── package.json             (Dependencies)
│   ├── vite.config.js           (Build config)
│   ├── index.html               (Entry point)
│   └── eslint.config.js         (Linting)
│
├── 📦 Source Code (src/)
│   ├── main.jsx                 (React root)
│   │
│   ├── App.jsx                  (Main dashboard)
│   │   └── Components:
│   │       ├── Header
│   │       ├── Control Panel
│   │       ├── Events Grid
│   │       └── Footer
│   │
│   ├── components/
│   │   └── EventCard.jsx        (Event display)
│   │       └── Features:
│   │           ├── Title & Status
│   │           ├── Category badge
│   │           ├── Expandable details
│   │           ├── Coordinates
│   │           └── Links
│   │
│   ├── services/
│   │   └── eosnetApi.js         (API integration)
│   │       └── Functions:
│   │           ├── fetchEvents()
│   │           └── getCategoryLabel()
│   │
│   └── Styles
│       ├── App.css              (Dashboard)
│       └── index.css            (Global)
│
├── 🎨 Static Assets
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/assets/
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
│
└── 📦 Build Output (dist/)
    ├── index.html               (Optimized)
    └── assets/
        ├── index-*.css          (Minified)
        └── index-*.js           (Bundled)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interaction                             │
│           (Filter, Refresh, Expand Cards)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     App.jsx (Main Component)                     │
│                                                                  │
│  State:                                                          │
│  • events: []                                                    │
│  • loading: boolean                                              │
│  • error: string | null                                          │
│  • selectedCategory: string                                      │
│  • lastUpdate: Date | null                                       │
│                                                                  │
│  Effects:                                                        │
│  • Initial fetch on mount                                        │
│  • Fetch on category change                                      │
│  • Auto-refresh every 5 minutes                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 eosnetApi.js (Service Layer)                     │
│                                                                  │
│  fetchEvents(category)                                           │
│  └─ URLSearchParams                                              │
│     └─ Fetch NASA EONET API                                      │
│        └─ Parse JSON response                                    │
│           └─ Return events array                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NASA EONET API v3                               │
│      https://eonet.gsfc.nasa.gov/api/v3/events                  │
│                                                                  │
│  Query Parameters:                                               │
│  • status=open                                                   │
│  • category=landslides|wildfires|severeStorms                    │
│                                                                  │
│  Returns: { events: [{...}, {...}] }                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              App.jsx (Update State)                              │
│                                                                  │
│  setEvents(data)           Update event list                     │
│  setLoading(false)         Hide loading spinner                  │
│  setLastUpdate(new Date()) Update timestamp                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Render Components                                   │
│                                                                  │
│  ├─ Header              (Title & subtitle)                       │
│  ├─ Control Panel       (Filter & refresh)                       │
│  ├─ Events Grid         (Map events to cards)                    │
│  │  └─ EventCard × N    (Display each event)                     │
│  │     ├─ Title                                                  │
│  │     ├─ Category badge                                         │
│  │     ├─ Status indicator                                       │
│  │     ├─ Date                                                   │
│  │     └─ Expandable details                                     │
│  └─ Footer             (Attribution)                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Rendering                             │
│                                                                  │
│  User sees:                                                      │
│  • Real-time events from NASA                                    │
│  • Can filter by category                                        │
│  • Can expand cards for details                                  │
│  • Can manually refresh                                          │
│  • Auto-refreshes every 5 minutes                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App (Root)
│
├── Header
│   ├── h1 "🌍 Earth Live Events"
│   └── p "Real-time Earth observation"
│
├── ControlPanel
│   ├── FilterGroup
│   │   ├── label "Filter by Category"
│   │   └── select
│   │       ├── "All Events"
│   │       ├── "Landslides"
│   │       ├── "Wildfires"
│   │       └── "Severe Storms"
│   │
│   ├── RefreshButton
│   │   └── onClick: handleRefresh()
│   │
│   └── LastUpdate
│       └── {timestamp}
│
├── MainContent
│   │
│   ├── [Loading State]
│   │   ├── Spinner animation
│   │   └── "Fetching Earth data…"
│   │
│   ├── [Empty State]
│   │   ├── 🌐 Icon
│   │   ├── "No active events found"
│   │   └── "Check back soon or try a different category"
│   │
│   ├── [Error State]
│   │   ├── ⚠️ Icon
│   │   ├── Error message
│   │   └── Retry button
│   │
│   ├── [Success State]
│   │   ├── EventsHeader
│   │   │   └── h2 "Active Events: N"
│   │   │
│   │   └── EventsGrid
│   │       └── EventCard × N
│   │           ├── Title
│   │           ├── Status badge
│   │           ├── Category badge
│   │           ├── Date
│   │           │
│   │           └── [On Click - Expand]
│   │               ├── Description
│   │               ├── Coordinates
│   │               └── Links
│   │
│   └── Footer
│       └── "Data provided by NASA EONET"
```

---

## State Management

```
App Component State
│
├── events: Event[]
│   └── Populated by: fetchEvents()
│       Triggers: Load, Category change, Auto-refresh
│
├── loading: boolean
│   └── true: During API fetch
│       false: API complete
│
├── error: string | null
│   └── Set when fetch fails
│       Cleared when retry succeeds
│
├── selectedCategory: string
│   └── Values: 'all', 'landslides', 'wildfires', 'severeStorms'
│       Triggers: New fetch when changed
│
└── lastUpdate: Date | null
    └── Set when data loaded
        Displayed to user
```

---

## Styling Architecture

```
CSS Cascade:
│
├── index.css (Global)
│   ├── :root (CSS Variables)
│   │   ├── --accent
│   │   ├── --bg-primary
│   │   ├── --bg-secondary
│   │   ├── --text-primary
│   │   └── --text-secondary
│   │
│   ├── * (Box model)
│   ├── body (Typography)
│   ├── ::-webkit-scrollbar (Custom scrollbar)
│   └── code (Font styling)
│
└── App.css (Component Styles)
    │
    ├── .app-container (Layout)
    │   └── flex, min-height: 100vh
    │
    ├── .app-header (Sticky header)
    │   ├── Gradient background
    │   ├── Border styling
    │   └── Box shadow
    │
    ├── .control-panel (Filter & refresh)
    │   ├── Flex layout
    │   ├── Gap spacing
    │   └── Responsive wrap
    │
    ├── .category-select (Dropdown)
    │   ├── Hover effects
    │   ├── Focus styles
    │   └── Option styling
    │
    ├── .refresh-button
    │   ├── Blue accent color
    │   ├── Hover transform
    │   └── Disabled state
    │
    ├── .main-content (Grid container)
    │   ├── Flex: 1 (grows)
    │   ├── Max-width: 1400px
    │   └── Padding & margin
    │
    ├── .events-grid (CSS Grid)
    │   ├── grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))
    │   ├── gap: 1.5rem
    │   └── Responsive
    │
    ├── .event-card
    │   ├── Background & border
    │   ├── Padding & border-radius
    │   ├── Transition effects
    │   ├── :hover state (lift + glow)
    │   └── Flex column layout
    │
    ├── .event-card-header
    │   ├── Flex between
    │   ├── Title styling
    │   └── Status badge
    │
    ├── .event-card-meta
    │   ├── Category badge
    │   └── Date display
    │
    ├── .event-card-details
    │   ├── Expandable content
    │   ├── Border & padding
    │   └── Detail labels
    │
    ├── .event-status (Badges)
    │   ├── .status-open (Green)
    │   └── .status-closed (Gray)
    │
    ├── .loading-state
    │   ├── Flex center
    │   ├── .spinner (CSS animation)
    │   └── Loading text
    │
    ├── .empty-state
    │   ├── Flex column center
    │   ├── Large icon
    │   └── Centered text
    │
    ├── .error-state
    │   ├── Warning icon
    │   ├── Error message
    │   └── Retry button (red accent)
    │
    ├── .app-footer
    │   ├── Background
    │   ├── Border top
    │   ├── Centered text
    │   └── Links
    │
    └── @media (max-width: 768px)
        ├── Adjust header size
        ├── Stack controls
        ├── 1-column grid
        └── Adjust padding
```

---

## API Integration Points

```
NASA EONET API v3
│
├── Service Layer: eosnetApi.js
│   │
│   ├── fetchEvents(category)
│   │   ├── Create URLSearchParams
│   │   ├── Append status: 'open'
│   │   ├── Append category if not 'all'
│   │   ├── Fetch from BASE_URL
│   │   ├── Check response.ok
│   │   ├── Parse JSON
│   │   ├── Return events array
│   │   └── Error handling: throw, log, propagate
│   │
│   └── getCategoryLabel(category)
│       └── Map category → UI label
│
└── Usage in App Component
    │
    ├── Initial load (useEffect, empty deps)
    │   └── loadEvents(selectedCategory)
    │
    ├── Category change (useEffect, selectedCategory dep)
    │   └── loadEvents(selectedCategory)
    │
    ├── Manual refresh (onClick handler)
    │   └── loadEvents(selectedCategory)
    │
    └── Auto-refresh (useEffect, setInterval)
        └── Every 5 minutes: loadEvents(selectedCategory)
```

---

## Browser Lifecycle

```
1. User visits http://localhost:5173
│
├─ Load index.html
│  └─ Link CSS (index.css)
│  └─ Load React app
│
├─ Parse & render App component
│  ├─ Initialize state
│  ├─ Register effects
│  └─ Render JSX
│
├─ First useEffect (empty deps)
│  └─ Load initial events (all)
│     ├─ setLoading(true)
│     ├─ Fetch NASA API
│     ├─ setEvents(data)
│     ├─ setLoading(false)
│     └─ setLastUpdate(now)
│
├─ Second useEffect (selectedCategory dep)
│  └─ Would run if category changes
│
├─ Third useEffect (auto-refresh)
│  └─ setInterval every 5 minutes
│
├─ Render UI
│  ├─ Show events in grid
│  ├─ Attach event listeners
│  └─ Paint browser
│
└─ User interactions
   ├─ Filter dropdown → change state → re-fetch → re-render
   ├─ Expand card → toggle state → re-render
   ├─ Refresh button → manual fetch → re-render
   └─ Auto-refresh timer → fetch → re-render
```

---

## Performance Optimizations

```
Build Optimizations:
├─ Vite tree-shaking (unused code removed)
├─ Minification (CSS + JS)
├─ Gzip compression
├─ Asset hashing (cache busting)
└─ No source maps in production

Runtime Optimizations:
├─ Functional components (lighter)
├─ useCallback not needed (simple callbacks)
├─ useMemo not needed (no heavy calculations)
├─ No unnecessary re-renders
├─ Event delegation on static content
└─ CSS Grid (GPU accelerated)

Network Optimizations:
├─ One API endpoint per action
├─ Auto-refresh not too frequent (5 min)
├─ No polling if page hidden (could add)
└─ Efficient fetch strategy

Asset Optimizations:
├─ Only necessary images included
├─ CSS Grid (no framework bloat)
├─ System fonts (no webfont load)
└─ No animation jank
```

---

This architecture provides a **clean, scalable, maintainable** foundation for the NASA EONET Earth Live Dashboard.
