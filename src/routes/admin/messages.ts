import express from "express";
const router  = express.Router({mergeParams: true});
import { handleFetchAllMessages, handleFetchSingleMessage, handleDeleteMessage } from '../../handlers/messages';

router.route('/').get(handleFetchAllMessages);
router.route('/:message_id/').get(handleFetchSingleMessage);
router.route('/:message_id/').delete(handleDeleteMessage);

export { router as adminMessageRoutes };
