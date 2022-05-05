<?php
	
	class WPVV_AdminPage{
		
		public function __construct() {
			add_action("admin_menu", [$this, 'menu']);
		}
		
		public function menu(){
			$settings = WPVV_Settings::getAdminPage();
			add_menu_page($settings['title'], $settings['menu_title'], $settings['capabilities'], $settings['slug'], [$this, 'display'], null, 1);
		}
		
		public function display(){
			include_once WPVV_Settings::plugin()['path'] . "_core/admin/admin-page.php";
		}
		
	}
	
	$WPVV_AdminPage = new WPVV_AdminPage();