<?php
	
	include_once WPVV_Settings::plugin()['path'] . "_func/wc-field-record.php";
	include_once WPVV_Settings::plugin()['path'] . "_func/api.php";
	
	
	
	// Add the vue component
	add_action('wp_velvet_admin_vue_scripts', function(){
	?>
		<script src="<?=WPVV_Settings::plugin()['url']?>/_func/_/admin/wc-checkout-fields.js ?>"></script>
	<?php
	});
	
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
		register_post_type( 'wpvv_wcf', $public_pt_args );
	}, 0 );
	
	// Hook to add/update fields
	add_filter('woocommerce_checkout_fields', 'wpvAddWCFieldsToCheckout');
	function wpvAddWCFieldsToCheckout($default){
		
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		$fields = $WPVV_WC_Field->getAll();
		
		foreach ($fields as $field){
			$section = $field->meta['section'];
			if( $WPVV_WC_Field->isDisabled($field) ){
				if( $WPVV_WC_Field->isWooMainField($field) && $default[$section][$field->post_name] ){
					unset($default[$section][$field->post_name]);
				}
				continue;
			}
			
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
	
	
	add_action( 'woocommerce_checkout_update_order_meta', 'wpvSaveOrderMetaFields' );
	function wpvSaveOrderMetaFields( $order_id ) {
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		$allFields = $WPVV_WC_Field->getAll();
		$fields = [];
		
		// main fields are handled by WooCommerce so we skip them
		// we also only handle post meta fields in here
		foreach ($allFields as $key => $field){
			if( !$WPVV_WC_Field->isWooMainField($field) && $WPVV_WC_Field->isPostMetaField($field) ){
				$fields[] = $field;
			}
		}
		
		foreach ($fields as $field){
			$fieldName = $field->post_name;
			if ( isset( $_POST[$fieldName] ) ) {
				update_post_meta( $order_id, $fieldName, sanitize_text_field( $_POST[$fieldName] ) );
			}
		}
	}
	
	add_action( 'woocommerce_checkout_update_user_meta', 'wpvSaveUserMetaFields' );
	function wpvSaveUserMetaFields( $customer_id ) {
		if( empty($customer_id) ) return;
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		$allFields = $WPVV_WC_Field->getAll();
		$fields = [];
		
		// main fields are handled by WooCommerce so we skip them
		// we also only handle post meta fields in here
		foreach ($allFields as $key => $field){
			if( !$WPVV_WC_Field->isWooMainField($field) && $WPVV_WC_Field->isUserMetaField($field) ){
				$fields[] = $field;
			}
		}
		
		
		foreach ($fields as $field){
			$fieldName = $field->post_name;
			if ( isset( $_POST[$fieldName] ) ) {
				update_user_meta( $customer_id, $fieldName, sanitize_text_field( $_POST[$fieldName] ) );
			}
		}
	}