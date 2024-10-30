import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import {User} from "../models/user.model.js";
import {Tweet} from "../models/tweet.model.js";


const createTweet = asyncHandler(async (req,res) => {
     const { content } = req.body;

     if (!content) {
          throw new ApiError(400,"Please Content is required")
     }

     const tweetCreate = await Tweet.create({
          content,
          owner:req.user?._id
     })

     if (!tweetCreate) {
          throw new ApiError(400,"Tweet is not created")
     }

     return res.status(201).json(
          new ApiResponse(
               200,
               tweetCreate,
               "Tweet was created successfully"
          )
     )
})

const updateTweet = asyncHandler(async (req,res) => {
     const { content } = req.body;
     const tweetId = req.params;

     if (!content) {
          throw new ApiError(400,"Please Content is required for update it")
     }

     if (!isValidObjectId(tweetId)) {
          throw new ApiError(400,"Invalid tweet id for updating tweet")
     }

     const tweet = await Tweet.findById(tweetId);

     if (!tweet) {
          throw new ApiError(400,"Tweet noot found")
     }

     if(tweet?.owner.toString() != req.user?._id.toString()){
          throw new ApiError(400,"You are not authorized to update this tweet")
     }

     const updatedTweet = await Tweet.findByIdAndUpdate(
          tweetId,
          {
               $set:{
                    content
               }
          },
          {
               new:true
          }
     )
     return res.status(200).json(
          new ApiResponse(
               200,
               updatedTweet,
               "Tweet was updated successfully"
          )
     )
})

const deleteTweet = asyncHandler(async (req,res) => {
     const {tweetId} = req.params;

     if (!isValidObjectId(tweetId)) {
          throw new ApiError(400,"Provide id is required for deleting tweet")
     }
     const tweet = await Tweet.findById(tweetId);

     if (!tweet) {
          throw new ApiError(400,"Noot found any tweet for deleting it")
     }

     if(tweet?.owner.toString() != req.user?._id.toString()){
          throw new ApiError(400,"You are not authorized to delete this tweet")
     }
     
     await Tweet.findByIdAndDelete(tweetId);

     return res.status(200).json({message:"Tweet was deleted successfully"})
})

export {
     createTweet,
     updateTweet,
     deleteTweet
}