FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src
COPY ./peloton-client-node/ ./peloton-client-node/
WORKDIR /usr/src/app
COPY ["./api/package.json", "./api/package-lock.json*", "./api/npm-shrinkwrap.json*", "./"]
COPY ./api .
RUN npm install --production
EXPOSE 9000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
