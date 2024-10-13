FROM node:20-bullseye

WORKDIR /frontend

COPY package*.json .

RUN npm install @rollup/rollup-linux-x64-gnu

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]