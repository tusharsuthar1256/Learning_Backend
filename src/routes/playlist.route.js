import { Router } from "express";
import {
     createPlaylist,
     updatePlaylist,
     deletePlaylist,
     getAllPlaylists,
     getPlaylistByID,
     getUserPlaylists,
     addVideosToPlaylist,
     removeVideoFromPlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
// router.use(verifyJWT, upload.none()); // Removed from global

router.route("/").post(verifyJWT, upload.none(), createPlaylist)
router
    .route("/:playlistId")
    .get(getPlaylistByID)
    .put(verifyJWT, upload.none(), updatePlaylist)
    .delete(verifyJWT, upload.none(), deletePlaylist)

router.route("/user/:userId").get(getUserPlaylists)
router.route("/all-playlists").get(getAllPlaylists)

router.route("/add/:playlistId/:videoId").post(verifyJWT, upload.none(), addVideosToPlaylist);
router.route("/remove/:playlistId/:videoId").delete(verifyJWT, upload.none(), removeVideoFromPlaylist)

export default router;