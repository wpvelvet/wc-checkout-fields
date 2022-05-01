const createSortable = (el, options, vnode) => {

    return Sortable.create(el, {
        ...options
    });
};
const sortable = {
    name: 'sortable',
    componentUpdated(el, binding, vnode) {
        if( binding.value ) {
            if( !el.sortingEnabled ) {
                const table = el;
                table._sortable = createSortable(table.querySelector("tbody"), binding.value, vnode);
                el.sortingEnabled = true;
            }
        }else{
            el.sortingEnabled = false;
        }
    }
};
const mainMixin = {
    data: function () {
        return {
            ajaxurl: ajaxurl,
        };
    },

    methods: {
        autoLoadPage: function () {
            let hash = window.location.hash;
            hash = hash.replace("#", ''); // remove the hash sign

            // TODO - regex to extract variables from url: #page=home&f__test__is=test&f__more__is=test2
            if( hash.includes("page=") ){
                this.page = hash.replace("page=", "");
            }
        },

        __fetch: async function (action, options = {}) {
            const Data = new FormData();

            Data.append('action', action);
			for(let key in options){
				Data.append(key, options[key]);
			}

            let resp = await fetch(this._data.ajaxurl, {
                method: "POST",
                credentials: "same-origin",
                body: Data,
            });
            resp = await resp.json();

            if( !resp.success ){
                this.swalError(resp.data, null);
                return [];
            }

            return resp.data;
        },

        __fetchRecords: async function (type, id = false, options = {}) {
            const Data = new FormData();

            Data.append('action', "bc_records");
            Data.append('type', type);

            // Data.append('perPage', options['perPage'] || 100);
            // Data.append('page', options['page'] || 1);
			for(let key in options){
				Data.append(key, options[key]);
			}
            if( id ) {
                Data.append('id', id);
            }

            let resp = await fetch(this._data.ajaxurl, {
                method: "POST",
                credentials: "same-origin",
                body: Data,
            });
            resp = await resp.json();

            if( !resp.success ){
                this.swalError(resp.data, null);
                return [];
            }

            return resp.data;
        },

        __fetchRecord: async function (id, options = {}) {
            const Data = new FormData();

            Data.append('action', "bc_record");
            Data.append('id', id);

            let resp = await fetch(this._data.ajaxurl, {
                method: "POST",
                credentials: "same-origin",
                body: Data,
            });
            resp = await resp.json();

            if( !resp.success ){
                this.swalError(resp.data, null);
                return [];
            }

            return resp.data;
        },

        __fetchRemoveRecord: async function (id) {
            const Data = new FormData();

            Data.append('action', "bc_record_remove");
            Data.append('id', id);

            let resp = await fetch(this._data.ajaxurl, {
                method: "POST",
                credentials: "same-origin",
                body: Data,
            });
            resp = await resp.json();

            if( !resp.success ){
                this.swalError(resp.data, null);
                return [];
            }

            return true;
        },

        __saveRecord: async function (fields, id = false) {
            const Data = new FormData();

            Data.append('action', "bc_record_save");
            Data.append('body', btoa(JSON.stringify(fields)))
            if( id ) {
                // Data.append('id', id);
            }

            // Pass in the fields
            for(let field in fields){
                // Data.append(field, fields[field]);
            }


            let resp = await fetch(this._data.ajaxurl, {
                method: "POST",
                credentials: "same-origin",
                body: Data,
            });
            resp = await resp.json();

            if( !resp.success ){
                this.swalError(resp.data, null);
                return [];
            }

            return resp.data;
        },

        __resetForm: function(formData, preserveFields = []){
            let newFormData = {};
            for(let key in formData){
                if( preserveFields.includes(key) ){
                    newFormData[key] = formData[key]
                }else{
					newFormData[key] = this.__resetObject(formData[key]);
                }
            }
            return newFormData;
        },
		__resetObject: function (obj) {
			if( typeof obj !== "object") return "";

			let newObj = {};
			for(let key in obj){
				if( typeof obj[key] === "object" ) {
					newObj[key] = this.__resetObject(obj[key]);
				}else{
					newObj[key] = '';
				}
			}
			return newObj;
		},


        swalError: function (title, timer = 1500) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title,
                showConfirmButton: false,
                timer,
            })
        },
        swalSuccess: function (title, timer = 1500) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title,
                showConfirmButton: false,
                timer,
            })
        },
    },

    watch: {
        page: function (val) {
            window.location.hash = `#page=${val}`;
        }
    },

    mounted: function () {
        this.autoLoadPage();
    }
};
Vue.component("bc-home", {
    template: `
        <div id="bc-home">
            <div class="p-5 content-featured">
                <div class="container">
                    <h2>
                        <i class="fas fa-badge-dollar light mr-2"></i>Dashboard
                    </h2>
                    <h4 class="sub-title light">
                        Premium Wordpress & WooCommerce Add-ons. For High Level consulting, contact <a href="#">@wpvelvet</a>
                    </h4>
                </div>
            </div>
            
            <div class="container">
                <div class="row mt-n5">
                    <div class="col">
                        <div class="card w-100">
                            <div class="card-body">
                                <h3>Dashboard Widget</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card w-100">
                            <div class="card-body">
                                <h3>Dashboard Widget</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <h3>Dashboard Widget</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col">
                        <div class="card w-100">
                            <div class="card-body">
                                <h3>Dashboard Widget</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card w-100">
                            <div class="card-body">
                                <h3>Dashboard Widget</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <h3>Dashboard Widget</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
Vue.component('bc-smart-table', {
    mixins: [mainMixin],
    directives: { sortable },
    props: {
        items: {type: Array, default: Array},
        fields: {type: Array, default: []},
        'current-page': {type: Number, default: 1},
        'per-page': {type: Number, default: 10},
        busy: {type: Boolean, default: false},
        bordered: {type: Boolean, default: false},
        borderless: {type: Boolean, default: false},
        outlined: {type: Boolean, default: false},
        headVariant: {type: String, default: null},
        'show-empty': {type: Boolean, default: false},
        'foot-clone': {type: Boolean, default: false},
        filter: {type: String, default: ''},
        dark: {type: Boolean, default: false},
        'head-variant': {type: String, default: ''},
        stacked: {type: String, default: false},
        striped: {type: Boolean, default: false},
        responsive: {type: Boolean, default: false},

        sorting: {type: Boolean, default: false},
		updateSorting: {type: Function, default: null},
		parentClasses: {type: [Array, String], default: Array},
		rowSelection: {type: Boolean, default: false},

        header: {type: Boolean, default: true},
        headerRight: {type: Boolean, default: true},
        footer: {type: Boolean, default: true},
        useResources: {type: Boolean, default: false},
        resourceRecordType: {type: String, default: ''},
        resourceFilters: {type: Object},
        resourceColumns: {type: Object, default: Object},
        resourcePageSize: {type: Number, default: 100},
        resourceAutoApplyFilters: {type: Boolean, default: false,},
        resourceExtra: {type: String, default: ''},
        resourceFilterItems: {type: [Boolean, Function], default: false},
        resourceCustomLoadRecords: {type: [Boolean, Function], default: false},
    },
    data: function () {
        return {
            totalRows: 0,
            resourcesItems: [],
            resourcesPage: 1,
            resourcesLoadedAll: false,
            loading: false,
            loadingMore: false,
            sortingItems: false,
        }
    },
    template: `<div class="bc-smart-table-wrap" :class="getParentClasses">
        <!-- Table Component Header -->
        <div class="header pb-2" v-if="header">
            <div class="row">
                <div class="col-md-6">
                    <slot name="header_left"></slot>
                </div>
                <div class="col-md-6" v-if="getHeaderRight">
                    <input type="text" placeholder="Search fields" class="form-control d-inline w-auto float-right" v-model="filter">
                </div>
            </div>
        </div>
        <!-- Table Component Header -->
        <!-- Table -->
        <b-table
              v-bind="$props"
              :busy="_busy"
              :items="_items"
              :fields="getFields"
              class="bc-smart-table"
              @filtered="onFiltered"
              v-sortable="sortableOptions"
        >
    
            <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />
            <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>

            <template #table-busy>
                <div class="skeleton" v-for="index in getPerPage"><span></span></div>
            </template>
        </b-table>
        <!-- Table -->
        
        <!-- Table Component Footer -->
        <div class="footer" v-if="getFooter">
            <div class="row">
                <div class="col-md-6">
                    <template v-if="totalRows > 0">
                    Showing {{ (currentPage-1)*getPerPage + 1 }} to {{ currentPage*getPerPage }} of {{ totalRows }} entries
                    </template>
                </div>
                <div class="col-md-6">
                    <b-pagination
                        v-if="totalRows > 0"
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="getPerPage"
                        first-text="First"
                        prev-text="Prev"
                        next-text="Next"
                        last-text="Last"
                        align="right"
                    >
                    <template #last-text>
                        <b-spinner v-if="loadingMore" class="loadingMore"></b-spinner>
                        <span v-else class="text-info">Last</span>
                    </template>
                    </b-pagination>
                </div>
            </div>
        </div>
        <!-- Table Component Footer -->
     </div>`,

    methods: {
        loadResources: async function (loadMore = false) {
            if(!loadMore) this.loading = true;
            else this.loadingMore = true;

            let items = [];
            if( !this.resourceCustomLoadRecords ) {
                items = await this.__fetchRecords(this.resourceRecordType, false, {
                    page: 1,
                })
            }else{
                items = await this.resourceCustomLoadRecords(this);
            }

            if(!loadMore) this.loading = false;
            else this.loadingMore = false;

            // check if we've loaded all the resources that matches this search
            if( items.length < this.resourcePageSize ){
                this.resourcesLoadedAll = true;
            }

            if (items) {
                if( !loadMore ){
                    this.resourcesItems = items;
                }else{
                    this.resourcesItems = [...this.resourcesItems, ...items];
                }
                this.totalRows = this.resourcesItems.length;
            }
        },
        getFilters: function (){
            if( !this.resourceAutoApplyFilters ) return this.resourceFilters;

            return {
                ...this.__getFiltersFromLink(),
                ...this.resourceFilters
            }
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
		onRowSelect(item, selected = true){
			if( !this.rowSelection ) return;
			this.rowSelection(item, selected);
		},
    },
    computed: {
        _items: function () {
            let newItems = this.useResources ? this.resourcesItems : this.items;

            if( this.resourceFilterItems ) newItems = this.resourceFilterItems(newItems);

            return newItems;
        },
        _busy: function (){
            return this.busy || this.loading;
        },


		getPerPage: function (){
			if( this.sorting ) return 10000;
			return this.perPage;
		},
		getHeaderRight: function (){
			if( this.sorting ) return false;
			return this.headerRight;
		},
		getFooter: function (){
			if( this.sorting ) return false;
			return this.footer;
		},

		getParentClasses: function (){
			let classes = this.parentClasses;
			if( typeof classes === 'string' ) classes = classes.split(' ');
			if( this.sorting ) classes.push('sorting');
			return classes;
		},

		// TODO complete later
        sortableOptions: function () {
            if( !this.sorting ) return false;

            return {
                chosenClass: 'is-selected',
                onEnd: (event) => {
                    let oldIndex = event.oldIndex;
                    let newIndex = event.newIndex;
                    if( !this.sortingItems ){
                        this.sortingItems = this._items;
                    }
                    let array = [...this.sortingItems];
                    if (newIndex >= array.length) {
                        let k = newIndex - array.length;
                        while ((k--) + 1) {
                            array.push(undefined);
                        }
                    }
                    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
                    this.sortingItems = array;
					if( this.updateSorting ){
						this.updateSorting(array);
					}
                    // this.resourcesItems = array;
                }
            };
        },

		// Replace the default fields prop
		getFields: function (){
			if( !this.rowSelection ) return this.fields;

			return [
				{
					key: 'checkbox',
					label: '',
					sortable: false,
					class: 'checkbox',
					thClass: 'checkbox',
					thStyle: {
						width: '40px'
					},
					tdClass: 'checkbox',
					tdStyle: {
						width: '40px'
					},
					thTemplate: '<input type="checkbox" class="checkbox-all" />',
					tdTemplate: '<input type="checkbox" class="checkbox-item" />'
				},
				...this.fields,
			]
		}
    },
    watch: {
        currentPage: function (){
            // We've loaded all the possible resources
            if( this.resourcesLoadedAll ) return;

            let itemsLength = this._items.length;
            let maxPages = Math.ceil(itemsLength / this.getPerPage);
            if( maxPages - this.currentPage <= 1 ){
                this.resourcesPage ++;
                this.loadResources(true);
            }
        }
    },
    mounted: function () {
        this.$nextTick(async function () {
            if (this.useResources) await this.loadResources();
            else this.totalRows = this.items.length
        });
    }
})


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
            if( !this.value.meta__options ) this.value.meta__options = [];
            this.value.meta__options.push({});
        },
        removeOption: function (index) {
            this.value.meta__options.splice(index, 1);
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
            
            <draggable tag="tbody" v-model="value.meta__options" group="people" @start="drag=true" @end="drag=false">
                <tr v-for="(item,index) in value.meta__options" :key="item.value">
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
                    {key: 'actions', label: '', tdClass: 'sm'},
                ],
                filterItems: false,
				section: 'billing',
            },

            modalShow: false,
            formData: {
                ID: false,
                post_type: 'wpv_wcf',
				post_status: 'publish',
				post_title: '',
                post_name: '',	//meta key
				menu_order: 0, // priority
				meta: {
					required: 0,
					section: 'billing',
					type: 'text',
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
                fieldTypes: ['text', 'tel', 'email', 'textarea', 'password', 'radio', 'checkbox', 'select', 'file', 'state', 'country'],
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
			console.log("this.formData", this.formData);
            this.formData = this.__resetForm(this.formData, ['post_type', 'post_status']);
			console.log("this.formData", this.formData);
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
                        WooCommerce Checkout Fields
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
                                    <label class="col-sm-3 col-form-label" for="">Type</label>
                                    <div class="col-sm-9">
                                        <b-form-select v-b-tooltip.hover.top="'The type of field that you would like to use, some might require additional settings!'" v-model="formData.meta.type" :options="lists.fieldTypes"></b-form-select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Meta Field</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-b-tooltip.hover.top="'Meta field KEY that will be used to store the selected value on the postmeta table'" v-model="formData.post_name" class="form-control" placeholder="_billing_first_name">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Title</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-b-tooltip.hover.top="'Title/Label for the field on the checkout page'" v-model="formData.post_title" class="form-control" placeholder="ex: First Name, Company Name">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Placeholder</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" v-model="formData.meta.extra.placeholder">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label" for="">Section</label>
                                    <div class="col-sm-9">
                                        <b-form-select v-b-tooltip.hover.top="'What section of the checkout would you like your field to show up on?'" v-model="formData.meta.section" :options="lists.sections"></b-form-select>
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
                                        <input class="form-check-input mt-2" v-b-tooltip.hover.top="'Is this a mandatory field?'" v-model="formData.meta.required" true-value="1" false-value="0" type="checkbox">
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


const WPNext = new Vue({
    mixins: [mainMixin],
    el: "#bc-app",
    data: {
        page: "wc-checkout-fields",
    },
    methods: {
        checkActivePage: function (page) {
            return page === this.page;
        },
        setPage: function (page) {
            this.page = page;
        }
    },
    computed: {

    },
    mounted: function () {
        console.log(this)
    },
});
