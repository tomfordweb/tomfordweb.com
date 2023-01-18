FROM node:lts-slim

RUN npm i -g gatsby-cli

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build
ENTRYPOINT [ "npm", "run", "serve", "--", "-H", "0.0.0.0" ] 

EXPOSE 9000

