/*
Run this as

`node demo-cli.mjs`

or

`node demo-cli.mjs 67` (i.e., your favorite number between 0 and 4.2-ish billion).
*/
import { draw } from "./index.js";

const seed = process.argv[2] ? Number(process.argv[2]) : undefined;
const { hexagrams, drawAgain } = draw(seed);
console.log(hexagrams);
console.log(drawAgain());
console.log(drawAgain());
