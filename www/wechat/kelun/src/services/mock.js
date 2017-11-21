/**
 * Created by naifen00 on 2017/5/3.
 * 关于 axios-mock-adapter 更多配置请参考 https://github.com/ctimmerm/axios-mock-adapter
 */

import MockAdapter from 'axios-mock-adapter';

export default {
    bootstrap(axios) {
        const mock = new MockAdapter(axios, { delayResponse: 1000 });

        if (process.env.NODE_ENV === 'production') {
            // Removing mocking behavior
            mock.restore();
        }

        mock.onGet('/user/info').reply(200, {
            code: 0, data: { username: 'mock' }, msg: 'success',
        });

        // Returns a failed promise with Error('Network Error')
        mock.onGet('/networkerror').networkError();
        // Returns a failed promise with Error with code set to 'ECONNABORTED'
        mock.onGet('/timeout').timeout();
        // mocks GET, POST, ... requests to /foo
        mock.onAny('/foo').reply(200);
    },
};
