# WordPress Headless para Railway
FROM wordpress:latest

# Forzar un solo MPM - eliminar event y worker, dejar solo prefork
RUN rm -f /etc/apache2/mods-enabled/mpm_event.* /etc/apache2/mods-enabled/mpm_worker.* \
    && ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf \
    && ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load

# Configurar ServerName y aumentar limite de headers para Chrome
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && echo "LimitRequestFieldSize 32768" >> /etc/apache2/apache2.conf \
    && echo "LimitRequestLine 32768" >> /etc/apache2/apache2.conf

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
