const Review = require("../models/Review");

const createReview = async (req, res) => {
  const { name, review, star, time } = req.body;

  let periodLower = time.toLowerCase();

  if (!name || !review || !star)
    return res.status(400).json({ message: "all fields are required" });

  const reviewObject = { name, review, star, time: periodLower };

  const revyou = await Review.create(reviewObject);

  if (revyou) {
    return res.status(201).json({ message: "Review sent" });
  } else {
    return res.status(500).json({ message: "invalid review data" });
  }
};

const getAllReviews = async (req, res) => {
  const page = req?.query?.page || 1;
  const perPage = req?.query?.perPage || 20;

  const [reviews, count] = await Promise.all([
    Review.find()
      .skip((page - 1) * parseInt(perPage))
      .limit(parseInt(perPage))
      .lean()
      .exec(),

    Review.countDocuments(),
  ]);

  if (!reviews?.length) {
    return res.status(200).json({ message: "No reviews found" });
  }
  res.json({ reviews, count });
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById({ _id: reviewId }).exec();

  if (!review)
    return res
      .status(400)
      .json({
        message: "Something went wrong, refresh the page and try again",
      });

  await Review.findOneAndDelete({ _id: reviewId }).exec();

  res.status(200).json({ message: "Review deleted successfully" });
};

module.exports = {
  createReview,
  getAllReviews,
  deleteReview
};
