FROM node:alpine as build-react-stage
WORKDIR /app
COPY ./cloudocr /app
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build-react-stage /app/build /usr/share/nginx/html
