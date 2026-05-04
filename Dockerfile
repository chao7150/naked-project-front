FROM node:24-alpine as builder

WORKDIR /work

COPY package.json ./
COPY .yarnrc.yml ./
COPY yarn.lock ./

RUN corepack yarn install --frozen-lockfile

COPY . .

RUN corepack yarn build

FROM joseluisq/static-web-server:2-alpine

ENV SERVER_PORT=3000
ENV SERVER_COMPRESSION=true
ENV SERVER_ROOT=/public

COPY --from=builder /work/dist/*.js /public/
COPY --from=builder /work/dist/*.html /public/
COPY --from=builder /work/dist/*.LICENSE.txt /public/

HEALTHCHECK CMD wget -q --spider http://localhost:3000/ || exit 1

EXPOSE 3000
