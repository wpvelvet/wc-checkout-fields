<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-vue/2.22.0/bootstrap-vue.min.css"/>
<link rel="stylesheet" href="<?=WPV_Settings::plugin()['url']?>_/admin/styles.css?time=<?= time() ?>"/>

<div id="bc-app">
	
	<nav class="topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white">
		<a class="navbar-brand" href="https://www.wpvelvet.com" target="_blank"><?= WPV_Settings::$title ?></a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item" v-if="1==2" :class="{ active: checkActivePage('home') }">
					<a class="nav-link"  @click.prevent="setPage('home')" href="#">Home</a>
				</li>
				<li class="nav-item" :class="{ active: checkActivePage('wc-checkout-fields') }">
					<a class="nav-link" @click.prevent="setPage('wc-checkout-fields')" href="#">WC Checkout Fields</a>
				</li>
			</ul>
			
			<form class="form-inline my-2 my-lg-0 d-none">
				<input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
				<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
			</form>
		</div>
	</nav>
	
	<div id="bc-content">
		<bc-home v-if="checkActivePage('home')"></bc-home>
		<bc-wc-checkout-fields v-if="checkActivePage('wc-checkout-fields')"></bc-wc-checkout-fields>
	</div>
	
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-vue/2.22.0/bootstrap-vue.min.js"></script>
<script src="https://unpkg.com/vue-select@3.0.0"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-select@3.0.0/dist/vue-select.css">
<script>
    Vue.component('v-select', VueSelect.VueSelect);
</script>

<!-- CDNJS :: Sortable (https://cdnjs.com/) -->
<script src="//cdn.jsdelivr.net/npm/sortablejs@1.8.4/Sortable.min.js"></script>
<!-- CDNJS :: Vue.Draggable (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.20.0/vuedraggable.umd.min.js"></script>

<script src="<?=WPV_Settings::plugin()['url']?>/_/admin/vueApp.js?time=<?= time() ?>"></script>
