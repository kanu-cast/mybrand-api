const express = require("express");
const router = express.Router({mergeParams: true});
import { handleCreateBlog, handleUpdateBlog, handleDeleteBlog, handleLikeBlog } from '../../handlers/blogs';
import { validateBlog } from '../../middleware/validate-request';
import multer  from 'multer';
const storage = multer.memoryStorage();
const upload = multer({
    storage:storage
});
router.post('/create', upload.fields([
        { name:"uploadedImage", maxCount:1 }
    ]),
    validateBlog,
    handleCreateBlog
);
router.put('/:blog_id/update', upload.fields([
        { name:"uploadedImage", maxCount:1 }
    ]),
    validateBlog,
    handleUpdateBlog
);
router.route('/:blog_id/delete').put(handleDeleteBlog);
router.route('/:blog_id/like').put(handleLikeBlog);

export { router as adminBlogRoutes };
