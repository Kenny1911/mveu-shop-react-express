FROM node:20.11.0-alpine3.19

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app/

ARG APP_HOST
ARG APP_PORT
ARG MONGO_URL
ARG JWT_SECRET
ARG JWT_EXPIRES

CMD npm run start

