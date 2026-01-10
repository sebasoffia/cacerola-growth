# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar codigo fuente
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copiar build output
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Variables de entorno
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
