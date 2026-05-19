FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .
RUN chmod +x start.sh && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["/bin/sh", "start.sh"]
