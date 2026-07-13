// heads 1 true, tails 0 false
const HEADS = true;
const TAILS = false;
const BOOL_TO_COIN = { [HEADS]: 3, [TAILS]: 2 };

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
const TRIGRAMS = "天沢火雷風水山地";

// closer to 1 = heads = true
const coin = () => Math.random() > 0.5;
const line = () => {
  const first = coin() === HEADS && HEADS === coin() ? 2 : 3;
  const second = BOOL_TO_COIN[coin()] + BOOL_TO_COIN[coin()];
  return first + second;
};

const hexaline = () => Array.from({ length: 6 }, (_) => line());

const linesToTrindex = (lines) =>
  lines.reduce((prev, x, i) => prev + (!(x % 2) << i), 0);

const invert = (line) => (line === 6 ? 7 : line === 9 ? 8 : line);

const hexalineToPair = (orig) => {
  const arr = [...orig].reverse();
  const tops = arr.slice(0, 3);
  const top = linesToTrindex(tops);
  const topFlipped = linesToTrindex(tops.map(invert));

  const bots = arr.slice(3);
  const bot = linesToTrindex(bots);
  const botFlipped = linesToTrindex(bots.map(invert));

  const firstIndex = `${TRIGRAMS[top]}${TRIGRAMS[bot]}`;
  const first = TABLE[firstIndex];

  const moving = arr
    .map((line) => (line === 6 || line === 9 ? `${line}` : "_"))
    .join("");

  const secondIndex = `${TRIGRAMS[topFlipped]}${TRIGRAMS[botFlipped]}`;
  const next = secondIndex === firstIndex ? undefined : TABLE[secondIndex];

  return [first, moving, next];
};

console.log(hexalineToPair(hexaline()));

const test = () => {
  const draws = [];
  for (let i = 0; i < 1_000_000; i++) {
    draws.push(line());
  }
  const histogram = {};
  for (const draw of draws) {
    histogram[draw] ??= 0;
    histogram[draw]++;
  }
  const IDEAL = { 6: 1 / 16, 7: 5 / 16, 8: 7 / 16, 9: 3 / 16 };
  for (let d in histogram) {
    console.log(`${d} = ${histogram[d] / draws.length} (ideal: ${IDEAL[d]})`);
  }
};

// test();
