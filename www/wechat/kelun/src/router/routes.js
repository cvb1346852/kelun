/* eslint-disable no-unused-vars,import/no-dynamic-require,no-undef */
const routes = [
    {
        path: '/home',
        name: 'home',
        component(resolve) {
            require(['@/views/HelloFromVux.vue'], resolve, networkError);
        },
        meta: { title: '首页', requireAuth: true },
    },
    {
        path: '/todo',
        name: 'todo',
        component(resolve) {
            require(['@/views/HelloFromVux.1.vue'], resolve, networkError);
        },
        meta: { title: 'todo' },
    },
    {
        path: '/ajax',
        name: 'ajax',
        component(resolve) {
            require(['@/views/demo/ajax.vue'], resolve, networkError);
        },
        meta: { title: 'ajax' },
    },
    {
        path: '/login',
        name: 'login',
        component: require('@/views/login.vue'),
        meta: {
            title: '登录',
            noDirection: true,
        },
    },
    {
        path: '/search',
        name: 'search',
        component: require('@/views/search.vue'),
        meta: {
            title: '查货',
            noDirection: true,
        },
    },
    {
        path: '/getGoods',
        name: 'getGoods',
        component: require('@/views/getGoods.vue'),
        meta: {
            title: '要货计划',
            noDirection: true,
        },
    },
    {
        path: '/orderList',
        name: 'orderList',
        component: require('@/views/orderList.vue'),
        meta: {
            title: '订单列表',
            noDirection: true,
        },
    },
    {
        path: '/orderTrackDetail/:ordercode',
        name: 'orderTrackDetail',
        component: require('@/views/orderTrackDetail.vue'),
        meta: {
            title: '订单跟踪详情',
            noDirection: true,
        },
    },
    {
        path: '/map/:orderid',
        name: 'map',
        component: require('@/views/map.vue'),
        meta: {
            title: '定位跟踪/轨迹回放',
            noDirection: true,
        },
    },
    {
        path: '*',
        redirect: '/home',
    },
];
