import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/medias");

console.log("current file path: ", fileURLToPath(import.meta.url));

// console.log("current file url: ", import.meta.url);
// console.log("current file path: ", fileURLToPath(import.meta.url));
// console.log("parent folder path: ", dirname(fileURLToPath(import.meta.url)));
// console.log("target path: ", join(dirname(fileURLToPath(import.meta.url)), "../../data/medias.json"));
