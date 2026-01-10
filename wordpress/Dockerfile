# WordPress Headless para Railway
FROM wordpress:latest

# Instalar WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Deshabilitar MPMs no deseados y activar mpm_prefork (compatible con mod_php)
RUN a2dismod mpm_event mpm_worker 2>/dev/null || true \
    && a2enmod mpm_prefork 2>/dev/null || true

# Instalar dependencias adicionales
RUN apt-get update && apt-get install -y \
    libwebp-dev \
    less \
    && rm -rf /var/lib/apt/lists/*

# Copiar mu-plugins (se activan automaticamente)
COPY mu-plugins/ /var/www/html/wp-content/mu-plugins/

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/wp-content/mu-plugins/

# Exponer puerto 80
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
