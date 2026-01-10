# WordPress Headless para Railway
FROM wordpress:latest

# Habilitar mod_rewrite para permalinks y REST API
RUN a2enmod rewrite

# Configurar ServerName y aumentar limite de headers para Chrome
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && echo "LimitRequestFieldSize 32768" >> /etc/apache2/apache2.conf \
    && echo "LimitRequestLine 32768" >> /etc/apache2/apache2.conf

# Copiar mu-plugins (se activan automaticamente)
COPY mu-plugins/ /var/www/html/wp-content/mu-plugins/

# Copiar entrypoint personalizado que arregla MPM
COPY docker-entrypoint-custom.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint-custom.sh

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/wp-content/mu-plugins/

# Exponer puerto 80
EXPOSE 80

# Usar entrypoint personalizado
ENTRYPOINT ["docker-entrypoint-custom.sh"]
CMD ["apache2-foreground"]
