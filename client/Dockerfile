FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
