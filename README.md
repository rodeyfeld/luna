# LUNA

**Satellite Imagery Intelligence Platform**

Luna is a modern frontend for accessing and analyzing satellite imagery from multiple providers. Search archives, execute studies, and visualize results with an intuitive, map-first interface.

Built with SvelteKit 5, Skeleton UI, Tailwind CSS, and OpenLayers.

## ✨ New Redesign

Luna has been completely redesigned with a modern UI/UX! See **[REDESIGN.md](./REDESIGN.md)** for:
- Feature overview and usage guide
- Technical architecture
- Design principles
- Migration notes

### Key Features

- 🗺️ **Interactive Mapping** - Draw areas of interest with Point/Polygon tools
- 🛰️ **Multi-Provider Search** - Query multiple satellite providers simultaneously
- 📊 **Study Execution** - Run analyses like tree coverage, wind speed detection
- ⚡ **Real-Time Status** - Track searches and studies with live updates
- 🎯 **Smart Filtering** - Filter by resolution, cloud coverage, sensor type
- 📈 **Results Visualization** - Interactive maps with imagery thumbnails and metadata

## Local Development

### Prerequisites
- Docker & Docker Compose
- Bun (optional, for local development without Docker)

### Quick Start

1. **Copy environment file**
   ```bash
   cp example.env .env
   ```

2. **Start the development server**
   ```bash
   docker compose up
   ```

3. **Access the application**
   - http://localhost:5173

## Production Build

```bash
docker compose build
```

Production build outputs to `build/` directory and runs with:
```bash
bun run build/index.js
```

## Environment Variables

See `example.env` for configuration:

- `LUNA_AUGUR_HOST` - Backend API URL for Augur services
- `PUBLIC_*` - Public environment variables accessible in the browser

## Troubleshooting

**Clean up and restart:**
```bash
docker compose down
docker compose up --build
```

**View logs:**
```bash
docker compose logs -f sveltekit-web
```