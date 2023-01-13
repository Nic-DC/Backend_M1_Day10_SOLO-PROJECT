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
  console.log("req.body for GET all reviews: ", req.body);
  try {
    const mediaArray = await getMedias();

    if (req.query && req.query.category) {
      const filteredMedias = reviewsArray.filter((media) => media.category === req.query.category);
      res.send(filteredMedias);
    } else {
      res.send(reviewsArray);
    }
  } catch (error) {
    next(error);
  }
});
export default reviewsRouter;
