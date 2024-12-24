FROM oven/bun:latest AS builder 
RUN apt update && apt install python3 python3-pip make g++ -y
WORKDIR /luna

COPY . .

RUN bun install --no-cache
RUN bun run build

FROM oven/bun:latest AS runner

COPY --from=builder /luna/build .

CMD ["bun", "run", "start"]
