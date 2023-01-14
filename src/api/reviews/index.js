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
    const reviewsArray = await getReviews();

    const searchedMedia = mediaArray.find((media) => media.id === mediaID);

    if (searchedMedia) {
      const index = reviewsArray.findIndex((review) => review._id === reviewID);

      if (index !== -1) {
        const oldReview = reviewsArray[index];
        const updatedReview = { ...oldReview, ...req.body, updatedAt: new Date() };
        reviewsArray[index] = updatedReview;

        writeReviews(reviewsArray);
        res.send({
          message: `Review with id: ${reviewID} successfully updated and it looks like the updatedReview below`,
          updatedReview: updatedReview,
        });
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

// 5. DELETE single review
reviewsRouter.delete("/:mediaID/reviews/:reviewID", async (req, res, next) => {
  try {
    const { mediaID } = req.params;
    const { reviewID } = req.params;

    const mediaArray = await getMedias();
    const reviewsArray = await getReviews();

    const searchedMedia = mediaArray.find((media) => media.id === mediaID);

    if (searchedMedia) {
      const remainingReviews = reviewsArray.filter((review) => review._id !== reviewID);

      if (reviewsArray.length !== remainingReviews.length) {
        writeReviews(remainingReviews);
        res.status(204).send({
          message: `Review with id: ${reviewID} successfully deleted; Below you can see the updated list of reviews`,
          updatedListOfReviews: remainingReviews,
        });
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
