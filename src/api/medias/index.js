import express from "express";

const mediasRouter = express.Router();

mediasRouter.post("/", async (res, req, next) => {
  console.log("req.body for POST single media: ", req.body);
});
mediasRouter.get("/", async (res, req, next) => {
  console.log("req.body for GET all medias: ", req.body);
});
mediasRouter.get("/:id", async (res, req, next) => {
  console.log("req.body for GET single media: ", req.body);
});
mediasRouter.post("/:id/poster", async (res, req, next) => {
  console.log("req.body for POST poster of single media: ", req.body);
});
mediasRouter.get("/:id/pdf", async (res, req, next) => {
  console.log("req.body for PDF download: ", req.body);
});

export default mediasRouter;
