FROM node:18-alpine AS build

WORKDIR /usr/src/app/
EXPOSE 3000


CMD yarn && yarn cache clean && yarn run dev;