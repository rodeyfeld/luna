# LUNA

Frontend for accessing aerospace and satellite imagery services.

Built with SvelteKit 5, Skeleton UI, and Tailwind CSS.

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