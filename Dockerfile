# Stage 1: Build the Angular application
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
# RUN npm i

RUN npm install -g @angular/cli
COPY . .
RUN npm install
RUN ng build

# Stage 2: Serve the Angular application with Nginx
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/errandhelper-app/browser /usr/share/nginx/html

EXPOSE 80


