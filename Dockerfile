FROM node:24.13.0-alpine3.23 AS builder

WORKDIR /usr/src/app

ENV TZ=America/Sao_Paulo

COPY package*.json ./

RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY src ./src

RUN npm run build && ls -la dist/


FROM node:24.13.0-alpine3.23 AS runner

WORKDIR /usr/src/app

ENV TZ=America/Sao_Paulo
ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
