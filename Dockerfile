# ============================================================================
# Stage 1: Build Docusaurus documentation
# ============================================================================
FROM node:21-alpine AS builder

WORKDIR /app/documentation

# Copy package files
COPY documentation/package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy documentation source
COPY documentation/ .

# Build static documentation site
RUN npm run build

# ============================================================================
# Stage 2: Serve with Nginx
# ============================================================================
FROM nginx:alpine

# Copy built documentation from builder stage
COPY --from=builder /app/documentation/build /usr/share/nginx/html

# Copy custom nginx configuration for documentation
COPY CrudCloud-Docs/nginx-docs.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
