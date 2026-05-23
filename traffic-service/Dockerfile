FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm install --legacy-peer-deps
COPY --chown=node:node . .
RUN npm run build
USER node
EXPOSE 3005
CMD ["node", "dist/main.js"]