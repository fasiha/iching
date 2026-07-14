I hand-implemented this (without any input from AI), consulting only the large table in https://ja.wikipedia.org/wiki/易経, the table of probabilities in https://en.wikipedia.org/wiki/I_Ching_divination, and the instructions in https://clovemedia.github.io/i_ching/I_Ching_Wilhelm_Baynes_Translation.html#moving_lines about moving lines

Before I ran it the first time, I asked, "Is this implementation correct?" and it gave me <ruby>地<rt>ground</rt></ruby> above <ruby>火<rt>fire</rt></ruby> → 明夷, and no moving lines, so https://clovemedia.github.io/i_ching/I_Ching_Wilhelm_Baynes_Translation.html#36:

> Here the sun has sunk under the earth and is therefore darkened… here a man of dark nature is in a position of authority and brings harm to the wise and able man.

Make of that what you will.

Released into the public domain. GenAI (Sonnet 5 low) was briefly used to replace the built-in JavaScript random number generator with a seedable one, and to tweak the library to be accessible to Node (old and new), Deno, Bun, browser, etc., but that's it.