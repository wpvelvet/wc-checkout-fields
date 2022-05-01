<?php
	/*
		Plugin Name: WC Checkout Fields Manager
		Description: Complete solution that empowers you to manage customize your checkout process.
		Author: WP Velvet
		Author URI: https://www.wpvelvet.com
		Version: 1.0
	*/
	
	include_once "settings.php";
	include_once WPV_Settings::plugin()['path'] . "classes/record.php";
	include_once WPV_Settings::plugin()['path'] . "_core/api.php";
	include_once WPV_Settings::plugin()['path'] . "addon/wc-field-record.php";
	include_once WPV_Settings::plugin()['path'] . "addon/wc-checkout-fields.php";
	include_once WPV_Settings::plugin()['path'] . "addon/api.php";
	include_once "classes/admin-page.php";
	
	

	// Register Custom Post Type
	add_action( 'init', function () {
		$public_pt_args = array(
			'label' => 'WC Checkout Fields',
			'public' => true,
			'publicly_queryable' => true,
			'exclude_from_search' => false,
			'show_ui' => true,
			'show_in_menu' => true,
			'has_archive' => true,
			'rewrite' => true,
			'query_var' => true,
		);
		register_post_type( 'wpv_wcf', $public_pt_args );
	}, 0 );
	