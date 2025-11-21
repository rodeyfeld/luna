# Luna

Satellite imagery search and analysis platform. https://luna.pinwheel.fan

## Running locally

```bash
cp example.env .env
docker compose up
```

Opens at http://localhost:5173

## Deploying

```bash
docker build -t edrodefeld/luna .
docker push edrodefeld/luna:latest
```

Then in k8s:

```bash
kubectl apply -f ../mirage/deployments/luna.yml
kubectl rollout restart deployment/luna -n galaxy
```

## Config

You need `LUNA_AUGUR_HOST` set to tell Luna where the API is:

- Docker: `http://augur-service:8000`

## What it does

Draw areas on a map, search multiple satellite providers at once, run analysis studies (tree coverage, wind speed, etc), and see results visualized on the map. Built with SvelteKit 5, Skeleton UI, Tailwind, and OpenLayers for the mapping.
