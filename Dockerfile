FROM node:16-alpine

ARG BACKEND_URL=http://localhost:8080

RUN apk add unzip wget

# Create app directory
WORKDIR /app

RUN chown node:node /app

USER node

RUN mkdir public

RUN wget --output-document public/map.zip https://github.com/Rachnus/osrs-gimp-tracker-frontend/releases/download/assets-v1.0/img.zip
RUN unzip public/map.zip -d public/img/

# Bundle app source
COPY --chown=node:node . .

RUN rm public/config.js
RUN echo "const CONFIG_BACKEND_URL = '${BACKEND_URL}'" > public/config.js



EXPOSE 5000
CMD [ "npx", "serve", "public" ]
