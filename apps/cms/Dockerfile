# Standalone Multi-stage Dockerfile for Strapi production deployment
# Optimized for size, security, and Postgres

# --- Stage 1: Build Stage ---
FROM node:20-slim AS builder

# Install build tools for native modules (sharp, pg)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    autoconf \
    automake \
    zlib1g-dev \
    libpng-dev \
    libvips-dev \
    curl \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

# Copy package files and install dependencies
# Note: If you have a lock file, ensure it is in the same directory
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# --- Stage 2: Production Runner ---
FROM node:20-slim AS runner
WORKDIR /opt/app
ENV NODE_ENV=production

# Install runtime-only tools: dumb-init, curl, and libvips
RUN apt-get update && apt-get install -y \
    dumb-init \
    curl \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nodejs --shell /bin/bash nodejs

# Copy built application and necessary files
COPY --from=builder --chown=nodejs:nodejs /opt/app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /opt/app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /opt/app/public ./public
COPY --from=builder --chown=nodejs:nodejs /opt/app/config ./config
COPY --from=builder --chown=nodejs:nodejs /opt/app/node_modules ./node_modules

# Create uploads directory with correct permissions
RUN mkdir -p public/uploads && chown -R nodejs:nodejs public/uploads

# Switch to non-root user
USER nodejs

# Expose Strapi port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:1337/api/health || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]

