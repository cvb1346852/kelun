import qs from 'qs';
import { cookie } from 'vux';
import { execNative } from '@/services/utils';

// 以手机管车为例
const UN_LOGIN_CODE = 196;
const UCENTER_ERROR_CODE = 23;

export default function (Vue) {
    const http = Vue.http;

    http.defaults.baseURL = location.origin;
    http.defaults.timeout = 15000;
    http.defaults.transformRequest = [data => qs.stringify(data)];
    http.interceptors.request.use((config) => {
        const token = cookie.get('token');
        if (token) {
            // 请结合具体业务变更
            if (config.method === 'get') {
                config.params = Object.assign({ token }, config.params);
            } else {
                config.data = Object.assign({ token }, config.data);
            }
        }

        return config;
    }, error => Promise.reject(error));
    http.interceptors.response.use((response) => {
        const rData = response.data;

        if (rData.code !== 0) {
            // token已过期/ucenter验证失败，需要重新登录
            if (rData.code === UN_LOGIN_CODE || rData.code === UCENTER_ERROR_CODE) {
                execNative('tokenExpire', rData.message || '');
            } else if (response.config.showCodeError) {
                // 是否展示业务错误：showCodeError
                execNative('showToast', {
                    content: typeof response.config.showCodeError === 'string'
                        ? response.config.showCodeError
                        : rData.message,
                });
            }
            // eslint-disable-next-line
            console.warn(rData.message);
            return Promise.reject(response);
        }

        return { data: rData.data, response };
    }, (error) => {
        if (error.config.showNetworkError) {
            // 是否展示网络错误：showNetworkError
            let errorMsg;

            if (typeof error.config.showNetworkError === 'string') {
                errorMsg = error.config.showNetworkError;
            } else if (error.response) {
                // 服务器有响应 状态码不在 2xx 范围内
                errorMsg = '服务器开了一个小差，请稍后重试';
            } else {
                errorMsg = navigator.onLine ? '网络不给力，请稍后重试' : '没有网络，请检查网络设置后重试';
            }
            // eslint-disable-next-line
            console.warn(errorMsg);
            execNative('showToast', { content: errorMsg });
        }

        return Promise.reject(error);
    });
}
