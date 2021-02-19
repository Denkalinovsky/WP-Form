<?php

add_action('wp_enqueue_scripts', 'theme_scripts');
function theme_scripts() {
    wp_enqueue_style('app-css', get_template_directory_uri() . "/assets/css/app.css");
    wp_enqueue_style('style-min-css', get_template_directory_uri() . "/assets/css/style.min.css");
    wp_enqueue_script('jquery-js', get_template_directory_uri() . '/assets/js/jquery.min.js', array(), false, true);
    wp_enqueue_script('jquery-migrate-js', get_template_directory_uri() . "/assets/js/jquery-migrate.min.js", array(), false, true);
    wp_enqueue_script('wp-embed-js', get_template_directory_uri() . "/assets/js/wp-embed.min.js", array(), false, true);
    wp_enqueue_script('wp-emoji-release-js', get_template_directory_uri() . "/assets/js/wp-emoji-release.min.js", array(), false, true);
    wp_localize_script('url-ajax', '_ajax', array('url' => admin_url('admin-ajax.php')), array(), false, true);
    wp_enqueue_script('app', get_stylesheet_directory_uri() . '/assets/js/app.js', array(), false, true);
}


function post_message() {
   $data = $_POST;
   $post_data = array(
      'post_title'   => sanitize_text_field($data['title']),
      'post_content' => $data['text'],
      'post_author'  => null,
      'post_status'  => 'publish',
   );
   if( !isset($_POST['title']) && !isset($_POST['text']) && !isset($_POST['user_login']) && !isset($_POST['user_email'])) {
        return;
   }

   // получить пользователей по login и email
   $get_user_by_login = get_user_by('login', $data['user_login']);
   $get_user_by_email = get_user_by('email', $data['user_email']);

   // знаю, что много лишнего кода, просто для alert нужна разная информация 
   if (!$get_user_by_login && !$get_user_by_email) {
      // регистрирую аккаунт и получаю id пользователя
      $user_id = register_new_user($data['user_login'], $data['user_email']);

      $user = get_user_by("id", $user_id);
      if (!$user) {
         wp_send_json_error("user is not registered");
      }

      $post_data['post_author'] = $user->ID;
      $post_id = wp_insert_post($post_data);
      if (get_post_status($post_id)) {
         wp_send_json_success("New user registered-> \nEmail: " . $data['user_email'] . " \nUsername: " . $data['user_login'] . "\nPost created, ID: " . $post_id);
      } else {
         wp_send_json_error("New user registered-> \nEmail: " . $data['user_email'] . " \nUsername: " . $data['user_login'] . "\nPost not created.");
      }
   } elseif (!$get_user_by_login && $get_user_by_email) {
      // если логина такого нет, то вывести что емеил используется
      $post_data['post_author'] = $get_user_by_email->ID;
      wp_send_json_error("Email: " . $data['user_email'] . " is already in use.\nPost not created.");
   } elseif ($get_user_by_login && !$get_user_by_email) {
      // если емейла нет, то вывести что юзернейм используется
      $post_data['post_author'] = $get_user_by_login->ID;
      wp_send_json_error("Username: " . $data['user_login'] . " is already in use.\nPost not created.");
   } else { // есть и логин и мыло

      // сравнение айди объектов, если вдруг логин уже зарегистрирован на один Email, а введенный Email зарегистрирован на другой логин
      if ($get_user_by_login->ID == $get_user_by_email->ID) {
         $post_data['post_author'] = $get_user_by_login->ID;
         $post_id = wp_insert_post($post_data);
         if (get_post_status($post_id)) {
            wp_send_json_success("Email: " . $data['user_email'] . " \nUsername: " . $get_user_by_login->user_login . "\nPost created, ID: " . $post_id);
         } else {
            wp_send_json_success("Email: " . $data['user_email'] . " \nUsername: " . $get_user_by_login->user_login . "\nPost created, ID: " . $post_id);
         }
      } else { //если по username и email получено 2 совершенно разных пользователя
         wp_send_json_error("obg(User_name) !=obg(User_email),\nPost not created.");
      }
   }
}
add_action('wp_ajax_post_message', 'post_message');
add_action('wp_ajax_nopriv_post_message', 'post_message');
