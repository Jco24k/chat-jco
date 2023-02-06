FROM node:16-alpine

WORKDIR /socket-chat-jco
COPY . .
EXPOSE ${PORT}
CMD ["node","/socket-chat-jco/src/app.js"]