/**
 * 注意：如非必要请勿修改此文件，业务配置请在`./httpConfig` `./routerConfig` 处理
 */
import store from '@/store';
import { initProgress, increase } from '@/services/page';
import httpConfg from './httpConfig';
import { routerConfig } from './routerConfig';

const SHOW_AJAX_LOADING = true;
const SHOW_PAGE_LOADING = true;

export default {
    install(Vue, router) {
        /* 默认http配置 */
        const http = Vue.http;

        http.interceptors.request.use((config) => {
            if (!('showLoading' in config)) config.showLoading = SHOW_AJAX_LOADING;

            if (config.showLoading) initProgress();

            return config;
        }, error => Promise.reject(error));

        http.interceptors.response.use((response) => {
            const config = response.config;

            if (config.showLoading) increase();

            return response;
        }, (error) => {
            const config = error.config;

            if (config && config.showLoading) increase();

            return Promise.reject(error);
        });

        httpConfg(Vue);

        /* 默认router配置 */
        let confirmed = true;
        const history = window.sessionStorage;
        history.clear();
        let historyCount = history.getItem('count') * 1 || 0;
        history.setItem('/', 0);

        if (router) {
            router.beforeEach((to, from, next) => {
                // 页面动画方向
                const toIndex = history.getItem(to.path);
                const fromIndex = history.getItem(from.path);

                if (from.meta.noDirection || to.meta.noDirection) {
                    store.commit('updateDirection', { direction: '' });
                } else if (toIndex) {
                    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
                        store.commit('updateDirection', { direction: 'forward' });
                    } else {
                        store.commit('updateDirection', { direction: 'reverse' });
                    }
                } else {
                    ++historyCount;
                    history.setItem('count', historyCount);
                    if (to.path !== '/') {
                        history.setItem(to.path, historyCount);
                    }
                    if (from.path !== '/') {
                        store.commit('updateDirection', { direction: 'forward' });
                    }
                }
                // Loading
                const showLoading = 'showLoading' in to.meta ? to.meta.showLoading : SHOW_PAGE_LOADING;
                if (showLoading && confirmed) {
                    initProgress();

                    confirmed = false;
                }
                next();
            });

            router.afterEach((to) => {
                const showLoading = 'showLoading' in to.meta ? to.meta.showLoading : SHOW_PAGE_LOADING;
                if (showLoading) {
                    increase();

                    confirmed = true;
                }
            });
            routerConfig(router);
        }
    },
};
