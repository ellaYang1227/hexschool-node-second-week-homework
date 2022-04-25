const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD))
    .then(() => console.log('資料庫連線成功'))
    .catch(error => console.error(error));