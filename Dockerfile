FROM node:10 AS build

WORKDIR /opt/app/

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:10

# Create app directory
WORKDIR /opt/app/

COPY ./package*.json ./

RUN npm ci --only=production

COPY . .

COPY --from=build /opt/app/build/ ./build

# Open port 3000
EXPOSE 3000

RUN npm install -g pm2
RUN npm install pino-elasticsearch -g

CMD pm2-docker start ecosystem.config.js --env production | pino-elasticsearch --host elasticsearch
