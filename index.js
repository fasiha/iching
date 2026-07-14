// heads 1 true, tails 0 false
const HEADS = true;
const TAILS = false;
const BOOL_TO_COIN = { [HEADS]: 3, [TAILS]: 2 };

// Via https://ja.wikipedia.org/wiki/易経
const TABLE = {
  地天: "䷊,11,泰",
  山天: "䷙,26,大畜",
  水天: "䷄,5,需",
  風天: "䷈,9,小畜",
  雷天: "䷡,34,大壮",
  火天: "䷍,14,大有",
  沢天: "䷪,43,夬",
  天天: "䷀,1,乾",
  地沢: "䷒,19,臨",
  山沢: "䷨,41,損",
  水沢: "䷻,60,節",
  風沢: "䷼,61,中孚",
  雷沢: "䷵,54,帰妹",
  火沢: "䷥,38,睽",
  沢沢: "䷹,58,兌",
  天沢: "䷉,10,履",
  地火: "䷣,36,明夷",
  山火: "䷕,22,賁",
  水火: "䷾,63,既済",
  風火: "䷤,37,家人",
  雷火: "䷶,55,豊",
  火火: "䷝,30,離",
  沢火: "䷰,49,革",
  天火: "䷌,13,同人",
  地雷: "䷗,24,復",
  山雷: "䷚,27,頤",
  水雷: "䷂,3,屯",
  風雷: "䷩,42,益",
  雷雷: "䷲,51,震",
  火雷: "䷔,21,噬嗑",
  沢雷: "䷐,17,随",
  天雷: "䷘,25,无妄",
  地風: "䷭,46,升",
  山風: "䷑,18,蠱",
  水風: "䷯,48,井",
  風風: "䷸,57,巽",
  雷風: "䷟,32,恒",
  火風: "䷱,50,鼎",
  沢風: "䷛,28,大過",
  天風: "䷫,44,姤",
  地水: "䷆,7,師",
  山水: "䷃,4,蒙",
  水水: "䷜,29,坎",
  風水: "䷺,59,渙",
  雷水: "䷧,40,解",
  火水: "䷿,64,未済",
  沢水: "䷮,47,困",
  天水: "䷅,6,訟",
  地山: "䷎,15,謙",
  山山: "䷳,52,艮",
  水山: "䷦,39,蹇",
  風山: "䷴,53,漸",
  雷山: "䷽,62,小過",
  火山: "䷷,56,旅",
  沢山: "䷞,31,咸",
  天山: "䷠,33,遯",
  地地: "䷁,2,坤",
  山地: "䷖,23,剥",
  水地: "䷇,8,比",
  風地: "䷓,20,観",
  雷地: "䷏,16,豫",
  火地: "䷢,35,晋",
  沢地: "䷬,45,萃",
  天地: "䷋,12,否",
};
const parseTableEntry = (value) => {
  const [symbol, number, hanzi] = value.split(",");
  return { symbol, number: parseInt(number, 10), hanzi };
};
const TRIGRAMS = "天沢火雷風水山地";

const makeRandomCoinFlip = (seed) => {
  let x = (seed ?? Math.random() * 2 ** 32) >>> 0;
  // from https://github.com/skeeto/hash-prospector#three-round-functions
  const triple32 = () => {
    x ^= x >>> 17;
    x = Math.imul(x, 0xed5ad4bb);
    x ^= x >>> 11;
    x = Math.imul(x, 0xac4c1b51);
    x ^= x >>> 15;
    x = Math.imul(x, 0x31848bab);
    x ^= x >>> 14;
    // let odd = true = heads
    return (x & 1) === 1;
  };
  return triple32;
};
// closer to 1 = heads = true
const coin = () => Math.random() > 0.5;

/** Given a random boolean generator, returns 6, 7, 8, or 9
 *
 * The odds follow yarrow-root divination procedure
 */
const line = (rng = coin) => {
  const first = rng() === HEADS && HEADS === rng() ? 2 : 3;
  const second = BOOL_TO_COIN[rng()] + BOOL_TO_COIN[rng()];
  return first + second;
};

/** Given a random boolean generator, generates six numbers, each between 6 and 9 inclusive
 *
 * Treat this list as a bottom-to-top components of one hexagram.
 */
const hexaline = (rng) => Array.from({ length: 6 }, (_) => line(rng));

/** Given a bottom-to-top hexagram (6-element list of numbers 6 thru 9 inclusive), generates an index into `TRIGRAMS` */
const linesToTrindex = (lines) =>
  lines.reduce((prev, x, i) => prev + (!(x % 2) << i), 0);

const invert = (line) => (line === 6 ? 7 : line === 9 ? 8 : line);

/** Given a bottom-to-top hexagram (6-element list of numbers 6 thru 9 inclusive), generate the first trigram, the moving lines, and if needed, the second trigram */
const hexalineToPair = (orig) => {
  // orig is bottom-to-top (traditional line order); linesToTrindex wants
  // each trigram's own 3 lines top-of-trigram-first, hence the reverse.
  const tops = orig.slice(3).reverse();
  const top = linesToTrindex(tops);
  const topFlipped = linesToTrindex(tops.map(invert));

  const bots = orig.slice(0, 3).reverse();
  const bot = linesToTrindex(bots);
  const botFlipped = linesToTrindex(bots.map(invert));

  const firstIndex = `${TRIGRAMS[top]}${TRIGRAMS[bot]}`;
  const first = TABLE[firstIndex];

  const moving = orig
    .map((line) => (line === 6 || line === 9 ? `${line}` : "_"))
    .join("");

  const secondIndex = `${TRIGRAMS[topFlipped]}${TRIGRAMS[botFlipped]}`;
  const next = secondIndex === firstIndex ? undefined : TABLE[secondIndex];

  const hint = makeSimpleHint(first, moving, next);
  return { first, movingBottomUp: moving, next, hint };
};

