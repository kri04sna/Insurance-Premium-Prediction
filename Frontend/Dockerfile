
# Stage 1: Build the React application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Receive the backend API URL during Docker build
ARG VITE_API_URL=/api

# Make the URL available to Vite
ENV VITE_API_URL=$VITE_API_URL

# Build React for production
RUN npm run build

# Stage 2: Serve the React application
FROM nginx:alpine

# Copy production files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
