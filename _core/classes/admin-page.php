<?php
	
	class WPV_AdminPage{
		
		public function __construct() {
			add_action("admin_menu", [$this, 'menu']);
		}
		
		public function menu(){
			$settings = WPV_Settings::getAdminPage();
			add_menu_page($settings['title'], $settings['menu_title'], $settings['capabilities'], $settings['slug'], [$this, 'display'], null, 1);
		}
		
		public function display(){
			include_once WPV_Settings::plugin()['path'] . "_core/templates/admin/admin-page.php";
		}
		
	}
	
	$WPV_AdminPage = new WPV_AdminPage();