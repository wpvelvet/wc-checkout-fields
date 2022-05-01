<?php
	
	class WPV_Record {
		public $type = 'default';
		
		public function getAll( $filters = [], $orderBy = FALSE, $orderByDirection = 'DESC', $extraArgs = [] ) {
			$args = [
				'numberposts' => 250,
				'post_type'   => $this->type,
			];
			
			if ( $filters ) {
				$args['meta_query'] = [
					$filters
				];
			}
			if ( $orderBy ) {
				$mainFields = [
					'ID',
					'post_author',
					'post_date',
					'post_date_gmt',
					'post_content',
					'post_title',
					'post_excerpt',
					'post_status',
					'comment_status',
					'ping_status',
					'post_password',
					'post_name',
					'to_ping',
					'pinged',
					'post_modified',
					'post_modified_gmt',
					'post_content_filtered',
					'post_parent',
					'guid',
					'menu_order',
					'post_type',
					'post_mime_type',
					'comment_count',
				];
				if ( ! in_array( $orderBy, $mainFields ) ) {
					$args['meta_key'] = $orderBy;
					if ( ! empty( $args['meta_query'] ) ) {
						$meta                                  = $args['meta_query'];
						$args['meta_query']['show_post_query'] = $meta;
					}
					$args['meta_query']["{$orderBy}__order_by"] = [
						'key'     => $orderBy,
						'type'    => 'NUMERIC',
						'compare' => 'NUMERIC',
					];
				} else {
					$args['orderby'] = $orderBy;
				}
			}
			if ( $orderByDirection ) {
				$args['order'] = $orderByDirection;
			}
			
			$args = array_merge($args, $extraArgs);
			
			
			
			$results = get_posts( $args );
			foreach ( $results as $key => $result ) {
				$results[ $key ]->meta = $this->getMeta( $result->ID );
			}
			
			return $results;
		}
		
		public function getMeta( $id ) {
			$all_meta_fields = get_post_meta( $id );
			$meta            = [];
			foreach ( $all_meta_fields as $field => $values ) {
				$meta[ $field ] = ! empty( $values[0] ) ? maybe_unserialize($values[0]) : '';
			}
			
			return $meta;
		}
		
		public function get( $id ) {
			
			$record = get_post( $id );
			
			$record->meta = $this->getMeta( $id );
			
			return $record;
		}
		
		
		public function remove( $id ) {
			
			wp_delete_post( $id, TRUE );
			
			return TRUE;
		}
		
		public function update( $body, $id = FALSE ) {
			$main_fields = [
				'ID',
				'post_author',
				'post_date',
				'post_date_gmt',
				'post_content',
				'post_title',
				'post_excerpt',
				'post_status',
				'comment_status',
				'ping_status',
				'post_password',
				'post_name',
				'to_ping',
				'pinged',
				'post_modified',
				'post_modified_gmt',
				'post_content_filtered',
				'post_parent',
				'guid',
				'menu_order',
				'post_type',
				'post_mime_type',
				'comment_count',
			];
			$args        = [];
			$meta        = [];
			if( isset($body['meta']) ){
				$meta = $body['meta'];
				unset($body['meta']);
			}
			
			foreach ( $body as $key => $value ) {
				if ( in_array( $key, $main_fields ) ) {
					$args[ $key ] = $value;
				} else {
					$meta[ $key ] = $value;
				}
			}
			
			if ( ! empty( $args ) ) {
				if ( $id ) {
					wp_update_post( $args );
				} else {
					$args['post_type']   = $this->type;
					$args['post_status'] = empty( $args['post_status'] ) ? 'publish' : $args['post_status'];
					$id                  = wp_insert_post( $args, TRUE );
					if ( is_wp_error( $id ) || ! $id ) {
						return FALSE;
					}
				}
			}
			
			$this->updateMeta( $id, $meta );
			
			return $id;
		}
		
		public function updateMeta( $id, $meta ) {
			foreach ( $meta as $key => $value ) {
				update_post_meta( $id, $key, $value );
			}
		}
	}