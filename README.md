# Earth Live Events Dashboard

A minimal React dashboard for monitoring active natural events from NASA's Earth Observatory Natural Event Tracker (EONET) API v3.

The app focuses on a clean dark interface, recent event visibility, fast filtering, and readable event cards for categories such as wildfires, landslides, and severe storms.

## Features

- Live event data from NASA EONET v3
- Recent-first feed limited to the latest open events
- Category, location, search, and sort controls
- Optional grouping by readable location
- Expandable event cards with description, source link, and precise coordinates
- Loading, empty, timeout, and error states
- Five-minute background refresh
- Responsive dark UI built with vanilla CSS

## Tech Stack

- React 19
- Vite
- JavaScript
- CSS Grid and Flexbox
- NASA EONET API v3

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal. Vite usually serves the app at:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Project Structure

```text
src/
+-- components/
|   +-- DashboardControls.jsx
|   +-- EventCard.jsx
|   +-- StateMessage.jsx
+-- services/
|   +-- eonetApi.js
+-- utils/
|   +-- eventUtils.js
+-- App.jsx
+-- App.css
+-- index.css
+-- main.jsx
```

## API

This project uses NASA's public EONET v3 events endpoint:

```text
https://eonet.gsfc.nasa.gov/api/v3/events
```

Current request defaults:

```text
status=open
limit=24
days=30
```

Supported dashboard categories:

- All events
- Landslides
- Wildfires
- Severe storms

No API key is required.

## Notes

EONET event records often include precise coordinates but not always a polished place name. The dashboard tries to show a readable location first by using source metadata, event titles, short descriptions, and then broad coordinate-based regions as a fallback. Exact coordinates remain available inside each expanded event card.

## Build

Create an optimized production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

## License

MIT License. See [LICENSE](./LICENSE) for details.
