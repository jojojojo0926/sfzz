<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>
<script>
// import bus from '../common/bus';
export default {
    provide() {
        return {
            reload: this.reload
        };
    },
    data() {
        return {
            isRouterAlive:true
        };
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                 this.isRouterAlive = true;
            });
        }
    }
};
</script>

<style>
@import './assets/css/main.css';

</style>