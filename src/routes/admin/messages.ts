import express from "express";
const router  = express.Router({mergeParams: true});
import { handleFetchAllMessages, handleFetchSingleMessage, handleDeleteMessage } from '../../handlers/messages';

router.route('/read/all').get(handleFetchAllMessages);
router.route('/:message_id/read').get(handleFetchSingleMessage);
router.route('/:message_id/delete').put(handleDeleteMessage);

export { router as adminMessageRoutes };
