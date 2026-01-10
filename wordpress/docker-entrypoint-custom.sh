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

# Configure Apache to listen on Railway's PORT (default 80)
LISTEN_PORT="${PORT:-80}"
echo "Configuring Apache to listen on port $LISTEN_PORT..."
sed -i "s/Listen 80/Listen $LISTEN_PORT/g" /etc/apache2/ports.conf
sed -i "s/:80/:$LISTEN_PORT/g" /etc/apache2/sites-available/000-default.conf

echo "MPM configuration fixed. Starting WordPress on port $LISTEN_PORT..."

# Call the original entrypoint
exec docker-entrypoint.sh "$@"
