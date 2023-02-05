FROM node:16-alpine

WORKDIR /socket-chat-jco
COPY . .
EXPOSE 3000
CMD ["node","/socket-chat-jco/src/app.js"]