/**
 * 注意：如非必要请勿修改此文件，业务配置请在`./routes`处理
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { routerSetting } from '@/config/routerConfig';
import { execNative } from '@/services/utils';
import { increase } from '@/services/page';

Vue.use(VueRouter);

// 下行会被vux-loader替换为src/router/routes.js 详见build/vux-config
const routes = [];

const router = new VueRouter(Object.assign({ routes }, routerSetting));

router.addRoutes([
    {
        path: '/error-page',
        name: 'errorPage',
        component: require('@/views/errorPage.vue'),
        meta: {
            noDirection: true,
        },
    },
]);

// 意向页面
let wishPath;

// eslint-disable-next-line no-unused-vars
function networkError() {
    increase();

    store.commit('updatePageStatus', { isPageError: true, isOnLine: navigator.onLine });
    router.push({ path: '/error-page', query: { to: wishPath } });

    setTimeout(() => {
        execNative('showToast', {
            content: navigator.onLine ? '网络不给力，请稍后重试' : '没有网络，请检查网络设置后重试',
        });
    });
}

router.beforeEach((to, from, next) => {
    wishPath = to.fullPath;
    next();
});

export default router;
