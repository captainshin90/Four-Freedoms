# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Install serve for static file serving
RUN npm install -g serve

# Copy built application
COPY --from=build /app /app

# Expose ports for both static frontend and API server
EXPOSE 8080 3001

# Start both servers using concurrently
RUN npm install -g concurrently

# Create a script to start both servers
RUN echo '#!/bin/sh\nconcurrently "serve -s out -l 8080" "node server/index.js"' > /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
