import express from "express";
const router  = express.Router({mergeParams: true});
import { handleFetchAllBlogs, handleFetchSingleBlog } from '../../handlers/blogs';

router.route('/').get(handleFetchAllBlogs);
router.route('/:blog_id/read').get(handleFetchSingleBlog);

export { router as blogPublicRoutes };
