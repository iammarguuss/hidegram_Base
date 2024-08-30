FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build


FROM node:20-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

