FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN chmod +x start.sh
EXPOSE 3000
CMD ["/bin/sh", "start.sh"]
