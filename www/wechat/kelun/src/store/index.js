import Vuex from 'vuex';
import Vue from 'vue';

require('es6-promise').polyfill();

Vue.use(Vuex);

/* eslint-disable no-shadow */
const state = {
    token: null,
};


const mutations = {
    setToken: (state, data) => {
        state.token = data;
    },
};

const page = {
    state: {
        isPageError: false,
        isOnLine: navigator.onLine,
        isLoading: false,
        direction: '',
    },
    mutations: {
        updatePageStatus(state, payload) {
            Object.assign(state, payload);
        },
        updateDirection(state, payload) {
            state.direction = payload.direction;
        },
    },
};

const consign = {
    state: {
        orderList: {},
        trackData: {},
    },
    mutations: {
        UPDATE_ORDER_LIST(state, data) {
            state.orderList = data;
        },
        UPDATE_TRACK_DATA(state, data) {
            state.trackData = data;
        },
    },
};

export default new Vuex.Store({
    state,
    mutations,
    modules: {
        page,
        consign,
    },
    strict: process.env.NODE_ENV !== 'production',
});

