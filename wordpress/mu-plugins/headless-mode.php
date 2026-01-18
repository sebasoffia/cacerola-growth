<?php
/**
 * Plugin Name: Headless Mode
 * Description: Configura WordPress para funcionar como headless CMS
 * Version: 1.0
 * Author: Cacerola Growth
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) exit;

/**
 * Redirigir frontend al sitio Astro
 * Solo permite acceso a /wp-admin y /wp-json
 */
add_action('template_redirect', function() {
    // Permitir acceso completo desde dominio admin (wp.cacerola.cl)
    $admin_domain = defined('WP_ADMIN_DOMAIN') ? WP_ADMIN_DOMAIN : 'wp.cacerola.cl';
    if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === $admin_domain) {
        return;
    }

    // Permitir admin, API REST, GraphQL y login
    if (is_admin() ||
        (defined('REST_REQUEST') && REST_REQUEST) ||
        strpos($_SERVER['REQUEST_URI'], '/wp-json') !== false ||
        strpos($_SERVER['REQUEST_URI'], '/graphql') !== false ||
        strpos($_SERVER['REQUEST_URI'], '/wp-login.php') !== false ||
        strpos($_SERVER['REQUEST_URI'], '/wp-admin') !== false) {
        return;
    }

    // Redirigir todo lo demas al frontend Astro
    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : 'https://cacerola.cl/growth';

    wp_redirect($frontend_url, 301);
    exit;
});

/**
 * Habilitar CORS para el frontend Astro
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'https://cacerola.cl',
            'http://localhost:4321',  // Desarrollo Astro
            'http://localhost:3000',
        ];

        if (in_array($origin, $allowed_origins) || !$origin) {
            header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type');
        }

        return $value;
    });
}, 15);

/**
 * Agregar campos utiles a la API REST de posts
 */
add_action('rest_api_init', function() {
    // Featured image URL
    register_rest_field('post', 'featured_image_url', [
        'get_callback' => function($post) {
            $image_id = get_post_thumbnail_id($post['id']);
            if ($image_id) {
                $image = wp_get_attachment_image_src($image_id, 'full');
                return $image ? $image[0] : null;
            }
            return null;
        }
    ]);

    // Author name
    register_rest_field('post', 'author_name', [
        'get_callback' => function($post) {
            return get_the_author_meta('display_name', $post['author']);
        }
    ]);

    // Reading time
    register_rest_field('post', 'reading_time', [
        'get_callback' => function($post) {
            $content = get_post_field('post_content', $post['id']);
            $word_count = str_word_count(strip_tags($content));
            return ceil($word_count / 200); // minutos
        }
    ]);

    // Categories names
    register_rest_field('post', 'category_names', [
        'get_callback' => function($post) {
            $categories = get_the_category($post['id']);
            return array_map(function($cat) {
                return ['name' => $cat->name, 'slug' => $cat->slug];
            }, $categories);
        }
    ]);
});

/**
 * Deshabilitar el editor de bloques en el frontend
 * (mantenerlo en admin)
 */
add_filter('use_block_editor_for_post', '__return_true');

/**
 * Agregar soporte para campos personalizados en API
 */
add_action('init', function() {
    // Asegurar que los custom fields esten disponibles en REST
    register_meta('post', 'meta_description', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_meta('post', 'meta_title', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);
});

/**
 * Optimizar consultas de la API REST
 */
add_filter('rest_post_query', function($args) {
    // Solo campos necesarios
    if (!isset($args['_fields'])) {
        $args['no_found_rows'] = false; // Necesario para paginacion
    }
    return $args;
});
