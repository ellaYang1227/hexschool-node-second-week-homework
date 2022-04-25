const successHandle = require('../service/successHandle');
const errorHandle = require('../service/errorHandle');
const Post = require('../models/posts');

const posts = {
    async getPosts ({req, res}){
        successHandle(res, await Post.find());
    },
    async addPost ({req, res, body}){
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
    },
    async delPosts ({req, res}){
        await Post.deleteMany({});
        successHandle(res, []);
    },
    async delPost ({req, res}){
        const id = req.url.split('/').pop();
        await Post.findByIdAndDelete(id)
            .then(delPost => {
                if(delPost._id){ successHandle(res, delPost)}
            }).catch(error => {
                console.error(error);
                errorHandle(res, 400, 'id');
            });
    },
    async editPost ({req, res, body}){
        try{
            const id = req.url.split('/').pop();
            const update = JSON.parse(body);
            await Post.findByIdAndUpdate(id, update, {new: true, runValidators: true})
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
    },
};

module.exports = posts;