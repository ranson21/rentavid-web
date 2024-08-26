# Build with:   docker build -t IMAGE_NAME .
# Run with:     docker run -p 3000:3000 --rm --name IMAGE_NAME IMAGE_NAME

# FROM node:20-alpine AS builder
# WORKDIR /staging
# COPY . ./
# RUN corepack enable && npm install && npm run build

# # Use the official nginx image as a parent image
# FROM nginx:stable-alpine

# # Remove the default nginx configuration file
# RUN rm /etc/nginx/conf.d/default.conf
# RUN apk add nodejs-current --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

# COPY ./config/nginx.conf.template /etc/nginx/conf.d/default.conf.template
# COPY ./config/entrypoint.sh /docker-entrypoint.sh

# # # Copy the custom nginx configuration file from the current directory
# # COPY config/nginx.conf /etc/nginx/nginx.conf

# WORKDIR /usr/share/nginx/html
# COPY --from=builder /staging/package.json /staging/package-lock.json /usr/share/nginx/
# COPY --from=builder /staging/node_modules /usr/share/nginx/node_modules
# COPY --from=builder /staging/build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 8080

# # Start nginx

# ENTRYPOINT ["/docker-entrypoint.sh"]
# CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS builder
WORKDIR /staging
COPY . ./
RUN corepack enable && npm install && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /staging/package.json /staging/package-lock.json /app/
COPY --from=builder /staging/node_modules /app/node_modules
COPY --from=builder /staging/build /app/build

EXPOSE 3000
CMD ["node", "/app/build/index.js"]
