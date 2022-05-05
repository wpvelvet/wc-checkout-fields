<?php
	/*
		Plugin Name: WC Checkout Fields Manager
		Description: Complete solution that empowers you to manage/customize your checkout fields.
		Author: WP Velvet
		Author URI: https://www.wpvelvet.com
		Version: 1.0
	*/
	
	if(!defined( 'ABSPATH' )) exit;
	
	
	if (!function_exists('is_woocommerce_active')){
		function is_woocommerce_active(){
			$active_plugins = (array) get_option('active_plugins', array());
			if(is_multisite()){
				$active_plugins = array_merge($active_plugins, get_site_option('active_sitewide_plugins', array()));
			}
			return in_array('woocommerce/woocommerce.php', $active_plugins) || array_key_exists('woocommerce/woocommerce.php', $active_plugins) || class_exists('WooCommerce');
		}
	}
	
	if(is_woocommerce_active()) {
		define('WPVV_VERSION', '1.0');
		
		include_once "settings.php";
		include_once WPVV_Settings::plugin()['path'] . "_core/classes/record.php";
		include_once WPVV_Settings::plugin()['path'] . "_core/api.php";
		include_once WPVV_Settings::plugin()['path'] . "_core/classes/admin-page.php";
		include_once WPVV_Settings::plugin()['path'] . "_func/index.php";
	}
	