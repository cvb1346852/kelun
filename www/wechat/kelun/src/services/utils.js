/**
 * Created by naifen00 on 2017/4/26.
 */

window.remote = window.remote || {};

function nativeParamsSerializer(target, namespace) {
    if (Object.prototype.toString.call(target) === '[object Object]') {
        const deep = {};

        for (const name in target) {
            const value = target[name];
            const type = Object.prototype.toString.call(value);

            if (type === '[object Object]') {
                deep[name] = nativeParamsSerializer(value, `${namespace}_${name}`);
            } else if (type === '[object Function]') {
                window.remote[`${namespace}_${name}`] = target[name];

                deep[name] = `remote.${namespace}_${name}`;
            } else {
                deep[name] = value;
            }
        }
        return deep;
    }
    return target;
}

export function execNative(method, options) {
    if (!window.native || !window.native[method]) {
        switch (method) {
            case 'tokenExpire':
                window.app.$vux.toast.show({ type: 'text', text: options, width: '80%' });
                break;
            case 'showToast':
                window.app.$vux.toast.show({ type: 'text', text: options.content, width: '80%' });
                break;
            default:
        }
        return;
    }
    // todo 处理写死回调
    let output;
    if (typeof options !== 'undefined') {
        let params = nativeParamsSerializer(options, method);
        if (Object.prototype.toString.call(params) === '[object Object]') {
            params = JSON.stringify(params);
        }
        output = window.native[method](params);
    } else {
        output = window.native[method]();
    }

    try {
        // 尝试把native返回值转为json对象
        output = JSON.parse(output);
    } catch (e) {
        // error
    }

    return output;
}

export function setDocumentTitle(title) {
    document.title = title;
    if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
        const i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = () => {
            setTimeout(() => {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }
}
