import express from "express";
import listEndpoints from "express-list-endpoints";
/* --- ENDPOINTS --- */
import mediasRouter from "./api/medias/index.js";

const server = express();
// const port = process.env.PORT;
const port = 3006;

server.use(express.json());

/* --------------------- ENDPOINTS -------------------- */
server.use("/medias", mediasRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`The server listens on port: ${port}`);
});
