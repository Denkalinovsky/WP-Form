<?php

add_action( 'wp_enqueue_scripts', 'theme_name_scripts' );
function theme_name_scripts() {
	wp_enqueue_style( 'app', get_template_directory_uri()."/assets/css/app.css" );
   wp_enqueue_style( 'style-min', get_template_directory_uri()."/assets/css/style.min.css" );
	wp_enqueue_script( 'app', get_template_directory_uri()."/assets/js/app.js" );
}
wp_enqueue_script('my-custom-script', get_template_directory_uri() .'/js/index.js', array('jquery'), null, true);

// ajax
add_action( 'wp_enqueue_scripts', 'myajax_data', 99 );
function myajax_data(){
		wp_localize_script( 'script', 'myajax', 
		array(
			'url' => admin_url('admin-ajax.php')
		)
	);  
}

function post_message() {
	$perem = $_POST;
   $user = get_user_by_email($perem['user_email']);
   if(!$user){
      $user_id = register_new_user( $perem['user_login'], $perem['user_email'] );
      $user = get_user_by("id",$user_id);
      $author = $user->ID;
   }else{
      $author = $user->ID;
   }
	$post_data = array(
	'post_title'    => sanitize_text_field( $perem['title'] ),
	'post_content'  => $perem['text'],
   'post_author'   => intval($author),
	'post_status'   => 'publish',
   'post_category' => array( 8,39 )
	);

	// Вставляем запись в базу данных
	$post_id = wp_insert_post( $post_data );
   // проверка на создание поста
   if ( get_post_status ( $post_id ) ) {
      wp_send_json_success();
   }
   else {
      wp_send_json_error();
   }
   
}
add_action('wp_ajax_post_message', 'post_message');
add_action('wp_ajax_nopriv_post_message', 'post_message');