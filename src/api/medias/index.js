import express from "express";
import httpErrors from "http-errors";
import uinqid from "uniqid";

import { checksMediaSchema, triggerBadRequest } from "./validator.js";
import { getMedias, writeMedias, saveMediasPoster, getMediasJsonReadableStream } from "../../lib/fs-tools.js";
const { NotFound, BadRequest, Unauthorized } = httpErrors;

// FIles upload & PDF & Swagger
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import { getSinglePDFReadableStream, getPDFReadableStream } from "../../lib/pdf-tools.js";
// import json2csv from "json2csv";

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

/* ----------------- POSTER UPLOAD -----------------*/

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "media/posters",
    },
  }),
}).single("poster");

mediasRouter.post("/:id/poster", cloudinaryUploader, async (req, res, next) => {
  console.log("req.body for POST poster of single media: ", req.body);
  try {
    const { id } = req.params;
    console.log(req.file);
    const url = req.file.path;
    const mediaArray = await getMedias();

    const index = mediaArray.findIndex((media) => media.id === id);

    if (index !== -1) {
      const oldMedia = mediaArray[index];
      const media = { ...oldMedia, poster: url, updatedAt: new Date() };
      mediaArray[index] = media;

      await writeMedias(mediaArray);
      res.send({ message: `For media with id: ${id} a poster has been successfully uploaded` });
    } else {
      next(NotFound(`The media withe id: ${id} id not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

/* ----------------- PDF DOWNLOAD -----------------*/
// 1. for ALL MEDIAS
mediasRouter.get("/all/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=media.pdf");
    const mediaArray = await getMedias();
    const source = getPDFReadableStream(mediaArray);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
      else console.log("PDF stream ended successfully");
    });
  } catch (error) {
    next(error);
  }
});

// 2. for MEDIA with SPECIFIC ID
mediasRouter.get("/:id/pdf", async (req, res, next) => {
  try {
    const { id } = req.params;
    const mediaArray = await getMedias();

    const searchedMedia = mediaArray.find((media) => media.id === id);
    if (searchedMedia) {
      const source = getSinglePDFReadableStream(searchedMedia);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) console.log(err);
        else console.log("PDF stream ended successfully");
      });
    } else {
      next(NotFound(`The media withe id: ${id} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
