# Stage 1: Build the Angular application
FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps


COPY . .
RUN npm run build

# Stage 2: Serve the Angular application with Nginx
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/errandhelper-app/browser /usr/share/nginx/html

EXPOSE 80


