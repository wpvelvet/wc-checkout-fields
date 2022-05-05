<?php
	
	// Get Records
	add_action( 'wp_ajax_bc_wcf_fields', function () {
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		$section = sanitize_text_field($_REQUEST['f__section__is']);
		$results      = $WPVV_WC_Field->getSection( $section );
		
		wp_send_json_success( $results );
		
	} );
	
	
	// Get Record
	add_action('wp_ajax_bc_record', function (){
		
		if( empty($_REQUEST['id']) ) wp_send_json_error('Id is a required field [ERROR:API:1002]');
		
		$id = intval($_REQUEST['id']);
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		wp_send_json_success($WPVV_WC_Field->get($id));
		
	});
	
	// Remove Record
	add_action('wp_ajax_bc_record_remove', function (){
		
		if( empty($_REQUEST['id']) ) wp_send_json_error('Id is a required field [ERROR:API:1002]');
		
		$id = intval($_REQUEST['id']);
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		$WPVV_WC_Field->remove($id);
		wp_send_json_success('Record Removed');
		
	});
	
	
	// Save Record
	add_action('wp_ajax_bc_record_save', function (){
		
		$body = json_decode(base64_decode($_REQUEST['body']), ARRAY_A);
		
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		
		if( !empty($body['ID']) ){ // update record
			$WPVV_WC_Field->update($body, $body['ID']);
		}elseif( !empty($body[0]) ){ // multiple records to update
			foreach ($body as $record){
				$id = false;
				if( !empty($record['ID']) ){
					$id = intval($record['ID']);
				}
				$WPVV_WC_Field->update($record, $id);
			}
		}else{// create new record
			$WPVV_WC_Field->update($body);
		}
		
		wp_send_json_success('Saved');
	});
	
	
	// Import Default fields
	add_action( 'wp_ajax_bc_wc_checkout_import_default', function () {
		
		/* @var WPVV_WC_Field $WPVV_WC_Field */
		$WPVV_WC_Field = $GLOBALS['WPVV_WC_Field'];
		
		remove_filter( 'woocommerce_checkout_fields', 'bcAddWCFieldsToCheckout' );
		$defaultFields      = WC()->checkout()->get_checkout_fields();
		$existingFields     = $WPVV_WC_Field->getAll();
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
					
					
					$WPVV_WC_Field->update( $body );
				}
			}
		}
		
		wp_send_json_success( 'Imported' );
		
	} );