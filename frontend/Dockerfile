FROM node:20.11.0-alpine3.19 as build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app/

ARG REACT_APP_API
RUN npm run build


FROM nginx:1.25.1
COPY --from=build /app/build/ /usr/share/nginx/html/
EXPOSE 80
