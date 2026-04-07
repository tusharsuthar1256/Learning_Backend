import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";


const getAllVideos = asyncHandler(async (req, res) => {
     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
     
     const pipeline = [];
     if (query) {
        pipeline.push({
            $match: {
                 $or: [
                     { title: { $regex: query, $options: "i" } },
                     { description: { $regex: query, $options: "i" } }
                 ]
            }
        });
     }
     if (userId) pipeline.push({ $match: { owner: new mongoose.Types.ObjectId(userId) } });
     
     pipeline.push({
         $lookup: {
             from: "users",
             localField: "owner",
             foreignField: "_id",
             as: "owner",
             pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }]
         }
     }, { $addFields: { owner: { $first: "$owner" } } });
     
     const videos = await Video.aggregate(pipeline);
     
     return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
 })

const publishVideo = asyncHandler(async (req,res) => {
     const {title, description} = req.body;

     if (!title || !description) {
          throw new ApiError(400,"Please provide all the required fields")
     }

     const videoFileLocalPath = req.files?.videoFile[0]?.path;
     const thumbnailFileLocalPath = req.files.thumbnail[0].path;

     if (!videoFileLocalPath) {
          throw new ApiError(400,"Please provide a video file")
     }

     if (!thumbnailFileLocalPath) {
          throw new ApiError(400, "Please provide a thumbnail image")
     }

     const videoFile = await uploadOnCloudinary(videoFileLocalPath);
     const thumbnailFile = await uploadOnCloudinary(thumbnailFileLocalPath);

     if (!videoFile) {
          throw new ApiError(400, "Video file upload failed on Cloudinary");
     }

     if (!thumbnailFile) {
          throw new ApiError(400, "Thumbnail file upload failed on Cloudinary");
     }

     const newVideo = await Video.create({
          title,
          description,
          videoFile:{
               videoURL:videoFile.url,
               videoPublic_ID:videoFile.public_id
          },
          thumbnail:{
               thumbnailURL:thumbnailFile.url,
               thumbnailPublic_ID:thumbnailFile.public_id
          },
          duration:videoFile.duration,
          isPublished:true,
          owner:req.user?._id
     })

     

     if (!newVideo) {
          throw new ApiError(500,"Server Error, Can't able to upload video file ")
     }

     const videoUploaded = await Video.findById(newVideo._id);

     if (!videoUploaded) {
          throw new ApiError(500,"video uploaded failed, Please try again later!!!")
     }

     return res
          .status(200)
          .json(
               new ApiResponse(
                    200,
                    newVideo,
                    "Successfully Uploaded Video File"
               )
          )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId");

    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: { $size: "$subscribers" },
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    { $project: { fullName: 1, username: 1, avatar: 1, subscribersCount: 1, isSubscribed: 1 } }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                likes: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ]);

    if (!video?.length) throw new ApiError(404, "Video not found");

    // Add to watch history if user is logged in
    if (req.user) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { watchHistory: videoId }
            }
        );
    }

    // Increment views
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    return res.status(200).json(new ApiResponse(200, video[0], "Video fetched successfully"));
});
 
 const updateVideo = asyncHandler(async (req, res) => {
     const { videoId } = req.params;
     const { title, description } = req.body;

     if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId");

     const video = await Video.findById(videoId);
     if (!video) throw new ApiError(404, "Video not found");

     if (video.owner.toString() !== req.user?._id.toString()) {
         throw new ApiError(403, "You are not authorized to update this video");
     }

     const updateFields = {};
     if (title) updateFields.title = title;
     if (description) updateFields.description = description;

     if (req.file) {
         const thumbnail = await uploadOnCloudinary(req.file.path);
         if (thumbnail) {
             updateFields.thumbnail = {
                 thumbnailURL: thumbnail.url,
                 thumbnailPublic_ID: thumbnail.public_id
             };
         }
     }

     const updatedVideo = await Video.findByIdAndUpdate(
         videoId,
         { $set: updateFields },
         { new: true }
     );

     return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
 });
 
 const deleteVideo = asyncHandler(async (req, res) => {
     const { videoId } = req.params;
     if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId");

     const video = await Video.findById(videoId);
     if (!video) throw new ApiError(404, "Video not found");

     if (video.owner.toString() !== req.user?._id.toString()) {
         throw new ApiError(403, "You are not authorized to delete this video");
     }

     await Video.findByIdAndDelete(videoId);

     return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
 });
 
 const togglePublishStatus = asyncHandler(async (req, res) => {
     const { videoId } = req.params;
     if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId");

     const video = await Video.findById(videoId);
     if (!video) throw new ApiError(404, "Video not found");

     if (video.owner.toString() !== req.user?._id.toString()) {
         throw new ApiError(403, "You are not authorized to toggle publish status");
     }

     video.isPublished = !video.isPublished;
     await video.save();

     return res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully"));
 });

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}