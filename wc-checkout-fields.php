<?php
	/*
		Plugin Name: WC Checkout Fields Manager
		Description: Complete solution that empowers you to manage/customize your checkout fields.
		Author: WP Velvet
		Author URI: https://www.wpvelvet.com
		Version: 1.0
	*/
	
	include_once "settings.php";
	include_once WPV_Settings::plugin()['path'] . "_core/classes/record.php";
	include_once WPV_Settings::plugin()['path'] . "_core/api.php";
	include_once WPV_Settings::plugin()['path'] . "_core/classes/admin-page.php";
	include_once WPV_Settings::plugin()['path'] . "_func/index.php";