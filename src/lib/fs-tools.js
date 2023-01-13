import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/medias");

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PUBLIC FOLDER:", publicFolderPath);
console.log("DATA FOLDER PATH: ", dataFolderPath);

const mediasJSONPath = join(dataFolderPath, "medias.json");

export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (mediasArray) => writeJSON(mediasJSONPath, mediasArray);

export const saveMediasPoster = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

export const getMediasJsonReadableStream = () => createReadStream(mediasJSONPath);
export const getPDFWritableStream = (filename) => createWriteStream(join(dataFolderPath, filename));

// console.log("current file url: ", import.meta.url);
// console.log("current file path: ", fileURLToPath(import.meta.url));
// console.log("parent folder path: ", dirname(fileURLToPath(import.meta.url)));
// console.log("target path: ", join(dirname(fileURLToPath(import.meta.url)), "../../data/medias.json"));
