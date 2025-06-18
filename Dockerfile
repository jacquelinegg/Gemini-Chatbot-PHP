FROM php:8.2-apache

# Инсталиране на SQLite и необходимите PHP разширения
RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    docker-php-ext-install pdo pdo_sqlite

# Останалите инструкции остават същите...
RUN echo "Listen 7000" > /etc/apache2/ports.conf
COPY apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite headers
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

EXPOSE 7000
CMD ["apache2-foreground"]