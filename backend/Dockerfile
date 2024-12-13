FROM node:20-alpine

WORKDIR /backend

RUN apk add --no-cache openssl

COPY package*.json .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]