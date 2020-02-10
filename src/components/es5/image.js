'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _antd = require('antd');

var IMAGE_PREFIX = 'http://img.souche.com/';

/**
 * 从 antd 的 Upload 获取图片地址
 */
function getImagesUrl(files) {
    var UPLOAD_ERRORS = [];

    // 过滤掉没有返回 response 的 file
    files = files.filter(function (file) {
        return !!file.response;
    });

    var images = files.map(function (file) {
        if (!file.response.success) {
            var failMessage = '[' + file.name + ']: ' + file.response.msg;
            UPLOAD_ERRORS.push(failMessage);

            return new Error(failMessage);
        }

        // 后台返回了完整的 url
        if (file.response.data && file.response.data.fullFilePath) {
            return file.response.data.fullFilePath;
        }

        // 后台只返回了 path，需要自己拼域名
        if (file.response.data && file.response.data.relativeFilepath) {
            return IMAGE_PREFIX + file.response.data.relativeFilepath;
        }
    });

    // 错误提示
    if (UPLOAD_ERRORS.length > 0) {
        _antd.Modal.error({
            title: 'Error',
            content: UPLOAD_ERRORS.join('\n\n')
        });
    }

    // 过滤掉错误的文件
    images = images.filter(function (image) {
        return image instanceof Error === false;
    });

    // 只有一张图片的话，直接返回 url；空数组的话返回 ''
    if (images.length < 2) {
        return images[0] || '';
    }

    return images;
}

exports.default = {
    getImagesUrl: getImagesUrl
};