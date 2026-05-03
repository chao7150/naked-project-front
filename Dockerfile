FROM node:22

WORKDIR /work

COPY package.json ./
COPY .yarnrc.yml ./
COPY yarn.lock ./

RUN corepack yarn install --frozen-lockfile

COPY . .

RUN corepack yarn build

HEALTHCHECK CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["node", "build/server.js"]
