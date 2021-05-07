import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';

import axios from 'axios'
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://123.127.160.69:8080/SFZZService/'
// axios.defaults.baseURL = 'http://192.168.25.24:8080/SFZZService/'
// axios.defaults.baseURL = 'http://192.168.9.138:8080/SFZZService/'


import VueI18n from 'vue-i18n';
import {
    messages
} from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';

import VueAreaLinkage from 'vue-area-linkage';
Vue.use(VueAreaLinkage)

import MyBread from './components/common/my-bread.vue'
Vue.component(MyBread.name, MyBread)


import 'babel-polyfill';

import Highchart from "highcharts/highcharts";
import HighchartsVue from "highcharts-vue";
import stockInit from "highcharts/modules/stock";

stockInit(Highchart);
Vue.use(HighchartsVue);


Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    if (to.path === '/organizationhomepage') return next()
    if (to.path === '/403') return next()

    const role = window.sessionStorage.getItem('name');
    // if (!role && to.path !== '/login') {
    //     next('/login');
    // } 

    if (role) {
        next()
    } else {
        next('/login')
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');