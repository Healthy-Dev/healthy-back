# Sourced from https://github.com/Saluki/nestjs-template/blob/master/Dockerfile

FROM node:12-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY . /home/node

RUN yarn install --frozen-lockfile \
    && npm run build

# ---

FROM node:12-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/

RUN yarn install --frozen-lockfile

