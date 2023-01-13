import express from "express";
import httpErrors from "http-errors";
import uinqid from "uniqid";

import { checksReviewSchema, triggerBadRequest } from "./validator.js";
import {
  getReviews,
  writeReviews,
  getMedias,
  writeMedias,
  saveMediasPoster,
  getMediasJsonReadableStream,
} from "../../lib/fs-tools.js";
const { NotFound, BadRequest, Unauthorized } = httpErrors;

const reviewsRouter = express.Router();

// 1. POST review
reviewsRouter.post("/:mediaID/reviews", checksReviewSchema, triggerBadRequest, async (req, res, next) => {
  console.log("req.body for POST single review: ", req.body);
  try {
    const { mediaID } = req.params;
    const mediasArray = await getMedias();
    const searchedMedia = mediasArray.find((media) => media.id === mediaID);

    if (searchedMedia) {
      const newReview = {
        ...req.body,
        _id: uinqid(),
        elementID: searchedMedia.id,
        createdAt: new Date(),
      };

      const reviewsArray = await getReviews();
      reviewsArray.push(newReview);
      await writeReviews(reviewsArray);

      res.status(201).send({ message: `The new review, with id: ${newReview._id} successfully created` });
    } else {
      next(NotFound(`Media with id: ${mediaID} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 2. GET all reviews for a single media
reviewsRouter.get("/:mediaID/reviews", async (req, res, next) => {
  try {
    const { mediaID } = req.params;
    const mediasArray = await getMedias();
    const searchedMedia = mediasArray.find((media) => media.id === mediaID);

    if (searchedMedia) {
      const reviewsArray = await getReviews();

      if (req.query & req.query.search) {
        const filteredReviews = reviewsArray.filter((review) => review.rate === req.query.rate);
        res.send(filteredReviews);
      } else {
        res.send(reviewsArray);
      }
    } else {
      next(NotFound(`Media with id: ${mediaID} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET single review for single media
reviewsRouter.get("/:mediaID/reviews/:reviewID", async (req, res, next) => {
  try {
    const { mediaID } = req.params;
    const { reviewID } = req.params;

    const mediaArray = await getMedias();

    const searchedMedia = mediaArray.filter((media) => media.id === mediaID);

    if (searchedMedia) {
      const reviewsArray = await getReviews();
      const searchedReview = reviewsArray.find((review) => review._id === reviewID);

      if (searchedReview) {
        res.send(searchedReview);
      } else {
        next(NotFound(`Review with id: ${reviewID} not in our archive`));
      }
    } else {
      next(NotFound(`Media with id: ${mediaID} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT review
reviewsRouter.put("/:mediaID/reviews/:reviewID", async (req, res, next) => {
  try {
    const { mediaID } = req.params;
    const { reviewID } = req.params;

    const mediaArray = await getMedias();

    const searchedMedia = mediaArray.filter((media) => media.id === mediaID);

    if (searchedMedia) {
      const reviewsArray = await getReviews();
      const searchedReview = reviewsArray.find((review) => review._id === reviewID);

      if (searchedReview) {
        res.send(searchedReview);
      } else {
        next(NotFound(`Review with id: ${reviewID} not in our archive`));
      }
    } else {
      next(NotFound(`Media with id: ${mediaID} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});
export default reviewsRouter;
