FROM node:18

WORKDIR /app
COPY . .
RUN yarn
CMD ["yarn", "dev"]

# FROM node:18-slim

# WORKDIR /app
# COPY .next/ .next/
# COPY package.json package.json
# COPY yarn.lock yarn.lock
# RUN yarn install
# CMD ["yarn","next","start"]