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

# Variables de entorno - HOST fijo, PORT dinámico de Railway
ENV HOST=0.0.0.0

# Railway asigna PORT dinámicamente, no hardcodear
# El servidor Astro leerá process.env.PORT

CMD ["node", "./dist/server/entry.mjs"]
