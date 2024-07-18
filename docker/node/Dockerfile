FROM node:22

ADD docker-start.sh /usr/local/bin/docker-start
RUN chmod 777 /usr/local/bin/docker-start

WORKDIR /usr/src/app
RUN npm install pm2 -g