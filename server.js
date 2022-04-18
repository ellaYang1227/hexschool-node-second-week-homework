const http = require('http');
const headers = require('./baseHeaders');
const { successHandle, errorHandle } = require('./responseHandle');
const Post = require('./models/posts');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD))
    .then(() => console.log('資料庫連線成功'))
    .catch(error => console.error(error));

const requestListener = async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    if(req.url === '/posts' && req.method === 'GET'){
        successHandle(res, await Post.find());
    }else if(req.url === '/posts' && req.method === 'POST'){
        req.on('end', async () => {
            try{
                const data = JSON.parse(body);
                const newPost = await Post.create({
                'name': data.name,
                'image': data.image,
                'content': data.content,
                'type': data.type,
                'tags': data.tags
                });

                successHandle(res, newPost);
            }catch(error){
                console.error(error);
                if(JSON.stringify(error) === '{}'){
                    errorHandle(res, 400, 'data');
                }else{
                    errorHandle(res, 400, 'format', error);
                }
            }
        });
    }else if(req.url === '/posts' && req.method === 'DELETE'){
        await Post.deleteMany({});
        successHandle(res, []);
    }else if(req.url.startsWith('/posts') && req.method === 'DELETE'){
        const id = req.url.split('/').pop();
        await Post.findByIdAndDelete(id)
            .then(delPost => {
                if(delPost._id){ successHandle(res, delPost)}
            }).catch(error => {
                console.error(error);
                errorHandle(res, 400, 'id');
            });
    }else if(req.url.startsWith('/posts') && req.method === 'PATCH'){
        req.on('end', async () => {
            try{
                const id = req.url.split('/').pop();
                const update = JSON.parse(body);
                await Post.findByIdAndUpdate(id, update, {new: true})
                .then(updatePost => {
                    if(updatePost){ 
                        successHandle(res, updatePost) 
                    }else{
                        errorHandle(res, 400, 'id');
                    }
                });
            }catch(error){
                console.error(error.path);
                if(JSON.stringify(error) === '{}'){
                    errorHandle(res, 400, 'data');
                }else{
                    const errorKey = error.path === '_id' ? 'id' :'format';
                    errorHandle(res, 400, errorKey, error);
                }
            }
        });
    }else if(req.method === 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();  
    }else{
        errorHandle(res, 404, 'routing');
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);