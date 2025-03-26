# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy and build
COPY . .
RUN pnpm build

# Run Stage
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies
COPY package*.json ./
RUN npm install -g pnpm && pnpm install --prod

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 4000

CMD ["pnpm", "start"]