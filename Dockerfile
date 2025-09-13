FROM node:24-alpine AS serve
# RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
# RUN corepack enable
RUN npm install -g pnpm

WORKDIR  /usr/app/site

COPY . .
RUN npm config set registry https://registry.npmjs.org/
RUN pnpm i --ignore-scripts --unsafe-perm
ENV PATH  /usr/app/site/node_modules/.bin:$PATH
RUN pnpm  build


ENV PORT=$PORT
    
COPY --from=serve /packages/site/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules
ENV NODE_ENV=production
CMD [ "node", ".output/server/index.mjs" ]
