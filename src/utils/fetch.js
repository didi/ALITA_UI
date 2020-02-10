import axios from 'axios';
import {
    notification
} from 'antd';

export default function (request = '', optioins = {}) {
    return axios({
            ...optioins,
            url: request
        })
        .catch(() => {
            notification.error({
                message: '错误提示',
                description: '网络错误',
                bottom: 50,
                duration: 3,
            });
        })
        .then(({
            data: ret
        }) => {
            const {
                status
            } = ret;
            // ret.msg = ret.message
            if (status === 10001) {
                return ret;
            } else if (status === 10008) {
                return;
            }

            if (status !== 10000) {
                throw new Error(JSON.stringify(ret));
            }

            return ret;
        })
        .catch(e => {
            const {
                msg,
                status
            } = JSON.parse(e.message);
            if (status === 10009) {
                notification.warn({
                    message: '权限异常',
                    description: msg,
                    bottom: 50,
                    duration: 3,
                });
            } else {
                notification.error({
                    message: '后端服务异常',
                    description: msg,
                    bottom: 50,
                    duration: 3,
                });
            }
            Promise.reject();
        });
}