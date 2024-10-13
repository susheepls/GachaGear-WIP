FROM node:20-alpine

WORKDIR /backend

COPY package*.json .
RUN rm -rf node_modules && rm -f package-lock.json

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]