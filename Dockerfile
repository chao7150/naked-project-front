FROM node:16-slim

COPY package.json /src/package.json
WORKDIR /src
RUN yarn install
COPY . /src

RUN yarn build:client
RUN yarn build:server

HEALTHCHECK CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["node", "build/server.js"]
