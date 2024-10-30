import { Router } from "express";
import {
     createPlaylist,
     updatePlaylist,
     deletePlaylist,
     getAllPlaylists,
     getPlaylistByID,
     addVideosToPlaylist,
     removeVideoFromPlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT,upload.none());

router.route("/").post(createPlaylist)
router.route("/:playlistId").get(getPlaylistByID).put(updatePlaylist).delete(deletePlaylist)

router.route("/all-playlists").get(getAllPlaylists)

router.route("/add/:playlistId/:videoId").post(addVideosToPlaylist);
router.route("/remove/:playlistId/:videoId").delete(removeVideoFromPlaylist)

export default router;