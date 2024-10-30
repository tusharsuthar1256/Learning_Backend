import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {
     createTweet,
     updateTweet,
     deleteTweet
} from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyJWT,upload.none());
router.route("/").post(createTweet);

router.route("/:tweetId").put(updateTweet).delete(deleteTweet);


export default router;