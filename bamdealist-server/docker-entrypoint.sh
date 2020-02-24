#!/bin/bash

# install deps
npm install

# we could do different stuff for dev/release here ..
if [ "$NODE_ENV" = "production" ]; then
   npm run build
   npm run start-production
else
   npm start
fi

