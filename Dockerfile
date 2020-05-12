# Sourced from https://github.com/Saluki/nestjs-template/blob/master/Dockerfile
# https://blog.logrocket.com/containerized-development-nestjs-docker/

FROM node:12-alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production false

COPY . .

RUN yarn run build

# ---------------------------------

FROM node:12-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN yarn install --frozen-lockfile

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]