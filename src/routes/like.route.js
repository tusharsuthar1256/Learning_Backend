import { Router } from "express";
import {
     toggleCommentLike,
     toggleTweetLike,
     toggleVideoLike,
     getLikedVideos
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const likesRouter = Router();

likesRouter.use(verifyJWT);

likesRouter.route("/toggle/v/:videoId").post(toggleVideoLike);
likesRouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
likesRouter.route("/toggle/c/:commentId").post(toggleCommentLike);

likesRouter.route("/videos").get(getLikedVideos);

export default likesRouter;
