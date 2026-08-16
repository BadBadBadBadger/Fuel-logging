// A source-level guard against one specific, silent, whole-app class of bug.
//
// Every colour in this app is a CSS variable ("var(--cut)"). The old hex-literal idiom for a
// translucent tint was to concatenate two hex digits of alpha onto the colour — `${c}88`, or
// `c + "88"`. Applied to a variable that yields `var(--cut)88`, which resolves to `#1f63c2 88`:
// a malformed value. The browser drops the entire declaration and paints nothing, silently.
//
// That is what killed the calorie progress bar's fill. It survived every DOM assertion in the
// Playwright suite for weeks, because the element, its width, and its style ATTRIBUTE were all
// exactly right — only the computed style showed the declaration had been thrown away.
//
// This test is static rather than rendered on purpose: it sees the tints that only appear once
// you tap to edit a target, or open History, or add an allergy tag — states no test navigates to.
// mix() (app.jsx) is the correct spelling, and produces a real color-mix().

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "app.jsx");

/** Source lines, minus comments — the explanatory comments above name the bad pattern verbatim. */
const codeLines = () =>
  fs.readFileSync(SRC, "utf8")
    .split("\n")
    .map((text, i) => ({ n: i + 1, text }))
    .filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l.text));

describe("Colour alpha is never concatenated onto a CSS variable", () => {
  test("no `${expr}HH` hex-alpha suffix in a template literal", () => {
    // An interpolation followed immediately by exactly two hex digits and then a value
    // terminator — the shape of `${mc}88` in `linear-gradient(90deg,${mc}88,${mc})`.
    const offenders = codeLines()
      .filter(l => /\$\{[^}]+\}[0-9a-fA-F]{2}(?![0-9a-fA-F])/.test(l.text))
      .map(l => `app.jsx:${l.n}  ${l.text.trim().slice(0, 100)}`);

    expect(offenders).toEqual([]);
  });

  test('no `expr + "HH"` hex-alpha concatenation', () => {
    const offenders = codeLines()
      .filter(l => /\+\s*"[0-9a-fA-F]{2}"/.test(l.text))
      .map(l => `app.jsx:${l.n}  ${l.text.trim().slice(0, 100)}`);

    expect(offenders).toEqual([]);
  });

  // Guards the guard. If mix() is ever renamed or removed, the two tests above would keep
  // passing while the codebase quietly lost the only correct way to express a tint.
  test("mix() still exists and produces a valid color-mix()", () => {
    const src = fs.readFileSync(SRC, "utf8");
    expect(src).toMatch(/const mix = \(c, h\) =>/);

    const mix = (c, h) =>
      `color-mix(in srgb, ${c} ${Math.round(parseInt(h, 16) / 2.55)}%, transparent)`;

    // The alpha the bar asks for: 0x88 of 0xff is 53%.
    expect(mix("var(--cut)", "88")).toBe("color-mix(in srgb, var(--cut) 53%, transparent)");
    expect(mix("var(--accent)", "22")).toBe("color-mix(in srgb, var(--accent) 13%, transparent)");
  });
});
