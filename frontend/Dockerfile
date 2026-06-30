# =========================================================
# Stage 1: Build the React Application
# =========================================================
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package descriptors first to take advantage of Docker layer caching
COPY package.json package-lock.json ./

# Install project dependencies cleanly using 'npm ci' (clean install) for reproducible builds
RUN npm ci

# Copy the rest of the application files (will ignore paths in .dockerignore)
COPY . .

# Define build-time arguments (ARG) for Vite environment variables
ARG VITE_LAMBDA_UPLOAD_URL

# Set arguments as environment variables (ENV) for Vite to inject them during build time
ENV VITE_LAMBDA_UPLOAD_URL=$VITE_LAMBDA_UPLOAD_URL

# Compile the application to static assets (creates the dist/ directory)
RUN npm run build

# =========================================================
# Stage 2: Serve the Static Assets using Nginx
# =========================================================
FROM nginx:1.25-alpine

# Copy custom Nginx configuration to support SPA routing, caching, and security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean up default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled production assets from the build stage to Nginx's HTML root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose container port 80 for web traffic
EXPOSE 80

# Run Nginx in the foreground to keep the container active
CMD ["nginx", "-g", "daemon off;"]
