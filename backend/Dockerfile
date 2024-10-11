FROM node:20-alpine

WORKDIR /backend

COPY package.json .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]