class Up {
  /**
   * @private
   * @param {any[]} prev
   * @param {typeof Up.Newline | string} x
   */
  static code(prev, x) {
    if (x !== "```") {
      return prev.concat(x);
    }

    let i = prev.length - 1;

    if (i === -1 || prev[i] !== Up.Newline) {
      return prev.concat(x);
    }

    for (i--; i >= 0; i--) {
      if (prev[i] === "```" && prev[i + 1] === Up.Newline) {
        break;
      } else if (i === 0) {
        return prev.concat(x);
      }
    }

    return prev.concat({
      children: prev
        .splice(i)
        .slice(2, -1)
        .reduce(Up.url, []),
      type: Up.Code
    });
  }

  /**
   * @private
   * @param {any[]} prev
   * @param {typeof Up.Newline | string} x
   */
  static spoiler(prev, x) {
    prev = prev.concat(x);

    if (typeof x !== "string") {
      return prev;
    }

    prev = prev.reduce((_, y) => {
      if (typeof y !== "string") {
        return _.concat(y);
      }

      const split = y.split(/(\*)/);
      if (!split[0]) {
        split.splice(0, 1);
      }
      if (!split[split.length - 1]) {
        split.splice(-1, 1);
      }
      return _.concat(split);
    }, []);

    let i = -1;

    for (let j = 0; j < prev.length; j++) {
      if (prev[j] === "*" && i === -1) {
        i = j;
      } else if (prev[j] === "*") {
        const cut = prev.splice(i, j - i + 1);
        prev.splice(i, 0, { children: cut.slice(1, -1), type: Up.Spoiler });

        j -= cut.length - 1;
        i = -1;
      }
    }

    prev = prev.reduce((_, y) => {
      if (typeof y !== "string") {
        return _.concat(y);
      }

      const z = _[_.length - 1];
      return typeof z === "string" ? _.slice(0, -1).concat(z + y) : _.concat(y);
    }, []);

    return prev;
  }

  /**
   * @private
   * @param {any[]} prev
   * @param {typeof Up.Newline | string} x
   */
  static url(prev, x) {
    if (typeof x !== "string") {
      return prev.concat(x);
    }

    const parts = x.split(
      /((?:(?:ftp|https?|ssh):\/\/)?(?:[a-z0-9-]+@)?[a-z0-9.-]+\.(?:[a-z][a-z0-9-]+|[а-ґ]{2,4})(?:\/[^\s]+[^*])?)([.,*](?:\s|$)|\s|$)/
    );

    for (let i = 0; i < parts.length; i += 3) {
      const text = i ? parts[i - 1] + parts[i] : parts[i];
      if (text) {
        prev = prev.concat(text);
      }

      if (i !== parts.length - 1) {
        const url = parts[i + 1];
        prev = prev.concat({
          children: [decodeURI(url)],
          type: Up.Url
        });
      }
    }

    return prev;
  }

  constructor(/** @type {string} */ domain) {
    /** @type {typeof Up.prototype.link} */
    this.link = this.link.bind(this);

    /** @private */
    this.linkRe = new RegExp(
      `(>>|(?:^|[^/]|https?://)${domain.replace(
        /\./g,
        "\\."
      )}/)(?:([a-z][a-z0-9-]+)#)?([0-9]+|[a-z0-9-]+-[a-z0-9-]*)`
    );
  }

  mark(/** @type {string} */ input) {
    return input
      .split(/(\n)/)
      .map(x => (x === "\n" ? Up.Newline : x))
      .filter(x => x !== "")
      .reduce(Up.code, [])
      .map(x => (/^[*-] /.test(x) ? `\u2022 ${x.slice(2)}` : x))
      .map(
        x =>
          /^#{1,6} /.test(x)
            ? { children: [x.replace(/^#+ /, "")], type: Up.Heading }
            : x
      )
      .map(
        x =>
          /^> ?([^>]|>>)/.test(x)
            ? {
                children: [x.replace(/^> ?/, "")]
                  .reduce(this.link, [])
                  .reduce(Up.url, [])
                  .reduce(Up.spoiler, []),
                type: Up.Quote
              }
            : x
      )
      .reduce(this.link, [])
      .reduce(Up.url, [])
      .reduce(Up.spoiler, []);
  }

  /**
   * @private
   * @param {any[]} prev
   * @param {typeof Up.Newline | string} x
   */
  link(prev, x) {
    if (typeof x !== "string") {
      return prev.concat(x);
    }

    const parts = x.split(this.linkRe);

    for (let i = 0; i < parts.length; i += 4) {
      prev = prev.concat(parts[i]);

      if (i !== parts.length - 1) {
        prev = prev.concat({
          children: [parts[i + 1], parts[i + 2] || "", parts[i + 3]],
          type: Up.Link
        });
      }
    }

    return prev;
  }
}

Up.Code = 3;
Up.Heading = 6;
Up.Link = 1;
Up.Newline = 0;
Up.Quote = 2;
Up.Spoiler = 5;
Up.Url = 4;

exports.Up = Up;
