# Stage 1: Build the Vite project
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We accept build arguments for Vite environment variables
ARG VITE_PROD_BACKEND_URL
ENV VITE_PROD_BACKEND_URL=$VITE_PROD_BACKEND_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built dist folder to Nginx's default public folder
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]