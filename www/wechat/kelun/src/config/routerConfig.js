import { execNative, setDocumentTitle } from '@/services/utils';
import { increase } from '@/services/page';
import { checkLogin } from '@/services/api';
import config from '../../config';

export const routerSetting = {
    mode: config.build.mode || 'hash',
    base: config.build.assetsPublicPath,
};

export function routerConfig(router) {
    router.beforeEach(async (to, from, next) => {
        if (to.matched.some(r => r.meta.requireAuth)) {
            const isLogin = await checkLogin();

            if (isLogin) {
                next();
            } else {
                next({
                    path: '/login',
                    query: { redirect: to.fullPath },  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                });
                // 路由未改变，不会进入afterEach钩子
                if (from.path === '/login') {
                    increase();
                }
            }
        } else {
            next();
        }
    });

    router.afterEach((to) => {
        if (to.meta.title) {
            // 微信浏览器需要主动修改title
            if (router.app.$device.isWechat) {
                setDocumentTitle(to.meta.title);
            } else {
                document.title = to.meta.title;
                execNative('initTopbarTitle', { title: to.meta.title });
            }
        }

        // 重置管车topbar
        execNative('enterPage', { title: to.meta.title, url: to.path });
    });
}
