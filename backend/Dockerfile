FROM node:19-bullseye as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install
COPY ./src ./src
COPY ./tsconfig.* ./
RUN npm run esbuild

FROM node:19-bullseye AS prod 

COPY --from=builder /usr/src/app/dist/index.js /usr/src/app/dist/index.js

ENTRYPOINT [ "node", "/usr/src/app/dist/index.js" ]

