# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package definitions
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies (including dev)
RUN pnpm install

# Copy the rest of the app
COPY . .

# Expose Next.js dev port
EXPOSE 4000

# Start development server
CMD ["pnpm", "dev"]