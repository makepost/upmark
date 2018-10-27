# upmark

Converts talk markup to an array of objects. For safe and consistent virtual DOM mapping. Lets you have a component, with local state, in place of an interlink, url, quote, code, spoiler or heading.

## Example

Install with `npm i -S upmark`, then run:

```js
const { Up } = require("upmark");
const up = new Up("example.net"); // Own domain, for interlinks.

up.mark(`>>123
https://example.net/thread-id#123

> Quoted spoiler: *https://uk.wikipedia.org/wiki/%D0%A2%D0%B5%D1%81%D1%82*

## Heading

\`\`\`
Monospaced text,
such as code.
\`\`\``);
```

Parses your input and returns an AST:

```js
[
  { children: [">>", "", "123"], type: 1 }, 0,
  { children: ["https://example.net/", "thread-id", "123"], type: 1 }, 0, 0,
  {
    children: [
      "Quoted spoiler: ",
      {
        children: [
          { children: ["https://uk.wikipedia.org/wiki/Тест"], type: 4 }
        ],
        type: 5
      }
    ],
    type: 2
  }, 0, 0,
  { children: ["Heading"], type: 6 }, 0, 0,
  { children: ["Monospaced text,", 0, "such as code."], type: 3 }
];
```

Map over this structure, and render your React Native or browser components in place of nodes, differentiating by type:

```js
Up.Code = 3;
Up.Heading = 6;
Up.Link = 1; // Interlink. Contains prefix, thread id and post id.
Up.Newline = 0; // Not a node object, just the number.
Up.Quote = 2;
Up.Spoiler = 5;
Up.Url = 4;
```

## License

MIT