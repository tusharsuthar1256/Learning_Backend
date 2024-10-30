import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/playlist.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError("Please provide a valid video id");
  }

  const likeAlready = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (likeAlready) {
    await Like.findByIdAndDelete(likeAlready._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false },
          "You have successfully unliked the video"
        )
      );
  }

  await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked: true },
        "You have successfully liked the video"
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError("Please provide a valid tweet id");
  }

  const likedAlready = await Like.findOne({
    tweet: tweetId,
    likeBy: req.user?._id,
  });

  if (likedAlready) {
    await Like.findByIdAndUpdate(likedAlready?._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false },
          "You have successfully unliked the tweet"
        )
      );
  }

  await Like.create({
    tweet: tweetId,
    likeBy: req.user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked: true },
        "You have successfully liked the tweet"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req,res) => {
     const {commentId} = req.params;

     if (!commentId) {
          throw new ApiError("Please provide a valid video id");
     }

     const likedAlready = await Like.findOne({
          comment:commentId,
          likeBy:req.user?._id,
     })
     if (likedAlready) {
          await Like.findByIdAndUpdate(likedAlready?._id);

          return res
               .status(200)
               .json(
                    new ApiResponse(
                         200,
                          { isLiked: false },
                   "You have successfully unliked the video"
                    )
               )
     }

     await Like.create({
          comment:commentId,
          likeBy:req.user?._id,
     })

     return res
          .status(200)
          .json(
               new ApiResponse(
                    200,
                    { isLiked: true },
           "You have successfully liked the video"
               )
          )
})

const getLikedVideos = asyncHandler(async (req,res) => {
  

})

export{
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike
}