# Luna Architecture

## Overview

Luna is a SvelteKit-based frontend that provides a modern interface for satellite imagery intelligence. It follows a **server-side proxy pattern** where all external API calls are routed through Luna's internal API layer before reaching the Augur backend.

## Architecture Pattern: Internal API Proxy

### Design Principle

```
Browser → Luna UI → Luna API Proxy (/api/*) → Augur Backend
```

**Key Benefits:**
- 🔒 Backend URLs and credentials stay server-side only
- ☸️ Kubernetes-ready with internal service DNS
- 🔄 Easy to add auth, caching, or transformation layers
- 📊 Single point for monitoring/logging all API traffic
- ⚡ Fail-fast configuration validation

### Why No Fallback Hosts?

All API proxy routes **require** `LUNA_AUGUR_HOST` to be set. There are **no fallback hosts** because:

1. **Kubernetes Safety** - Misconfigured services should fail immediately, not silently connect to wrong environments
2. **12-Factor App Compliance** - Configuration should be explicit, not assumed
3. **Clear Error Messages** - Missing env vars return HTTP 500 with clear error messages
4. **Production Ready** - No risk of accidentally using localhost in production

If `LUNA_AUGUR_HOST` is not set, every API call will return:
```json
{
  "error": "Server configuration error: LUNA_AUGUR_HOST not configured"
}
```

## API Response Format

All proxy routes follow a consistent response format:

### Success Responses

**List endpoints** (multiple items):
```json
{
  "results": [...]
}
```

**Single item endpoints**:
```json
{
  "result": {...}
}
```

### Error Responses

```json
{
  "error": "Error message",
  "details": "Optional detailed error information"
}
```

## API Proxy Routes

### Archive (Imagery Finders)
- `GET /api/archive` → List all imagery finders
- `GET /api/archive/finder_data/[id]` → Get finder by ID
- `POST /api/archive/finder_create` → Create new finder
- `POST /api/archive/finder_execute` → Execute study on finder

### Imagery (Areas of Interest)
- `GET /api/imagery` → List all stored geometries (AOIs)
- `GET /api/imagery/[id]` → Get geometry by ID
- `POST /api/imagery/create` → Create new geometry

### Providers
- `GET /api/providers` → List all satellite providers
- `GET /api/providers/integrations` → List provider integrations

### Studies
- `GET /api/study/[study_name]/[id]/results` → Get study results
- `GET /api/study/[study_name]/[id]/status` → Get study status

## Environment Configuration

### Development (Docker Compose)

```yaml
services:
  sveltekit-web:
    environment:
      - LUNA_AUGUR_HOST=http://augur-django-web-1:8000
```

### Production (Kubernetes)

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: luna
        env:
        - name: LUNA_AUGUR_HOST
          value: "http://augur-service:8000"
          # Or use ConfigMap/Secret for different environments
```

## Error Handling Strategy

Every proxy route implements comprehensive error handling:

1. **Configuration Check** - Validates `LUNA_AUGUR_HOST` exists
2. **Request Validation** - Checks required parameters
3. **Upstream Errors** - Catches and logs backend failures
4. **Network Errors** - Handles timeout and connection failures
5. **Consistent Responses** - Always returns JSON with error details

## Security Considerations

### What's Hidden from Browser
- Internal service DNS names
- Backend authentication credentials
- Internal network topology
- Service-to-service communication patterns

### What's Exposed to Browser
- Luna's public API surface (`/api/*` routes)
- Client-side application code
- Public assets and images

### Future Enhancements
- Rate limiting per user/IP
- Request authentication/authorization
- Response caching layer
- API usage analytics
- Request/response transformation

## Technology Stack

- **Frontend**: SvelteKit 5, Skeleton UI, Tailwind CSS 4
- **Maps**: OpenLayers
- **Runtime**: Node.js (Bun in development)
- **Deployment**: Docker, Kubernetes

## Best Practices

1. **Always use the proxy** - Never make direct Augur API calls from browser
2. **Fail fast** - Don't add fallback values for required configuration
3. **Log errors** - Server-side logging for all upstream failures
4. **Consistent formats** - Follow the established response patterns
5. **Error details** - Provide actionable error messages for debugging

## Testing

To test the proxy layer:

```bash
# Start Luna and Augur services
docker compose up

# Test a proxy endpoint
curl http://localhost:5173/api/providers

# Test missing env var (should fail with clear error)
unset LUNA_AUGUR_HOST
docker compose up
# Should see configuration errors in logs
```

## Monitoring Recommendations

For production deployments:

1. **Health Checks** - Ping `/api/providers` to verify backend connectivity
2. **Error Tracking** - Monitor 502 responses (upstream failures)
3. **Latency Metrics** - Track proxy overhead
4. **Request Logging** - Log all `/api/*` calls for debugging

## Migration Notes

Luna previously used direct browser → Augur calls via `PUBLIC_AUGUR_URL`. This has been completely removed in favor of the proxy pattern. Benefits:

- ✅ Better security (no exposed backend URLs)
- ✅ Easier Kubernetes deployment
- ✅ More flexible architecture
- ✅ Better error handling
- ✅ Centralized logging

