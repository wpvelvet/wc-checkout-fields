<?php
	
	include_once WPV_Settings::plugin()['path'] . "_func/wc-field-record.php";
	include_once WPV_Settings::plugin()['path'] . "_func/api.php";
	
	
	
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
	
	// Hook to add/update fields
	add_filter('woocommerce_checkout_fields', 'wpvAddWCFieldsToCheckout');
	function wpvAddWCFieldsToCheckout($default){
		
		
		/* @var WPV_WC_Field $WPV_WC_Field */
		$WPV_WC_Field = $GLOBALS['WPV_WC_Field'];
		$fields = $WPV_WC_Field->getAll();
		
		foreach ($fields as $field){
			$section = $field->meta['section'];
			if( isset($default[$section]) ) {
				$data = [
					'type'  => $field->meta['type'],
					'label' => $field->post_title,
					'required' => $field->meta['required'] === '1',
					'priority' => $field->menu_order,
					'class' => array_map('trim', explode(',',$field->meta['extra']['class'])),
					'label_class' => array_map('trim', explode(',',$field->meta['extra']['label_class'])),
					'placeholder' => $field->meta['extra']['placeholder'],
					'autocomplete' => $field->meta['extra']['autocomplete'],
//					'class' => !empty($field['meta_class']) ? explode(',', $field['meta_class']) : ''
				];
				
				if( $field->meta['extra']['options'] ){
					$options = [];
					foreach ($field->meta['extra']['options'] as $option){
						$options[$option['value']] = $option['label'];
					}
					$data['options'] = $options;
				}
				
				$default[ $section ][$field->post_name] = $data;
			}
		}
		
		return $default;
	}
	
	
	add_action('woocommerce_checkout_process', 'wpvValidateFields');
	function wpvValidateFields() {
		$phone_number = $_POST['---your-phone-field-name---'];
		// your function's body above, and if error, call this wc_add_notice
		wc_add_notice( __( 'Your phone number is wrong.' ), 'error' );
	}
