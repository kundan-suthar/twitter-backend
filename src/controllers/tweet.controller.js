import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userid = req.user._id;
  console.log("content= ", content);

  if (!content) {
    throw new ApiError(400, "content required");
  }

  const tweet = await Tweet.create({
    content,
    owner: userid,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, tweet, "tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  try {
    const { userId } = req.params;
    const userTweets = await Tweet.find({ owner: userId });
    console.log("user tweets: ", userTweets);

    return res
      .status(200)
      .json(
        new ApiResponse(200, userTweets, "user tweets fetched successfully")
      );
  } catch (error) {
    console.log("unable to update", error);
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
