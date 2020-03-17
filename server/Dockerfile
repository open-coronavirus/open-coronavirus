# Set to a non-root built-in user `node`
FROM node:10.15.3
MAINTAINER Antonio Párraga <antonio@parraga.es>

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD server/package.json /tmp/package.json
ADD server/.npmrc /tmp/.npmrc
RUN cd /tmp && yarn install --no-optional
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# install pm2
RUN npm install pm2 -g

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /opt/app
ADD server /opt/app

RUN npm run clean
RUN npm run build

#Copy .env files to deliverable dir
ADD server/.env* /opt/app/

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=9050

EXPOSE ${PORT}
CMD [ "npm", "run", "start:prod" ]
