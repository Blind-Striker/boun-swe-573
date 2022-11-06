###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /usr/src/app
RUN mkdir dist && chown -R node:node ./dist
COPY --chown=node:node package.json yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN rm -rf node_modules && \
    yarn install --production && \
    yarn cache clean --all

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]