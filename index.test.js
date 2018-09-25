const { test } = require("ava");
const { Up } = require("./index");

/**
 * Checks expected node types in addition to the runtime test.
 *
 * @type {(t: { is<T>(a:T, b:T): void }) => <T>(a:T, b:T) => void}
 */
const $ = t => (a, b) => t.is(JSON.stringify(a), JSON.stringify(b));

test("marks", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Prosto slova."), ["Prosto slova."]);
});

test("marks, allowing newlines", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Osj rjadok.\n  Potim inszyj.\n\nPorownij ok."), [
    "Osj rjadok.",
    Up.Newline,
    "  Potim inszyj.",
    Up.Newline,
    Up.Newline,
    "Porownij ok."
  ]);
});

test("marks, ignoring ``` once", t => {
  const up = new Up("example.net");
  $(t)(up.mark("\nKod?\n```"), [Up.Newline, "Kod?", Up.Newline, "```"]);
});

test("marks, ignoring underscores", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Pidkreslenia _tew_ zajve."), ["Pidkreslenia _tew_ zajve."]);
});

test("marks bullets", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Krapkovyj spysok:\n- punkt\n- sce odyn punkt\n- i znov"), [
    "Krapkovyj spysok:",
    Up.Newline,
    "\u2022 punkt",
    Up.Newline,
    "\u2022 sce odyn punkt",
    Up.Newline,
    "\u2022 i znov"
  ]);
});

test("marks bullets, asterisk", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Tew krapkovyj spysok:\n* punkt\n* sce odyn punkt\n* i znov"), [
    "Tew krapkovyj spysok:",
    Up.Newline,
    "\u2022 punkt",
    Up.Newline,
    "\u2022 sce odyn punkt",
    Up.Newline,
    "\u2022 i znov"
  ]);
});

test("marks code", t => {
  const up = new Up("example.net");
  $(t)(up.mark("```\nKod\n```"), [
    {
      children: ["Kod"],
      type: Up.Code
    }
  ]);
});

test("marks code, ignoring markup", t => {
  const up = new Up("example.net");
  $(t)(
    up.mark("```\nKrim urliv, *kod*\n> ne zastosovue\n- inszoi rozmitky.\n```"),
    [
      {
        children: [
          "Krim urliv, *kod*",
          Up.Newline,
          "> ne zastosovue",
          Up.Newline,
          "- inszoi rozmitky."
        ],
        type: Up.Code
      }
    ]
  );
});

test("marks code, with urls", t => {
  const up = new Up("example.net");
  $(t)(
    up.mark(
      "```\nUrly v kodi ok http://example.com/test?filter=*&lang=en\n```"
    ),
    [
      {
        children: [
          "Urly v kodi ok ",
          {
            children: ["http://example.com/test?filter=*&lang=en"],
            type: Up.Url
          }
        ],
        type: Up.Code
      }
    ]
  );
});

test("marks heading", t => {
  const up = new Up("example.net");
  $(t)(up.mark("# Zagolovok"), [{ children: ["Zagolovok"], type: Up.Heading }]);
});

test("marks heading, ignoring url", t => {
  const up = new Up("example.net");
  $(t)(
    up.mark("# Zagolovok bez urlu http://example.com/test?filter=*&lang=en"),
    [
      {
        children: [
          "Zagolovok bez urlu http://example.com/test?filter=*&lang=en"
        ],
        type: Up.Heading
      }
    ]
  );
});

test("marks heading, ignoring spoiler", t => {
  const up = new Up("example.net");
  $(t)(up.mark("# Zagolovok ne mae *rozmitky*"), [
    { children: ["Zagolovok ne mae *rozmitky*"], type: Up.Heading }
  ]);
});

test("marks heading, one level", t => {
  const up = new Up("example.net");
  $(t)(up.mark("## Zagolovky rivni. Posty lakoniczni"), [
    { children: ["Zagolovky rivni. Posty lakoniczni"], type: Up.Heading }
  ]);
});

