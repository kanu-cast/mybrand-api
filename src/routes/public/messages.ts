import express from "express";
const router  = express.Router({mergeParams: true});
import { handleCreateMessage } from '../../handlers/messages';
import { validateMessage } from "../../middleware/validate-request";

router.route('/').post(validateMessage, handleCreateMessage);

export { router as publicMessageRoutes };
