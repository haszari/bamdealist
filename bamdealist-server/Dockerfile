FROM node:7.10

# install git (needed for mongoose?)
# install python, build-essential (needed for sass)
# RUN apk update && apk upgrade && \
#     apk add --no-cache bash git openssh python build-essential

# Create app directory
#RUN mkdir -p /usr/src/app

# Bundle app source
#COPY . /usr/src/app

# Run in there from here on in
WORKDIR /usr/src/app

# Install app dependencies
#RUN npm install

# Expose app port
# (this is specified in app.config.js or override~~/ app.config.js)
EXPOSE 8937

# non-root user
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# this doesn't work yet - Error: EACCES: permission denied, mkdir '/usr/src/app/dist'
#USER node

# hand over to entry point to build/launch etc
ENTRYPOINT /usr/src/app/docker-entrypoint.sh