const express = require('express');
const router = express.Router();
const blogController = require('../controllers/postController');
const {upload} = require('../helpers/fileHelper');

router
    .post('/', upload.single('file'), blogController.uploadBlog)
    .get('/', blogController.getAllBlogs)
    .get('/one/:slug', blogController.getBlogById)
    .patch('/:blogId', upload.single('file'), blogController.editBlog)
    .delete('/:postId', blogController.deletePost)

module.exports = router;
