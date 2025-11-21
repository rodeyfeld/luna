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

### Required Variables

- **`LUNA_AUGUR_HOST`** (Required) - Backend API URL for Augur services
  - In Docker: `http://augur-service:8000`
  - In Kubernetes: `http://augur-service.default.svc.cluster.local:8000`
  - **The application will fail to start if this is not set** (no fallback for production safety)

### Architecture

Luna uses an **internal proxy pattern** where all API requests go through Luna's server-side routes (`/api/*`) before reaching Augur. This means:

- ✅ Backend URLs never exposed to browser
- ✅ Kubernetes-ready with internal service DNS
- ✅ Easy to add auth, caching, or rate limiting at proxy layer
- ✅ Single point for monitoring all API traffic
- ✅ Fail-fast configuration validation

**No public environment variables** are used for backend connectivity - everything is server-side only.

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