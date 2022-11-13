###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /usr/src
COPY --chown=node:node package.json yarn.lock ./
RUN mkdir -p packages/server && chown -R node:node ./packages/server

RUN yarn install

COPY --chown=node:node packages/server packages/server

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src

RUN mkdir -p packages/server && chown -R node:node ./packages/server
COPY --chown=node:node packages/server ./packages/server
COPY --chown=node:node --from=development /usr/src/node_modules ./packages/server/node_modules
COPY --chown=node:node packages/server/package.json ./packages/server/package.json

WORKDIR /usr/src/packages/server
COPY --chown=node:node yarn.lock ./yarn.lock
RUN yarn install

RUN yarn prebuild && yarn build

ENV NODE_ENV production

RUN rm -rf node_modules && \
    yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache && \
    yarn cache clean --all

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

COPY --chown=node:node --from=build /usr/src/packages/server/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/packages/server/dist ./dist

CMD [ "node", "dist/main.js" ]