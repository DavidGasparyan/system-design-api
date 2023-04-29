FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm i @nestjs/cli
RUN npm install pm2 -g
RUN npm run build

EXPOSE 3000
CMD ["pm2-runtime", "./dist/src/main.js"]