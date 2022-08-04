FROM node:17-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY ./build ./build

EXPOSE 3003

CMD ["npm", "start"]