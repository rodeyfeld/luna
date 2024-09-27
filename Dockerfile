FROM oven/bun:latest AS builder 

EXPOSE 5173
WORKDIR /app

COPY . /app 

RUN bun install

CMD ["bun", "run", "dev"]