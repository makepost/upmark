// @ts-ignore
const r = (x, y) => require("fs").readFileSync(j(x), "utf8", y);
// @ts-ignore
const w = (x, y) => require("fs").writeFileSync(j(x), y);
// @ts-ignore
const j = x => require("path").join(__dirname, `index.${x}`);
const { outputText, sourceMapText } = require("typescript").transpileModule(
  r("js"),
  { compilerOptions: { sourceMap: true, target: 1 } }
);
w("dist.js", outputText);
w("dist.js.map", sourceMapText);
w("dist.d.ts", r("d.ts"));
w("dist.test.js", r("test.js").replace(/"\.\/index"/, '"."'));
