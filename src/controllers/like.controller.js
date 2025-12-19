import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Tweet } from "../models/tweet.model.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.body
    const userId = req.user?._id
    //TODO: toggle like on tweet
    const exisitngLike = await Like.findOne({ tweet: tweetId, likedBy: userId })
    if (exisitngLike) {
        await Like.deleteOne({ _id: exisitngLike._id })
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: { likesCount: -1 },
        });
        return res.status(200).json(new ApiResponse(200, { "status": "removed" }, "like removed successfully"))
    }
    await Like.create({ tweet: tweetId, likedBy: userId })
    await Tweet.findByIdAndUpdate(tweetId, {
        $inc: { likesCount: 1 },
    });
    return res.status(200).json(new ApiResponse(200, { "status": "added" }, "like added successfully"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}