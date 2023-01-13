import express from "express";
import listEndpoints from "express-list-endpoints";
/* --- ENDPOINTS --- */
import mediasRouter from "./api/medias/index.js";

import cors from "cors";
import { join } from "path";
import createHttpError from "http-errors";
import swagger from "swagger-ui-express";
import yaml from "yamljs";

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

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`The server listens on port: ${port}`);
});
