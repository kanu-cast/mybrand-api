import express from "express";
const router  = express.Router({mergeParams: true});
import { handleCreateComment, handleLikeComment, handleDislikeComment } from '../../handlers/comments';
import { validateComment } from "../../middleware/validate-request";

router.route('/create').post(validateComment, handleCreateComment);
router.route('/:comment_id/like').post(handleLikeComment);
router.route('/:comment_id/dislike').post(handleDislikeComment);

export { router as commentRoutes };
