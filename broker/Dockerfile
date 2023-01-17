FROM node:18
RUN mkdir /app
WORKDIR /app
COPY . .
RUN mkdir tmp
RUN yarn global add ts-node
RUN yarn
CMD ["yarn", "start"]