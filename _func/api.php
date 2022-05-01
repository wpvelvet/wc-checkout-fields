<?php
	
	// Get Records
	add_action( 'wp_ajax_bc_wcf_fields', function () {
		
		/* @var WPV_WC_Field $WPV_WC_Field */
		$WPV_WC_Field = $GLOBALS['WPV_WC_Field'];
		$results      = $WPV_WC_Field->getSection( $_REQUEST['f__section__is'] );
		
		wp_send_json_success( $results );
		
	} );
	
	
	// Get Record
	add_action('wp_ajax_bc_record', function (){
		
		if( empty($_REQUEST['id']) ) wp_send_json_error('Id is a required field [ERROR:API:1002]');
		
		$id = $_REQUEST['id'];
		
		/* @var WPV_WC_Field $WPV_WC_Field */
		$WPV_WC_Field = $GLOBALS['WPV_WC_Field'];
		wp_send_json_success($WPV_WC_Field->get($id));
		
	});
	
	// Remove Record
	add_action('wp_ajax_bc_record_remove', function (){
		
		if( empty($_REQUEST['id']) ) wp_send_json_error('Id is a required field [ERROR:API:1002]');
		
		$id = $_REQUEST['id'];
		
		/* @var WPV_WC_Field $WPV_WC_Field */
		$WPV_WC_Field = $GLOBALS['WPV_WC_Field'];
		$WPV_WC_Field->remove($id);
		wp_send_json_success('Record Removed');
		
	});
	
	
	// Save Record
	add_action('wp_ajax_bc_record_save', function (){
		
		$body = json_decode(base64_decode($_REQUEST['body']), ARRAY_A);
		
		
		/* @var WPV_WC_Field $WPV_WC_Field */
		$WPV_WC_Field = $GLOBALS['WPV_WC_Field'];
		
		if( !empty($body['ID']) ){ // update record
			$WPV_WC_Field->update($body, $body['ID']);
		}elseif( !empty($body[0]) ){ // multiple records to update
			foreach ($body as $record){
				$id = false;
				if( !empty($record['ID']) ){
					$id = $record['ID'];
				}
				$WPV_WC_Field->update($record, $id);
			}
		}else{// create new record
			$WPV_WC_Field->update($body);
		}
		
		wp_send_json_success('Saved');
	});
	
	
	// Import Default fields
	add_action( 'wp_ajax_bc_wc_checkout_import_default', function () {
		
		/* @var WPV_WC_Field $WPV_WC_Field */
		$WPV_WC_Field = $GLOBALS['WPV_WC_Field'];
		
		remove_filter( 'woocommerce_checkout_fields', 'bcAddWCFieldsToCheckout' );
		$defaultFields      = WC()->checkout()->get_checkout_fields();
		$existingFields     = $WPV_WC_Field->getAll();
		$existingFieldsKeys = array_column( $existingFields, 'post_name' );
		
		foreach ( $defaultFields as $section => $fields ) {
			if ( ! empty( $fields ) ) {
				foreach ( $fields as $field_key => $field ) {
					if ( in_array( $field_key, $existingFieldsKeys ) ) {
						continue;
					} // TODO DO we want to update the existing fields?
					
					$body = [
						'post_title'   => $field['label'],
						'post_name'    => $field_key,
						'menu_order'   => $field['priority'],
						'meta'         => [
							'section'   => $section,
							'required' => $field['required'] ? 1 : 0,
							'type'     => ! empty( $field['type'] ) ? $field['type'] : 'text',
							'extra'    => [
								'placeholder'  => $field['placeholder'],
								'class'        => ! empty( $field['class'] ) ? join( ',', $field['class'] ) : '',
								'label_class'  => ! empty( $field['label_class'] ) ? join( ',', $field['label_class'] ) : '',
								'autocomplete' => $field['autocomplete'],
							],
						],
					];
					
					
					$WPV_WC_Field->update( $body );
				}
			}
		}
		
		wp_send_json_success( 'Imported' );
		
	} );