Vue.component('bc-wcf-options-manager', {
	props: ["value"],
	data: function(){
		return {
			smartTable: {
				fields: [
					{key: 'front_actions', label: ''},
					{key: 'value', label: 'Option Value'},
					{key: 'label', label: 'Option Title'},
					{key: 'back_actions', label: 'Actions'},
				],
			},
			drag: false,
		}
	},
	methods: {
		createOption: function () {
			console.log("this.value", this.value);
			if( !this.value.meta.extra.options ) this.value.meta.extra.options = [];
			this.value.meta.extra.options.push({});
		},
		removeOption: function (index) {
			this.value.meta.extra.options.splice(index, 1);
		}
	},
	template: `<div class="wc-checkout-fields-options-manager">
        <p>
            Enter all the options that you'd like the field to use.
        </p>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <td></td>
                    <td>Option Value</td>
                    <td>Option Name</td>
                    <td></td>
                </tr>
            </thead>
            
            <draggable tag="tbody" v-model="value.meta.extra.options" group="people" @start="drag=true" @end="drag=false">
                <tr v-for="(item,index) in value.meta.extra.options" :key="item.value">
                    <td>
                        <button class="btn btn-light btn-md move"><i class="fas fa-arrows"></i></button>
                    </td>
                    <td><input type="text" :tabindex="index+100" class="form-control" v-model="item.value"></td>
                    <td><input type="text" :tabindex="index+101" class="form-control" v-model="item.label"></td>
                    <td>
                        <button class="btn btn-danger btn-md" @click.prevent="removeOption(index)"><i class="fas fa-times-circle"></i></button>
                    </td>
                </tr>
            </draggable>
        </table>
        
        <button class="btn btn-primary w-100" tabindex="200" @click.prevent="createOption">Create Option</button>
    </div>`
})
Vue.component("bc-wc-checkout-fields", {
	mixins: [mainMixin],
	data: function(){
		return {
			smartTable: {
				key: 'wc-checkout-fields-table',
				recordType: 'wc-checkout-fields',
				filters: {},
				fields: [
					{key: 'post_title', label: 'Title'},
					{key: 'meta.type', label: 'Type'},
					{key: 'post_name', label: 'Meta Field'},
					// {key: 'section', label: 'Section'},
					// {key: 'priority', label: 'Priority', tdClass: 'xs text-center'},
					{key: 'meta.required', label: 'Required', tdClass: 'xs text-center'},
					{key: 'meta.disabled', label: 'Disabled', tdClass: 'xs text-center'},
					{key: 'actions', label: '', tdClass: 'sm'},
				],
				filterItems: false,
				section: 'billing',
			},

			modalShow: false,
			formData: {
				ID: false,
				post_type: 'wpvv_wcf',
				post_status: 'publish',
				post_title: '',
				post_name: '',	//meta key
				menu_order: 150, // priority
				meta: {
					required: 0,
					section: 'billing',
					type: 'text',
					metaType: 'post',
					extra: {
						autocomplete: '',
						class: '',
						label_class: '',
						placeholder: '',
						options: [],
					}
				},
			},
			loadingSave: false,
			loadingItem: false,
			loadingRemove: false,
			loadingImportDefaultFields: false,
			lists: {
				fieldTypes: ['text', 'tel', 'email', 'textarea', 'password', 'radio', 'checkbox', 'select', 'state', 'country', ], //'file', 'paragraph', 'header', 'description', 'alert'
				metaTypes: ['post', 'user'],
				sections: [
					{
						value: 'billing',
						text: 'Billing',
					},
					{
						value: 'shipping',
						text: 'Shipping',
					},
					{
						value: 'account',
						text: 'Account',
					},
					{
						value: 'order',
						text: 'Order',
					},
				]
			},

			orderedItems: [],
			orderFieldsChanged: false,
			orderFieldsSaveLoading: false,
		}
	},
	methods: {
		refreshTable: function(){
			this.smartTable.key = 'wc-checkout-fields-table-'+Date.now(); // refresh table
		},
		save: async function () {
			this.loadingSave = true;
			let resp = await this.__saveRecord(this.formData, this.formData.ID);
			this.loadingSave = false;
			this.modalShow = false;
			this.swalSuccess('Record saved successfully');
			this.refreshTable();
		},
		edit: async function(recordId){
			this.resetForm();

			if( recordId ) {
				this.loadingItem = true;
				let item = await this.__fetchRecord(recordId)
				for (let field in this.formData) {
					this.formData[field] = item[field];
				}
				this.loadingItem = false;
			}else{
				this.formData.meta.section = this.smartTable.section;
			}

			this.modalShow = true;
		},
		removeRecord: async function(id){
			this.loadingRemove = true;
			let resp = await this.__fetchRemoveRecord(id);
			this.loadingRemove = false;
			this.swalSuccess('Record removed');
			this.refreshTable();
		},
		importDefaultFields: async function(){
			this.loadingImportDefaultFields = true;
			let resp = await this.__fetch('bc_wc_checkout_import_default')
			this.refreshTable();
			this.loadingImportDefaultFields = false;
			this.swalSuccess('Default fields imported')
		},
		customLoadRecords: async function (vm){
			return await this.__fetch('bc_wcf_fields',{
				f__section__is: this.smartTable.section,
				sort: true,
			});
		},
		setSection: async function (section){
			if( this.orderFieldsChanged ){
				let resp = await Swal.fire({
					title: 'Are you sure?',
					text: 'You will lose unsaved changes',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, change section!'
				});
				if( !resp.isConfirmed ) return;
			}
			this.smartTable.section = section;
			this.refreshTable();
			this.orderFieldsChanged = false;
		},
		isActiveSection: function (section){
			return this.smartTable.section === section;
		},

		updateSorting: function (data){
			this.orderedItems = data;
			this.orderFieldsChanged = true;
		},
		saveSorting: async function (){
			this.orderFieldsSaveLoading = true;
			let order = this.orderedItems.map( (item, index) => ({
				ID: item.ID,
				menu_order: (index + 1) * 10,
			}) );
			let resp = await this.__saveRecord(order);
			this.orderFieldsSaveLoading = false;
			this.swalSuccess('Updated fields order');
			this.orderFieldsChanged = false;
		},

		resetForm: function () {
			// this.formData = this.__resetForm(this.formData, ['post_type', 'post_status']);
			this.formData = {
				ID: false,
				post_type: 'wpvv_wcf',
				post_status: 'publish',
				post_title: '',
				post_name: '',	//meta key
				menu_order: 150, // priority
				meta: {
					required: 1,
					disabled: 0,
					section: 'billing',
					type: 'text',
					metaType: 'post',
					extra: {
						autocomplete: '',
						class: '',
						label_class: '',
						placeholder: '',
						options: [],
					}
				},
			};
		},
	},
	computed: {
		getModalTitle: function () {
			return this.formData.ID ? `Edit Field - ${this.formData.post_title}` : 'Create New Field';
		},
		fieldRequiresOptions: function () {
			let applicableFor = ['select', 'radio'];
			return applicableFor.includes(this.formData.meta.type);
		}
	},
	template: `
        <div id="bc-wc-checkout-fields">
            <div class="p-5 content-featured">
                <div class="container">
                    <h2>
                        WooCommerce Checkout Fields Manager
                    </h2>
                </div>
            </div>
            
            <div class="container">
                <div class="card mt-n4">
                    <div class="card-header">
                        Checkout Fields 
                        <div class="float-right">
							<button class="btn btn-sm btn-dark" @click.prevent="edit(false)"><i class="fas fa-layer-plus mr-1"></i>Create New Field</button>
							<button class="btn btn-sm btn-warning ml-2" @click.prevent="importDefaultFields">
								<b-spinner small v-if="loadingImportDefaultFields"></b-spinner>
								<span v-else><i class="fas fa-layer-plus mr-1"></i>Import Default Fields</span>
							</button>
							<button class="btn btn-sm btn-light ml-2" v-if="1==2" @click.prevent="edit(false)"><i class="fas fa-layer-plus mr-1"></i>Export Settings</button>
						</div>
                    </div>
                    <div class="card-body">
						<!-- Fields Table -->
						<bc-smart-table
								:key="smartTable.key"
								bordered responsive stacked="sm"
								:use-resources="true" :resource-record-type="smartTable.recordType" :resource-filters="smartTable.filters" :fields="smartTable.fields" :resource-extra="smartTable.extra"
								:resource-filter-items="smartTable.filterItems" :resource-custom-load-records="customLoadRecords" :sorting="true"
								:update-sorting="updateSorting"
								per-page="100"
						>
							<template #header_left>
								<button class="btn btn-lg btn-primary" @click.prevent="setSection('billing')" :class="{active: isActiveSection('billing')}">Billing</button>
								<button class="btn btn-lg btn-primary" @click.prevent="setSection('shipping')" :class="{active: isActiveSection('shipping')}">Shipping</button>
								<button class="btn btn-lg btn-primary" @click.prevent="setSection('account')" :class="{active: isActiveSection('account')}">Account</button>
								<button class="btn btn-lg btn-primary" @click.prevent="setSection('order')" :class="{active: isActiveSection('order')}">Order</button>
								<button class="btn btn-lg btn-dark" v-if="1==2">Create Section</button>
							</template>
						
							<template #cell(meta.required)="{value}">
								<i v-if="value == 1" class="fas fa-check-square"></i>
							</template>
							<template #cell(meta.disabled)="{value}">
								<i v-if="value == 1" class="fas fa-check-square"></i>
							</template>
							<template #cell(actions)="{item}">
								<button class="btn btn-sm btn-secondary" @click.prevent="edit(item.ID)" :disabled="loadingItem">
									<b-spinner small v-if="loadingItem"></b-spinner>
									<i v-else class="fas fa-edit"></i>
								</button>
								<button class="btn btn-sm btn-danger" @click.prevent="removeRecord(item.ID)" :disabled="loadingRemove">
									<b-spinner small v-if="loadingRemove"></b-spinner>
									<i v-else class="fas fa-times-circle"></i>
								</button>
							</template>
						</bc-smart-table>
						<!-- Fields Table -->
						<button class="btn btn-dark w-100" v-if="orderFieldsChanged" :disabled="orderFieldsSaveLoading" @click.prevent="saveSorting">
							<b-spinner small v-if="orderFieldsSaveLoading"></b-spinner>
							<span v-else>Save Order</span>
						</button>
                    </div>
                </div>
            </div>
            
            <b-modal v-model="modalShow" size="xl" hide-footer centered :title="getModalTitle">
                <div class="row">
                    <!-- Basic Settings -->
                    <div class="col bc-transition">
                        <div class="card mt-0">
                            <div class="card-body">
                                <p>Primary information about the field, like the meta field you want it to be saved, or the section you'd like to display it on</p>
                                
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Section</label>
                                    <div class="col-sm-9">
                                        <b-form-select v-b-tooltip.hover.right="'What section of the checkout would you like your field to show up on?'" v-model="formData.meta.section" :options="lists.sections"></b-form-select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Type</label>
                                    <div class="col-sm-9">
                                        <b-form-select v-b-tooltip.hover.right="'The type of field that you would like to use, some might require additional settings!'" v-model="formData.meta.type" :options="lists.fieldTypes"></b-form-select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Meta Field</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-b-tooltip.hover.right="'Meta field KEY that will be used to store the selected value on the postmeta table'" v-model="formData.post_name" class="form-control" placeholder="_billing_first_name">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Meta Type</label>
                                    <div class="col-sm-9">
                                        <b-form-select v-b-tooltip.hover.right="'By default we save the data inside the postmeta table(connected to the order) but you can also choose to save it with the customer(usermeta)'" v-model="formData.meta.metaType" :options="lists.metaTypes"></b-form-select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Title</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-b-tooltip.hover.right="'Title/Label for the field on the checkout page'" v-model="formData.post_title" class="form-control" placeholder="ex: First Name, Company Name">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Placeholder</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" v-model="formData.meta.extra.placeholder">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Class</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" v-model="formData.meta.extra.class" placeholder="Comma separated list, ex: class-1, class-2, class-3">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Label Class</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" v-model="formData.meta.extra.label_class" placeholder="Comma separated list, ex: class-1, class-2, class-3">
                                    </div>
                                </div>
                                <div class="form-group row" v-if="1==2">
                                    <label class="col-sm-3 col-form-label" for="">Priority</label>
                                    <div class="col-sm-9">
                                        <input type="number" class="form-control" v-model="formData.menu_order">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Required</label>
                                    <div class="col-sm-9">
                                        <input class="form-check-input mt-2" v-b-tooltip.hover.right="'Is this a mandatory field?'" v-model="formData.meta.required" true-value="1" false-value="0" type="checkbox">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Disabled</label>
                                    <div class="col-sm-9">
                                        <input class="form-check-input mt-2" v-b-tooltip.hover.right="'Do you want to disable this field?'" v-model="formData.meta.disabled" true-value="1" false-value="0" type="checkbox">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Basic Settings -->
                    
                    <!-- Advanced Settings -->
                    <div class="col bc-transition" v-show="fieldRequiresOptions">
                        <div class="card mt-0">
                        <div class="card-header">Advanced Settings</div>
                            <div class="card-body">
                                <bc-wcf-options-manager v-if="fieldRequiresOptions" v-model="formData"/>
                            </div>
                        </div>
                    </div>
                    <!-- Advanced Settings -->
                </div>
                
                <button class="btn btn-dark w-100 mt-3" @click.prevent="save">
                    <b-spinner v-if="loadingSave"></b-spinner>
                    <span v-else>Save</span>
                </button>
            </b-modal>
        </div>
    `
})
