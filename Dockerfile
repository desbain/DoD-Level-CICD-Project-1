# =============================================================================
# Multi-stage Dockerfile for DoD Tactical Operations Center Dashboard
# Stage 1: Build React frontend
# Stage 2: Install production server dependencies
# Stage 3: Final production image (no npm — only node + pre-built artifacts)
# =============================================================================

# --- Stage 1: Build React client ---
FROM node:20-alpine AS client-build

RUN apk update && apk upgrade --no-cache && npm install -g npm@latest

WORKDIR /app/client

COPY client/package.json client/package-lock.json* ./
RUN npm ci --production=false

COPY client/ ./
# Prevent CRA from inlining the runtime chunk as an inline <script>.
# Without this, the server's CSP (scriptSrc: 'self') blocks it → white screen.
ENV INLINE_RUNTIME_CHUNK=false
RUN npm run build

# --- Stage 2: Install production server dependencies ---
FROM node:20-alpine AS server-deps

RUN apk update && apk upgrade --no-cache && npm install -g npm@latest

WORKDIR /app

COPY server/package.json server/package-lock.json* ./
RUN npm ci --production && npm cache clean --force

# --- Stage 3: Final production image ---
# Copies pre-installed node_modules from Stage 2.
# npm is never installed here — node runs the app directly.
FROM node:20-alpine AS production

RUN apk update && apk upgrade --no-cache

# Remove npm — not needed at runtime, and its bundled deps (e.g. minimatch)
# would otherwise appear as vulnerabilities in container scans.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy pre-installed production node_modules from Stage 2
COPY --from=server-deps /app/node_modules ./node_modules

# Copy server source
COPY server/ ./

# Copy React build from Stage 1
COPY --from=client-build /app/client/build /client/build

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Use non-root user
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
