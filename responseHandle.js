const headers = require('./baseHeaders');
const errorMag = {
    'data': '沒有資料',
    'id': '沒有此 _id',
    'format': '格式錯誤',
    'routing': '沒有此路由'
};


const successHandle = (res, data) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        'status': 'success',
        data
    }));
    res.end();
};

const errorHandle = (res, statusCode, errorKey, mongooseError) => {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify({
        'status': false,
        'errorMag': errorMag[errorKey],
        'error': mongooseError
    }));
    res.end();
};

module.exports = { successHandle, errorHandle };