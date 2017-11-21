import store from '@/store';
import { execNative } from '@/services/utils';

// 延迟关闭时间
const DEFAULT_DELAY_TIME = 50;

let count = 0;
let completed = 0;

function setComplete() {
    count = 0;
    completed = 0;

    execNative('hideLoading');
    store.commit('updatePageStatus', { isLoading: false });
}

export function initProgress() {
    if (count === 0) {
        execNative('showLoading');
        store.commit('updatePageStatus', { isLoading: true });
    }
    count++;
}

export function increase() {
    // Finish ajax loading DEFAULT_LATENCY_TIME ms later
    setTimeout(() => {
        ++completed;
        if (completed >= count) {
            setComplete();
        }
    }, DEFAULT_DELAY_TIME);
}
