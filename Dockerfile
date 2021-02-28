### STAGE 1: Build ###

FROM node:12.18.1 as builder

COPY package.json package-lock.json ./

RUN npm ci && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

RUN node_modules/.bin/ng build --prod

### STAGE 2: Nginx setup ###

FROM nginx:1.14.1-alpine

COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/ng-pdfjs-viewer /usr/share/nginx/html

CMD nginx -g "daemon off;"
