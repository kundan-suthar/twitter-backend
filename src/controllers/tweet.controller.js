import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userid = req.user._id;
  console.log("content= ", content);

  if (!content) {
    throw new ApiError(400, "content required");
  }
  let postImage;
  if (req.files?.postImage) {
    postImage = await uploadOnCloudinary(req.files?.postImage[0]?.path);
  }
  const tweet = await Tweet.create({
    content,
    owner: userid,
    postImage: postImage?.url,

  });
  const createdTweet = await Tweet.find({ "_id": tweet._id })
    .populate("owner", "username fullName avatar")
    .lean();
  const transformedTweet = createdTweet.map((tweet) => ({
    tweetId: tweet._id,
    content: tweet.content,
    postImage: tweet.postImage,
    createdAt: tweet.createdAt,
    isLiked: false,
    likesCount: tweet.likesCount,
    user: {
      id: tweet.owner._id,
      username: tweet.owner.username,
      fullName: tweet.owner.fullName,
      avatar: tweet.owner.avatar,
    },
  }));

  return res
    .status(201)
    .json(new ApiResponse(200, transformedTweet[0], "tweet created successfully"));


});

const getAllTweets = asyncHandler(async (req, res) => {
  //TODO: get all tweets
  try {
    const tweets = await Tweet.find()
      .populate("owner", "username fullName avatar") // select only required fields
      .lean(); // converts Mongoose docs → plain JS objects
    const likedTweets = await Like.find({
      likedBy: req.user._id,
      tweet: { $in: tweets.map(t => t._id) }
    }).select("tweet");
    const likedSet = new Set(
      likedTweets.map(l => l.tweet.toString())
    );
    const transformedTweets = tweets.map((tweet) => ({
      tweetId: tweet._id,
      content: tweet.content,
      postImage: tweet.postImage,
      createdAt: tweet.createdAt,
      likesCount: tweet.likesCount,
      isLiked: likedSet.has(tweet._id.toString()),
      user: {
        id: tweet.owner._id,
        username: tweet.owner.username,
        fullName: tweet.owner.fullName,
        avatar: tweet.owner.avatar,
      },
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, transformedTweets, "tweets fetched successfully"));
  } catch (error) {
    throw new ApiError(400, " unable to fetch tweets");
  }
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
  const { tweetId } = req.body;
  const tweet = await Tweet.deleteOne({ _id: tweetId });
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "user tweets deleted successfully"));
});


export { createTweet, getUserTweets, updateTweet, deleteTweet, getAllTweets };
