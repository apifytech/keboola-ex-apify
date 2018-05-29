FROM node:carbon

MAINTAINER Apify <info@apify.com>

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENTRYPOINT npm start
