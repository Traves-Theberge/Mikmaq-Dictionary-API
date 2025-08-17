# Use official Node.js runtime as base image
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory in container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci

# Copy source code and configuration files
COPY . .

# Build TypeScript
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S mikmaq && \
    adduser -S mikmaq -u 1001 -G mikmaq

# Change ownership of app directory
RUN chown -R mikmaq:mikmaq /app
USER mikmaq

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Start the application
CMD ["npm", "start"]
