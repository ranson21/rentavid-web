# Build with:   docker build -t IMAGE_NAME .
# Run with:     docker run -p 3000:3000 --rm --name IMAGE_NAME IMAGE_NAME

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
