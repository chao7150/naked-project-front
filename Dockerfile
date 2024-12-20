FROM node:22-slim

COPY package.json /src/package.json
WORKDIR /src
COPY . /src
RUN yarn install

RUN yarn build:client
RUN yarn build:server

HEALTHCHECK CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["node", "build/server.js"]
