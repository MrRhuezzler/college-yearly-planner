FROM node:lts-alpine

WORKDIR /app

RUN apk add chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package.json .
RUN yarn install
COPY . .
RUN npx prisma generate

CMD ["yarn", "prod"]