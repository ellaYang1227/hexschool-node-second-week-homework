const headers = require('../service/baseHeaders');
const errorHandle = require('../service/errorHandle');

const http  = {
    cors(res) {
        res.writeHead(200, headers);
        res.end();
    },
    notFound(res){
        errorHandle(res, 404, 'routing');
    }
};

module.exports = http;