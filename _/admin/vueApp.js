const WPVelvet = new Vue({
    mixins: [mainMixin],
    el: "#wpvelvet-app",
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
