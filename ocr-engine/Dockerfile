FROM node:20-alpine as builder
WORKDIR /app
COPY ./ocr-engine /app

RUN npm i

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

RUN npm i --omit=dev

CMD ["npm","start"]