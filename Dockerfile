FROM node:16-alpine

WORKDIR /socket-chat-jco
COPY . .
RUN npm i
EXPOSE ${PORT}
CMD ["node","/socket-chat-jco/src/app.js"]