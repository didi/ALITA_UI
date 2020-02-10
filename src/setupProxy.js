const target = 'http://localhost:8068/'

const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy(['/alita', '/callback'], {
        target
    }));
};