test("marks link", t => {
  const up = new Up("example.net");
  $(t)(up.mark(">>rozmitka-textu"), [
    { children: [">>", "", "rozmitka-textu"], type: Up.Link }
  ]);
});

test("marks link, digits", t => {
  const up = new Up("example.net");
  $(t)(up.mark(">>rozmitka-textu-2"), [
    { children: [">>", "", "rozmitka-textu-2"], type: Up.Link }
  ]);
});

test("marks link, digits only", t => {
  const up = new Up("example.net");
  $(t)(up.mark(">>1537815722721"), [
    { children: [">>", "", "1537815722721"], type: Up.Link }
  ]);
});

test("marks link, url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("https://example.net/rozmitka-textu"), [
    { children: ["https://example.net/", "", "rozmitka-textu"], type: Up.Link }
  ]);
});

test("marks link, url digits", t => {
  const up = new Up("example.net");
  $(t)(up.mark("https://example.net/rozmitka-textu-2"), [
    {
      children: ["https://example.net/", "", "rozmitka-textu-2"],
      type: Up.Link
    }
  ]);
});

test("marks link, url http", t => {
  const up = new Up("example.net");
  $(t)(up.mark("http://example.net/rozmitka-textu"), [
    { children: ["http://example.net/", "", "rozmitka-textu"], type: Up.Link }
  ]);
});

test("marks link, url reply", t => {
  const up = new Up("example.net");
  $(t)(up.mark("https://example.net/rozmitka-textu#1537815722721"), [
    {
      children: ["https://example.net/", "rozmitka-textu", "1537815722721"],
      type: Up.Link
    }
  ]);
});

test("marks link, url without schema", t => {
  const up = new Up("example.net");
  $(t)(up.mark("example.net/rozmitka-textu"), [
    { children: ["example.net/", "", "rozmitka-textu"], type: Up.Link }
  ]);
});

test("marks quote", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Osj ty pysav:\n> cytata"), [
    "Osj ty pysav:",
    Up.Newline,
    { children: ["cytata"], type: Up.Quote }
  ]);
});

test("marks quote, breaking spoiler", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Spojler mowe rvatysj, a *\n> cytata* ne povynna."), [
    "Spojler mowe rvatysj, a *",
    Up.Newline,
    { children: ["cytata* ne povynna."], type: Up.Quote }
  ]);
});

test("marks quote, spacing", t => {
  const up = new Up("example.net");
  $(t)(up.mark(">probil opcionalnyj"), [
    { children: ["probil opcionalnyj"], type: Up.Quote }
  ]);
});

test("marks quote, with link", t => {
  const up = new Up("example.net");
  $(t)(up.mark(">>>rozmitka-textu"), [
    {
      children: [{ children: [">>", "", "rozmitka-textu"], type: Up.Link }],
      type: Up.Quote
    }
  ]);
});

test("marks quote, with spoiler", t => {
  const up = new Up("example.net");
  $(t)(up.mark("> *spojler*."), [
    {
      children: [{ children: ["spojler"], type: Up.Spoiler }, "."],
      type: Up.Quote
    }
  ]);
});

test("marks quote, with spoiler link", t => {
  const up = new Up("example.net");
  $(t)(up.mark("> *>>rozmitka-textu*"), [
    {
      children: [
        {
          children: [{ children: [">>", "", "rozmitka-textu"], type: Up.Link }],
          type: Up.Spoiler
        }
      ],
      type: Up.Quote
    }
  ]);
});

test("marks quote, with spoiler url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("> *ftp://example.net/fajly*"), [
    {
      children: [
        {
          children: [{ children: ["ftp://example.net/fajly"], type: Up.Url }],
          type: Up.Spoiler
        }
      ],
      type: Up.Quote
    }
  ]);
});

