<?php
	
	// Hook to add/update fields
	add_filter('woocommerce_checkout_fields', 'bcAddWCFieldsToCheckout');
	function bcAddWCFieldsToCheckout($default){
		
		
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
	