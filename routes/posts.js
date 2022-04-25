
const postsControllers = require('../controllers/posts');
const httpControllers = require('../controllers/http')

const routes = async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    if(req.url === '/posts' && req.method === 'GET'){
        postsControllers.getPosts({req, res});
    }else if(req.url === '/posts' && req.method === 'POST'){
        req.on('end', () => postsControllers.addPost({req, res, body}));
    }else if(req.url === '/posts' && req.method === 'DELETE'){
        postsControllers.delPosts({req, res});
    }else if(req.url.startsWith('/posts') && req.method === 'DELETE'){
        postsControllers.delPost({req, res});
    }else if(req.url.startsWith('/posts') && req.method === 'PATCH'){
        req.on('end', () => postsControllers.editPost({req, res, body}));
    }else if(req.method === 'OPTIONS'){
        httpControllers.core(res);
    }else{
        httpControllers.notFound(res);
    }
}

module.exports = routes;