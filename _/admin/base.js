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
