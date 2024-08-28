# FROM node:lts AS builder

# WORKDIR /usr/src/app

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN apt-get -qy update && apt-get -qy install openssl

# RUN npm install
# RUN npm install @prisma/client
# COPY . .
# RUN npx prisma generate --schema ./prisma/schema.prisma
# # RUN npm run build

# # FROM node:alpine

# # COPY --from=builder /usr/src/app/node_modules ./node_modules
# # COPY --from=builder /usr/src/app/package*.json ./
# # COPY --from=builder /usr/src/app/dist ./dist

# EXPOSE 3000

# # CMD ["npm", "run", "start:prod"]

# # RUN npm run start:dev

# # EXPOSE 3000

# TODO REMOVE TEST START
FROM node:18 as build
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
RUN npm install --omit=dev
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

ENV NODE_ENV production
EXPOSE 3000
CMD ["dumb-init", "node", "dist/src/main"]