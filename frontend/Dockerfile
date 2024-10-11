FROM node:20-alpine

WORKDIR /frontend

COPY package.json .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]