const ORDINALS = {
  0: "beginning/lowest/first",
  1: "second",
  2: "third",
  3: "fourth",
  4: "fifth",
  5: "end/highest/last/sixth",
};
const makeSimpleHint = (first, movingBottomUp, next) => {
  const parsedFirst = parseTableEntry(first);
  let hint = `To understand your reading,
1. Look up ${parsedFirst.number} (${parsedFirst.hanzi}) and read its judgement and image`;

  if (next) {
    const parsedSecond = parseTableEntry(next);

    hint = `${hint}
2. Consult the relevant statements regarding changing lines:
${movingBottomUp
  .split("")
  .map((val, idx) =>
    val === "_" ? null : `  - ${val} in the ${ORDINALS[idx]} place`,
  )
  .filter(Boolean)
  .join("\n")}
3. Then look up ${parsedSecond.number} (${parsedSecond.hanzi}) and read its judgement and image. Ignore any statements regarding changing lines.`;
  } else {
    hint = `${hint}

That's it. The statements regarding changing lines (e.g., "six in the beginning" or "nine in the second place") are not relevant to your reading.`;
  }

  return hint;
};

/** Given an optional numeric seed, draw an I Ching hexagram, moving lines, and (if necessary) the next hexagram.
 *
 * Returns that fortune as well as a function to draw another.
 *
 * The seed's lowest 32 bits are used. So `Date.now()` or `Math.random() * 2 ** 32` work fine.
 */
export const draw = (seed) => {
  const drawFn = makeDraw(seed);
  return { hexagrams: drawFn(), drawAgain: drawFn };
};

/** Given an optional numeric seed, return a function that will produce one fortune per call
 *
 * The seed's lowest 32 bits are used. So `Date.now()` or `Math.random() * 2 ** 32` work fine.
 */
export const makeDraw = (seed) => {
  const rng = makeRandomCoinFlip(seed);
  return () => hexalineToPair(hexaline(rng));
};

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("makeRandomCoinFlip", () => {
    it("is roughly balanced between heads and tails", () => {
      const rng = makeRandomCoinFlip(1234567890);
      const n = 200_000;
      let heads = 0;
      for (let i = 0; i < n; i++) if (rng()) heads++;
      expect(heads / n).toBeCloseTo(0.5, 2);
    });

    it("is deterministic given a seed", () => {
      const SEED = 42;
      const a = makeRandomCoinFlip(SEED);
      const b = makeRandomCoinFlip(SEED);
      const seqA = Array.from({ length: 20 }, () => a());
      const seqB = Array.from({ length: 20 }, () => b());
      expect(seqA).toEqual(seqB);
    });

    it("is different for different seeds", () => {
      const [SEED1, SEED2] = [1, 2];
      const a = makeRandomCoinFlip(SEED1);
      const b = makeRandomCoinFlip(SEED2);
      // odds of 50 coin flips coming up same are astronomical
      const seqA = Array.from({ length: 50 }, () => a());
      const seqB = Array.from({ length: 50 }, () => b());
      expect(seqA).not.toEqual(seqB);
    });

    it("is different when there's no seed", () => {
      const a = makeRandomCoinFlip();
      const b = makeRandomCoinFlip();
      const seqA = Array.from({ length: 50 }, () => a());
      const seqB = Array.from({ length: 50 }, () => b());
      expect(seqA).not.toEqual(seqB);
    });

    it("covers the full uint32 range without float precision loss", () => {
      const rng = makeRandomCoinFlip(0xffffffff);
      expect(() => rng()).not.toThrow();
      expect(typeof rng()).toBe("boolean");
    });
  });

  it("line() distribution matches the yarrow-stalk probabilities", () => {
    const n = 500_000;
    const counts = { 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let i = 0; i < n; i++) counts[line()]++;

    expect(Object.keys(counts).toSorted()).toEqual(["6", "7", "8", "9"]);

    const IDEAL = { 6: 1 / 16, 7: 5 / 16, 8: 7 / 16, 9: 3 / 16 };
    for (const k of [6, 7, 8, 9]) {
      expect(counts[k] / n).toBeCloseTo(IDEAL[k], 2);
    }
  });

  describe("hexalineToPair", () => {
    it("all-9s (乾) flips entirely to all-6s (坤)", () => {
      const { first, next } = hexalineToPair([9, 9, 9, 9, 9, 9]);
      expect(first).toBe(TABLE["天天"]);
      expect(next).toBe(TABLE["地地"]);
    });

    it("all-6s (坤) flips entirely to all-9s (乾)", () => {
      const { first, next } = hexalineToPair([6, 6, 6, 6, 6, 6]);
      expect(first).toBe(TABLE["地地"]);
      expect(next).toBe(TABLE["天天"]);
    });

    it("no moving lines yields no next hexagram", () => {
      const { next } = hexalineToPair([7, 8, 7, 8, 7, 8]);
      expect(next).toBeUndefined();
    });

    it("moving string is bottom-up, matching traditional line numbering", () => {
      const { movingBottomUp } = hexalineToPair([6, 7, 7, 7, 7, 7]);
      expect(movingBottomUp).toBe("6_____");
    });
  });
}
