import Vue from 'vue';
import { cookie, AjaxPlugin, AlertPlugin, ConfirmPlugin, DevicePlugin, LoadingPlugin, ToastPlugin, Group, Cell, CellBox, Flexbox, FlexboxItem } from 'vux';
import FastClick from 'fastclick';

import store from './store';
import router from './router';

import App from './App';
import config from './config';
// import mock from './services/mock';

Vue.use(AjaxPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(DevicePlugin);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(config, router);

// 全局注册常用组件
Vue.component('Group', Group);
Vue.component('Cell', Cell);
Vue.component('CellBox', CellBox);
Vue.component('Flexbox', Flexbox);
Vue.component('FlexboxItem', FlexboxItem);

// 页面刷新时，赋值token
if (cookie.get('token')) {
    store.commit('setToken', cookie.get('token'));
}

// mock.bootstrap(Vue.http);

window.Vue = Vue;
window.router = router;
window.Bus = new Vue();

FastClick.attach(document.body);

/* eslint-disable no-new */
window.app = new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app-box');
