import express from "express";
import listEndpoints from "express-list-endpoints";
/* ----- ENDPOINTS ----- */
import mediasRouter from "./api/medias/index.js";
import reviewsRouter from "./api/reviews/index.js";

import cors from "cors";
import { join } from "path";
import createHttpError from "http-errors";
import swagger from "swagger-ui-express";
import yaml from "yamljs";

/* --- ERROR HANDLERS --- */
import { genericErrorHandler, notFoundHandler, badRequestHandler, unauthorizedHandler } from "./errorHandlers.js";

const server = express();
// const port = process.env.PORT;
const port = 3006;

const publicFolderPath = join(process.cwd(), "./public");
// const yamlFile = yaml.load(join(process.cwd(), "./src/docs/apiDocs.yml"));
server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

/* --------------------- ENDPOINTS -------------------- */
server.use("/medias", mediasRouter);
server.use("/medias", reviewsRouter);

/* ------------------- ERROR HANDLERS ----------------- */
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500
// (the order of these error handlers does not really matters, expect for genericErrorHandler which needs to be the last in chain)

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`The server listens on port: ${port}`);
});
