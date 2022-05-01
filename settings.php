<?php
	
	class WPV_Settings{
		
		static $id = "wpv";
		static $title = "WP Velvet";
		
		static public function getAdminPage(){
			return [
				'title' => self::$title,
				'menu_title' => self::$title,
				'capabilities' => apply_filters('wpv_admin_menu_capabilities', 'edit_posts'),
				'slug' => apply_filters('wpv_admin_menu_slug', 'wpvelvet'),
			];
		}
		
		static public function plugin(){
			return [
				'url' => plugin_dir_url( __FILE__ ),
				'path' => plugin_dir_path( __FILE__ )
			];
		}
		
	}