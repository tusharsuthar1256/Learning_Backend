import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/playlist.model.js";
import mongoose,{isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req,res) => {
     const {name,description} = req.body;

     if (!name || !description) {
       throw new ApiError(400,"Please provide all the required fields")
     }

     const playlist = await Playlist(
          {
               name,
               description,
               owner: req.user?._id
          }
     );

     if (!playlist) {
          throw new ApiError(500,"An error occurred while creating the playlist")
     }

     return res
          .status(200)
          .json(
               new ApiResponse(
                    200,
                    playlist,
                    "Playlist created successfully"
               )
          )
})

const updatePlaylist = asyncHandler(async (req,res) => {
     const {name,description} = req.body;
     const {id: playlistId} = req.params

     if (!name || !description) {
       throw new ApiError(400,"Please provide all the required fields")
     }

     if (!isValidObjectId(playlistId)) {
          throw new ApiError(400, "Invalid PlaylistId");
      }

      const playlist =  await Playlist.find(playlistId);

     const updatingPlaylist = await playlist.findByIdAndUpdate(
          playlist?.id,
          {
               name,
               description
          },
          {
               new:treu
          }
     )

     return res
          .status(200)
          .json(
               new ApiResponse(
                    200,
                    updatingPlaylist,
                    "Playlist updated successfully"
               )
          )
})

const deletePlaylist = asyncHandler(async (req,res) => {
     const {id: playlistId} = req.params;

      if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"Invalid Playlist Id")
      }

      const removePlaylist = await Playlist.findByIdAndDelete(
          playlist?.id,
)

if (!removePlaylist) {
     throw new ApiError(400,"Error while deleting playlist")
}
return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               removePlaylist,
               "Playlist deleted successfully"
          )
     )
})

const getAllPlaylists = asyncHandler(async (req,res) => {
     const allPlaylist = await Playlist.find().populate('video').populate('owner');

     if (!allPlaylist) {
          throw new ApiError(400,"Error while fetching playlists")
     }

     return res
          .status(200)
          .json(
               new ApiResponse(
                    200,
                    allPlaylist,
                    "All Playlists Fetched Successfully"
               )
          )
})

const getPlaylistByID = asyncHandler(async (req,res) => {
     const {id: playlistId} = req.params;

     if (!playlist) {
          throw new ApiError(400,"Invalid Playlist Id ")
     }
     const playlist = await Playlist.findById(playlistId);

     if (!playlist) {
          throw new ApiError(400,"Playlist not found")
     }

     return res.status(200).json(
          new ApiResponse(
               200,
               playlist,
               "Playlist fetched successfully"
          )
     )

})

const addVideosToPlaylist = asyncHandler(async (req,res) => {
     const {playlistId, videoId} = req.params;

     if (!playlistId || !videoId) {
          throw new ApiError(400,"Please provide all the required fields")
     }

     const playlist = await Playlist.findById(playlistId);
     const video = await Video.findById(videoId);

     if (!playlist || !video) {
          throw new ApiError(400,"Invalid playlist or video id")
     }

     if (playlist.videos.include(videoId)) {
          throw new ApiError(400,"This video is already exist in that video")
     }

     playlist.videos.push(video)

    await playlist.save();

    return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               playlist,
               "Playlist updated successfully"
          )
     )
})

const removeVideoFromPlaylist = asyncHandler(async (req,res) => {
     const {playlistId, videoId} = req.params;

     if (!playlistId || !videoId) {
          throw new ApiError(400,"Please provide all the required fields")

     }
     const playlist = await Playlist.findById(playlistId);
     const video = await Video.findById(videoId);

     if (!playlist || !video) {
          throw new ApiError(400,"Invalid playlist or video id")
     }
      if (!playlist?.videos.include(videoId)){
           throw new ApiError(400, "This Video is not exist in that playlist")
      }



     const deleteVideo = await Playlist.findByIdAndDelete(
          playlistId,
          {
               $pull:{
                    videos:videoId
               }
          },
          {
               new : true
          }
     )

     return res
      .status(200)
      .json(
          new ApiResponse(
               200,
               deleteVideo,
               "Playlist deleted successfully"
      ))
})

export{
     createPlaylist,
     updatePlaylist,
     deletePlaylist,
     getAllPlaylists,
     getPlaylistByID,
     addVideosToPlaylist,
     removeVideoFromPlaylist
}