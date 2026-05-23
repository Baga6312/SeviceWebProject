FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm install --legacy-peer-deps
COPY --chown=node:node . .
USER node
EXPOSE 4000
CMD ["node", "src/index.js"]