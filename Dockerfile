FROM node:12.19.0-alpine

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 5001

CMD ["yarn", "debug"]
