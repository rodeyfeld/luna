FROM node:latest AS builder 
ENV ORIGIN=https://luna.pinwheel.fan
RUN apt update && apt install python3 python3-pip make g++ build-essential -y
WORKDIR /luna

COPY . .
RUN npm install
RUN npm run build

FROM node:latest AS runner
ENV ORIGIN=https://luna.pinwheel.fan
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /luna
COPY --from=builder /luna/build ./build
COPY --from=builder /luna/package.json ./
COPY --from=builder /luna/node_modules ./node_modules


CMD ["node", "build/index.js"]

