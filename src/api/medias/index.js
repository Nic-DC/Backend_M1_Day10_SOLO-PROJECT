import express from "express";
import httpErrors from "http-errors";
import uinqid from "uniqid";

import { checksMediaSchema, triggerBadRequest } from "./validator.js";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
const { NotFound, BadRequest, Unauthorized } = httpErrors;

const mediasRouter = express.Router();

mediasRouter.post("/", checksMediaSchema, triggerBadRequest, async (req, res, next) => {
  console.log("req.body for POST single media: ", req.body);
  try {
    const newMedia = {
      ...req.body,
      id: uinqid(),
      createdAt: new Date(),
    };

    const mediaArray = await getMedias();
    mediaArray.push(newMedia);
    await writeMedias(mediaArray);

    res.status(201).send({ message: `New media,'${newMedia.title}', with id: ${newMedia.id} successfully created` });
  } catch (error) {
    next(error);
  }
});
mediasRouter.get("/", async (req, res, next) => {
  console.log("req.body for GET all medias: ", req.body);
  try {
    const mediaArray = await getMedias();

    if (req.query && req.query.category) {
      const filteredMedias = mediaArray.filter((media) => media.category === req.query.category);
      res.send(filteredMedias);
    } else {
      res.send(mediaArray);
    }
  } catch (error) {
    next(error);
  }
});
mediasRouter.get("/:id", async (req, res, next) => {
  console.log("req.body for GET single media: ", req.body);
  try {
    const { id } = req.params;
    const mediaArray = await getMedias();

    const foundMedia = mediaArray.find((media) => media.id === id);

    if (foundMedia) {
      res.send(foundMedia);
    } else {
      next(NotFound(`The media with id: ${id} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});
mediasRouter.post("/:id/poster", async (req, res, next) => {
  console.log("req.body for POST poster of single media: ", req.body);
  try {
  } catch (error) {
    next(error);
  }
});
mediasRouter.get("/:id/pdf", async (req, res, next) => {
  console.log("req.body for PDF download: ", req.body);
  try {
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
