# Use lightweight Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests and install
COPY package*.json ./
RUN npm install --omit=dev

# Copy application code
COPY . .

# Cloud Run injects PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

# Start the zero-dependency Node HTTP server
CMD ["node", "server.js"]
