import { draw } from "./index.js";

const seed = process.argv[2] ? Number(process.argv[2]) : undefined;
const { hexagrams, drawAgain } = draw(seed);
console.log(hexagrams);
console.log(drawAgain());
console.log(drawAgain());
