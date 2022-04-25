require('./connections');

const PostsRoutes = require('./routes/posts');
const requestListener = async (req, res) => {
    PostsRoutes(req, res);
};

module.exports = requestListener;