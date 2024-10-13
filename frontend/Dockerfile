FROM node:20-bullseye

WORKDIR /frontend

COPY package*.json .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]