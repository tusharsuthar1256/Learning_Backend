import { Router } from "express";
import {
     toggleCommentLike,
     toggleTweetLike,
     toggleVideoLike
} from "../controllers/like.controller.js";
import {verifyJWT} from "../middlewares/auth.mid.js"

const likesRouter = Router();

likesRouter.use(verifyJWT);

likesRouter.route("/toggle/v/:videoId").post(toggleVideoLike);
likesRouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
likesRouter.route("/toggle/c/:commentId").post(toggleCommentLike);

export default likesRouter;
