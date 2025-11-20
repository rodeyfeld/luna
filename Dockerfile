FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:1 AS dev
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
CMD ["bun", "run", "dev"]

FROM oven/bun:1
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN useradd -ms /bin/bash luna && chown -R luna:luna /app
USER luna

CMD ["bun", "run", "build/index.js"]
