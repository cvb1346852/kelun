/**
 * config 自定义参数
 *  {
 *      showLoading: true,      // 是否显示Loading，缺省值true
 *      showCodeError: true,    // 是否显示业务错误，缺省值true
 *      showNetworkError: true, // 是否显示网络错误，缺省值true
 *  }
 *
 * https://github.com/mzabriskie/axios#request-method-aliases
 *
 */
import Vue from 'vue';

export const user = {
    getUserInfo() {
        return Vue.http.get('/user/info');
    },
};

export function getUserInfo() {
    return Vue.http.get('/user/info');
}

let isLogin = false;

export function checkLogin() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(isLogin);
        }, 1000);
    });
}

export function login() {
    return new Promise((resolve) => {
        setTimeout(() => {
            isLogin = true;
            resolve();
        }, 1000);
    });
}

export const demo = {
    get1() {
        return Vue.http.get('/user/info');
    },
    get2() {
        return Vue.http.get('/user/info', { showLoading: false });
    },
};


// RESTful API 举例
export const restful = {
    user: {
        base: '/user',
        get(id) {
            return Vue.http.get(`${this.base}/${id}`);
        },
        create(data) {
            return Vue.http.post(`${this.base}`, data);
        },
        update(id, data) {
            return Vue.http.put(`${this.base}${id}`, data);
        },
        remove(id) {
            return Vue.http.delete(`/user/${id}`);
        },
    },
};

export const consign = {
    // 根据openid 查询要货基地
    getBase(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getFromNames'}});
    },
    // 要货计划要货单模糊查询
    getErpGoodsCodes(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getErpGoodsCodes'}});
    },
    // 查订单跟踪详情
    getOrderTrace(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getOrderTrace'}});
    },
    // 根据货单号查订单列表
    erpOrderList(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.erpOrderList'}});
    },
    // 获取货单列表
    getGoodsList(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getAuthOrders'}});
    },
    getUserInfoByCode(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.user.getUserInfoByCode'}});
    },
    getUserInfoByOpenid(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.user.getUserInfoByOpenid'}});
    },
    getAuthOrders(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getAuthOrders'}});
    },
    getDetail(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getDetail'}});
    },
    getDingWei(data, interactionConfig = {showLoading: false}) {
        return Vue.http.post('wechat.php', data, {params: {method: 'consign.order.getDingWei'}});
    },
};