test("marks quote, with url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("> ftp://example.net/fajly"), [
    {
      children: [{ children: ["ftp://example.net/fajly"], type: Up.Url }],
      type: Up.Quote
    }
  ]);
});

test("marks spoiler", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*Spojler.*"), [{ children: ["Spojler."], type: Up.Spoiler }]);
});

test("marks spoiler, begin", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*Bilszyj spojler* na poczatku."), [
    { children: ["Bilszyj spojler"], type: Up.Spoiler },
    " na poczatku."
  ]);
});

test("marks spoiler, end", t => {
  const up = new Up("example.net");
  $(t)(up.mark("V kinci *slova pid spojlerom.*"), [
    "V kinci ",
    { children: ["slova pid spojlerom."], type: Up.Spoiler }
  ]);
});

test("marks spoiler, link", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*>>rozmitka-textu*"), [
    {
      children: [{ children: [">>", "", "rozmitka-textu"], type: Up.Link }],
      type: Up.Spoiler
    }
  ]);
});

test("marks spoiler, quote", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*\n> spojler\n*"), [
    {
      children: [
        Up.Newline,
        { children: ["spojler"], type: Up.Quote },
        Up.Newline
      ],
      type: Up.Spoiler
    }
  ]);
});

test("marks spoiler, quote link", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*\n> >>rozmitka-textu\n*"), [
    {
      children: [
        Up.Newline,
        {
          children: [{ children: [">>", "", "rozmitka-textu"], type: Up.Link }],
          type: Up.Quote
        },
        Up.Newline
      ],
      type: Up.Spoiler
    }
  ]);
});

test("marks spoiler, quote url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*\n> ftp://example.net/fajly\n*"), [
    {
      children: [
        Up.Newline,
        {
          children: [{ children: ["ftp://example.net/fajly"], type: Up.Url }],
          type: Up.Quote
        },
        Up.Newline
      ],
      type: Up.Spoiler
    }
  ]);
});

test("marks spoiler, url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("Dwerelo: *http://example.com/test?filter=*&lang=en*"), [
    "Dwerelo: ",
    {
      children: [
        {
          children: ["http://example.com/test?filter=*&lang=en"],
          type: Up.Url
        }
      ],
      type: Up.Spoiler
    }
  ]);
});

test("marks spoiler, with newline", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*>>rozmitka-textu\n>>rozmitka-textu-2*"), [
    {
      children: [
        { children: [">>", "", "rozmitka-textu"], type: Up.Link },
        Up.Newline,
        { children: [">>", "", "rozmitka-textu-2"], type: Up.Link }
      ],
      type: Up.Spoiler
    }
  ]);
});

test("marks spoiler, with url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("*Dwerelo: http://example.com/test?filter=*&lang=en (2015)*"), [
    {
      children: [
        "Dwerelo: ",
        {
          children: ["http://example.com/test?filter=*&lang=en"],
          type: Up.Url
        },
        " (2015)"
      ],
      type: Up.Spoiler
    }
  ]);
});

test("marks url", t => {
  const up = new Up("example.net");
  $(t)(up.mark("https://uk.wikipedia.org/wiki/13-й_район"), [
    { children: ["https://uk.wikipedia.org/wiki/13-й_район"], type: Up.Url }
  ]);
});

test("marks url, encoded", t => {
  const up = new Up("example.net");
  $(t)(
    up.mark(
      "https://uk.wikipedia.org/wiki/13-%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD"
    ),
    [{ children: ["https://uk.wikipedia.org/wiki/13-й_район"], type: Up.Url }]
  );
});

test("marks url, ftp", t => {
  const up = new Up("example.net");
  $(t)(up.mark("ftp://example.net/fajly"), [
    { children: ["ftp://example.net/fajly"], type: Up.Url }
  ]);
});

test("marks url, self", t => {
  const up = new Up("example.net");
  $(t)(up.mark("example.net/pravyla"), [
    { children: ["example.net/pravyla"], type: Up.Url }
  ]);
});
