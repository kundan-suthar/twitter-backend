import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweet.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})
const addTweetComment = asyncHandler(async (req, res) => {
    //TODO: add a comment to a tweet
    const { tweetId } = req.params
    const { content } = req.body
    const user = req.user
    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    const comment = await Comment.create({
        content,
        tweet: tweetId,
        owner: user._id
    })
    if (comment) {
        await Tweet.findByIdAndUpdate(tweetId, { $inc: { commentsCount: 1 } })
    }

    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    addTweetComment
}
