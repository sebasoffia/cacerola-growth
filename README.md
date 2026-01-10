# Cacerola Growth - WordPress Headless + Astro

Stack headless para cacerola.cl/growth

## Arquitectura

```
cacerola.cl/growth/* → Astro (SSR)
                           ↓
                     WordPress API
                           ↓
                        MySQL
```

## Servicios Railway

| Servicio | Proposito | URL |
|----------|-----------|-----|
| `astro-frontend` | Frontend publico | cacerola.cl/growth |
| `wordpress` | CMS headless | wp.cacerola.cl |
| `mysql` | Base de datos | (interno) |

## Desarrollo Local

### WordPress

```bash
cd wordpress
docker compose up -d
# Acceder a http://localhost:8080/wp-admin
```

### Astro

```bash
cd astro-frontend
npm install
npm run dev
# Acceder a http://localhost:4321/growth/
```

## Despliegue en Railway

### 1. Crear proyecto

```bash
railway login
railway init
```

### 2. Agregar MySQL

En Railway Dashboard:
- Add Plugin → MySQL
- Copiar `MYSQL_URL`

### 3. Desplegar WordPress

```bash
cd wordpress
railway up

# Variables de entorno requeridas:
# WORDPRESS_DB_HOST=mysql.railway.internal
# WORDPRESS_DB_NAME=railway
# WORDPRESS_DB_USER=root
# WORDPRESS_DB_PASSWORD=${MYSQL_ROOT_PASSWORD}
```

### 4. Desplegar Astro

```bash
cd astro-frontend
railway up

# Variables de entorno requeridas:
# WORDPRESS_API_URL=http://wordpress.railway.internal
```

### 5. Configurar dominios

En Railway Dashboard:
- WordPress: `wp.cacerola.cl`
- Astro: `cacerola.cl` con path `/growth`

## Estructura del proyecto

```
cacerola-growth/
├── wordpress/
│   ├── Dockerfile
│   ├── railway.json
│   └── mu-plugins/
│       └── headless-mode.php
└── astro-frontend/
    ├── Dockerfile
    ├── railway.json
    ├── astro.config.mjs
    └── src/
        ├── lib/wordpress.ts
        ├── layouts/Layout.astro
        └── pages/
            ├── index.astro
            ├── blog/
            │   ├── index.astro
            │   └── [slug].astro
            └── recursos/
                └── index.astro
```

## Plugins WordPress recomendados

Instalar desde wp-admin:

1. **WPGraphQL** - API GraphQL (opcional, mejora DX)
2. **Advanced Custom Fields** - Campos personalizados
3. **Yoast SEO** - Meta tags para SEO
