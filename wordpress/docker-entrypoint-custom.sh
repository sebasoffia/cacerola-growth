#!/bin/bash
set -e

# Fix MPM conflict - ensure only prefork is enabled
echo "Fixing Apache MPM configuration..."
rm -f /etc/apache2/mods-enabled/mpm_event.load /etc/apache2/mods-enabled/mpm_event.conf
rm -f /etc/apache2/mods-enabled/mpm_worker.load /etc/apache2/mods-enabled/mpm_worker.conf

# Ensure prefork is enabled
if [ ! -f /etc/apache2/mods-enabled/mpm_prefork.load ]; then
    ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load
fi
if [ ! -f /etc/apache2/mods-enabled/mpm_prefork.conf ]; then
    ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf
fi

# Configure Apache to listen on Railway's PORT (default 80) on all interfaces
LISTEN_PORT="${PORT:-80}"
echo "Configuring Apache to listen on 0.0.0.0:$LISTEN_PORT..."

# Rewrite ports.conf completely to ensure correct binding
cat > /etc/apache2/ports.conf << EOF
Listen 0.0.0.0:$LISTEN_PORT
EOF

# Rewrite the default VirtualHost to use the correct port
cat > /etc/apache2/sites-available/000-default.conf << EOF
<VirtualHost *:$LISTEN_PORT>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

echo "Apache configured on port $LISTEN_PORT. Contents:"
cat /etc/apache2/ports.conf
echo "---"
head -5 /etc/apache2/sites-available/000-default.conf

echo "Starting WordPress..."

# Call the original entrypoint
exec docker-entrypoint.sh "$@"
