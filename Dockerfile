# ==========================================
# STAGE 1: Build the React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# DEBUG STEP: Prints files to Jenkins logs to ensure package.json is present
RUN ls -la

# Clean install using regular install to bypass lack of package-lock.json
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production-ready static assets (generates /app/dist or /app/build)
RUN npm run build

# ==========================================
# STAGE 2: Serve with Lightweight Nginx
# ==========================================
FROM nginx:1.25-alpine

# Copy the compiled static files from the builder stage to Nginx web directory
# Note: If your framework builds to "/app/build" instead of "/app/dist", change this path
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle React routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
