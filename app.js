function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// ─────────────────────────────────────────────────────────────
// FUEL LOG — src/app.jsx
// Build: npx babel src/app.jsx --presets @babel/preset-react -o app.js
// ─────────────────────────────────────────────────────────────

var exports = window.exports || {};
// ── Constants ─────────────────────────────────────────────────

var A = "var(--accent)",
  BG = "var(--bg)",
  CARD = "var(--surface)",
  BD = "var(--border)";
// Theme helpers (light mode). mix = alpha via color-mix; aA = accent alpha; rc = resolve a
// "var(--x)" to a concrete hex for SVG/Recharts attributes (CSS vars don't work there).
var mix = function mix(c, h) {
  return "color-mix(in srgb, ".concat(c, " ").concat(Math.round(parseInt(h, 16) / 2.55), "%, transparent)");
};
var aA = function aA(h) {
  return mix(A, h);
};
var cssVar = function cssVar(n) {
  return typeof getComputedStyle === "undefined" ? "" : getComputedStyle(document.documentElement).getPropertyValue(n).trim();
};
var rc = function rc(v) {
  var m = String(v).match(/var\((--[\w-]+)\)/);
  return m ? cssVar(m[1]) || v : v;
};
// Theme choice (per-device, never synced): "system" follows prefers-color-scheme; "light"/"dark" force it.
var getTheme = function getTheme() {
  try {
    return localStorage.getItem("fuel_theme") || "system";
  } catch (e) {
    return "system";
  }
};
var applyTheme = function applyTheme(choice) {
  try {
    localStorage.setItem("fuel_theme", choice);
  } catch (e) {}
  if (choice === "light" || choice === "dark") document.documentElement.setAttribute("data-theme", choice);else document.documentElement.removeAttribute("data-theme");
  if (typeof window !== "undefined" && window.__fuelSyncChrome) window.__fuelSyncChrome();
};
// Dev harness flag — gates the celebration test panel. Off in the real app; add ?dev to the URL
// (e.g. http://<host>:3000/?dev) to summon it. Never shown to real users.
var DEV = typeof location !== "undefined" && new URLSearchParams(location.search).has("dev");

// ── Auth / Premium ────────────────────────────────────────────
// Fill GOOGLE_CLIENT_ID after Google Cloud Console setup — see DOCS.md §29.
// Leave empty ("") to skip Google Sign In and go straight to voucher entry (dev mode).
var GOOGLE_CLIENT_ID = "922818167366-5nl6qfteipui307j1oi7asu7d3bkgvat.apps.googleusercontent.com";

// Voucher codes are no longer in the client bundle (Phase A).
// Validation happens server-side in the Cloudflare Worker /redeem endpoint.

var MODES = {
  cut: {
    label: "CUT",
    color: "var(--cut)",
    adj: -500
  },
  maintain: {
    label: "MAINTAIN",
    color: "var(--accent)",
    adj: 0
  },
  bulk: {
    label: "BULK",
    color: "var(--bulk)",
    adj: 500
  }
};
var SESS_TYPES = ["legs", "push", "pull", "fullbody", "cardio"];
var SESS_INT = ["light", "moderate", "heavy"];
var MET = {
  legs: {
    light: 4.0,
    moderate: 6.0,
    heavy: 8.0
  },
  push: {
    light: 3.5,
    moderate: 5.5,
    heavy: 7.0
  },
  pull: {
    light: 3.5,
    moderate: 5.5,
    heavy: 7.0
  },
  fullbody: {
    light: 4.5,
    moderate: 6.5,
    heavy: 9.0
  },
  cardio: {
    light: 5.0,
    moderate: 7.0,
    heavy: 10.0
  }
};
var BDGS = [{
  id: "streak",
  name: "On Fire",
  emoji: "🔥",
  desc: "day logging streak"
}, {
  id: "logger",
  name: "Top Recorder",
  emoji: "🪈",
  desc: "total days logged"
}, {
  id: "hydrated",
  name: "Hydrated",
  emoji: "💧",
  desc: "days hitting 8 glasses"
}];
var TIERS = [3, 6, 12, 24, 48, 96];
var TIER_NAMES = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Elite"];
var TIER_ICONS = ["🟤", "⚪", "🟡", "🔵", "💎", "👑"];
var DEF_PROFILE = {
  weight: 80,
  height: 178,
  bodyFat: 18,
  sex: null,
  activity: null,
  weighCadence: null
};

// ── Display units ─────────────────────────────────────────────────
// Storage is ALWAYS metric (weight kg, height cm). These are per-device
// DISPLAY preferences only — never synced, and never written back to the
// stored value unless the user actually edits a field. Weight and height
// are chosen INDEPENDENTLY (UK users routinely mix, e.g. height in cm but
// weight in stone): weight ∈ {kg, st (stone+pounds), lb}; height ∈
// {cm, ftin (feet+inches), in}. The whole-number round-trips are stable,
// so switching units and saving never nudges the stored value.
var LB_PER_KG = 2.2046226218;
var IN_PER_CM = 0.3937007874;
var WUNITS = ["kg", "st", "lb"];
var HUNITS = ["cm", "ftin", "in"];
// Independent getters/setters. Fall back to the old single `fuel_units` key
// (imperial → st / ftin) so an early tester's choice maps sensibly.
var getWUnit = function getWUnit() {
  try {
    var v = localStorage.getItem("fuel_wunit");
    if (WUNITS.includes(v)) return v;
    if (localStorage.getItem("fuel_units") === "imperial") return "st";
  } catch (e) {}
  return "kg";
};
var setWUnit = function setWUnit(u) {
  try {
    localStorage.setItem("fuel_wunit", WUNITS.includes(u) ? u : "kg");
  } catch (e) {}
};
var getHUnit = function getHUnit() {
  try {
    var v = localStorage.getItem("fuel_hunit");
    if (HUNITS.includes(v)) return v;
    if (localStorage.getItem("fuel_units") === "imperial") return "ftin";
  } catch (e) {}
  return "cm";
};
var setHUnit = function setHUnit(u) {
  try {
    localStorage.setItem("fuel_hunit", HUNITS.includes(u) ? u : "cm");
  } catch (e) {}
};
var kgToStLb = function kgToStLb(kg) {
  var tot = Math.round((Number(kg) || 0) * LB_PER_KG);
  return {
    st: Math.floor(tot / 14),
    lb: tot % 14
  };
};
var stLbToKg = function stLbToKg(st, lb) {
  return Math.round(((Number(st) || 0) * 14 + (Number(lb) || 0)) / LB_PER_KG * 10) / 10;
};
var kgToLb = function kgToLb(kg) {
  return Math.round((Number(kg) || 0) * LB_PER_KG * 10) / 10;
};
var lbToKg = function lbToKg(lb) {
  return Math.round((Number(lb) || 0) / LB_PER_KG * 100) / 100;
}; // 2dp so kgToLb round-trips an integer lb back unchanged
var cmToFtIn = function cmToFtIn(cm) {
  var tot = Math.round((Number(cm) || 0) * IN_PER_CM);
  return {
    ft: Math.floor(tot / 12),
    "in": tot % 12
  };
};
var ftInToCm = function ftInToCm(ft, inch) {
  return Math.round(((Number(ft) || 0) * 12 + (Number(inch) || 0)) / IN_PER_CM);
};
var cmToInch = function cmToInch(cm) {
  return Math.round((Number(cm) || 0) * IN_PER_CM);
};
var inchToCm = function inchToCm(inch) {
  return Math.round((Number(inch) || 0) / IN_PER_CM);
};
// Read-only formatting of a stored kg weight in the active weight unit.
var fmtW = function fmtW(kg, u) {
  if (u === "st") {
    var _kgToStLb = kgToStLb(kg),
      st = _kgToStLb.st,
      lb = _kgToStLb.lb;
    return "".concat(st, " st ").concat(lb, " lb");
  }
  if (u === "lb") return "".concat(kgToLb(kg), " lb");
  return "".concat(kg, " kg");
};
// Chart/trend representation: kg stays kg; both imperial weights plot in lb
// (a numeric axis can't carry compound st+lb, and stone users track change
// in pounds anyway). Returns { num, unit } for a stored kg value.
var wChartNum = function wChartNum(kg, u) {
  return u === "kg" ? Number(kg) : kgToLb(kg);
};
var wChartUnit = function wChartUnit(u) {
  return u === "kg" ? "kg" : "lb";
};

// ── Dietary requirements & allergies (feature #8) ─────────────────
// Suggestion lists for the profile tag-input. Allergens are the UK/EEA 'Big 14'
// (FIC regulated). The user can also commit a custom tag not in these lists.
var DIET_SUGGESTIONS = ["vegan", "vegetarian", "pescatarian", "halal", "kosher", "dairy-free", "gluten-free", "keto", "low-carb"];
var BIG14_ALLERGENS = ["celery", "gluten", "crustaceans", "eggs", "fish", "lupin", "milk", "molluscs", "mustard", "peanuts", "sesame", "soya", "sulphites", "tree nuts"];

// Single-user cache so the scattered AI prompt builders (coach, AI Log, re-estimate,
// Quick Add estimate) can read the user's dietary config without threading a prop
// through every food surface. Refreshed whenever the profile loads or saves.
var DIETARY = {
  diets: [],
  allergens: [],
  dislikes: []
};
var normaliseDietary = function normaliseDietary(d) {
  return {
    diets: d && Array.isArray(d.diets) ? d.diets : [],
    allergens: d && Array.isArray(d.allergens) ? d.allergens : [],
    dislikes: d && Array.isArray(d.dislikes) ? d.dislikes : []
  };
};
var setDietaryCache = function setDietaryCache(d) {
  DIETARY = normaliseDietary(d);
};

// Hard-exclusion block appended to every AI food prompt. Empty when nothing is
// configured (no-regression). Diets + allergens are HARD; dislikes are SOFT.
var dietaryPromptBlock = function dietaryPromptBlock(d) {
  var c = normaliseDietary(d);
  var lines = [];
  if (c.diets.length) lines.push("- DIET (hard rule): the user follows ".concat(c.diets.join(", "), ". Never suggest, name or include any food that violates these diets."));
  if (c.allergens.length) lines.push("- ALLERGIES (hard SAFETY rule): the user is allergic to ".concat(c.allergens.join(", "), ". Never suggest, name or include any food containing these \u2014 or any dish that typically contains them. This is a medical safety constraint."));
  if (c.dislikes.length) lines.push("- DISLIKES (soft preference): avoid ".concat(c.dislikes.join(", "), " where reasonable; this is a preference, not a safety rule."));
  return lines.length ? "\nDietary constraints:\n".concat(lines.join("\n"), "\n") : "";
};

// Zero-token output backstop: which declared allergens does this text name?
// Synonyms expand the trickier presets; matching uses a START word-boundary so
// plurals/derivatives still hit (walnut→walnuts). We deliberately bias toward
// OVER-detection — a spurious flag is cautious, a missed allergen is dangerous.
var ALLERGEN_SYNONYMS = {
  "tree nuts": ["tree nut", "almond", "walnut", "cashew", "pecan", "pistachio", "hazelnut", "macadamia", "brazil nut", "praline", "nutella", "marzipan"],
  "peanuts": ["peanut", "groundnut", "satay"],
  "milk": ["milk", "dairy", "cheese", "butter", "cream", "yogurt", "yoghurt", "whey", "casein", "custard"],
  "eggs": ["egg", "mayonnaise", "mayo", "meringue"],
  "gluten": ["gluten", "wheat", "barley", "rye", "bread", "pasta", "flour", "breaded", "batter", "couscous"],
  "crustaceans": ["crustacean", "prawn", "shrimp", "crab", "lobster", "langoustine"],
  "molluscs": ["mollusc", "mussel", "clam", "oyster", "squid", "octopus", "scallop", "snail"],
  "soya": ["soya", "soy", "tofu", "edamame", "miso", "tempeh"],
  "fish": ["fish", "salmon", "tuna", "cod", "haddock", "anchovy", "mackerel", "sardine"],
  "sesame": ["sesame", "tahini", "hummus"],
  "celery": ["celery", "celeriac"],
  "mustard": ["mustard"],
  "sulphites": ["sulphite", "sulfite"],
  "lupin": ["lupin"]
};
var scanAllergens = function scanAllergens(text, allergens) {
  if (!text || !allergens || !allergens.length) return [];
  var hay = String(text).toLowerCase();
  var hits = [];
  var _iterator = _createForOfIteratorHelper(allergens),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var a = _step.value;
      var key = String(a).toLowerCase();
      var terms = ALLERGEN_SYNONYMS[key] || [key];
      var found = terms.some(function (t) {
        return new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(hay);
      });
      if (found) hits.push(a);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return hits;
};
var AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";

// ── Legal / compliance (LEGAL_ROADMAP Phase B) ────────────────
// Bump POLICY_VERSION whenever the privacy policy changes materially; the value
// is stored against each consent so we know which version a user agreed to.
var POLICY_VERSION = "1.2"; // v1.2: privacy policy now covers dietary requirements & allergies (#8)
var LEGAL = {
  privacy: "legal/privacy.html",
  terms: "legal/terms.html",
  subprocessors: "legal/subprocessors.html",
  deleteInfo: "legal/delete-account.html"
};
var DEF_MEALS = [{
  name: "Chicken breast (150g)",
  kcal: 248,
  protein: 47,
  carbs: 0,
  fat: 5
}, {
  name: "Brown rice (200g cooked)",
  kcal: 218,
  protein: 5,
  carbs: 46,
  fat: 2
}, {
  name: "Scrambled eggs (3 large)",
  kcal: 234,
  protein: 18,
  carbs: 1,
  fat: 17
}, {
  name: "Oats (80g dry)",
  kcal: 304,
  protein: 11,
  carbs: 54,
  fat: 6
}, {
  name: "Greek yoghurt (200g)",
  kcal: 130,
  protein: 18,
  carbs: 6,
  fat: 4
}, {
  name: "Whey protein shake",
  kcal: 130,
  protein: 25,
  carbs: 5,
  fat: 2
}, {
  name: "Banana (medium)",
  kcal: 89,
  protein: 1,
  carbs: 23,
  fat: 0
}, {
  name: "Tuna can (120g drained)",
  kcal: 132,
  protein: 29,
  carbs: 0,
  fat: 1
}, {
  name: "Salmon fillet (150g)",
  kcal: 280,
  protein: 35,
  carbs: 0,
  fat: 15
}, {
  name: "Sweet potato (200g)",
  kcal: 172,
  protein: 3,
  carbs: 40,
  fat: 0
}, {
  name: "Broccoli (200g)",
  kcal: 68,
  protein: 6,
  carbs: 11,
  fat: 1
}, {
  name: "Mixed nuts (30g)",
  kcal: 185,
  protein: 5,
  carbs: 6,
  fat: 16
}, {
  name: "Whole milk (250ml)",
  kcal: 153,
  protein: 8,
  carbs: 12,
  fat: 8
}, {
  name: "White rice (200g cooked)",
  kcal: 260,
  protein: 5,
  carbs: 57,
  fat: 0
}, {
  name: "Cottage cheese (200g)",
  kcal: 160,
  protein: 22,
  carbs: 6,
  fat: 4
}, {
  name: "Avocado (half)",
  kcal: 120,
  protein: 1,
  carbs: 6,
  fat: 11
}, {
  name: "Peanut butter (2 tbsp)",
  kcal: 188,
  protein: 8,
  carbs: 6,
  fat: 16
}, {
  name: "Beef mince 5% fat (150g)",
  kcal: 221,
  protein: 33,
  carbs: 0,
  fat: 9
}, {
  name: "Protein bar (50g)",
  kcal: 200,
  protein: 20,
  carbs: 18,
  fat: 7
}, {
  name: "Whole eggs x2 boiled",
  kcal: 156,
  protein: 12,
  carbs: 1,
  fat: 11
}];

// ── Dev overrides (harness only) ──────────────────────────────

var getDevDateOffset = function getDevDateOffset() {
  try {
    return parseInt(localStorage.getItem("dev_date_offset") || "0") || 0;
  } catch (e) {
    return 0;
  }
};
var getCurrentHour = function getCurrentHour() {
  try {
    var v = localStorage.getItem("dev_time_hour");
    return v !== null ? parseInt(v) : new Date().getHours();
  } catch (e) {
    return new Date().getHours();
  }
};

// ── Helpers ───────────────────────────────────────────────────

var todayKey = function todayKey() {
  var off = getDevDateOffset();
  var d = new Date(Date.now() + off * 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
var fmtShort = function fmtShort(d) {
  var p = d.split("-");
  return p[2] + "/" + p[1];
};
var fmtFull = function fmtFull(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
var sumLogs = function sumLogs(logs) {
  return logs.reduce(function (a, l) {
    return {
      kcal: a.kcal + (l.kcal || 0),
      protein: a.protein + (l.protein || 0),
      carbs: a.carbs + (l.carbs || 0),
      fat: a.fat + (l.fat || 0)
    };
  }, {
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
};

// ── Confidence model (Separated) ──────────────────────────────
// Two SEPARATE uncertainties, never blended into one number:
//  • tdeeConfidence — maturity of the ESTIMATED energy budget, from weigh-in
//    calibration. This is the headline % on the calorie summary.
//  • intakeConfidence — how exact the logged food is. Each entry carries a
//    `conf` (0–100): AI-Meal-Log estimates use the model's confidence; anything
//    reviewed/typed/preset is treated as exact (100, via the ?? default below).
//    Impact-weighted by each entry's kcal share — a fuzzy big meal hurts more
//    than a fuzzy snack. Only SURFACED when low; never sent to the coach.
var tdeeConfidence = function tdeeConfidence(weighInCount) {
  return weighInCount >= 28 ? 92 : weighInCount >= 14 ? 80 : weighInCount >= 7 ? 65 : 50;
};
var intakeConfidence = function intakeConfidence(logs) {
  var kcal = logs.reduce(function (a, l) {
    return a + (l.kcal || 0);
  }, 0);
  if (kcal <= 0) return 100;
  var weighted = logs.reduce(function (a, l) {
    return a + (l.conf == null ? 100 : l.conf) * (l.kcal || 0);
  }, 0);
  return Math.round(weighted / kcal);
};
var INTAKE_FLAG_BELOW = 80; // surface "mostly estimated" only under this

var calcStreak = function calcStreak(hist) {
  var s = 0;
  var d = new Date(Date.now() + getDevDateOffset() * 86400000);
  var _loop = function _loop() {
    var _hist$find;
    var k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    if (!((_hist$find = hist.find(function (h) {
      return h.date === k;
    })) !== null && _hist$find !== void 0 && (_hist$find = _hist$find.logs) !== null && _hist$find !== void 0 && _hist$find.length)) return 1; // break
    s++;
    d.setDate(d.getDate() - 1);
  };
  for (;;) {
    if (_loop()) break;
  }
  return s;
};
var estimateSessionKcal = function estimateSessionKcal(w, bf, type, dur, _int) {
  var _MET$type;
  return Math.round((((_MET$type = MET[type]) === null || _MET$type === void 0 ? void 0 : _MET$type[_int]) || 5) * w * (w * (1 - bf / 100) / 70) * (dur / 60));
};
var SAFE_MIN = {
  male: 1400,
  female: 1200
};

// ── Macro floor engine (feature #7) ──────────────────────────────
// One source of truth for protein/fat/carbs at any calorie target, used by both
// the preset path (calcTargets) and the custom-target path. Protein and fat are
// FLOORS, not proportionally-scaled values — carbs absorb the whole deficit/surplus.
//   • protein: a flat g/kg-LEAN-MASS floor, identical in every mode, so it stops
//     fluctuating on a cut/maintain/bulk switch (male 2.2 / female 2.0).
//   • fat: stays mode-varying (more to spare on a bulk) but never below a hormonal
//     floor of 0.6 g/kg BODYWEIGHT — this is what the old proportional scaling broke.
//   • carbs: whatever calories remain after the two floors, min 50g.
//   • floorsExceedKcal: true when the target is too low to fit both floors + min
//     carbs. We keep the floors (never silently break one) and let the UI warn.
var PROTEIN_PER_LBM = {
  male: 2.2,
  female: 2.0
};
var FAT_FLOOR_PER_KG = 0.6;
var FAT_MODE_PER_KG = {
  male: {
    cut: 0.8,
    maintain: 1.0,
    bulk: 1.0
  },
  female: {
    cut: 0.7,
    maintain: 0.9,
    bulk: 0.9
  }
};
var MIN_CARBS_G = 50;
var computeMacros = function computeMacros(p, mode, kcal) {
  var _FAT_MODE_PER_KG$sex$;
  var w = Number(p.weight) || 80;
  var bf = Number(p.bodyFat) || 18;
  var sex = p.sex === "female" ? "female" : "male";
  var lbm = w * (1 - bf / 100);
  var protein = Math.round(lbm * PROTEIN_PER_LBM[sex]);
  var fatPerKg = Math.max(FAT_FLOOR_PER_KG, (_FAT_MODE_PER_KG$sex$ = FAT_MODE_PER_KG[sex][mode]) !== null && _FAT_MODE_PER_KG$sex$ !== void 0 ? _FAT_MODE_PER_KG$sex$ : FAT_MODE_PER_KG[sex].maintain);
  var fat = Math.round(w * fatPerKg);
  var floorKcal = protein * 4 + fat * 9;
  var carbs = Math.max(MIN_CARBS_G, Math.round((kcal - floorKcal) / 4));
  // The floors alone (+ minimum carbs) already cost more than the target asks for.
  var floorsExceedKcal = floorKcal + MIN_CARBS_G * 4 > kcal;
  return {
    protein: protein,
    carbs: carbs,
    fat: fat,
    lbm: Math.round(lbm),
    floorsExceedKcal: floorsExceedKcal
  };
};

// ── Activity / NEAT seed (energy-model Step 1) ────────────────────
// Seed TDEE from one coarse lifestyle question (seed → calibrate; ENERGY_MODEL.md §3).
// These are NEAT-ONLY multipliers — deliberately below the textbook whole-day factors
// (1.375–1.725) because logged workouts are added separately as "earn to eat"; a
// whole-day factor would double-count training. Sedentary == 1.20 == the old flat
// baseline, so existing/unset users and the BMR×1.2 maintenance floor are unchanged.
// Values locked against the believability gate (ENERGY_MODEL.md §4); the exact numbers
// are owned here + mirrored in __tests__/logic.test.js.
var ACTIVITY = {
  sedentary: {
    mult: 1.20,
    label: "Sedentary",
    hint: "Mostly seated — desk job, under ~5k steps"
  },
  light: {
    mult: 1.35,
    label: "Lightly active",
    hint: "Some walking on your feet, ~5–8k steps"
  },
  active: {
    mult: 1.45,
    label: "Active",
    hint: "On your feet often, ~8–12k steps"
  },
  very: {
    mult: 1.55,
    label: "Very active",
    hint: "Manual/physical job, ~12k+ steps"
  }
};
var ACTIVITY_ORDER = ["sedentary", "light", "active", "very"];
var activityMult = function activityMult(p) {
  return p && ACTIVITY[p.activity] ? ACTIVITY[p.activity].mult : ACTIVITY.sedentary.mult;
};
var bmrOf = function bmrOf(p) {
  return Math.round(370 + 21.6 * ((Number(p.weight) || 80) * (1 - (Number(p.bodyFat) || 18) / 100)));
};
// Day-one seed estimate; the adaptive tdeeAdj becomes the source of truth over time.
var seedTDEE = function seedTDEE(p) {
  return Math.round(bmrOf(p) * activityMult(p));
};
// Absolute MAINTAIN floor — nobody's true maintenance sits below sedentary energy use,
// so the adaptive auto-lowering can never drag maintenance there even for a user who
// seeded a higher activity level (adaptive may calibrate that seed DOWN to sedentary,
// never below). Stays BMR×1.2 regardless of the seed.
var sedentaryFloorOf = function sedentaryFloorOf(p) {
  return Math.round(bmrOf(p) * 1.2);
};

// ── Smoothed earn-to-eat (energy-model Step 3) ────────────────────
// A logged workout no longer unlocks its full energy the same day. Its kcal are
// spread FORWARD across a 3-day window as an ENERGY-CONSERVING weighted average
// (weights sum to 1 — total training energy is unchanged, only un-spiked). This
// protects the deficit from a same-day binge, still fuels the day AFTER a hard
// session, and averages back-to-back days instead of stacking them. Front-loaded
// [today, −1d, −2d] so today's own session still visibly nudges today. See
// ENERGY_MODEL.md §5 Step 3 + features/energy-safety/07; mirrored in logic.test.js.
var SMOOTH_WEIGHTS = [0.5, 0.3, 0.2];
// kcalByOffset[0] = today's workout kcal, [1] = yesterday's, [2] = 2 days ago.
var smoothWorkoutKcal = function smoothWorkoutKcal(kcalByOffset) {
  return Math.round(SMOOTH_WEIGHTS.reduce(function (s, w, i) {
    return s + w * (kcalByOffset[i] || 0);
  }, 0));
};

// ── Energy floor + low-fuel warning (energy-model Step 4) ─────────
// features/energy-safety/01. Two DIFFERENT protections, deliberately separated —
// the draft spec conflated them into one EA-30 floor, which doesn't survive the
// numbers (see ENERGY_MODEL.md §5 Step 4):
//
//  1. MOVES THE TARGET — rate of loss. A preset target never takes more than
//     MAX_DEFICIT_FRAC off believable maintenance (+ today's applied training
//     bonus, so the Step-3 smoothing isn't undone). This scales with body size,
//     which is what the flat SAFE_MIN never did: a 98.5 kg body floors ~1,673,
//     a 60 kg body ~1,208. SAFE_MIN survives only as the absolute backstop.
//  2. WARNING ONLY — energy availability. EA = (intake − today's training burn)
//     / fat-free mass; below EA_HARD the RED-S literature (Loucks & Thuma 2003;
//     IOC consensus, Mountjoy et al.) documents endocrine/recovery harm. Those
//     thresholds were derived in LEAN athletes, who have no large fat store to
//     cover the gap — applied to a 30%-body-fat dieter EA-30 sits ABOVE a normal
//     cut target and would forbid weight loss entirely. So EA never moves the
//     target; it warns, and only for lean bodies on days they actually trained.
//     That keeps it rare AND true, and keeps a persistent "you're under-eating"
//     banner off a calorie tracker (ED-safety guardrail).
//
// EA_OK (45) is deliberately NOT implemented as a band: our multipliers are
// NEAT-only (max 1.55) with training added separately and subtracted back out of
// EA, so 45 kcal/kg FFM is unreachable by construction — a band nothing can
// satisfy is wallpaper, not safety.
var EA_HARD = 30; // kcal per kg fat-free mass per day
var MAX_DEFICIT_FRAC = 0.25; // a preset target never sits >25% below maintenance
// Where the EA thresholds' source population starts. App policy informed by the
// standard athletic/fitness body-fat ranges — not a clinical cut-off, and only
// ever used to decide whether to SHOW a warning.
var LEAN_BF = {
  male: 15,
  female: 23
};
var ffmOf = function ffmOf(p) {
  return (Number(p.weight) || 80) * (1 - (Number(p.bodyFat) || 18) / 100);
};
var bodyFatSet = function bodyFatSet(p) {
  var bf = Number(p && p.bodyFat);
  return bf > 0 && bf < 100;
};
var isLeanBody = function isLeanBody(p) {
  return bodyFatSet(p) && Number(p.bodyFat) <= LEAN_BF[p.sex === "female" ? "female" : "male"];
};

// The steady-loss floor: 75% of the energy the day is actually built on.
var deficitFloorOf = function deficitFloorOf(effTDEE) {
  var appliedBonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round((1 - MAX_DEFICIT_FRAC) * (effTDEE + (appliedBonus || 0)));
};

// EA uses TODAY'S RAW burn (what the body actually spent), not the smoothed bonus
// the target was built from — the question is what's left over today.
var energyAvailability = function energyAvailability(kcal, rawBurnKcal, p) {
  return bodyFatSet(p) ? Math.round((kcal - (rawBurnKcal || 0)) / ffmOf(p) * 10) / 10 : null;
};
var calcTargets = function calcTargets(p, mode) {
  var totalWorkoutKcal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var tdeeAdj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var rawBurnKcal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var sex = p.sex || "male";
  var bmr = bmrOf(p);
  // Seed TDEE from the lifestyle NEAT multiplier (was a flat ×1.2). The adaptive
  // tdeeAdj then calibrates this estimate; a large negative adjustment (the
  // auto-lowering) must never drag MAINTENANCE below sedentary (see sedentaryFloorOf),
  // which previously produced a sub-resting, physiologically-impossible maintain target.
  // A deliberate cut is a chosen deficit bounded separately (SAFE_MIN today, the
  // energy-availability floor later), so the floor is MAINTAIN-ONLY.
  var seed = Math.round(bmr * activityMult(p));
  var sedentaryTDEE = Math.round(bmr * 1.2);
  var tdee = seed + tdeeAdj;
  var kcal = tdee + MODES[mode].adj + (totalWorkoutKcal || 0);
  var bmrFloorApplied = mode === "maintain" && kcal < sedentaryTDEE;
  if (bmrFloorApplied) kcal = sedentaryTDEE;
  // Steady-loss floor (Step 4). Measured against BELIEVABLE maintenance — the same
  // floored effective TDEE the rest of the app trusts — so a negative adaptive
  // adjustment can't quietly deepen the real deficit past the cap.
  var effTDEE = Math.max(sedentaryTDEE, tdee);
  var deficitFloor = deficitFloorOf(effTDEE, totalWorkoutKcal);
  var deficitFloorApplied = kcal < deficitFloor;
  if (deficitFloorApplied) kcal = deficitFloor;
  var safeMin = SAFE_MIN[sex] || 1400;
  var safeMinApplied = kcal < safeMin;
  if (safeMinApplied) kcal = safeMin;
  var m = computeMacros(p, mode, kcal);
  // Low-fuel signal: warning only — it never changes the target (see the block above).
  var ea = energyAvailability(kcal, rawBurnKcal, p);
  var lowFuel = ea != null && isLeanBody(p) && (rawBurnKcal || 0) > 0 && ea < EA_HARD;
  return {
    kcal: kcal,
    protein: m.protein,
    carbs: m.carbs,
    fat: m.fat,
    tdee: tdee,
    bmr: bmr,
    lbm: m.lbm,
    bonus: totalWorkoutKcal || 0,
    safeMinApplied: safeMinApplied,
    bmrFloorApplied: bmrFloorApplied,
    deficitFloorApplied: deficitFloorApplied,
    deficitFloor: deficitFloor,
    ea: ea,
    lowFuel: lowFuel,
    bodyFatUnset: !bodyFatSet(p),
    floorsExceedKcal: m.floorsExceedKcal
  };
};

// ── Coach pacing (feature #6) ────────────────────────────────────
// Pace is COMPUTED here and handed to the LLM as a verdict — the model never
// judges "behind" itself (that misfires early in the day). Safeguards baked in:
//   • the eating window STARTS at today's first logged meal, not a wall clock,
//     so fasting / 16:8 / Ramadan users are never falsely told they're behind;
//   • callers pace only FLOOR goals (protein, water) — never the calorie ceiling,
//     where being under is success, not a failure to fix;
//   • "behind" is never used until >25% of the window has elapsed.
var EATING_WINDOW_H = 14; // a typical waking eating span measured from the first meal

var paceVerdict = function paceVerdict(firstMealHour, nowHour, frac) {
  if (firstMealHour == null) return {
    elapsed: 0,
    verdict: "ahead"
  }; // nothing eaten yet → window not started
  var elapsed = (nowHour - firstMealHour) / EATING_WINDOW_H;
  elapsed = Math.max(0, Math.min(1, elapsed));
  if (frac >= 1) return {
    elapsed: elapsed,
    verdict: "met"
  };
  if (elapsed < 0.25) return {
    elapsed: elapsed,
    verdict: "ahead"
  }; // day is just getting going
  if (frac >= elapsed) return {
    elapsed: elapsed,
    verdict: "ahead"
  };
  if (frac >= elapsed - 0.15) return {
    elapsed: elapsed,
    verdict: "on"
  };
  return {
    elapsed: elapsed,
    verdict: "behind"
  };
};

// ── Adaptive TDEE ─────────────────────────────────────────────

var dateKey = function dateKey(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
var weighRollingAvg = function weighRollingAvg(weighIns, beforeDate) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
  var subset = weighIns.filter(function (w) {
    return w.date < beforeDate;
  }).slice(-n);
  if (subset.length < 3) return null;
  return subset.reduce(function (a, w) {
    return a + w.weight;
  }, 0) / subset.length;
};

// Adaptive-TDEE convergence (energy-model Step 2). The estimate error (in kcal/day) is
// measured from the gap between actual and expected weight change, then applied as a
// DAMPED, per-run-capped step so it converges without lurching. Two structural fixes over
// the old flat ±150 integrator (which slammed to the ±600 cap and pinned there for ~10
// days before settling — a lag-induced overshoot):
//   • Dead-time compensation: the 7-day trailing weight window can't yet reflect an
//     adjustment made in the last 7 days, so we SUBTRACT that in-flight adjustment from
//     the measured error — otherwise the integrator re-counts a correction already working
//     its way through and overshoots.
//   • Confidence-scaled step cap: sparser data (low confidence) moves cautiously; a
//     well-established history is allowed larger steps, so a real 500 kcal gap closes in
//     ~3 weeks (simulated) yet never lurches.
// The accumulated adjustment is still bounded by ADJ_CAP (±600, feature-04 policy) and the
// maintenance BMR×1.2 floor at the target layer. Engages at 6 weigh-ins (was 8).
var CAL_MIN_WEIGHINS = 6;
var CAL_GAIN = 0.8; // proportional gain toward the measured error
var CAL_STEP_CAP = {
  low: 100,
  medium: 150,
  high: 200
}; // per-run cap by confidence tier
var CAL_STEP_ROUND = 25; // step granularity (kcal)
var CAL_MIN_STEP = 25; // ignore sub-25 nudges (applied at the call site)
var ADJ_CAP = 600; // accumulated adjustment limit (feature 04)

var runCalibration = function runCalibration(history, weighIns, baseTDEE) {
  var inFlightAdj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (weighIns.length < CAL_MIN_WEIGHINS) return null;
  var today = new Date();
  var weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  var weekAgoKey = dateKey(weekAgo);
  var recentAvg = weighRollingAvg(weighIns, dateKey(new Date(today.getTime() + 86400000)), 7);
  var olderAvg = weighRollingAvg(weighIns, weekAgoKey, 7);
  if (!recentAvg || !olderAvg) return null;
  var actualChange = recentAvg - olderAvg;
  var recentHist = history.filter(function (d) {
    return d.date >= weekAgoKey && d.kcal > 0;
  });
  if (recentHist.length < 4) return null;

  // Coach safeguard: AI-estimated days are softer evidence than weighed/typed
  // ones. Weight each day's intake by its confidence and drop near-guess days
  // (<50%) so a biased AI estimate can't silently retrain TDEE. Days whose logs
  // we can't inspect default to full confidence (legacy snapshots / no `conf`).
  var trusted = recentHist.map(function (d) {
    return {
      kcal: d.kcal,
      w: (d.logs ? intakeConfidence(d.logs) : 100) / 100
    };
  }).filter(function (x) {
    return x.w >= 0.5;
  });
  if (trusted.length < 4) return null;
  var wSum = trusted.reduce(function (a, x) {
    return a + x.w;
  }, 0);
  var avgKcal = trusted.reduce(function (a, x) {
    return a + x.kcal * x.w;
  }, 0) / wSum;
  var avgDeficit = baseTDEE - avgKcal;
  var expectedChange = -(avgDeficit * 7) / 7700;
  var discrepancy = actualChange - expectedChange;
  var errKcal = -discrepancy * 7700 / 7; // signed estimate error, kcal/day
  var effErr = errKcal - inFlightAdj; // dead-time compensation
  var confidence = weighIns.length >= 28 ? "high" : weighIns.length >= 14 ? "medium" : "low";
  var cap = CAL_STEP_CAP[confidence];
  var rawAdj = Math.max(-cap, Math.min(cap, Math.round(CAL_GAIN * effErr / CAL_STEP_ROUND) * CAL_STEP_ROUND));

  // ── THE ASYMMETRY (features/energy-safety/04) ──
  // The loop above is symmetric: it lowers the estimate for a disappointing scale
  // exactly as readily as it raises it for a good one. Those two directions are not
  // equally safe. Guessing high costs some progress; guessing low walks a dieter toward
  // under-eating 25 kcal at a time while telling them it is correct — which is the
  // mechanism that started this workstream.
  //
  // So: the estimate is only ever LOWERED when the user was NOT cutting. A weight rise
  // (or a stall) while eating below maintenance has five innocent explanations — water
  // from stress or under-eating, glycogen, a full gut, salt, lean mass gained while
  // training — and none of them mean a lower burn. Eating AT or ABOVE maintenance and
  // still not losing is clean evidence, and there we act on it.
  //
  // This defers the correction, it doesn't discard it: an over-estimated maintenance
  // surfaces as a stall, file 03's stall check suggests a break, and a break is Maintain
  // — where this refusal lifts and the loop converges normally. Raising is NEVER damped.
  //
  // "Was I cutting" reads the DECLARED daily mode from the history snapshots, the same
  // signal file 02 uses, so it holds up for a patchy logger.
  var weekDays = history.filter(function (d) {
    return d.date >= weekAgoKey;
  });
  var wasCutting = weekDays.filter(function (d) {
    return d.mode === "cut";
  }).length > weekDays.length / 2;
  var refused = rawAdj < 0 && wasCutting;
  return {
    adj: refused ? 0 : rawAdj,
    refused: refused,
    wouldHaveBeen: rawAdj,
    confidence: confidence,
    actualChange: Math.round(actualChange * 10) / 10,
    expectedChange: Math.round(expectedChange * 10) / 10,
    avgKcal: Math.round(avgKcal)
  };
};

// ── Cut cycling (energy-model Step 5; features/energy-safety/02) ──────
// Nothing in the app capped how LONG a cut ran. A deficit from January to June with
// no structured break is the harm this whole workstream exists to prevent.
//
// The unit is a DEFICIT-WEIGHTED DAY ("cut load"), not a calendar day, and it is never
// read from food logs:
//   • WHETHER a day counts comes from the DECLARED daily mode (already stored per day
//     and synced) plus a weight-trend backstop. A log-derived counter goes quiet for
//     the patchy logger — who is exactly the user this protects. Days the app wasn't
//     opened inherit the last known mode; not logging never pauses the clock.
//   • HOW MUCH it counts is dayLoad = deficitFrac / REFERENCE_DEFICIT, where
//     deficitFrac = 1 − target ÷ believable maintenance. So a gentle cut runs much
//     longer before prompting a break and an aggressive one is cautioned sooner
//     (~24 / 12 / ~9.5 real weeks at a 10 / 20 / 25% deficit, bounded above by Step 4's
//     MAX_DEFICIT_FRAC). That IS the protection — which is why this file does NOT also
//     impose a short calendar default. See ENERGY_MODEL.md §5.2 for what was rejected.
//   • Load uses the PRESCRIBED deficit, not the achieved one: the target is known every
//     day without logging, and the error runs toward prompting a break EARLIER than
//     strictly earned, which is the right failure direction for a safety feature.
//
// Coach constraint, binding on all copy here: no day count may be presented as the
// point at which something happens to the body. There is no threshold at which
// testosterone falls or metabolism "breaks"; risk rises with severity × duration, and
// in people with obesity weight loss often IMPROVES testosterone. The card shows REAL
// elapsed weeks, never load — telling a 16-week gentle cutter "you've been cutting for
// 8 weeks" because that is their load would simply be false.
// Exact numbers mirrored in __tests__/logic.test.js.
var REFERENCE_DEFICIT = 0.20; // the deficit depth that counts as one full day
var CUT_MIN_FRAC = 0.05; // shallower than this is noise, not a cut
var CUT_BLOCK_SOFT_NUDGE = 56; // load-days → dismissable amber nudge
var CUT_BLOCK_HARD_PROMPT = 84; // load-days → non-dismissable prompt
var CUT_BLOCK_LEAN_SOFT = 42; // lean bodies are pulled earlier (Helms)
var CUT_BLOCK_LEAN_HARD = 56;
var BLOCK_LOSS_TRIGGER = 0.05; // 5% of bodyweight lost inside one block
var TREND_CUT_RATE = 0.0025; // ≥0.25%/wk of sustained loss reads as cutting
var CUT_NUDGE_SNOOZE_DAYS = 7; // soft nudge "Not yet"
var CUT_PROMPT_SNOOZE_DAYS = 3; // hard prompt "Remind me in 3 days"
var DIET_BREAK_DAYS = 14; // rest days that fully drain a block (file 03)
var CUT_BAR_MIN_LOAD = 7; // ~a week of real cutting before the gauge says anything
var STALL_WEEKS = 3; // weeks of a flat scale that read as stalled
var RECHARGED_CARD_DAYS = 3; // the "Recharged" card retires itself after this

// One day's contribution. Returns 0 for anything shallower than CUT_MIN_FRAC so a
// rounding-error "deficit" can't accrue in slow motion.
var dayCutLoad = function dayCutLoad(targetKcal, maintenanceKcal) {
  if (!maintenanceKcal || maintenanceKcal <= 0) return 0;
  var frac = 1 - targetKcal / maintenanceKcal;
  if (frac < CUT_MIN_FRAC) return 0;
  return Math.round(frac / REFERENCE_DEFICIT * 100) / 100;
};

// Lean bodies have less to give, so both thresholds move earlier. Reuses Step 4's
// isLeanBody — deliberately NOT a second leanness threshold.
var cutThresholds = function cutThresholds(p) {
  return isLeanBody(p) ? {
    soft: CUT_BLOCK_LEAN_SOFT,
    hard: CUT_BLOCK_LEAN_HARD
  } : {
    soft: CUT_BLOCK_SOFT_NUDGE,
    hard: CUT_BLOCK_HARD_PROMPT
  };
};

// Weight-trend backstop: fraction of bodyweight lost PER WEEK, measured between two
// 7-day rolling averages `spanDays` apart — the same averages the adaptive TDEE uses.
// At the default 7-day span this catches switching to "Maintain" to silence the prompts
// while still under-eating. Over a longer span it is the stall check (file 03): three
// weeks is long enough that a fortnight of water retention can't masquerade as a stall.
// null when there aren't enough weigh-ins — silence beats a confident wrong reading.
var trendLossFrac = function trendLossFrac(weighIns, todayK) {
  var spanDays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
  var t = new Date(todayK + "T12:00:00");
  var recent = weighRollingAvg(weighIns, dateKey(new Date(t.getTime() + 86400000)), 7);
  var older = weighRollingAvg(weighIns, dateKey(new Date(t.getTime() - spanDays * 86400000)), 7);
  if (!recent || !older || older <= 0) return null;
  return (older - recent) / older * (7 / spanDays);
};
var weeklyLossFrac = function weeklyLossFrac(weighIns, todayK) {
  return trendLossFrac(weighIns, todayK, 7);
};

// Weight up while eating below maintenance (features/energy-safety/04). Derived every
// render rather than stored as an event: the explanation should be on screen whenever the
// situation is real, not only in the moments after a weigh-in. Two weeks rather than one,
// because a single week of water is exactly the noise this is here to explain away.
var gainWhileCutting = function gainWhileCutting(_ref) {
  var weighIns = _ref.weighIns,
    todayK = _ref.todayK,
    cutting = _ref.cutting;
  if (!cutting) return false;
  var rate = trendLossFrac(weighIns, todayK, 14);
  return rate != null && rate < 0; // a negative loss rate is a gain
};
var EMPTY_CUT_BLOCK = {
  start: null,
  load: 0,
  startWeight: null,
  offRun: 0,
  breakLoad: 0,
  lastAccrued: null,
  lastBreakEnd: null,
  rechargedOn: null,
  nudgeAt: null,
  snoozeAt: null
};

// Advance the block by ONE day. Pure, and idempotent at the call site via lastAccrued,
// so re-opening the app can't double-count. `day.cutting` already folds in the mode and
// the trend backstop; `day.load` is 0 on a day that doesn't qualify.
//
// THE DRAIN (file 03). A break is simply not cutting — there is no break state to enter
// or fail. Every non-cut day pays down the open block PRO RATA: DIET_BREAK_DAYS of rest
// clear it whatever its size, seven days clear half, three days leave a real dent that
// stands. The rate is fixed from the load the block held when THIS off-stretch began
// (`breakLoad`), which is what makes a partial break worth exactly its length. Maintain
// and Bulk drain identically — it's the days not in cut that count, and no surplus
// multiplier exists that we could defend.
var stepCutBlock = function stepCutBlock(block, day) {
  var b = _objectSpread(_objectSpread({}, block), {}, {
    lastAccrued: day.date
  });
  if (day.cutting && day.load > 0) {
    if (!b.start) {
      var _day$weight;
      b.start = day.date;
      b.load = 0;
      b.startWeight = (_day$weight = day.weight) !== null && _day$weight !== void 0 ? _day$weight : null;
    }
    if (b.startWeight == null && day.weight != null) b.startWeight = day.weight;
    b.load = Math.round((b.load + day.load) * 100) / 100;
    b.offRun = 0;
    b.breakLoad = 0; // the break is over; the next one re-reads the load as it stands then
    return b;
  }
  // Not cutting today. A sub-CUT_MIN_FRAC "deficit" lands here too — it is maintenance in
  // all but name. Remaining load is computed from the ORIGINAL breakLoad rather than by
  // repeated subtraction, so fourteen rest days land exactly on zero at any block size.
  b.offRun = (b.offRun || 0) + 1;
  if (b.start) {
    // First rest day sets the rate. A block stored by a pre-drain build arrives mid-run
    // with no breakLoad, so it starts its break cleanly from today rather than guessing.
    if (b.offRun === 1 || !b.breakLoad) {
      b.breakLoad = b.load;
      b.offRun = 1;
    }
    var left = 1 - b.offRun / DIET_BREAK_DAYS;
    b.load = left <= 0 ? 0 : Math.round(b.breakLoad * left * 100) / 100;
    if (b.load <= 0) {
      // Fully recharged: the block closes, and the one celebration card is armed. Nothing
      // changes mode — the app never resumes a cut on the user's behalf. A block too small
      // to have been worth mentioning gets no celebration either: congratulating someone for
      // recovering from two days of cutting is the app talking to hear itself.
      var worthSaying = b.breakLoad >= CUT_BAR_MIN_LOAD;
      b.start = null;
      b.load = 0;
      b.startWeight = null;
      b.breakLoad = 0;
      b.offRun = 0;
      b.lastBreakEnd = day.date;
      if (worthSaying) b.rechargedOn = day.date;
      b.nudgeAt = null;
      b.snoozeAt = null;
    }
  }
  return b;
};

// Catch up from lastAccrued to today. Gap days INHERIT today's cutting/load — the whole
// point is that closing the app doesn't stop the clock. Capped so a year-dormant install
// doesn't spin.
var accrueCutBlock = function accrueCutBlock(block, todayK, day) {
  var b0 = block || EMPTY_CUT_BLOCK;
  if (b0.lastAccrued === todayK) return b0;
  var today = new Date(todayK + "T12:00:00");
  var days = [];
  if (b0.lastAccrued) {
    var from = new Date(b0.lastAccrued + "T12:00:00");
    for (var d = new Date(from.getTime() + 86400000); d <= today; d = new Date(d.getTime() + 86400000)) days.push(dateKey(d));
  } else days.push(todayK);
  return days.slice(-370).reduce(function (b, date) {
    return stepCutBlock(b, _objectSpread(_objectSpread({}, day), {}, {
      date: date
    }));
  }, b0);
};
var daysBetween = function daysBetween(fromK, toK) {
  return Math.max(0, Math.round((new Date(toK + "T12:00:00") - new Date(fromK + "T12:00:00")) / 86400000));
};

// Which prompt (if any) to show. Returns REAL elapsed weeks, never load — see the copy
// constraint above. `lossFrac` is loss since the block started, for BLOCK_LOSS_TRIGGER.
//
// THE STALL (file 03). A third route into the soft nudge, and the honest one: cutting for
// STALL_WEEKS with the scale refusing to move means adherence has drifted, the body has
// compensated, or water is masking the loss — and in every one of those "cut harder" is
// the wrong answer while a spell at maintenance is the fix. `stallRate` is the per-week
// loss over that longer span; null (not enough weigh-ins) says nothing rather than
// guessing. Calendar time alone never triggers this — a gentle cut that IS working stays
// unbothered however long it runs.
var cutPromptFor = function cutPromptFor(_ref2) {
  var block = _ref2.block,
    profile = _ref2.profile,
    todayK = _ref2.todayK,
    _ref2$lossFrac = _ref2.lossFrac,
    lossFrac = _ref2$lossFrac === void 0 ? null : _ref2$lossFrac,
    _ref2$stallRate = _ref2.stallRate,
    stallRate = _ref2$stallRate === void 0 ? null : _ref2$stallRate,
    _ref2$cutting = _ref2.cutting,
    cutting = _ref2$cutting === void 0 ? false : _ref2$cutting,
    _ref2$now = _ref2.now,
    now = _ref2$now === void 0 ? Date.now() : _ref2$now;
  if (!block || !block.start) return null;
  var th = cutThresholds(profile || {});
  var bigLoss = lossFrac != null && lossFrac >= BLOCK_LOSS_TRIGGER;
  var stalled = cutting && stallRate != null && stallRate < TREND_CUT_RATE && daysBetween(block.start, todayK) >= STALL_WEEKS * 7;
  var level = block.load >= th.hard || bigLoss ? "hard" : block.load >= th.soft || stalled ? "soft" : null;
  if (!level) return null;
  var snoozedFor = level === "hard" ? block.snoozeAt ? now - block.snoozeAt < CUT_PROMPT_SNOOZE_DAYS * 86400000 : false : block.nudgeAt ? now - block.nudgeAt < CUT_NUDGE_SNOOZE_DAYS * 86400000 : false;
  if (snoozedFor) return null;
  return {
    level: level,
    bigLoss: bigLoss,
    // Only claim a stall on the card that can say it kindly; the hard prompt outranks it.
    stalled: stalled && level === "soft" && block.load < th.soft,
    weeks: Math.max(1, Math.round(daysBetween(block.start, todayK) / 7))
  };
};

// ── The break gauge (energy Step 5; features/energy-safety/03) ────────
// One number read in two directions: the same cut load fills while cutting and drains
// while not. The bar shows whenever there is something to show — always inside an open
// block, never once the block is closed and nothing is owed. A months-long bulk with a
// clean slate shows nothing at all.
//
// CUT_BAR_MIN_LOAD decides whether any of this is worth mentioning yet, and it matters
// more than it looks. Cut is the DEFAULT mode, so merely opening the app for a day accrues
// load and opens a block — and the drain is pro rata, so a one-day block would spend a
// fortnight announcing "about 14 days to fully recharged" over a single day of cutting.
// Nonsense to read, and it spends the user's trust on nothing. The counter still runs from
// day one (that is the protection); only the TALKING waits for about a week of cutting.
//
// The two directions ask about different numbers, deliberately. While filling, the bar
// appears once your CURRENT load reaches the minimum. While draining, it stays up as long
// as the load was above the minimum when the break BEGAN — otherwise the bar would vanish
// just as you were about to finish, which is the worst possible moment to lose it.
var cutBarFor = function cutBarFor(_ref3) {
  var block = _ref3.block,
    profile = _ref3.profile,
    todayK = _ref3.todayK,
    _ref3$cutting = _ref3.cutting,
    cutting = _ref3$cutting === void 0 ? false : _ref3$cutting,
    _ref3$weightUp = _ref3.weightUp,
    weightUp = _ref3$weightUp === void 0 ? false : _ref3$weightUp;
  if (!block || !block.start || block.load <= 0) return null;
  if (cutting ? block.load < CUT_BAR_MIN_LOAD : (block.breakLoad || block.load) < CUT_BAR_MIN_LOAD) return null;
  var th = cutThresholds(profile || {});
  var pct = Math.max(0, Math.min(100, Math.round(block.load / th.soft * 100)));
  if (cutting) return {
    draining: false,
    pct: pct,
    weeks: Math.max(1, Math.round(daysBetween(block.start, todayK) / 7))
  };
  // Draining. The rest-day count is 0 on the day the break is declared, because today
  // already accrued as a cut day — saying "day 1" would be a day's worth of flattery.
  var restDays = block.offRun || 0;
  return {
    draining: true,
    pct: pct,
    restDays: restDays,
    weightUp: weightUp,
    daysLeft: Math.max(0, DIET_BREAK_DAYS - restDays)
  };
};

// The one guarded action: going back to Cut mid-break, and only where the app had
// actually advised the break (the block reached its soft-nudge threshold before it
// stopped). A short casual cut never meets friction, and Bulk is never guarded at all.
var cutGuardFor = function cutGuardFor(_ref4) {
  var block = _ref4.block,
    profile = _ref4.profile,
    _ref4$cutting = _ref4.cutting,
    cutting = _ref4$cutting === void 0 ? false : _ref4$cutting;
  if (!block || !block.start || cutting || block.load <= 0) return null;
  if ((block.breakLoad || 0) < cutThresholds(profile || {}).soft) return null;
  return {
    daysLeft: Math.max(1, DIET_BREAK_DAYS - (block.offRun || 0))
  };
};

// One dismissible card when the load reaches zero, which retires itself after
// RECHARGED_CARD_DAYS whether or not it is ever tapped. Then silence — nothing about
// breaks is shown again until there is a new block to talk about.
var rechargedCardDue = function rechargedCardDue(block, todayK) {
  return !!(block && block.rechargedOn && !block.start && daysBetween(block.rechargedOn, todayK) < RECHARGED_CARD_DAYS);
};

// ── Weigh-in engagement (energy Step 2 companion; features/energy-safety/06) ──
// Seed → calibrate only calibrates if the user weighs in, but the seed stands on its
// own — so we INVITE check-ins, never demand them. The cadence states intent; the
// nudge is one simple universal backstop (a week with no weigh-in). Calibration just
// uses whatever weigh-ins exist. Coach guardrails: default is a few-times-a-week (never
// "daily"); "I'd rather not" fully mutes; supportive, never shaming; no streaks.
var WEIGH_NUDGE_GAP_DAYS = 7; // a week with no weigh-in ⇒ a gentle nudge
var WEIGH_NUDGE_COOLDOWN_DAYS = 14; // silence for this long after a dismissal
var WEIGH_CADENCE = {
  few: {
    label: "A few times a week",
    hint: "Suggested — enough to fine-tune, easy to keep up"
  },
  daily: {
    label: "Daily",
    hint: "You like to track your weight day to day"
  },
  weekly: {
    label: "Weekly",
    hint: "A weekly check-in is plenty"
  },
  off: {
    label: "I'd rather not",
    hint: "We'll rely on your profile estimate — no reminders"
  }
};
var WEIGH_CADENCE_ORDER = ["few", "daily", "weekly", "off"]; // suggested option first
var weighCadenceOf = function weighCadenceOf(p) {
  return p && WEIGH_CADENCE[p.weighCadence] ? p.weighCadence : "few";
};
var daysBetweenTs = function daysBetweenTs(aTs, bTs) {
  return Math.floor((bTs - aTs) / 86400000);
};
// Pure: should the escalated check-in nudge show? `lastActivityTs` = the last weigh-in,
// or (if the user has never weighed) the first day they were active; null when there is
// no anchor yet (brand-new). Muted entirely when cadence is "off".
var shouldNudgeWeighIn = function shouldNudgeWeighIn(_ref5) {
  var cadence = _ref5.cadence,
    lastActivityTs = _ref5.lastActivityTs,
    dismissedTs = _ref5.dismissedTs,
    now = _ref5.now,
    _ref5$gapDays = _ref5.gapDays,
    gapDays = _ref5$gapDays === void 0 ? WEIGH_NUDGE_GAP_DAYS : _ref5$gapDays,
    _ref5$cooldownDays = _ref5.cooldownDays,
    cooldownDays = _ref5$cooldownDays === void 0 ? WEIGH_NUDGE_COOLDOWN_DAYS : _ref5$cooldownDays;
  if (cadence === "off") return false;
  if (lastActivityTs == null) return false;
  if (daysBetweenTs(lastActivityTs, now) < gapDays) return false;
  if (dismissedTs != null && daysBetweenTs(dismissedTs, now) < cooldownDays) return false;
  return true;
};
var sg = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(k) {
    var r, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return window.storage.get(k);
        case 1:
          r = _context.v;
          return _context.a(2, r ? r.value : null);
        case 2:
          _context.p = 2;
          _t = _context.v;
          return _context.a(2, null);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function sg(_x) {
    return _ref6.apply(this, arguments);
  };
}();
var ss = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(k, v) {
    var _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return window.storage.set(k, v);
        case 1:
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function ss(_x2, _x3) {
    return _ref7.apply(this, arguments);
  };
}();
var parseJwt = function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    return {};
  }
};

// Haptic confirmation for Create / Update / Delete actions (#4). Fire-and-forget:
// feature-detected, wrapped so an unsupported or throwing Vibration API (e.g. iOS
// Safari) can never block or break the action. Reads never call this.
// 35ms, not 12 — Pixel-class LRA motors barely register a sub-~30ms raw vibrate
// (the keyboard feels crisp because it uses Android's tuned haptic effect, not
// this raw on/off timer). Still a single short tick, not a sustained buzz.
var haptic = function haptic() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 35;
  try {
    navigator.vibrate && navigator.vibrate(ms);
  } catch (e) {}
};

// ── Supabase cloud sync ───────────────────────────────────────
var sb = function sb() {
  return window.supabaseClient;
};
var syncUpsert = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(table, rows, conflict) {
    var _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          if (!(!sb() || !(rows !== null && rows !== void 0 && rows.length))) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2);
        case 1:
          _context3.p = 1;
          _context3.n = 2;
          return sb().from(table).upsert(rows, {
            onConflict: conflict
          });
        case 2:
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 3]]);
  }));
  return function syncUpsert(_x4, _x5, _x6) {
    return _ref8.apply(this, arguments);
  };
}();
var syncFoodLogs = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(uid, date, logs) {
    var now, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          _context4.n = 2;
          return sb().from("food_logs")["delete"]().eq("user_id", uid).eq("date", date);
        case 2:
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
        case 4:
          if (logs.length) {
            _context4.n = 5;
            break;
          }
          return _context4.a(2);
        case 5:
          now = new Date().toISOString();
          _context4.n = 6;
          return syncUpsert("food_logs", logs.map(function (l) {
            return {
              user_id: uid,
              date: date,
              entry_id: l.id,
              name: l.name,
              kcal: l.kcal,
              protein: l.protein,
              carbs: l.carbs,
              fat: l.fat,
              conf: l.conf == null ? 100 : l.conf,
              elements: l.elements || null,
              time: l.time || null,
              updated_at: now
            };
          }), "user_id,entry_id");
        case 6:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 3]]);
  }));
  return function syncFoodLogs(_x7, _x8, _x9) {
    return _ref9.apply(this, arguments);
  };
}();
var syncWater = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(uid, date, glasses) {
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2);
        case 1:
          _context5.n = 2;
          return syncUpsert("water_logs", [{
            user_id: uid,
            date: date,
            glasses: glasses,
            updated_at: new Date().toISOString()
          }], "user_id,date");
        case 2:
          return _context5.a(2);
      }
    }, _callee5);
  }));
  return function syncWater(_x0, _x1, _x10) {
    return _ref0.apply(this, arguments);
  };
}();
var syncWorkouts = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(uid, date, ws) {
    var now, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2);
        case 1:
          _context6.p = 1;
          _context6.n = 2;
          return sb().from("workouts")["delete"]().eq("user_id", uid).eq("date", date);
        case 2:
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t5 = _context6.v;
        case 4:
          if (ws.length) {
            _context6.n = 5;
            break;
          }
          return _context6.a(2);
        case 5:
          now = new Date().toISOString();
          _context6.n = 6;
          return syncUpsert("workouts", ws.map(function (w) {
            return {
              user_id: uid,
              date: date,
              entry_id: w.id,
              type: w.type,
              duration: w.duration,
              intensity: w.intensity,
              kcal: w.kcal || 0,
              time: w.time || null,
              notes: w.notes || null,
              updated_at: now
            };
          }), "user_id,entry_id");
        case 6:
          return _context6.a(2);
      }
    }, _callee6, null, [[1, 3]]);
  }));
  return function syncWorkouts(_x11, _x12, _x13) {
    return _ref1.apply(this, arguments);
  };
}();
var syncProfile = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(uid, p) {
    var _t6;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !p)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2);
        case 1:
          _context7.p = 1;
          _context7.n = 2;
          return sb().from("profiles").upsert({
            id: uid,
            weight: p.weight,
            height: p.height,
            body_fat: p.bodyFat,
            sex: p.sex || null,
            activity: p.activity || null,
            updated_at: new Date().toISOString()
          });
        case 2:
          _context7.n = 4;
          break;
        case 3:
          _context7.p = 3;
          _t6 = _context7.v;
        case 4:
          return _context7.a(2);
      }
    }, _callee7, null, [[1, 3]]);
  }));
  return function syncProfile(_x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();

// Cut-cycling block state (energy Step 5). Deliberately NOT local-only like
// activity/weighCadence: block state is the one thing that has to remember a long cut,
// so a new device must not silently restart the clock at 0. Touches only its own four
// columns, leaving body metrics alone on conflict.
// `cut_break_load` carries the drain rate (file 03). It is what lets a second device
// resume a break at the right speed AND decide the early-return guard the same way this
// one would — the off-day count is re-derived from it on pull, so it needs no column.
var syncCutBlock = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(uid, b) {
    var _t7;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !b)) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          _context8.p = 1;
          _context8.n = 2;
          return sb().from("profiles").upsert({
            id: uid,
            cut_block_start: b.start || null,
            cut_block_load: b.load || 0,
            cut_break_load: b.breakLoad || 0,
            last_break_end: b.lastBreakEnd || null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: "id"
          });
        case 2:
          _context8.n = 4;
          break;
        case 3:
          _context8.p = 3;
          _t7 = _context8.v;
        case 4:
          return _context8.a(2);
      }
    }, _callee8, null, [[1, 3]]);
  }));
  return function syncCutBlock(_x16, _x17) {
    return _ref11.apply(this, arguments);
  };
}();

// Persist the compliance consent record onto the profiles row (R2/R6). Upsert
// touches only the consent columns, leaving body metrics untouched on conflict.
var syncConsent = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(uid, meta) {
    var _t8;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !meta)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2);
        case 1:
          _context9.p = 1;
          _context9.n = 2;
          return sb().from("profiles").upsert({
            id: uid,
            age_confirmed_at: meta.ageConfirmedAt ? new Date(meta.ageConfirmedAt).toISOString() : null,
            health_consent_at: meta.healthConsentAt ? new Date(meta.healthConsentAt).toISOString() : null,
            consent_policy_version: meta.policyVersion || null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: "id"
          });
        case 2:
          _context9.n = 4;
          break;
        case 3:
          _context9.p = 3;
          _t8 = _context9.v;
        case 4:
          return _context9.a(2);
      }
    }, _callee9, null, [[1, 3]]);
  }));
  return function syncConsent(_x18, _x19) {
    return _ref12.apply(this, arguments);
  };
}();

// Record consent withdrawal (R2 — withdrawal must be as easy as giving it).
var syncConsentWithdrawn = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(uid) {
    var _t9;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2);
        case 1:
          _context0.p = 1;
          _context0.n = 2;
          return sb().from("profiles").upsert({
            id: uid,
            health_consent_withdrawn_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: "id"
          });
        case 2:
          _context0.n = 4;
          break;
        case 3:
          _context0.p = 3;
          _t9 = _context0.v;
        case 4:
          return _context0.a(2);
      }
    }, _callee0, null, [[1, 3]]);
  }));
  return function syncConsentWithdrawn(_x20) {
    return _ref13.apply(this, arguments);
  };
}();
var syncWeighIns = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(uid, wis) {
    var now;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !(wis !== null && wis !== void 0 && wis.length))) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2);
        case 1:
          now = new Date().toISOString();
          _context1.n = 2;
          return syncUpsert("weigh_ins", wis.map(function (w) {
            return {
              user_id: uid,
              date: w.date,
              weight: w.weight,
              updated_at: now
            };
          }), "user_id,date");
        case 2:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return function syncWeighIns(_x21, _x22) {
    return _ref14.apply(this, arguments);
  };
}();
var syncSettings = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(uid, mode, tdeeAdj, customKcal, acked) {
    var _t0;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2);
        case 1:
          _context10.p = 1;
          _context10.n = 2;
          return sb().from("settings").upsert({
            id: uid,
            mode: mode || "cut",
            tdee_adj: tdeeAdj || 0,
            custom_kcal: customKcal || null,
            aggressive_cut_acked: !!acked,
            updated_at: new Date().toISOString()
          });
        case 2:
          _context10.n = 4;
          break;
        case 3:
          _context10.p = 3;
          _t0 = _context10.v;
        case 4:
          return _context10.a(2);
      }
    }, _callee10, null, [[1, 3]]);
  }));
  return function syncSettings(_x23, _x24, _x25, _x26, _x27) {
    return _ref15.apply(this, arguments);
  };
}();
var syncMeals = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(uid, meals) {
    var now;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2);
        case 1:
          now = new Date().toISOString();
          _context11.n = 2;
          return syncUpsert("meal_library", meals.map(function (m) {
            return {
              user_id: uid,
              name: m.name,
              kcal: m.kcal,
              protein: m.protein,
              carbs: m.carbs,
              fat: m.fat,
              updated_at: now
            };
          }), "user_id,name");
        case 2:
          return _context11.a(2);
      }
    }, _callee11);
  }));
  return function syncMeals(_x28, _x29) {
    return _ref16.apply(this, arguments);
  };
}();
var syncBadges = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(uid, keys) {
    var now;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !(keys !== null && keys !== void 0 && keys.length))) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2);
        case 1:
          now = new Date().toISOString();
          _context12.n = 2;
          return syncUpsert("badges", keys.map(function (badge_key) {
            return {
              user_id: uid,
              badge_key: badge_key,
              updated_at: now
            };
          }), "user_id,badge_key");
        case 2:
          return _context12.a(2);
      }
    }, _callee12);
  }));
  return function syncBadges(_x30, _x31) {
    return _ref17.apply(this, arguments);
  };
}();
var syncHistory = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(uid, hist) {
    var now;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !(hist !== null && hist !== void 0 && hist.length))) {
            _context13.n = 1;
            break;
          }
          return _context13.a(2);
        case 1:
          now = new Date().toISOString();
          _context13.n = 2;
          return syncUpsert("history_snapshots", hist.map(function (h) {
            return {
              user_id: uid,
              date: h.date,
              mode: h.mode,
              kcal: h.kcal,
              protein: h.protein,
              carbs: h.carbs,
              fat: h.fat,
              water: h.water || 0,
              training: h.training || false,
              updated_at: now
            };
          }), "user_id,date");
        case 2:
          return _context13.a(2);
      }
    }, _callee13);
  }));
  return function syncHistory(_x32, _x33) {
    return _ref18.apply(this, arguments);
  };
}();
var migrateLocalToSupabase = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(uid) {
    var migKey, pv, wiv, m, ta, ck, ak, mv, bv, hv, hist, _iterator2, _step2, _snap$logs, snap, i, key, v, _t1, _t10, _t11, _t12, _t13, _t14;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          migKey = "sync_migrated__" + uid;
          if (!localStorage.getItem(migKey)) {
            _context14.n = 1;
            break;
          }
          return _context14.a(2);
        case 1:
          _context14.p = 1;
          _context14.n = 2;
          return sg("profile");
        case 2:
          pv = _context14.v;
          if (!pv) {
            _context14.n = 3;
            break;
          }
          _context14.n = 3;
          return syncProfile(uid, JSON.parse(pv));
        case 3:
          _context14.n = 4;
          return sg("weighins");
        case 4:
          wiv = _context14.v;
          if (!wiv) {
            _context14.n = 5;
            break;
          }
          _context14.n = 5;
          return syncWeighIns(uid, JSON.parse(wiv));
        case 5:
          _context14.n = 6;
          return sg("mode__" + todayKey());
        case 6:
          _t1 = _context14.v;
          if (_t1) {
            _context14.n = 7;
            break;
          }
          _t1 = "cut";
        case 7:
          m = _t1;
          _t11 = parseInt;
          _context14.n = 8;
          return sg("tdee_adj");
        case 8:
          _t12 = _context14.v;
          if (_t12) {
            _context14.n = 9;
            break;
          }
          _t12 = "0";
        case 9:
          _t10 = _t11(_t12);
          if (_t10) {
            _context14.n = 10;
            break;
          }
          _t10 = 0;
        case 10:
          ta = _t10;
          _context14.n = 11;
          return sg("target_kcal");
        case 11:
          ck = _context14.v;
          _context14.n = 12;
          return sg("aggressive_cut_acked");
        case 12:
          ak = _context14.v;
          _context14.n = 13;
          return syncSettings(uid, m, ta, ck ? parseInt(ck) : null, !!ak);
        case 13:
          _context14.n = 14;
          return sg("meals");
        case 14:
          mv = _context14.v;
          if (!mv) {
            _context14.n = 15;
            break;
          }
          _context14.n = 15;
          return syncMeals(uid, JSON.parse(mv));
        case 15:
          _context14.n = 16;
          return sg("badges");
        case 16:
          bv = _context14.v;
          if (!bv) {
            _context14.n = 17;
            break;
          }
          _context14.n = 17;
          return syncBadges(uid, JSON.parse(bv));
        case 17:
          _context14.n = 18;
          return sg("history");
        case 18:
          hv = _context14.v;
          if (!hv) {
            _context14.n = 27;
            break;
          }
          hist = JSON.parse(hv);
          _context14.n = 19;
          return syncHistory(uid, hist);
        case 19:
          _iterator2 = _createForOfIteratorHelper(hist);
          _context14.p = 20;
          _iterator2.s();
        case 21:
          if ((_step2 = _iterator2.n()).done) {
            _context14.n = 24;
            break;
          }
          snap = _step2.value;
          if (!((_snap$logs = snap.logs) !== null && _snap$logs !== void 0 && _snap$logs.length)) {
            _context14.n = 22;
            break;
          }
          _context14.n = 22;
          return syncFoodLogs(uid, snap.date, snap.logs);
        case 22:
          if (!snap.water) {
            _context14.n = 23;
            break;
          }
          _context14.n = 23;
          return syncWater(uid, snap.date, snap.water);
        case 23:
          _context14.n = 21;
          break;
        case 24:
          _context14.n = 26;
          break;
        case 25:
          _context14.p = 25;
          _t13 = _context14.v;
          _iterator2.e(_t13);
        case 26:
          _context14.p = 26;
          _iterator2.f();
          return _context14.f(26);
        case 27:
          i = 0;
        case 28:
          if (!(i < localStorage.length)) {
            _context14.n = 30;
            break;
          }
          key = localStorage.key(i);
          if (!(key !== null && key !== void 0 && key.startsWith("workouts__"))) {
            _context14.n = 29;
            break;
          }
          v = localStorage.getItem(key);
          if (!v) {
            _context14.n = 29;
            break;
          }
          _context14.n = 29;
          return syncWorkouts(uid, key.replace("workouts__", ""), JSON.parse(v));
        case 29:
          i++;
          _context14.n = 28;
          break;
        case 30:
          localStorage.setItem(migKey, "1");
          _context14.n = 32;
          break;
        case 31:
          _context14.p = 31;
          _t14 = _context14.v;
        case 32:
          return _context14.a(2);
      }
    }, _callee14, null, [[20, 25, 26, 27], [1, 31]]);
  }));
  return function migrateLocalToSupabase(_x34) {
    return _ref19.apply(this, arguments);
  };
}();
var pullFromSupabase = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(uid) {
    var _weighR$data, _mealsR$data, _badgesR$data, _histR$data, _workR$data, _yield$Promise$all, _yield$Promise$all2, profR, weighR, settR, mealsR, badgesR, histR, foodR, waterR, workR, result, local, pv, p, localBlock, cv, load, breakLoad, offRun, block, wi, s, meals, keys, foodByDate, _iterator3, _step3, f, waterByDate, _iterator4, _step4, w, fullHist, _iterator5, _step5, snap, byDate, _iterator6, _step6, _w, _i, _Object$entries, _Object$entries$_i, d, ws, _t15, _t16, _t17, _t18;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2, {});
        case 1:
          _context15.p = 1;
          _context15.n = 2;
          return Promise.all([sb().from("profiles").select("*").eq("id", uid).maybeSingle(), sb().from("weigh_ins").select("*").eq("user_id", uid).order("date"), sb().from("settings").select("*").eq("id", uid).maybeSingle(), sb().from("meal_library").select("*").eq("user_id", uid), sb().from("badges").select("badge_key").eq("user_id", uid), sb().from("history_snapshots").select("*").eq("user_id", uid).order("date"), sb().from("food_logs").select("*").eq("user_id", uid).order("date"), sb().from("water_logs").select("*").eq("user_id", uid).order("date"), sb().from("workouts").select("*").eq("user_id", uid).order("date")]);
        case 2:
          _yield$Promise$all = _context15.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 9);
          profR = _yield$Promise$all2[0];
          weighR = _yield$Promise$all2[1];
          settR = _yield$Promise$all2[2];
          mealsR = _yield$Promise$all2[3];
          badgesR = _yield$Promise$all2[4];
          histR = _yield$Promise$all2[5];
          foodR = _yield$Promise$all2[6];
          waterR = _yield$Promise$all2[7];
          workR = _yield$Promise$all2[8];
          result = {};
          if (!profR.data) {
            _context15.n = 13;
            break;
          }
          // Preserve local-only profile fields the profiles table doesn't carry (weighCadence,
          // dietary config) so a cloud pull doesn't wipe them; the synced columns below stay
          // authoritative. `activity` now HAS a column, but an older row may still be null —
          // in that case keep the local pick rather than resetting the user to sedentary.
          local = {};
          _context15.p = 3;
          _context15.n = 4;
          return sg("profile");
        case 4:
          pv = _context15.v;
          if (pv) local = JSON.parse(pv);
          _context15.n = 6;
          break;
        case 5:
          _context15.p = 5;
          _t15 = _context15.v;
        case 6:
          p = _objectSpread(_objectSpread({}, local), {}, {
            weight: profR.data.weight,
            height: profR.data.height,
            bodyFat: profR.data.body_fat,
            sex: profR.data.sex,
            activity: profR.data.activity || local.activity || null
          });
          _context15.n = 7;
          return ss("profile", JSON.stringify(p));
        case 7:
          result.profile = p;
          // Cut-cycling block state. The local blob carries the working fields (accrual
          // cursor, dismissals); the cloud carries the four durable ones, so a new device
          // resumes an open cut instead of restarting it.
          localBlock = {};
          _context15.p = 8;
          _context15.n = 9;
          return sg("cut_block");
        case 9:
          cv = _context15.v;
          if (cv) localBlock = JSON.parse(cv);
          _context15.n = 11;
          break;
        case 10:
          _context15.p = 10;
          _t16 = _context15.v;
        case 11:
          if (!(profR.data.cut_block_start || profR.data.last_break_end)) {
            _context15.n = 13;
            break;
          }
          load = Number(profR.data.cut_block_load) || 0;
          breakLoad = Number(profR.data.cut_break_load) || 0; // Rest days are algebra, not a stored field: load = breakLoad × (1 − offRun/14),
          // so the count this device should resume from falls straight out of the two
          // synced numbers. Nothing to drift, and the guard reads the same on any phone.
          offRun = breakLoad > 0 ? Math.max(0, Math.min(DIET_BREAK_DAYS, Math.round(DIET_BREAK_DAYS * (1 - load / breakLoad)))) : 0;
          block = _objectSpread(_objectSpread(_objectSpread({}, EMPTY_CUT_BLOCK), localBlock), {}, {
            start: profR.data.cut_block_start || null,
            load: load,
            breakLoad: breakLoad,
            offRun: offRun,
            lastBreakEnd: profR.data.last_break_end || null
          });
          _context15.n = 12;
          return ss("cut_block", JSON.stringify(block));
        case 12:
          result.cutBlock = block;
        case 13:
          if (!((_weighR$data = weighR.data) !== null && _weighR$data !== void 0 && _weighR$data.length)) {
            _context15.n = 15;
            break;
          }
          wi = weighR.data.map(function (r) {
            return {
              date: r.date,
              weight: Number(r.weight)
            };
          });
          _context15.n = 14;
          return ss("weighins", JSON.stringify(wi));
        case 14:
          result.weighIns = wi;
        case 15:
          if (!settR.data) {
            _context15.n = 20;
            break;
          }
          s = settR.data;
          if (!s.mode) {
            _context15.n = 16;
            break;
          }
          _context15.n = 16;
          return ss("mode__" + todayKey(), s.mode);
        case 16:
          if (!(s.tdee_adj != null)) {
            _context15.n = 17;
            break;
          }
          _context15.n = 17;
          return ss("tdee_adj", String(s.tdee_adj));
        case 17:
          if (!(s.custom_kcal != null)) {
            _context15.n = 18;
            break;
          }
          _context15.n = 18;
          return ss("target_kcal", String(s.custom_kcal));
        case 18:
          if (!s.aggressive_cut_acked) {
            _context15.n = 19;
            break;
          }
          _context15.n = 19;
          return ss("aggressive_cut_acked", "1");
        case 19:
          result.settings = s;
        case 20:
          if (!((_mealsR$data = mealsR.data) !== null && _mealsR$data !== void 0 && _mealsR$data.length)) {
            _context15.n = 22;
            break;
          }
          meals = mealsR.data.map(function (m) {
            return {
              name: m.name,
              kcal: Number(m.kcal),
              protein: Number(m.protein),
              carbs: Number(m.carbs),
              fat: Number(m.fat)
            };
          });
          _context15.n = 21;
          return ss("meals", JSON.stringify(meals));
        case 21:
          result.meals = meals;
        case 22:
          if (!((_badgesR$data = badgesR.data) !== null && _badgesR$data !== void 0 && _badgesR$data.length)) {
            _context15.n = 24;
            break;
          }
          keys = badgesR.data.map(function (b) {
            return b.badge_key;
          });
          _context15.n = 23;
          return ss("badges", JSON.stringify(keys));
        case 23:
          result.badges = keys;
        case 24:
          foodByDate = {};
          if (foodR.data) {
            _iterator3 = _createForOfIteratorHelper(foodR.data);
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                f = _step3.value;
                if (!foodByDate[f.date]) foodByDate[f.date] = [];
                foodByDate[f.date].push({
                  id: f.entry_id,
                  name: f.name,
                  kcal: Number(f.kcal),
                  protein: Number(f.protein),
                  carbs: Number(f.carbs),
                  fat: Number(f.fat),
                  conf: f.conf == null ? 100 : Number(f.conf),
                  elements: f.elements || null,
                  time: f.time
                });
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
          waterByDate = {};
          if (waterR.data) {
            _iterator4 = _createForOfIteratorHelper(waterR.data);
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                w = _step4.value;
                waterByDate[w.date] = w.glasses;
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }
          if (!((_histR$data = histR.data) !== null && _histR$data !== void 0 && _histR$data.length)) {
            _context15.n = 34;
            break;
          }
          fullHist = histR.data.map(function (h) {
            var _ref21, _waterByDate$h$date;
            return {
              date: h.date,
              mode: h.mode,
              kcal: h.kcal,
              protein: h.protein,
              carbs: h.carbs,
              fat: h.fat,
              training: h.training,
              water: (_ref21 = (_waterByDate$h$date = waterByDate[h.date]) !== null && _waterByDate$h$date !== void 0 ? _waterByDate$h$date : h.water) !== null && _ref21 !== void 0 ? _ref21 : 0,
              logs: foodByDate[h.date] || []
            };
          });
          _context15.n = 25;
          return ss("history", JSON.stringify(fullHist));
        case 25:
          _iterator5 = _createForOfIteratorHelper(fullHist);
          _context15.p = 26;
          _iterator5.s();
        case 27:
          if ((_step5 = _iterator5.n()).done) {
            _context15.n = 30;
            break;
          }
          snap = _step5.value;
          _context15.n = 28;
          return ss("logs__" + snap.date, JSON.stringify(snap.logs || []));
        case 28:
          _context15.n = 29;
          return ss("water__" + snap.date, String(snap.water || 0));
        case 29:
          _context15.n = 27;
          break;
        case 30:
          _context15.n = 32;
          break;
        case 31:
          _context15.p = 31;
          _t17 = _context15.v;
          _iterator5.e(_t17);
        case 32:
          _context15.p = 32;
          _iterator5.f();
          return _context15.f(32);
        case 33:
          result.history = fullHist;
        case 34:
          if (!((_workR$data = workR.data) !== null && _workR$data !== void 0 && _workR$data.length)) {
            _context15.n = 38;
            break;
          }
          byDate = {};
          _iterator6 = _createForOfIteratorHelper(workR.data);
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              _w = _step6.value;
              if (!byDate[_w.date]) byDate[_w.date] = [];
              byDate[_w.date].push({
                id: _w.entry_id,
                type: _w.type,
                duration: _w.duration,
                intensity: _w.intensity,
                kcal: _w.kcal,
                time: _w.time,
                notes: _w.notes
              });
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
          _i = 0, _Object$entries = Object.entries(byDate);
        case 35:
          if (!(_i < _Object$entries.length)) {
            _context15.n = 37;
            break;
          }
          _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), d = _Object$entries$_i[0], ws = _Object$entries$_i[1];
          _context15.n = 36;
          return ss("workouts__" + d, JSON.stringify(ws));
        case 36:
          _i++;
          _context15.n = 35;
          break;
        case 37:
          result.workouts = byDate;
        case 38:
          return _context15.a(2, result);
        case 39:
          _context15.p = 39;
          _t18 = _context15.v;
          return _context15.a(2, {});
      }
    }, _callee15, null, [[26, 31, 32, 33], [8, 10], [3, 5], [1, 39]]);
  }));
  return function pullFromSupabase(_x35) {
    return _ref20.apply(this, arguments);
  };
}();

// ── Data migrations ───────────────────────────────────────────
// Bump SCHEMA_VERSION and add a migration block each time the stored
// data shape changes. runMigrations() is called once on startup.

var SCHEMA_VERSION = 1;
var runMigrations = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    var stored, v;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          _context16.n = 1;
          return sg("fuel_schema_v");
        case 1:
          stored = _context16.v;
          v = stored ? parseInt(stored) : 0;
          if (!(v >= SCHEMA_VERSION)) {
            _context16.n = 2;
            break;
          }
          return _context16.a(2);
        case 2:
          _context16.n = 3;
          return ss("fuel_schema_v", String(SCHEMA_VERSION));
        case 3:
          return _context16.a(2);
      }
    }, _callee16);
  }));
  return function runMigrations() {
    return _ref22.apply(this, arguments);
  };
}();

// Current Supabase access token (JWT) — the worker requires it to authorise AI calls.
var getAccessToken = /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
    var _data$session, client, _yield$client$auth$ge, data, _t19;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          _context17.p = 0;
          client = sb();
          if (client) {
            _context17.n = 1;
            break;
          }
          return _context17.a(2, null);
        case 1:
          _context17.n = 2;
          return client.auth.getSession();
        case 2:
          _yield$client$auth$ge = _context17.v;
          data = _yield$client$auth$ge.data;
          return _context17.a(2, (data === null || data === void 0 || (_data$session = data.session) === null || _data$session === void 0 ? void 0 : _data$session.access_token) || null);
        case 3:
          _context17.p = 3;
          _t19 = _context17.v;
          return _context17.a(2, null);
      }
    }, _callee17, null, [[0, 3]]);
  }));
  return function getAccessToken() {
    return _ref23.apply(this, arguments);
  };
}();

// Server-side voucher redemption (Phase A). Sends the code to the worker /redeem endpoint.
var redeemVoucher = /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(code) {
    var token, res, data;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          _context18.n = 1;
          return getAccessToken();
        case 1:
          token = _context18.v;
          if (token) {
            _context18.n = 2;
            break;
          }
          throw new Error("Please sign in to redeem a voucher.");
        case 2:
          _context18.n = 3;
          return fetch(AI_ENDPOINT + "/redeem", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              code: code.trim()
            })
          });
        case 3:
          res = _context18.v;
          if (res.ok) {
            _context18.n = 5;
            break;
          }
          _context18.n = 4;
          return res.json();
        case 4:
          data = _context18.v;
          throw new Error(data.error || "Voucher redemption failed.");
        case 5:
          _context18.n = 6;
          return res.json();
        case 6:
          return _context18.a(2, _context18.v);
      }
    }, _callee18);
  }));
  return function redeemVoucher(_x36) {
    return _ref24.apply(this, arguments);
  };
}();

// Account deletion (R5). The worker deletes the auth.users row with the service
// role, which cascades to every table. The client cannot do this itself.
var deleteAccountRequest = /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
    var token, res, msg, _t20, _t21;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          _context19.n = 1;
          return getAccessToken();
        case 1:
          token = _context19.v;
          if (token) {
            _context19.n = 2;
            break;
          }
          throw new Error("Please sign in again, then retry.");
        case 2:
          _context19.n = 3;
          return fetch(AI_ENDPOINT + "/delete-account", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          });
        case 3:
          res = _context19.v;
          if (res.ok) {
            _context19.n = 9;
            break;
          }
          msg = "Account deletion failed. Please try again or email fuellogadmin@gmail.com.";
          _context19.p = 4;
          _context19.n = 5;
          return res.json();
        case 5:
          _t20 = _context19.v.error;
          if (_t20) {
            _context19.n = 6;
            break;
          }
          _t20 = msg;
        case 6:
          msg = _t20;
          _context19.n = 8;
          break;
        case 7:
          _context19.p = 7;
          _t21 = _context19.v;
        case 8:
          throw new Error(msg);
        case 9:
          return _context19.a(2, true);
      }
    }, _callee19, null, [[4, 7]]);
  }));
  return function deleteAccountRequest() {
    return _ref25.apply(this, arguments);
  };
}();

// Shared AI fetch — returns the text content string, throws on failure.
// Sends the Supabase JWT; the hardened worker rejects anonymous/over-limit calls.
var callAI = /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(prompt) {
    var maxTokens,
      token,
      ctrl,
      timer,
      res,
      data,
      _args20 = arguments,
      _t22;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          maxTokens = _args20.length > 1 && _args20[1] !== undefined ? _args20[1] : 500;
          _context20.n = 1;
          return getAccessToken();
        case 1:
          token = _context20.v;
          if (token) {
            _context20.n = 2;
            break;
          }
          throw new Error("Please sign in to use AI features.");
        case 2:
          // Hard timeout so a stalled request (e.g. flaky mobile signal) can never hang
          // the UI forever — it aborts and surfaces as a clear, retryable error.
          ctrl = new AbortController();
          timer = setTimeout(function () {
            return ctrl.abort();
          }, 30000);
          _context20.p = 3;
          _context20.n = 4;
          return fetch(AI_ENDPOINT, {
            method: "POST",
            signal: ctrl.signal,
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: maxTokens,
              messages: [{
                role: "user",
                content: prompt
              }]
            })
          });
        case 4:
          res = _context20.v;
          _context20.n = 6;
          break;
        case 5:
          _context20.p = 5;
          _t22 = _context20.v;
          throw new Error(_t22.name === "AbortError" ? "AI request timed out — check your connection and try again." : "Couldn't reach the AI — check your connection.");
        case 6:
          _context20.p = 6;
          clearTimeout(timer);
          return _context20.f(6);
        case 7:
          if (res.ok) {
            _context20.n = 11;
            break;
          }
          if (!(res.status === 401)) {
            _context20.n = 8;
            break;
          }
          throw new Error("Your session expired — please sign in again.");
        case 8:
          if (!(res.status === 429)) {
            _context20.n = 9;
            break;
          }
          throw new Error("Daily AI limit reached — try again tomorrow.");
        case 9:
          if (!(res.status === 402 || res.status === 403)) {
            _context20.n = 10;
            break;
          }
          throw new Error("AI features require an active Premium account.");
        case 10:
          throw new Error("AI service is unavailable right now (" + res.status + ").");
        case 11:
          _context20.n = 12;
          return res.json();
        case 12:
          data = _context20.v;
          return _context20.a(2, (data.content || []).map(function (b) {
            return b.text || "";
          }).join("").trim());
      }
    }, _callee20, null, [[3, 5, 6, 7]]);
  }));
  return function callAI(_x37) {
    return _ref26.apply(this, arguments);
  };
}();
var repairJson = function repairJson(text) {
  var s = text.replace(/```json\s*|```/g, "").trim();
  // Extract outermost JSON object
  var start = s.indexOf('{'),
    end = s.lastIndexOf('}');
  if (start !== -1 && end !== -1) s = s.slice(start, end + 1);
  // Fix trailing decimal points: 450. -> 450
  s = s.replace(/(\d+)\.\s*([,\}\]\n\r])/g, '$1$2');
  // Remove JS-style // comments
  s = s.replace(/\/\/[^\n]*/g, '');
  // Remove trailing commas before } or ]
  s = s.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(s);
};
var callAIJson = /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(prompt) {
    var maxTokens,
      text,
      _args21 = arguments;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          maxTokens = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : 500;
          _context21.n = 1;
          return callAI(prompt, maxTokens);
        case 1:
          text = _context21.v;
          return _context21.a(2, repairJson(text));
      }
    }, _callee21);
  }));
  return function callAIJson(_x38) {
    return _ref27.apply(this, arguments);
  };
}();

// ── Error Boundary ────────────────────────────────────────────
var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  function ErrorBoundary(props) {
    var _this;
    _classCallCheck(this, ErrorBoundary);
    _this = _callSuper(this, ErrorBoundary, [props]);
    _this.state = {
      err: null
    };
    return _this;
  }
  _inherits(ErrorBoundary, _React$Component);
  return _createClass(ErrorBoundary, [{
    key: "render",
    value: function render() {
      if (this.state.err) return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: 24,
          color: "var(--over)",
          fontSize: 13,
          lineHeight: 1.6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 16,
          fontWeight: 900,
          marginBottom: 8
        }
      }, "\u26A0\uFE0F Render error"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "monospace",
          background: "var(--over-tint-2)",
          padding: 12,
          borderRadius: 8,
          wordBreak: "break-all"
        }
      }, this.state.err.message));
      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(e) {
      return {
        err: e
      };
    }
  }]);
}(React.Component); // ── Premium Modals ────────────────────────────────────────────
function PremiumModal(_ref28) {
  var feature = _ref28.feature,
    onUpgrade = _ref28.onUpgrade,
    onDismiss = _ref28.onDismiss;
  var emoji = feature ? feature.emoji : "⭐";
  var name = feature ? feature.name : "This feature";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1002,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "36px 28px",
      textAlign: "center",
      border: "1px solid ".concat(aA("44")),
      maxWidth: 300,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 64,
      marginBottom: 10
    }
  }, emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 6
    }
  }, "PREMIUM FEATURE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: "var(--text-hi)",
      marginBottom: 8
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-mid)",
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "AI features require a Premium account"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg)",
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 20,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      fontWeight: 800,
      letterSpacing: "0.1em",
      marginBottom: 10
    }
  }, "PREMIUM UNLOCKS"), [["🤖", "AI Meal Log — describe any meal"], ["🏋️", "Workout AI Parser — paste and analyse"], ["🧑‍💼", "Daily Coach — personalised tips"], ["☁️", "Cloud sync — log on any device"]].map(function (_ref29, i) {
    var _ref30 = _slicedToArray(_ref29, 2),
      e = _ref30[0],
      t = _ref30[1];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 10,
        marginBottom: 6,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        flexShrink: 0
      }
    }, e), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-mid-6)",
        lineHeight: 1.4
      }
    }, t));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      marginTop: 10,
      borderTop: "1px solid ".concat(BD),
      paddingTop: 10
    }
  }, "\xA34.99/month \xB7 \xA349.99/year \xB7 30-day free trial")), /*#__PURE__*/React.createElement("button", {
    onClick: onUpgrade,
    style: {
      width: "100%",
      padding: "14px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900,
      marginBottom: 10
    }
  }, "Start Free Trial \uD83D\uDE80"), /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    style: {
      width: "100%",
      padding: "10px",
      background: "none",
      color: "var(--text-label)",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Maybe Later")));
}
function SignInModal(_ref31) {
  var onSuccess = _ref31.onSuccess,
    onCancel = _ref31.onCancel;
  var devMode = !GOOGLE_CLIENT_ID;
  var _useState = useState(devMode ? "payment" : "google"),
    _useState2 = _slicedToArray(_useState, 2),
    step = _useState2[0],
    setStep = _useState2[1];
  var _useState3 = useState(devMode ? {
      name: "Guest",
      email: "",
      picture: ""
    } : null),
    _useState4 = _slicedToArray(_useState3, 2),
    gUser = _useState4[0],
    setGUser = _useState4[1];
  var _useState5 = useState(""),
    _useState6 = _slicedToArray(_useState5, 2),
    voucher = _useState6[0],
    setVoucher = _useState6[1];
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    vError = _useState8[0],
    setVError = _useState8[1];
  // Compliance gates (LEGAL_ROADMAP R6 + R2)
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    ageOK = _useState0[0],
    setAgeOK = _useState0[1]; // 18+ affirmation (before sign-in)
  var _useState1 = useState(false),
    _useState10 = _slicedToArray(_useState1, 2),
    consentOK = _useState10[0],
    setConsentOK = _useState10[1]; // explicit health-data consent (before first sync)
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    ageAt = _useState12[0],
    setAgeAt = _useState12[1]; // timestamp of the 18+ affirmation

  useEffect(function () {
    // Only render the Google button once the user has affirmed they are 18+.
    if (step !== "google" || devMode || typeof google === "undefined" || !ageOK) return;
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: function () {
          var _callback = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(resp) {
            var _yield$sb$auth$signIn, data, error, u, p, _t23;
            return _regenerator().w(function (_context22) {
              while (1) switch (_context22.p = _context22.n) {
                case 0:
                  _context22.p = 0;
                  _context22.n = 1;
                  return sb().auth.signInWithIdToken({
                    provider: "google",
                    token: resp.credential
                  });
                case 1:
                  _yield$sb$auth$signIn = _context22.v;
                  data = _yield$sb$auth$signIn.data;
                  error = _yield$sb$auth$signIn.error;
                  if (!error) {
                    _context22.n = 2;
                    break;
                  }
                  throw error;
                case 2:
                  u = data.session.user;
                  setGUser({
                    id: u.id,
                    name: u.user_metadata.full_name || "User",
                    email: u.email || "",
                    picture: u.user_metadata.avatar_url || ""
                  });
                  _context22.n = 4;
                  break;
                case 3:
                  _context22.p = 3;
                  _t23 = _context22.v;
                  p = parseJwt(resp.credential);
                  setGUser({
                    name: p.name || "User",
                    email: p.email || "",
                    picture: p.picture || ""
                  });
                case 4:
                  setStep("payment");
                case 5:
                  return _context22.a(2);
              }
            }, _callee22, null, [[0, 3]]);
          }));
          function callback(_x39) {
            return _callback.apply(this, arguments);
          }
          return callback;
        }(),
        auto_select: false,
        cancel_on_tap_outside: false
      });
      var el = document.getElementById("gsi-btn");
      if (el) google.accounts.id.renderButton(el, {
        theme: "outline",
        size: "large",
        width: 252,
        text: "continue_with"
      });
    } catch (e) {}
  }, [step, ageOK]); // eslint-disable-line

  // Consent record passed up to handleSignInSuccess and persisted to the profiles row.
  var consentMeta = function consentMeta() {
    return {
      ageConfirmedAt: ageAt || Date.now(),
      healthConsentAt: Date.now(),
      policyVersion: POLICY_VERSION
    };
  };
  var handleVoucher = /*#__PURE__*/function () {
    var _ref32 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      var _t24;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.p = _context23.n) {
          case 0:
            if (consentOK) {
              _context23.n = 1;
              break;
            }
            setVError("Please consent to health-data storage to continue.");
            return _context23.a(2);
          case 1:
            if (voucher.trim()) {
              _context23.n = 2;
              break;
            }
            setVError("Enter a voucher code.");
            return _context23.a(2);
          case 2:
            setVError("");
            _context23.p = 3;
            _context23.n = 4;
            return redeemVoucher(voucher);
          case 4:
            haptic();
            onSuccess(gUser || {
              name: "Guest",
              email: "",
              picture: ""
            }, "voucher", consentMeta());
            _context23.n = 6;
            break;
          case 5:
            _context23.p = 5;
            _t24 = _context23.v;
            setVError(_t24.message || "Redemption failed. Try again.");
          case 6:
            return _context23.a(2);
        }
      }, _callee23, null, [[3, 5]]);
    }));
    return function handleVoucher() {
      return _ref32.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "32px 24px",
      border: "1px solid ".concat(aA("33")),
      maxWidth: 300,
      width: "100%"
    }
  }, step === "google" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      textAlign: "center",
      marginBottom: 12
    }
  }, "\uD83D\uDD10"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: "var(--text-hi)",
      textAlign: "center",
      marginBottom: 6
    }
  }, "Sign in to continue"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-label)",
      textAlign: "center",
      lineHeight: 1.6,
      marginBottom: 18
    }
  }, "We use Google Sign In to protect your account. No separate password needed."), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      cursor: "pointer",
      background: "var(--bg)",
      border: "1px solid ".concat(ageOK ? aA("55") : BD),
      borderRadius: 10,
      padding: "11px 12px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: ageOK,
    onChange: function onChange(e) {
      setAgeOK(e.target.checked);
      if (e.target.checked && !ageAt) setAgeAt(Date.now());
    },
    style: {
      marginTop: 2,
      width: 16,
      height: 16,
      accentColor: A,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-hi-2)",
      lineHeight: 1.5
    }
  }, "I confirm I am ", /*#__PURE__*/React.createElement("strong", null, "18 or over"), ". Fuel Log is for adults in the UK\xA0and\xA0EEA. I agree to the ", /*#__PURE__*/React.createElement("a", {
    href: LEGAL.terms,
    target: "_blank",
    rel: "noopener",
    style: {
      color: A
    }
  }, "Terms"), " and", " ", /*#__PURE__*/React.createElement("a", {
    href: LEGAL.privacy,
    target: "_blank",
    rel: "noopener",
    style: {
      color: A
    }
  }, "Privacy\xA0Policy"), ".")), ageOK ? /*#__PURE__*/React.createElement("div", {
    id: "gsi-btn",
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 14
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 12,
      color: "var(--text-lo-2)",
      padding: "12px 0",
      marginBottom: 14
    }
  }, "Tick the box above to continue with Google."), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      width: "100%",
      padding: "10px",
      background: "none",
      color: "var(--text-label)",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel")), step === "payment" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 4
    }
  }, "\uD83D\uDC4B HI, ", (((gUser === null || gUser === void 0 ? void 0 : gUser.name) || "").split(" ")[0] || "THERE").toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: "var(--text-hi)",
      marginBottom: 14
    }
  }, "Start your free trial"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg)",
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 900,
      color: A
    }
  }, "30 days free"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-label)",
      marginTop: 3
    }
  }, "then \xA34.99/month or \xA349.99/year"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      marginTop: 6
    }
  }, "Cancel anytime before trial ends")), /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      width: "100%",
      padding: "14px",
      background: "var(--border)",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      color: "var(--text-label)",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 16,
      cursor: "not-allowed"
    }
  }, "Subscribe \u2014 Coming Soon"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      cursor: "pointer",
      background: "var(--bg)",
      border: "1px solid ".concat(consentOK ? aA("55") : BD),
      borderRadius: 10,
      padding: "11px 12px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: consentOK,
    onChange: function onChange(e) {
      setConsentOK(e.target.checked);
      setVError("");
    },
    style: {
      marginTop: 2,
      width: 16,
      height: 16,
      accentColor: A,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-hi-2)",
      lineHeight: 1.5
    }
  }, "I explicitly consent to Fuel Log storing my ", /*#__PURE__*/React.createElement("strong", null, "health data"), " (weight, body\xA0fat, sex, and any dietary\xA0requirements\xA0and\xA0allergies I enter) in the cloud to provide the service. Meal/workout text, body metrics and my dietary needs are sent to our AI provider ", /*#__PURE__*/React.createElement("strong", null, "without anything that identifies me"), ". See the", " ", /*#__PURE__*/React.createElement("a", {
    href: LEGAL.privacy,
    target: "_blank",
    rel: "noopener",
    style: {
      color: A
    }
  }, "Privacy\xA0Policy"), ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-mid)",
      textAlign: "center",
      marginBottom: 8
    }
  }, "Have an access code?"), /*#__PURE__*/React.createElement("input", {
    value: voucher,
    onChange: function onChange(e) {
      setVoucher(e.target.value);
      setVError("");
    },
    placeholder: "Enter code...",
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && handleVoucher();
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: "var(--bg)",
      border: "1px solid ".concat(vError ? "var(--over)" : BD),
      borderRadius: 10,
      padding: "12px 14px",
      color: "var(--text-hi)",
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      marginBottom: vError ? 6 : 10
    }
  }), vError && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--over)",
      marginBottom: 10
    }
  }, vError), /*#__PURE__*/React.createElement("button", {
    onClick: handleVoucher,
    disabled: !consentOK,
    style: {
      width: "100%",
      padding: "12px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      color: consentOK ? "var(--text-mid-6)" : "var(--text-faint-2)",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 10,
      opacity: consentOK ? 1 : 0.6
    }
  }, "Redeem Code"), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      width: "100%",
      padding: "10px",
      background: "none",
      color: "var(--text-label)",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"))));
}
function SignOutModal(_ref33) {
  var userName = _ref33.userName,
    onConfirm = _ref33.onConfirm,
    onCancel = _ref33.onCancel;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.88)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "28px 24px",
      border: "1px solid ".concat(BD),
      maxWidth: 300,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      textAlign: "center",
      marginBottom: 12
    }
  }, "\uD83D\uDD13"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: "var(--text-hi)",
      textAlign: "center",
      marginBottom: 10
    }
  }, "Sign out", userName ? ", ".concat(userName.split(" ")[0]) : "", "?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-mid)",
      lineHeight: 1.7,
      marginBottom: 22,
      textAlign: "center"
    }
  }, "Signing out will remove local data.", /*#__PURE__*/React.createElement("br", null), "Your cloud data is safe and will restore on next login."), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      width: "100%",
      padding: "13px",
      background: "var(--over-tint-2)",
      border: "1px solid var(--over-tint)",
      borderRadius: 12,
      color: "var(--over)",
      fontSize: 14,
      fontWeight: 900,
      marginBottom: 10
    }
  }, "Sign Out"), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      width: "100%",
      padding: "12px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900
    }
  }, "Stay Signed In")));
}

// Retroactive / re-consent prompt (R2). Shown when a signed-in user has not yet
// agreed to the current privacy-policy version. Blocking — they consent or sign out.
function ConsentModal(_ref34) {
  var onConsent = _ref34.onConsent,
    onSignOut = _ref34.onSignOut;
  var _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    ok = _useState14[0],
    setOk = _useState14[1];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "28px 24px",
      border: "1px solid ".concat(aA("33")),
      maxWidth: 320,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      textAlign: "center",
      marginBottom: 12
    }
  }, "\uD83D\uDD0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: "var(--text-hi)",
      textAlign: "center",
      marginBottom: 8
    }
  }, "A quick consent check"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-mid)",
      lineHeight: 1.6,
      marginBottom: 16,
      textAlign: "center"
    }
  }, "We've updated how we describe your data. To keep syncing your health data we need your explicit consent."), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      cursor: "pointer",
      background: "var(--bg)",
      border: "1px solid ".concat(ok ? aA("55") : BD),
      borderRadius: 10,
      padding: "11px 12px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: ok,
    onChange: function onChange(e) {
      return setOk(e.target.checked);
    },
    style: {
      marginTop: 2,
      width: 16,
      height: 16,
      accentColor: A,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-hi-2)",
      lineHeight: 1.5
    }
  }, "I explicitly consent to Fuel Log storing my ", /*#__PURE__*/React.createElement("strong", null, "health data"), " (weight, body\xA0fat, sex, and any dietary\xA0requirements\xA0and\xA0allergies I enter) to provide the service. See the", " ", /*#__PURE__*/React.createElement("a", {
    href: LEGAL.privacy,
    target: "_blank",
    rel: "noopener",
    style: {
      color: A
    }
  }, "Privacy\xA0Policy"), ".")), /*#__PURE__*/React.createElement("button", {
    onClick: onConsent,
    disabled: !ok,
    style: {
      width: "100%",
      padding: "13px",
      background: ok ? A : "var(--border)",
      color: ok ? "var(--bg)" : "var(--text-faint-2)",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900,
      marginBottom: 10,
      opacity: ok ? 1 : 0.7
    }
  }, "Agree & continue"), /*#__PURE__*/React.createElement("button", {
    onClick: onSignOut,
    style: {
      width: "100%",
      padding: "10px",
      background: "none",
      color: "var(--text-label)",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Sign out instead")));
}

// ── Account & Privacy screen ──────────────────────────────────
// Reached by tapping the avatar. Home for data export (R4), account deletion
// (R5), policy links, consent status, and sign out (LEGAL_ROADMAP Phase B).
function AccountScreen(_ref35) {
  var user = _ref35.user,
    consentInfo = _ref35.consentInfo,
    onBack = _ref35.onBack,
    onExport = _ref35.onExport,
    onSignOut = _ref35.onSignOut,
    onDelete = _ref35.onDelete;
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    confirm = _useState16[0],
    setConfirm = _useState16[1];
  var _useState17 = useState(""),
    _useState18 = _slicedToArray(_useState17, 2),
    typed = _useState18[0],
    setTyped = _useState18[1];
  var _useState19 = useState(false),
    _useState20 = _slicedToArray(_useState19, 2),
    busy = _useState20[0],
    setBusy = _useState20[1];
  var _useState21 = useState(""),
    _useState22 = _slicedToArray(_useState21, 2),
    err = _useState22[0],
    setErr = _useState22[1];
  var runDelete = /*#__PURE__*/function () {
    var _ref36 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var _t25;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.p = _context24.n) {
          case 0:
            setBusy(true);
            setErr("");
            _context24.p = 1;
            _context24.n = 2;
            return onDelete();
          case 2:
            _context24.n = 4;
            break;
          case 3:
            _context24.p = 3;
            _t25 = _context24.v;
            setErr(_t25.message || "Deletion failed.");
            setBusy(false);
          case 4:
            return _context24.a(2);
        }
      }, _callee24, null, [[1, 3]]);
    }));
    return function runDelete() {
      return _ref36.apply(this, arguments);
    };
  }();
  var linkRow = function linkRow(label, href) {
    return /*#__PURE__*/React.createElement("a", {
      href: href,
      target: "_blank",
      rel: "noopener",
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "13px 14px",
        background: "var(--surface-2)",
        border: "1px solid ".concat(BD),
        borderRadius: 12,
        color: "var(--text-hi-2)",
        fontSize: 14,
        textDecoration: "none",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-lo-2)"
      }
    }, "\u2197"));
  };
  var consentDate = consentInfo !== null && consentInfo !== void 0 && consentInfo.healthConsentAt ? new Date(consentInfo.healthConsentAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: BG,
      padding: "18px 16px 60px",
      maxWidth: 480,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: BG,
      paddingTop: 18,
      marginTop: -18,
      paddingBottom: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      width: 36,
      height: 36,
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "var(--text-mid)",
      fontSize: 18
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 900,
      color: A
    }
  }, "Account & Privacy")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    user: user,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "var(--text-hi)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, (user === null || user === void 0 ? void 0 : user.name) || "Signed in"), (user === null || user === void 0 ? void 0 : user.email) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-label)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, user.email))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 8
    }
  }, "YOUR DATA"), /*#__PURE__*/React.createElement("button", {
    onClick: onExport,
    style: {
      width: "100%",
      padding: "13px 14px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      color: "var(--text-hi-2)",
      fontSize: 14,
      fontWeight: 700,
      textAlign: "left",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2B07\uFE0F Download my data"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-lo-2)",
      fontSize: 12
    }
  }, "JSON")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, "A copy of everything stored against your account, in a portable file (GDPR access & portability)."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 8
    }
  }, "LEGAL"), linkRow("Privacy Policy", LEGAL.privacy), linkRow("Terms of Service", LEGAL.terms), linkRow("Who processes your data", LEGAL.subprocessors), consentDate && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      lineHeight: 1.6,
      margin: "8px 0 20px"
    }
  }, "Health-data consent given ", consentDate, " (policy v", consentInfo.version || POLICY_VERSION, "). To withdraw consent, delete your data below."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      letterSpacing: "0.1em",
      fontWeight: 800,
      margin: "4px 0 8px"
    }
  }, "SESSION"), /*#__PURE__*/React.createElement("button", {
    onClick: onSignOut,
    style: {
      width: "100%",
      padding: "13px 14px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      color: "var(--text-hi-2)",
      fontSize: 14,
      fontWeight: 700,
      textAlign: "left",
      marginBottom: 24
    }
  }, "\uD83D\uDD13 Sign out"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--over-3)",
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 8
    }
  }, "DANGER ZONE"), !confirm ? /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setConfirm(true);
      setErr("");
    },
    style: {
      width: "100%",
      padding: "13px 14px",
      background: "var(--over-tint-2)",
      border: "1px solid var(--over-tint)",
      borderRadius: 12,
      color: "var(--over)",
      fontSize: 14,
      fontWeight: 800,
      textAlign: "left"
    }
  }, "\uD83D\uDDD1\uFE0F Delete my account & all data") : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--over-tint-2)",
      border: "1px solid var(--over-tint)",
      borderRadius: 14,
      padding: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--over-soft)",
      lineHeight: 1.6,
      marginBottom: 12
    }
  }, "This permanently deletes your account and ", /*#__PURE__*/React.createElement("strong", null, "all"), " your data (profile, weigh-ins, logs, history, badges). This cannot be undone. Type ", /*#__PURE__*/React.createElement("strong", null, "DELETE"), " to confirm."), /*#__PURE__*/React.createElement("input", {
    value: typed,
    onChange: function onChange(e) {
      return setTyped(e.target.value);
    },
    placeholder: "DELETE",
    disabled: busy,
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: "var(--bg)",
      border: "1px solid var(--over-tint)",
      borderRadius: 10,
      padding: "11px 13px",
      color: "var(--text-hi)",
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      marginBottom: 12
    }
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--over-3)",
      marginBottom: 10
    }
  }, err), /*#__PURE__*/React.createElement("button", {
    onClick: runDelete,
    disabled: busy || typed.trim().toUpperCase() !== "DELETE",
    style: {
      width: "100%",
      padding: "13px",
      background: "var(--over-tint-6)",
      border: "1px solid var(--over-tint-4)",
      borderRadius: 12,
      color: typed.trim().toUpperCase() === "DELETE" && !busy ? "var(--over)" : "var(--over-muted)",
      fontSize: 14,
      fontWeight: 900,
      marginBottom: 8,
      opacity: typed.trim().toUpperCase() === "DELETE" && !busy ? 1 : 0.6
    }
  }, busy ? "Deleting…" : "Permanently delete everything"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setConfirm(false);
      setTyped("");
      setErr("");
    },
    disabled: busy,
    style: {
      width: "100%",
      padding: "11px",
      background: "none",
      color: "var(--text-label)",
      border: "none",
      fontSize: 13
    }
  }, "Cancel")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      lineHeight: 1.6,
      marginTop: 14
    }
  }, "Prefer email? Contact ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:fuellogadmin@gmail.com",
    style: {
      color: "var(--text-label)"
    }
  }, "fuellogadmin@gmail.com"), "."));
}
function LapsedModal(_ref37) {
  var onRenew = _ref37.onRenew,
    onDismiss = _ref37.onDismiss;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.88)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "28px 24px",
      border: "1px solid color-mix(in srgb, var(--warn) 27%, transparent)",
      maxWidth: 300,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      textAlign: "center",
      marginBottom: 12
    }
  }, "\u231B"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: "var(--text-hi)",
      textAlign: "center",
      marginBottom: 10
    }
  }, "Your Premium subscription has ended"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-mid)",
      lineHeight: 1.7,
      marginBottom: 22,
      textAlign: "center"
    }
  }, "Your data is safe and still visible. Quick Add and logging still work. Renew to unlock AI features and cloud sync."), /*#__PURE__*/React.createElement("button", {
    onClick: onRenew,
    style: {
      width: "100%",
      padding: "13px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900,
      marginBottom: 10
    }
  }, "Renew Premium"), /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    style: {
      width: "100%",
      padding: "11px",
      background: "none",
      color: "var(--text-label)",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Continue for Free")));
}

// ── Shared UI ─────────────────────────────────────────────────

var INP = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--bg)",
  border: "1px solid ".concat(BD),
  borderRadius: 10,
  padding: "12px 14px",
  color: "var(--text-hi)",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none"
};
function BackHdr(_ref38) {
  var title = _ref38.title,
    onBack = _ref38.onBack,
    right = _ref38.right;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 22,
      position: "sticky",
      top: 0,
      background: BG,
      zIndex: 10,
      paddingTop: 12,
      paddingBottom: 12,
      marginTop: -12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      width: 36,
      height: 36,
      color: "var(--text-mid-2)",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 900,
      color: A,
      letterSpacing: "0.06em",
      flex: 1
    }
  }, title), right);
}
function Chip(_ref39) {
  var label = _ref39.label,
    value = _ref39.value,
    color = _ref39.color;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      background: "var(--bg)",
      borderRadius: 12,
      padding: "10px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 900,
      color: color
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-lo)",
      marginTop: 2,
      letterSpacing: "0.05em"
    }
  }, label));
}
function MBar(_ref40) {
  var label = _ref40.label,
    value = _ref40.value,
    target = _ref40.target,
    color = _ref40.color;
  var pct = Math.min(100, value / target * 100);
  var overG = value - target;
  var accent = overG > 15 ? "var(--over)" : overG > 5 ? "var(--warn)" : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      letterSpacing: "0.06em",
      color: accent || "var(--text-mid-6)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent || "var(--text-mid-5)"
    }
  }, Math.round(value), "g / ", target, "g")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      background: "var(--surface-2b)",
      borderRadius: 99,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: "".concat(pct, "%"),
      background: accent || color,
      borderRadius: 99,
      transition: "width 0.4s"
    }
  })));
}

// ── Coach Card ────────────────────────────────────────────────

function CoachCard(_ref41) {
  var mode = _ref41.mode,
    totals = _ref41.totals,
    targets = _ref41.targets,
    streak = _ref41.streak,
    water = _ref41.water,
    _ref41$logs = _ref41.logs,
    logs = _ref41$logs === void 0 ? [] : _ref41$logs;
  var _useState23 = useState(""),
    _useState24 = _slicedToArray(_useState23, 2),
    tip = _useState24[0],
    setTip = _useState24[1];
  var _useState25 = useState(0),
    _useState26 = _slicedToArray(_useState25, 2),
    refreshes = _useState26[0],
    setRefreshes = _useState26[1];
  var _useState27 = useState(false),
    _useState28 = _slicedToArray(_useState27, 2),
    loading = _useState28[0],
    setLoading = _useState28[1];
  var _useState29 = useState([]),
    _useState30 = _slicedToArray(_useState29, 2),
    history = _useState30[0],
    setHistory = _useState30[1]; // tips already given today, so refreshes don't repeat

  useEffect(function () {
    sg("coach__" + todayKey()).then(function (v) {
      if (v) {
        var d = JSON.parse(v);
        setTip(d.tip || "");
        setRefreshes(d.r || 0);
        setHistory(d.history || []);
      }
    });
  }, []);
  useEffect(function () {
    if (!tip && !loading && totals.kcal >= 200) gen();
  }, [totals.kcal]); // eslint-disable-line

  var gen = /*#__PURE__*/function () {
    var _ref42 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
      var h, timeLabel, kcalNum, kcalDelta, kcalLine, protNum, protDelta, protLine, waterLine, eaten, foodsLine, firstMealHour, protFrac, protPace, waterPace, protPaceLine, waterPaceLine, prevLine, ctx, prompt, t, r, newHistory, _t26;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.p = _context25.n) {
          case 0:
            if (!(loading || refreshes >= 3)) {
              _context25.n = 1;
              break;
            }
            return _context25.a(2);
          case 1:
            setLoading(true);
            _context25.p = 2;
            h = getCurrentHour();
            timeLabel = h < 6 ? "early morning" : h < 12 ? "morning" : h < 14 ? "midday" : h < 18 ? "afternoon" : h < 21 ? "evening" : "night"; // Spell out over/under per metric so the model never tells you to eat/drink
            // more of something you've already hit. Raw "X/Y" alone reads as a deficit.
            kcalNum = Math.round(totals.kcal);
            kcalDelta = kcalNum - targets.kcal;
            kcalLine = kcalDelta > 0 ? "calories ".concat(kcalNum, "/").concat(targets.kcal, " kcal \u2014 ").concat(kcalDelta, " OVER target") : "calories ".concat(kcalNum, "/").concat(targets.kcal, " kcal \u2014 ").concat(Math.abs(kcalDelta), " remaining");
            protNum = Math.round(totals.protein);
            protDelta = protNum - targets.protein;
            protLine = protDelta >= 0 ? "protein ".concat(protNum, "/").concat(targets.protein, "g \u2014 ").concat(protDelta, "g OVER, goal met \u2705 (do NOT suggest more protein)") : "protein ".concat(protNum, "/").concat(targets.protein, "g \u2014 ").concat(Math.abs(protDelta), "g under");
            waterLine = water >= 8 ? "water ".concat(water, "/8 glasses \u2014 goal met \u2705 (do NOT suggest more water)") : "water ".concat(water, "/8 glasses \u2014 ").concat(8 - water, " under"); // (#5) State-awareness from STRUCTURED data only: expand any grouped meal into
            // its stored elements — never the truncated display name. Element names + per-element
            // macros so the coach reasons about composition, not just variety. (No confidence is
            // ever sent: coaching stays independent of the estimation-confidence layer — nc5.)
            eaten = (logs || []).flatMap(function (l) {
              return l && l.elements && l.elements.length ? l.elements : l ? [l] : [];
            });
            foodsLine = eaten.length ? "Already eaten today (do NOT suggest any of these again):\n" + eaten.map(function (e) {
              return "- ".concat(e.name, " (").concat(Math.round(e.kcal || 0), " kcal, P").concat(Math.round(e.protein || 0), " C").concat(Math.round(e.carbs || 0), " F").concat(Math.round(e.fat || 0), ")");
            }).join("\n") : "Nothing logged yet today."; // (#6) Pace is COMPUTED here, never judged by the LLM. Window starts at the
            // first logged meal; only floor goals (protein, water) are paced — never calories.
            firstMealHour = logs.length ? new Date(Math.min.apply(Math, _toConsumableArray(logs.map(function (l) {
              return Number(l.id) || Date.now();
            })))).getHours() : null;
            protFrac = targets.protein > 0 ? totals.protein / targets.protein : 1;
            protPace = paceVerdict(firstMealHour, h, protFrac);
            waterPace = paceVerdict(firstMealHour, h, water / 8);
            protPaceLine = protDelta >= 0 ? "" : "Protein pace \u2192 ".concat(Math.round(protPace.elapsed * 100), "% of the eating window elapsed vs ").concat(Math.round(protFrac * 100), "% of the protein floor hit; verdict: ").concat(protPace.verdict, ".");
            waterPaceLine = water >= 8 ? "" : "Water pace \u2192 ".concat(Math.round(waterPace.elapsed * 100), "% of window elapsed vs ").concat(Math.round(water / 8 * 100), "% of the water goal hit; verdict: ").concat(waterPace.verdict, "."); // (#5) Vary across refreshes: hand the model what it already said today.
            prevLine = history.length ? "You have ALREADY suggested these today \u2014 say something meaningfully different: ".concat(history.slice(-3).join(" | "), ".") : "";
            ctx = ["- ".concat(kcalLine), "- ".concat(protLine), "- ".concat(waterLine), "- ".concat(streak, " day logging streak."), "- ".concat(foodsLine), protPaceLine ? "- ".concat(protPaceLine) : "", waterPaceLine ? "- ".concat(waterPaceLine) : "", prevLine ? "- ".concat(prevLine) : ""].filter(Boolean).join("\n");
            prompt = "You are a supportive fitness coach. Local time: ".concat(timeLabel, " (").concat(h, ":00). Today (").concat(mode, " mode):\n").concat(ctx, "\n\nRules:\n- Use the pace VERDICT given above; do NOT decide for yourself whether I am \"behind\". Only protein and water are paced \u2014 NEVER calories. Being under my calorie target is success on a cut/maintain, never \"behind\", and you must never urge me to eat more to \"catch up\" on calories.\n- Never suggest more of a metric marked \"goal met \u2705\"; instead give that met goal a brief celebratory nod.\n- If the protein floor is still unmet, meeting it OUTRANKS variety; once the floors are met, favour VARIETY and fibre / gut-health diversity instead of re-recommending the same high-protein food.\n- Any food you suggest must NOT be something already eaten today, and must differ from what you already suggested.\n- If a floor goal's verdict is \"behind\", give a gentle, non-punishing nudge toward one specific food choice to round the day out \u2014 no \"catch up\" urgency, no shame.\n").concat(dietaryPromptBlock(DIETARY), "Write exactly 3 sentences: 1) an honest observation about today 2) a specific food or habit suggestion appropriate for ").concat(timeLabel, " 3) genuine praise. Brief, personal, max one emoji per sentence.");
            _context25.n = 3;
            return callAI(prompt, 200);
          case 3:
            t = _context25.v;
            r = refreshes + 1;
            newHistory = [].concat(_toConsumableArray(history), [t]).slice(-3);
            setTip(t);
            setRefreshes(r);
            setHistory(newHistory);
            _context25.n = 4;
            return ss("coach__" + todayKey(), JSON.stringify({
              tip: t,
              r: r,
              history: newHistory
            }));
          case 4:
            _context25.n = 6;
            break;
          case 5:
            _context25.p = 5;
            _t26 = _context25.v;
          case 6:
            setLoading(false);
          case 7:
            return _context25.a(2);
        }
      }, _callee25, null, [[2, 5]]);
    }));
    return function gen() {
      return _ref42.apply(this, arguments);
    };
  }();
  if (totals.kcal < 200 && !tip) return null;
  // Zero-token allergen backstop: if a tip slips a declared allergen past the
  // prompt, flag it before the user acts on it (never silently trust the LLM).
  var tipAllergens = scanAllergens(tip, DIETARY.allergens);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(aA("22")),
      borderRadius: 20,
      padding: "14px 18px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: tip ? 8 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.12em",
      fontWeight: 800
    }
  }, "\uD83E\uDD16 DAILY COACH"), refreshes < 3 && /*#__PURE__*/React.createElement("button", {
    onClick: gen,
    disabled: loading,
    style: {
      background: "none",
      border: "none",
      color: "var(--text-mid)",
      cursor: "pointer",
      fontSize: 13,
      padding: "2px 6px"
    }
  }, loading ? "..." : "↺", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--text-lo-2)"
    }
  }, 3 - refreshes))), loading && !tip && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-label)",
      marginTop: 4
    }
  }, "Generating your tip..."), tip && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: "var(--text-hi-3)",
      lineHeight: 1.7
    }
  }, tip), tipAllergens.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      background: "var(--over-tint-3)",
      border: "1px solid color-mix(in srgb, var(--over) 27%, transparent)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 11,
      color: "var(--bulk-2)",
      lineHeight: 1.5
    }
  }, "\u26A0\uFE0F This tip may mention ", tipAllergens.join(", "), ", which you've flagged as an allergy \u2014 please double-check before acting on it."));
}

// ── Tag input (feature #8) ────────────────────────────────────
// A hybrid combobox: free-text that surfaces selectable suggestions and also
// lets the user commit a CUSTOM tag the app didn't suggest. Tags are removable pills.
function TagField(_ref43) {
  var label = _ref43.label,
    tags = _ref43.tags,
    suggestions = _ref43.suggestions,
    onChange = _ref43.onChange,
    _ref43$accent = _ref43.accent,
    accent = _ref43$accent === void 0 ? A : _ref43$accent,
    placeholder = _ref43.placeholder;
  var _useState31 = useState(""),
    _useState32 = _slicedToArray(_useState31, 2),
    input = _useState32[0],
    setInput = _useState32[1];
  var has = function has(t) {
    return tags.some(function (x) {
      return x.toLowerCase() === t.toLowerCase();
    });
  };
  // Resolve typed text to a canonical suggestion when it clearly maps to one,
  // so committing with Enter doesn't create a near-duplicate custom tag that
  // bypasses preset handling. For allergies this is a SAFETY fix: a custom
  // "tree nut" tag misses the synonym expansion (almond, walnut…) that the
  // canonical "tree nuts" preset drives in scanAllergens.
  var resolve = function resolve(raw) {
    var t = raw.trim().toLowerCase();
    if (!t) return "";
    var exact = suggestions.find(function (s) {
      return s.toLowerCase() === t;
    });
    if (exact) return exact;
    var partial = suggestions.filter(function (s) {
      return s.toLowerCase().includes(t) && !has(s);
    });
    return partial.length === 1 ? partial[0] : raw.trim();
  };
  var add = function add(raw) {
    var t = resolve(raw).toLowerCase();
    if (t && !has(t)) onChange([].concat(_toConsumableArray(tags), [t]));
    setInput("");
  };
  var remove = function remove(t) {
    return onChange(tags.filter(function (x) {
      return x !== t;
    }));
  };
  var q = input.trim().toLowerCase();
  var shown = suggestions.filter(function (s) {
    return !has(s) && (q === "" || s.toLowerCase().includes(q));
  }).slice(0, 8);
  var isCustom = q && !suggestions.some(function (s) {
    return s.toLowerCase() === q;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 8
    }
  }, label), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 8
    }
  }, tags.map(function (t) {
    return /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: accent + "1e",
        border: "1px solid ".concat(accent, "55"),
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
        color: accent,
        fontWeight: 700
      }
    }, t, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return remove(t);
      },
      style: {
        background: "none",
        border: "none",
        color: accent,
        fontSize: 14,
        padding: 0,
        cursor: "pointer",
        lineHeight: 1
      }
    }, "\xD7"));
  })), /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: function onChange(e) {
      return setInput(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        add(input);
      }
    },
    placeholder: placeholder,
    style: _objectSpread({}, INP)
  }), (shown.length > 0 || isCustom) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 8
    }
  }, shown.map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: function onClick() {
        return add(s);
      },
      style: {
        background: "var(--surface-2)",
        border: "1px solid ".concat(BD),
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
        color: "var(--text-mid)",
        cursor: "pointer",
        fontFamily: "inherit"
      }
    }, "+ ", s);
  }), isCustom && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return add(input);
    },
    style: {
      background: "none",
      border: "1px dashed ".concat(accent, "66"),
      borderRadius: 999,
      padding: "4px 10px",
      fontSize: 12,
      color: accent,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "+ Add \"", input.trim(), "\"")));
}

// ── Profile ───────────────────────────────────────────────────

// Self-contained body-stat editor. Converts the stored METRIC value (kg or cm)
// to the chosen display unit ONCE at mount, then edits purely in local string
// buffers — so typing, clearing a box, and trailing decimals are never fought by
// a re-derived value (the root cause of the old "stuck 0"). Recomputes the metric
// on every keystroke and pushes it up. The parent keys this by unit, so switching
// unit remounts it with a fresh seed.
//
// Zero handling has CONTEXT, decided once at the whole-measurement level: if the
// measurement holds no value (never set or fully cleared) every box seeds blank
// (placeholder) — no stray "0". If it holds a real value, the true parts are
// shown INCLUDING a legitimate 0 (the pounds in 12 st 0 lb, the inches in 5 ft
// 0 in) — even when that 0 is produced by a unit switch. So a 0 only ever appears
// as a real sub-part of a measurement the user has actually set.
var emptyMetric = function emptyMetric(m) {
  return m === "" || m == null || Number(m) === 0;
};
var MEASURE_CFG = {
  kg: {
    f: ["kg"],
    seed: function seed(kg) {
      return emptyMetric(kg) ? [""] : [String(kg)];
    },
    build: function build(_ref44) {
      var _ref45 = _slicedToArray(_ref44, 1),
        a = _ref45[0];
      return a;
    }
  },
  lb: {
    f: ["lb"],
    seed: function seed(kg) {
      return emptyMetric(kg) ? [""] : [String(kgToLb(kg))];
    },
    build: function build(_ref46) {
      var _ref47 = _slicedToArray(_ref46, 1),
        a = _ref47[0];
      return lbToKg(a);
    }
  },
  st: {
    f: ["st", "lb"],
    seed: function seed(kg) {
      if (emptyMetric(kg)) return ["", ""];
      var x = kgToStLb(kg);
      return [String(x.st), String(x.lb)];
    },
    build: function build(_ref48) {
      var _ref49 = _slicedToArray(_ref48, 2),
        s = _ref49[0],
        p = _ref49[1];
      return stLbToKg(s, p);
    }
  },
  cm: {
    f: ["cm"],
    seed: function seed(cm) {
      return emptyMetric(cm) ? [""] : [String(cm)];
    },
    build: function build(_ref50) {
      var _ref51 = _slicedToArray(_ref50, 1),
        a = _ref51[0];
      return a;
    }
  },
  "in": {
    f: ["in"],
    seed: function seed(cm) {
      return emptyMetric(cm) ? [""] : [String(cmToInch(cm))];
    },
    build: function build(_ref52) {
      var _ref53 = _slicedToArray(_ref52, 1),
        a = _ref53[0];
      return inchToCm(a);
    }
  },
  ftin: {
    f: ["ft", "in"],
    seed: function seed(cm) {
      if (emptyMetric(cm)) return ["", ""];
      var x = cmToFtIn(cm);
      return [String(x.ft), String(x["in"])];
    },
    build: function build(_ref54) {
      var _ref55 = _slicedToArray(_ref54, 2),
        ft = _ref55[0],
        i = _ref55[1];
      return ftInToCm(ft, i);
    }
  }
};
function MeasureField(_ref56) {
  var metric = _ref56.metric,
    unit = _ref56.unit,
    onChange = _ref56.onChange;
  var cfg = MEASURE_CFG[unit] || MEASURE_CFG.kg;
  var _useState33 = useState(function () {
      return cfg.seed(metric);
    }),
    _useState34 = _slicedToArray(_useState33, 2),
    vals = _useState34[0],
    setVals = _useState34[1]; // seed once; local thereafter
  var commit = function commit(i, raw) {
    var next = vals.slice();
    next[i] = raw;
    setVals(next);
    onChange(cfg.build(next));
  };
  var compound = cfg.f.length > 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, cfg.f.map(function (label, i) {
    return /*#__PURE__*/React.createElement("input", {
      key: i,
      type: "number",
      min: "0",
      max: label === "lb" && compound ? "13" : label === "in" && compound ? "11" : undefined,
      inputMode: label === "kg" || label === "lb" ? "decimal" : "numeric",
      "aria-label": label,
      placeholder: label,
      value: vals[i],
      onChange: function onChange(e) {
        return commit(i, e.target.value);
      },
      style: compound ? _objectSpread(_objectSpread({}, INP), {}, {
        textAlign: "center"
      }) : INP
    });
  }));
}

// Compact segmented control for picking a display unit. Sits inline on the
// field it controls (weight / height) so the choice is where the value is.
// 3-way appearance control: 🌙 Dark · ☀️ Light · 🖥 System. System re-delegates to the OS.
function ThemeToggle() {
  var _useState35 = useState(getTheme()),
    _useState36 = _slicedToArray(_useState35, 2),
    choice = _useState36[0],
    setChoice = _useState36[1];
  var opts = [["dark", "🌙", "Dark"], ["light", "☀️", "Light"], ["system", "🖥️", "System"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      background: "var(--bg)",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      padding: 4
    }
  }, opts.map(function (_ref57) {
    var _ref58 = _slicedToArray(_ref57, 3),
      v = _ref58[0],
      icon = _ref58[1],
      lbl = _ref58[2];
    var on = choice === v;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: function onClick() {
        applyTheme(v);
        setChoice(v);
        haptic();
      },
      "aria-label": lbl,
      "aria-pressed": on,
      style: {
        flex: 1,
        padding: "9px 4px",
        borderRadius: 9,
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        fontFamily: "inherit",
        background: on ? A : "transparent",
        color: on ? "var(--bg)" : "var(--text-label)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 17,
        lineHeight: 1
      }
    }, icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.04em"
      }
    }, lbl));
  }));
}
function UnitSwitch(_ref59) {
  var value = _ref59.value,
    options = _ref59.options,
    onChange = _ref59.onChange;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      background: "var(--bg)",
      border: "1px solid ".concat(BD),
      borderRadius: 999,
      padding: 2
    }
  }, options.map(function (_ref60) {
    var _ref61 = _slicedToArray(_ref60, 2),
      v = _ref61[0],
      lbl = _ref61[1];
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: function onClick() {
        return onChange(v);
      },
      style: {
        padding: "3px 9px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.02em",
        fontFamily: "inherit",
        background: value === v ? A : "transparent",
        color: value === v ? "var(--bg)" : "var(--text-label)"
      }
    }, lbl);
  }));
}
function ProfileScreen(_ref62) {
  var profile = _ref62.profile,
    onSave = _ref62.onSave,
    onBack = _ref62.onBack,
    _ref62$tdeeAdj = _ref62.tdeeAdj,
    tdeeAdj = _ref62$tdeeAdj === void 0 ? 0 : _ref62$tdeeAdj,
    _ref62$weighIns = _ref62.weighIns,
    weighIns = _ref62$weighIns === void 0 ? [] : _ref62$weighIns,
    _ref62$aggressiveCutA = _ref62.aggressiveCutAcked,
    aggressiveCutAcked = _ref62$aggressiveCutA === void 0 ? false : _ref62$aggressiveCutA,
    _ref62$onResetAdjustm = _ref62.onResetAdjustment,
    onResetAdjustment = _ref62$onResetAdjustm === void 0 ? function () {} : _ref62$onResetAdjustm;
  var _useState37 = useState(_objectSpread(_objectSpread({}, DEF_PROFILE), profile)),
    _useState38 = _slicedToArray(_useState37, 2),
    f = _useState38[0],
    setF = _useState38[1];
  var _useState39 = useState(false),
    _useState40 = _slicedToArray(_useState39, 2),
    saved = _useState40[0],
    setSaved = _useState40[1];
  // "Start clean" is the one control here that throws away something the app spent weeks
  // learning, so it asks first — deliberately against the house no-friction rule, which is
  // about deletes you can redo in a tap. This one you can't.
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    askReset = _useState42[0],
    setAskReset = _useState42[1];
  var _useState43 = useState(false),
    _useState44 = _slicedToArray(_useState43, 2),
    bfFocused = _useState44[0],
    setBfFocused = _useState44[1];
  var _useState45 = useState(getWUnit()),
    _useState46 = _slicedToArray(_useState45, 2),
    wUnit = _useState46[0],
    setWU = _useState46[1]; // display only — storage stays kg
  var _useState47 = useState(getHUnit()),
    _useState48 = _slicedToArray(_useState47, 2),
    hUnit = _useState48[0],
    setHU = _useState48[1]; // display only — storage stays cm
  var set = function set(k, v) {
    return setF(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
    });
  };
  // Dietary config (#8) persists immediately on change — the body-stats auto-save
  // effect only watches weight/height/bf/sex, so tag edits save themselves here.
  var diet = normaliseDietary(f.dietary);
  var setDiet = function setDiet(key, list) {
    var nf = _objectSpread(_objectSpread({}, f), {}, {
      dietary: _objectSpread(_objectSpread({}, diet), {}, _defineProperty({}, key, list))
    });
    setF(nf);
    onSave(nf);
  };
  var valid = Number(f.weight) > 0 && Number(f.height) > 0 && Number(f.bodyFat) > 0 && Number(f.bodyFat) < 100;
  var bfVal = Number(f.bodyFat);
  var bfImplausible = bfVal > 0 && (bfVal < 4 || bfVal > 50);
  var prev = calcTargets(f, "cut", 0, 0);
  var formulaTDEE = prev.tdee; // seeded estimate (activity-adjusted)
  var tdeeFloor = sedentaryFloorOf(f); // absolute floor = sedentary (BMR × 1.2)
  var adjTDEE = Math.max(tdeeFloor, formulaTDEE + tdeeAdj); // never below sedentary TDEE
  var tdeeFloored = formulaTDEE + tdeeAdj < tdeeFloor; // adaptive adj hit the floor
  var confidence = weighIns.length >= 28 ? "Calibrated" : weighIns.length >= 14 ? "Learning" : weighIns.length >= 6 ? "Estimating" : null;
  useEffect(function () {
    if (!valid) return;
    var t = setTimeout(function () {
      onSave(f);
      haptic();
      setSaved(true);
      setTimeout(function () {
        return setSaved(false);
      }, 1800);
    }, 600);
    return function () {
      return clearTimeout(t);
    };
  }, [f.weight, f.height, f.bodyFat, f.sex, f.activity, f.weighCadence]); // eslint-disable-line

  var row = function row(label, val, unit) {
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "var(--text-hi)";
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid ".concat(BD)
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-mid)"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: color
      }
    }, val, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-label)",
        marginLeft: 3
      }
    }, unit)));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 50px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(BackHdr, {
    title: "MY PROFILE",
    onBack: onBack,
    right: saved && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: A,
        fontWeight: 700
      }
    }, "\u2713 SAVED")
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-mid)",
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, "Targets use ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-mid-2)"
    }
  }, "Katch-McArdle"), ". Changes save automatically."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      padding: "20px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 14
    }
  }, "BODY STATS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800
    }
  }, "WEIGHT"), /*#__PURE__*/React.createElement(UnitSwitch, {
    value: wUnit,
    options: [["kg", "kg"], ["st", "st+lb"], ["lb", "lb"]],
    onChange: function onChange(u) {
      setWU(u);
      setWUnit(u);
    }
  })), /*#__PURE__*/React.createElement(MeasureField, {
    key: wUnit,
    metric: f.weight,
    unit: wUnit,
    onChange: function onChange(v) {
      return set("weight", v);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800
    }
  }, "HEIGHT"), /*#__PURE__*/React.createElement(UnitSwitch, {
    value: hUnit,
    options: [["cm", "cm"], ["ftin", "ft+in"], ["in", "in"]],
    onChange: function onChange(u) {
      setHU(u);
      setHUnit(u);
    }
  })), /*#__PURE__*/React.createElement(MeasureField, {
    key: hUnit,
    metric: f.height,
    unit: hUnit,
    onChange: function onChange(v) {
      return set("height", v);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 5
    }
  }, "BODY FAT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-label)"
    }
  }, "(%)")), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "99",
    value: f.bodyFat,
    onChange: function onChange(e) {
      return set("bodyFat", e.target.value);
    },
    onFocus: function onFocus() {
      return setBfFocused(true);
    },
    onBlur: function onBlur() {
      return setBfFocused(false);
    },
    style: _objectSpread(_objectSpread({}, INP), {}, {
      marginBottom: 4
    })
  }), bfFocused && !bfImplausible && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-mid-2)",
      marginBottom: 6,
      lineHeight: 1.5
    }
  }, "Not sure? Use 25% for men or 30% for women as a starting estimate. A more accurate figure improves your calorie and macro targets."), bfImplausible && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--warn)",
      marginBottom: 6,
      lineHeight: 1.5
    }
  }, "That seems unusual \u2014 double-check this number as it affects your calorie targets."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 5
    }
  }, "SEX ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-label)",
      fontSize: 10,
      fontWeight: 400
    }
  }, "\u2014 used to calculate your calorie and macro targets")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 6
    }
  }, ["male", "female"].map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: function onClick() {
        return set("sex", s);
      },
      style: {
        flex: 1,
        padding: "10px 0",
        borderRadius: 10,
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: "0.06em",
        border: "1px solid ".concat(f.sex === s ? aA("88") : BD),
        background: f.sex === s ? aA("18") : "var(--bg)",
        color: f.sex === s ? A : "var(--text-label)"
      }
    }, s === "male" ? "MALE" : "FEMALE");
  })), !f.sex && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--warn)",
      marginBottom: 10,
      lineHeight: 1.5
    }
  }, "Set your sex for more accurate targets \u2014 defaulting to male calculations."), f.sex === "female" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-mid-2)",
      marginBottom: 10,
      lineHeight: 1.5
    }
  }, "Targets may need adjusting around your cycle \u2014 override anytime."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 5
    }
  }, "ACTIVITY ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-label)",
      fontSize: 10,
      fontWeight: 400
    }
  }, "\u2014 your typical day, not counting workouts")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 6
    }
  }, ACTIVITY_ORDER.map(function (k) {
    var on = (f.activity || "sedentary") === k;
    var set_ = f.activity == null;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return set("activity", k);
      },
      style: {
        textAlign: "left",
        padding: "9px 12px",
        borderRadius: 10,
        border: "1px solid ".concat(on && !set_ ? aA("88") : BD),
        background: on && !set_ ? aA("18") : "var(--bg)",
        color: on && !set_ ? A : "var(--text-mid)",
        lineHeight: 1.35
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: "0.02em"
      }
    }, ACTIVITY[k].label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--text-label)",
        fontWeight: 400,
        marginTop: 1
      }
    }, ACTIVITY[k].hint));
  })), f.activity == null ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--warn)",
      marginBottom: 10,
      lineHeight: 1.5
    }
  }, "Pick your typical activity for a more accurate starting target \u2014 defaulting to sedentary until you do.") : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-mid-2)",
      marginBottom: 10,
      lineHeight: 1.5
    }
  }, "A starting point \u2014 we fine-tune this automatically as you log weight. Workout calories are added separately when you log a session, so pick how active your day is ", /*#__PURE__*/React.createElement("em", null, "without"), " training."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 5
    }
  }, "WEIGH-INS ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-label)",
      fontSize: 10,
      fontWeight: 400
    }
  }, "\u2014 how often you'd like to check in")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 6
    }
  }, WEIGH_CADENCE_ORDER.map(function (k) {
    var cur = f.weighCadence || "few";
    var on = cur === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return set("weighCadence", k);
      },
      style: {
        padding: "8px 12px",
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 800,
        border: "1px solid ".concat(on ? aA("88") : BD),
        background: on ? aA("18") : "var(--bg)",
        color: on ? A : "var(--text-label)"
      }
    }, WEIGH_CADENCE[k].label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-mid-2)",
      marginBottom: 14,
      lineHeight: 1.5
    }
  }, WEIGH_CADENCE[f.weighCadence || "few"].hint, ". We use your 7-day trend, not any single day \u2014", (f.weighCadence || "few") === "off" ? " your targets run on your profile estimate." : " weigh in when it suits and we auto-tune your targets.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      padding: "20px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 6
    }
  }, "DIET & ALLERGIES"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      lineHeight: 1.5,
      marginBottom: 16
    }
  }, "These steer every AI suggestion \u2014 the coach, AI Meal Log and estimates. Allergies are a hard safety filter, applied in the prompt and double-checked on every AI response."), /*#__PURE__*/React.createElement(TagField, {
    label: "DIET TYPE",
    tags: diet.diets,
    suggestions: DIET_SUGGESTIONS,
    onChange: function onChange(l) {
      return setDiet("diets", l);
    },
    placeholder: "e.g. vegan, halal\u2026"
  }), /*#__PURE__*/React.createElement(TagField, {
    label: "ALLERGIES (HARD FILTER)",
    tags: diet.allergens,
    suggestions: BIG14_ALLERGENS,
    onChange: function onChange(l) {
      return setDiet("allergens", l);
    },
    accent: "var(--over-2)",
    placeholder: "e.g. peanuts, milk\u2026"
  }), /*#__PURE__*/React.createElement(TagField, {
    label: "DISLIKES (SOFT \u2014 AVOID WHERE POSSIBLE)",
    tags: diet.dislikes,
    suggestions: [],
    onChange: function onChange(l) {
      return setDiet("dislikes", l);
    },
    accent: "var(--text-mid)",
    placeholder: "e.g. coriander, olives\u2026"
  })), valid && /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 12
    }
  }, "CALCULATED STATS"), row("Lean Body Mass", prev.lbm, "kg", "var(--cut)"), row("BMR", prev.bmr, "kcal/day", "var(--warn)"), row("Formula TDEE", formulaTDEE, "kcal/day", "var(--text-mid-6)"), tdeeAdj !== 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid ".concat(BD)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-mid)"
    }
  }, "Adaptive adjustment"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: tdeeAdj > 0 ? A : "var(--bulk)"
    }
  }, tdeeAdj > 0 ? "+" : "", tdeeAdj, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-label)"
    }
  }, "kcal/day"))), tdeeAdj !== 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 0 2px"
    }
  }, !askReset ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAskReset(true);
    },
    style: {
      width: "100%",
      padding: "9px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 9,
      color: A,
      fontSize: 11.5,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Start clean \u2014 reset the adjustment to 0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-label)",
      lineHeight: 1.5,
      marginTop: 6
    }
  }, "Wipes what the app has learned about your metabolism and starts over from your body stats. Your weigh-ins and history are kept. It takes a few weeks of check-ins to build the estimate back up.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 10,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--warn)",
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 3
    }
  }, "RESET THE ADJUSTMENT?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "Your maintenance estimate goes straight back to ", formulaTDEE.toLocaleString(), " kcal \u2014 ", tdeeAdj > 0 ? "down" : "up", " ", Math.abs(tdeeAdj), " from where it sits now \u2014 and it'll take a few weeks of weigh-ins to learn your real number again. Nothing else is lost.", /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAskReset(false);
    },
    style: {
      flex: 1,
      padding: "8px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 9,
      color: A,
      fontSize: 11.5,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Keep it"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setAskReset(false);
      onResetAdjustment();
    },
    style: {
      padding: "8px 14px",
      background: "transparent",
      border: "1px solid ".concat(BD),
      borderRadius: 9,
      color: "var(--text-mid)",
      fontSize: 11.5,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Yes, reset"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid ".concat(BD)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-mid)"
    }
  }, "Effective TDEE ", confidence && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: tdeeAdj !== 0 ? A : "var(--text-label)"
    }
  }, "\xB7 ", confidence)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: A
    }
  }, adjTDEE, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-label)"
    }
  }, "kcal/day"))), tdeeFloored && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--warn)",
      marginTop: 6,
      lineHeight: 1.5
    }
  }, "Held at your minimum maintenance. Your maintenance can't sit below sedentary energy use, so the adaptive adjustment is floored here \u2014 keep logging weight and it will re-converge."), !confidence && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      marginTop: 6,
      lineHeight: 1.5
    }
  }, "Log your weight daily from the dashboard to enable adaptive calibration."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 10
    }
  }, "TARGETS BY MODE"), [{
    mode: "cut",
    label: "CUT",
    color: "var(--cut)"
  }, {
    mode: "maintain",
    label: "MAINTAIN",
    color: A
  }, {
    mode: "bulk",
    label: "BULK",
    color: "var(--bulk)"
  }].map(function (_ref63) {
    var mode = _ref63.mode,
      label = _ref63.label,
      color = _ref63.color;
    var t = calcTargets(f, mode, 0, tdeeAdj);
    return /*#__PURE__*/React.createElement("div", {
      key: mode,
      style: {
        background: "var(--bg)",
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 900,
        color: color,
        letterSpacing: "0.08em",
        marginBottom: 6
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, [["KCAL", "kcal", ""], ["P", "protein", "g"], ["C", "carbs", "g"], ["F", "fat", "g"]].map(function (_ref64) {
      var _ref65 = _slicedToArray(_ref64, 3),
        k = _ref65[0],
        key = _ref65[1],
        u = _ref65[2];
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          flex: 1,
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 900,
          color: color
        }
      }, t[key], u), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: "var(--text-lo-2)",
          marginTop: 1
        }
      }, k));
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      marginTop: 8
    }
  }, "Workout kcal are added when you log sessions on the dashboard.")), aggressiveCutAcked && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginTop: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15
    }
  }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "You have previously acknowledged an aggressive cut target. Review your profile stats and targets if your circumstances have changed.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      padding: "20px",
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 12
    }
  }, "APPEARANCE"), /*#__PURE__*/React.createElement(ThemeToggle, null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-mid-2)",
      marginTop: 10,
      lineHeight: 1.5
    }
  }, "System follows your device\u2019s light/dark setting.")));
}

// ── Meal Form ─────────────────────────────────────────────────

function MealForm(_ref66) {
  var meal = _ref66.meal,
    onSave = _ref66.onSave,
    onCancel = _ref66.onCancel,
    _ref66$isPremium = _ref66.isPremium,
    isPremium = _ref66$isPremium === void 0 ? false : _ref66$isPremium,
    _ref66$onPremiumGate = _ref66.onPremiumGate,
    onPremiumGate = _ref66$onPremiumGate === void 0 ? function () {} : _ref66$onPremiumGate;
  var blank = {
    name: "",
    kcal: "",
    protein: "",
    carbs: "",
    fat: ""
  };
  var _useState49 = useState(meal ? {
      name: meal.name,
      kcal: String(meal.kcal),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat)
    } : blank),
    _useState50 = _slicedToArray(_useState49, 2),
    f = _useState50[0],
    setF = _useState50[1];
  var _useState51 = useState(false),
    _useState52 = _slicedToArray(_useState51, 2),
    reest = _useState52[0],
    setReest = _useState52[1];
  var _useState53 = useState(""),
    _useState54 = _slicedToArray(_useState53, 2),
    reestMsg = _useState54[0],
    setReestMsg = _useState54[1]; // "" | "done" | error text
  var set = function set(k, v) {
    setF(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
    });
    setReestMsg("");
  };
  var ok = f.name.trim() && Number(f.kcal) > 0;

  // Mirrors EntryEditor's re-estimate exactly: premium-gated, AI shown first,
  // Open Food Facts a bounded background refinement that only wins on confidence.
  var estimate = /*#__PURE__*/function () {
    var _ref67 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
      var fill, upd, oft, _t27, _t28;
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.p = _context26.n) {
          case 0:
            if (isPremium) {
              _context26.n = 1;
              break;
            }
            onPremiumGate({
              emoji: "✨",
              name: "AI estimate"
            });
            return _context26.a(2);
          case 1:
            if (!(!f.name.trim() || reest)) {
              _context26.n = 2;
              break;
            }
            return _context26.a(2);
          case 2:
            setReest(true);
            setReestMsg("");
            fill = function fill(r) {
              return setF(function (p) {
                return _objectSpread(_objectSpread({}, p), {}, {
                  kcal: String(Math.round(r.kcal)),
                  protein: String(Math.round(r.protein * 10) / 10),
                  carbs: String(Math.round(r.carbs * 10) / 10),
                  fat: String(Math.round(r.fat * 10) / 10)
                });
              });
            };
            _context26.p = 3;
            _context26.n = 4;
            return callAIJson(AI_REESTIMATE_PROMPT(f.name.trim()), 300);
          case 4:
            upd = _context26.v;
            _context26.n = 6;
            break;
          case 5:
            _context26.p = 5;
            _t27 = _context26.v;
            setReestMsg("Couldn't reach the AI — check your connection and try again.");
            setReest(false);
            return _context26.a(2);
          case 6:
            if (!(!upd || !isFinite(Number(upd.kcal)))) {
              _context26.n = 7;
              break;
            }
            setReestMsg("Couldn't estimate that — try rephrasing the name.");
            setReest(false);
            return _context26.a(2);
          case 7:
            fill(upd);
            setReestMsg("done");
            setReest(false);
            _context26.p = 8;
            _context26.n = 9;
            return searchOFT(f.name.trim());
          case 9:
            oft = _context26.v;
            if (oft && oft.confidence > upd.confidence) fill(oft);
            _context26.n = 11;
            break;
          case 10:
            _context26.p = 10;
            _t28 = _context26.v;
          case 11:
            return _context26.a(2);
        }
      }, _callee26, null, [[8, 10], [3, 5]]);
    }));
    return function estimate() {
      return _ref67.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.88)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      zIndex: 999
    },
    onClick: function onClick(e) {
      return e.target === e.currentTarget && onCancel();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: "22px 22px 0 0",
      padding: "28px 20px 50px",
      width: "100%",
      maxWidth: 500,
      border: "1px solid ".concat(BD),
      borderBottom: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      color: A,
      fontSize: 16,
      fontWeight: 900
    }
  }, meal ? "EDIT MEAL" : "ADD MEAL"), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      background: "none",
      border: "none",
      color: "var(--text-mid)",
      fontSize: 24
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 6
    }
  }, "MEAL NAME"), /*#__PURE__*/React.createElement("input", {
    value: f.name,
    onChange: function onChange(e) {
      return set("name", e.target.value);
    },
    placeholder: "e.g. Chicken breast (150g)",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      marginBottom: 16
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 20
    }
  }, [{
    k: "kcal",
    l: "CALORIES",
    c: A
  }, {
    k: "protein",
    l: "PROTEIN (g)",
    c: "var(--cut)"
  }, {
    k: "carbs",
    l: "CARBS (g)",
    c: "var(--warn)"
  }, {
    k: "fat",
    l: "FAT (g)",
    c: "var(--bulk)"
  }].map(function (fl) {
    return /*#__PURE__*/React.createElement("div", {
      key: fl.k
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: fl.c,
        letterSpacing: "0.1em",
        fontWeight: 800,
        marginBottom: 5
      }
    }, fl.l), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      value: f[fl.k],
      onChange: function onChange(e) {
        return set(fl.k, e.target.value);
      },
      placeholder: "0",
      style: INP
    }));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: estimate,
    disabled: reest,
    style: {
      width: "100%",
      padding: "12px",
      marginBottom: reestMsg && reestMsg !== "done" ? 6 : 12,
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 11,
      color: A,
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer",
      opacity: reest ? 0.6 : 1
    }
  }, reest ? "Estimating…" : reestMsg === "done" ? "✓ Filled — estimate again" : "✨ AI estimate from name"), reestMsg && reestMsg !== "done" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--over-2)",
      marginBottom: 12,
      lineHeight: 1.4
    }
  }, reestMsg), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return ok && (haptic(), onSave({
        name: f.name.trim(),
        kcal: Number(f.kcal) || 0,
        protein: Number(f.protein) || 0,
        carbs: Number(f.carbs) || 0,
        fat: Number(f.fat) || 0
      }));
    },
    disabled: !ok,
    style: {
      width: "100%",
      padding: "15px",
      background: ok ? A : "var(--surface-2)",
      color: ok ? "var(--bg)" : "var(--text-disabled)",
      border: "none",
      borderRadius: 13,
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: "0.08em"
    }
  }, meal ? "SAVE CHANGES" : "ADD MEAL")));
}

// ── Weigh-In Widget ───────────────────────────────────────────

function WeighInWidget(_ref68) {
  var weighIns = _ref68.weighIns,
    onWeighIn = _ref68.onWeighIn,
    tdeeAdj = _ref68.tdeeAdj,
    baseTDEE = _ref68.baseTDEE,
    _ref68$tdeeFloor = _ref68.tdeeFloor,
    tdeeFloor = _ref68$tdeeFloor === void 0 ? baseTDEE : _ref68$tdeeFloor;
  var _useState55 = useState(""),
    _useState56 = _slicedToArray(_useState55, 2),
    val = _useState56[0],
    setVal = _useState56[1]; // kg · lb · or stone (when st mode)
  var _useState57 = useState(""),
    _useState58 = _slicedToArray(_useState57, 2),
    val2 = _useState58[0],
    setVal2 = _useState58[1]; // pounds (st mode only)
  var wUnit = getWUnit();
  var entryKg = wUnit === "st" ? stLbToKg(val || 0, val2 || 0) : wUnit === "lb" ? lbToKg(val || 0) : Number(val);
  var today = todayKey();
  var todayEntry = weighIns.find(function (w) {
    return w.date === today;
  });
  var trend7 = function () {
    if (weighIns.length < 4) return null;
    var recent = weighIns.slice(-7);
    var old = recent[0].weight;
    var now = recent[recent.length - 1].weight;
    return Math.round((now - old) * 10) / 10;
  }();
  var confidence = weighIns.length >= 28 ? "Calibrated" : weighIns.length >= 14 ? "Learning" : "Estimating";
  var confColor2 = weighIns.length >= 28 ? A : weighIns.length >= 14 ? "var(--warn)" : "var(--text-mid)";
  var calibrating = weighIns.length >= CAL_MIN_WEIGHINS; // 6 — matches the engine's engagement point
  var checkInsToGo = Math.max(0, CAL_MIN_WEIGHINS - weighIns.length);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 20,
      padding: "16px 20px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 4
    }
  }, "BODY WEIGHT"), todayEntry ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: "var(--text-hi)"
    }
  }, wUnit === "st" ? function () {
    var _kgToStLb2 = kgToStLb(todayEntry.weight),
      st = _kgToStLb2.st,
      lb = _kgToStLb2.lb;
    return /*#__PURE__*/React.createElement(React.Fragment, null, st, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-label)",
        marginLeft: 3
      }
    }, "st"), " ", lb, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-label)",
        marginLeft: 3
      }
    }, "lb"));
  }() : /*#__PURE__*/React.createElement(React.Fragment, null, wChartNum(todayEntry.weight, wUnit), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-label)",
      marginLeft: 4
    }
  }, wChartUnit(wUnit))), trend7 !== null && function () {
    var t = wUnit === "kg" ? trend7 : Math.round(trend7 * LB_PER_KG * 10) / 10;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: trend7 <= 0 ? "var(--accent)" : "var(--bulk)",
        marginLeft: 10
      }
    }, t > 0 ? "+" : "", t, wUnit === "kg" ? "kg" : "lb", "/wk");
  }()) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-lo-2)",
      marginTop: 2
    }
  }, "Not logged today")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: confColor2,
      letterSpacing: "0.08em",
      fontWeight: 800
    }
  }, confidence.toUpperCase()), calibrating ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: A,
      marginTop: 2
    }
  }, "~", Math.max(tdeeFloor, baseTDEE + tdeeAdj).toLocaleString(), " kcal"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-label)",
      marginTop: 1
    }
  }, "est. TDEE", tdeeAdj !== 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: tdeeAdj > 0 ? A : "var(--bulk)"
    }
  }, " ", tdeeAdj > 0 ? "+" : "", tdeeAdj))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      marginTop: 4,
      maxWidth: 110,
      textAlign: "right",
      lineHeight: 1.4
    }
  }, checkInsToGo, " more check-in", checkInsToGo === 1 ? "" : "s", " until we fine-tune"))), !todayEntry && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, wUnit === "st" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    inputMode: "numeric",
    value: val,
    "aria-label": "stone today",
    onChange: function onChange(e) {
      return setVal(e.target.value);
    },
    placeholder: "st",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: 1,
      padding: "10px 12px",
      fontSize: 13,
      textAlign: "center"
    }),
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && entryKg > 0 && (onWeighIn(entryKg), setVal(""), setVal2(""));
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "13",
    inputMode: "numeric",
    value: val2,
    "aria-label": "pounds today",
    onChange: function onChange(e) {
      return setVal2(e.target.value);
    },
    placeholder: "lb",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: 1,
      padding: "10px 12px",
      fontSize: 13,
      textAlign: "center"
    }),
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && entryKg > 0 && (onWeighIn(entryKg), setVal(""), setVal2(""));
    }
  })) : /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    min: "0",
    max: wUnit === "lb" ? 660 : 300,
    value: val,
    onChange: function onChange(e) {
      return setVal(e.target.value);
    },
    placeholder: wUnit === "lb" ? "lb today..." : "kg today...",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: 1,
      padding: "10px 12px",
      fontSize: 13
    }),
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && entryKg > 0 && (onWeighIn(entryKg), setVal(""));
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (entryKg > 0) {
        onWeighIn(entryKg);
        setVal("");
        setVal2("");
      }
    },
    disabled: !(entryKg > 0),
    style: {
      padding: "10px 18px",
      background: entryKg > 0 ? A : "var(--surface-2)",
      color: entryKg > 0 ? "var(--bg)" : "var(--border-strong)",
      border: "none",
      borderRadius: 10,
      fontWeight: 900,
      fontSize: 13
    }
  }, "LOG")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      lineHeight: 1.5
    }
  }, !calibrating && "Your target is already set from your profile. Weigh in a few times a week and we auto-tune it \u2014 we use your 7-day trend, not any single day. ".concat(checkInsToGo, " more check-in").concat(checkInsToGo === 1 ? "" : "s", " until we start fine-tuning."), calibrating && tdeeAdj === 0 && "\uD83D\uDD04 ".concat(confidence, " \u2014 your logged results match the estimate, no adjustment needed yet."), calibrating && tdeeAdj !== 0 && "\uD83D\uDD04 ".concat(confidence, " \u2014 your real TDEE looks ").concat(tdeeAdj > 0 ? "higher" : "lower", " than the estimate, so targets are adjusted to match.")));
}

// ── Workout Logger ────────────────────────────────────────────

function WorkoutLogger(_ref69) {
  var workouts = _ref69.workouts,
    onAdd = _ref69.onAdd,
    onRemove = _ref69.onRemove,
    prof = _ref69.prof,
    _ref69$earnedToday = _ref69.earnedToday,
    earnedToday = _ref69$earnedToday === void 0 ? 0 : _ref69$earnedToday,
    isPremium = _ref69.isPremium,
    onPremiumGate = _ref69.onPremiumGate;
  var _useState59 = useState("legs"),
    _useState60 = _slicedToArray(_useState59, 2),
    type = _useState60[0],
    setType = _useState60[1];
  var _useState61 = useState(45),
    _useState62 = _slicedToArray(_useState61, 2),
    dur = _useState62[0],
    setDur = _useState62[1];
  var _useState63 = useState("moderate"),
    _useState64 = _slicedToArray(_useState63, 2),
    intensity = _useState64[0],
    setIntensity = _useState64[1];
  var _useState65 = useState(false),
    _useState66 = _slicedToArray(_useState65, 2),
    hevyMode = _useState66[0],
    setHevyMode = _useState66[1];
  var _useState67 = useState(""),
    _useState68 = _slicedToArray(_useState67, 2),
    hevyText = _useState68[0],
    setHevyText = _useState68[1];
  var _useState69 = useState(false),
    _useState70 = _slicedToArray(_useState69, 2),
    hevyLoading = _useState70[0],
    setHevyLoading = _useState70[1];
  var _useState71 = useState(null),
    _useState72 = _slicedToArray(_useState71, 2),
    hevyResult = _useState72[0],
    setHevyResult = _useState72[1];
  var p = prof || DEF_PROFILE;
  var estKcal = estimateSessionKcal(p.weight, p.bodyFat, type, dur, intensity);
  var totalKcal = workouts.reduce(function (s, w) {
    return s + (w.kcal || 0);
  }, 0);
  var logWorkout = function logWorkout() {
    onAdd({
      id: Date.now(),
      type: type,
      duration: dur,
      intensity: intensity,
      kcal: estKcal,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });
  };
  var parseWorkout = /*#__PURE__*/function () {
    var _ref70 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
      var prompt, _t29, _t30;
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.p = _context27.n) {
          case 0:
            if (!(!hevyText.trim() || hevyLoading)) {
              _context27.n = 1;
              break;
            }
            return _context27.a(2);
          case 1:
            setHevyLoading(true);
            setHevyResult(null);
            _context27.p = 2;
            prompt = "Parse this workout log and estimate calories burned. User: ".concat(p.weight, "kg bodyweight, ").concat(p.bodyFat, "% body fat.\n\nWorkout:\n").concat(hevyText, "\n\nReturn ONLY valid JSON: {\"estimatedKcal\":number,\"type\":\"legs|push|pull|fullbody|cardio\",\"intensity\":\"light|moderate|heavy\",\"summary\":\"brief 1 line description\"}");
            _t29 = setHevyResult;
            _context27.n = 3;
            return callAIJson(prompt, 200);
          case 3:
            _t29(_context27.v);
            _context27.n = 5;
            break;
          case 4:
            _context27.p = 4;
            _t30 = _context27.v;
            setHevyResult({
              error: "Parse failed — Cloudflare Worker required."
            });
          case 5:
            setHevyLoading(false);
          case 6:
            return _context27.a(2);
        }
      }, _callee27, null, [[2, 4]]);
    }));
    return function parseWorkout() {
      return _ref70.apply(this, arguments);
    };
  }();
  var logParsed = function logParsed() {
    if (!hevyResult || hevyResult.error) return;
    onAdd({
      id: Date.now(),
      type: hevyResult.type || "fullbody",
      duration: 60,
      intensity: hevyResult.intensity || "moderate",
      kcal: hevyResult.estimatedKcal,
      notes: hevyResult.summary,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });
    setHevyMode(false);
    setHevyText("");
    setHevyResult(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 14,
      padding: "12px 14px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-label)",
      letterSpacing: "0.1em",
      fontWeight: 800
    }
  }, "WORKOUTS ", workouts.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: A
    }
  }, "\xB7 \u26A1", workouts.length)), workouts.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 900,
      color: A
    }
  }, totalKcal, " kcal burned")), workouts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-mid-3)",
      marginBottom: 10,
      lineHeight: 1.4
    }
  }, "+", earnedToday, " kcal added to today \u2014 the rest fuels the next couple of days, so one big session doesn\u2019t all land at once."), workouts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, workouts.map(function (w) {
    return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "var(--bg)",
        borderRadius: 8,
        padding: "8px 10px",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: A,
        fontWeight: 900,
        flexShrink: 0
      }
    }, w.kcal, " kcal"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-mid-3)",
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, w.notes || "".concat(w.type, " \xB7 ").concat(w.duration, "min \xB7 ").concat(w.intensity)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "var(--text-lo-2)",
        flexShrink: 0
      }
    }, w.time), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onRemove(w.id);
      },
      style: {
        background: "none",
        border: "none",
        color: "var(--over-tint-5)",
        fontSize: 16,
        cursor: "pointer",
        padding: "0 4px",
        flexShrink: 0
      }
    }, "\xD7"));
  })), !hevyMode ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: function onChange(e) {
      return setType(e.target.value);
    },
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: "none",
      width: "auto",
      padding: "7px 10px",
      fontSize: 12
    })
  }, SESS_TYPES.map(function (t) {
    return /*#__PURE__*/React.createElement("option", {
      key: t,
      value: t
    }, t.charAt(0).toUpperCase() + t.slice(1));
  })), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "10",
    max: "180",
    value: dur,
    onChange: function onChange(e) {
      return setDur(parseInt(e.target.value) || 45);
    },
    style: _objectSpread(_objectSpread({}, INP), {}, {
      width: 56,
      padding: "7px 8px",
      textAlign: "center",
      fontSize: 12
    })
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-label)"
    }
  }, "min \xB7"), /*#__PURE__*/React.createElement("select", {
    value: intensity,
    onChange: function onChange(e) {
      return setIntensity(e.target.value);
    },
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: "none",
      width: "auto",
      padding: "7px 10px",
      fontSize: 12
    })
  }, SESS_INT.map(function (i) {
    return /*#__PURE__*/React.createElement("option", {
      key: i,
      value: i
    }, i.charAt(0).toUpperCase() + i.slice(1));
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 13,
      fontWeight: 900,
      color: A
    }
  }, estKcal, " kcal")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: logWorkout,
    style: {
      flex: 1,
      padding: "10px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 900,
      cursor: "pointer",
      letterSpacing: "0.06em"
    }
  }, "+ LOG WORKOUT"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return isPremium ? setHevyMode(true) : onPremiumGate && onPremiumGate({
        emoji: "🏋️",
        name: "Workout AI Parser"
      });
    },
    style: {
      padding: "10px 14px",
      background: "var(--bg)",
      border: "1px solid ".concat(isPremium ? aA("33") : BD),
      borderRadius: 10,
      color: isPremium ? A : "var(--text-label)",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\uD83D\uDCCB ", isPremium ? "Paste log" : "Paste log ⭐"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
    value: hevyText,
    onChange: function onChange(e) {
      return setHevyText(e.target.value);
    },
    rows: 5,
    placeholder: "Paste your workout log here...\n\nE.g.:\nBack Squat 4×5 @ 100kg\nRomanian Deadlift 3×10 @ 80kg",
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: "var(--bg)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      padding: "10px 12px",
      color: "var(--text-hi)",
      fontSize: 12,
      resize: "none",
      fontFamily: "inherit",
      outline: "none",
      lineHeight: 1.6,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: parseWorkout,
    disabled: hevyLoading || !hevyText.trim(),
    style: {
      flex: 1,
      padding: "10px",
      background: hevyText.trim() && !hevyLoading ? A : "var(--surface-2)",
      color: hevyText.trim() && !hevyLoading ? "var(--bg)" : "var(--border-strong)",
      border: "none",
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 900,
      cursor: hevyText.trim() && !hevyLoading ? "pointer" : "not-allowed",
      letterSpacing: "0.07em"
    }
  }, hevyLoading ? "PARSING..." : "🤖 PARSE WORKOUT"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setHevyMode(false);
      setHevyText("");
      setHevyResult(null);
    },
    style: {
      padding: "10px 14px",
      background: "none",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "var(--text-label)",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "\u2190 Back")), hevyResult && !hevyResult.error && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "var(--surface)",
      borderRadius: 8,
      padding: "8px 12px",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-mid-3)",
      flex: 1
    }
  }, hevyResult.summary), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: A,
      marginLeft: 10
    }
  }, hevyResult.estimatedKcal, " kcal")), /*#__PURE__*/React.createElement("button", {
    onClick: logParsed,
    style: {
      width: "100%",
      padding: "10px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 900,
      cursor: "pointer",
      letterSpacing: "0.06em"
    }
  }, "\u2713 LOG THIS WORKOUT")), hevyResult && hevyResult.error && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--over-5)",
      marginTop: 4
    }
  }, hevyResult.error)));
}

// ── Avatar ────────────────────────────────────────────────────
// Google profile pic with graceful fallback to the user's initial.
// referrerPolicy="no-referrer" stops googleusercontent from rejecting
// the request (403/429) when a cross-origin referrer is sent.
function Avatar(_ref71) {
  var user = _ref71.user,
    _ref71$size = _ref71.size,
    size = _ref71$size === void 0 ? 34 : _ref71$size;
  var _useState73 = useState(false),
    _useState74 = _slicedToArray(_useState73, 2),
    failed = _useState74[0],
    setFailed = _useState74[1];
  var letter = ((user === null || user === void 0 ? void 0 : user.name) || "P")[0].toUpperCase();
  if (user !== null && user !== void 0 && user.picture && !failed) {
    return /*#__PURE__*/React.createElement("img", {
      src: user.picture,
      width: size,
      height: size,
      referrerPolicy: "no-referrer",
      onError: function onError() {
        return setFailed(true);
      },
      style: {
        display: "block",
        borderRadius: 10
      },
      alt: ""
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: A
    }
  }, letter);
}

// ── Dashboard ─────────────────────────────────────────────────

// Inline editor for an already-logged food entry. Reused by the dashboard
// today-list and the History day view. Every field is editable by all users;
// the ✨ AI re-estimate button is premium-gated (mirrors AI Meal Log) and
// reuses the same AI_REESTIMATE_PROMPT + Open Food Facts cross-check.
function EntryEditor(_ref72) {
  var entry = _ref72.entry,
    onSave = _ref72.onSave,
    onCancel = _ref72.onCancel,
    isPremium = _ref72.isPremium,
    onPremiumGate = _ref72.onPremiumGate;
  var _useState75 = useState({
      name: entry.name,
      kcal: String(entry.kcal),
      protein: String(entry.protein),
      carbs: String(entry.carbs),
      fat: String(entry.fat)
    }),
    _useState76 = _slicedToArray(_useState75, 2),
    f = _useState76[0],
    setF = _useState76[1];
  var _useState77 = useState(false),
    _useState78 = _slicedToArray(_useState77, 2),
    reest = _useState78[0],
    setReest = _useState78[1];
  var _useState79 = useState(""),
    _useState80 = _slicedToArray(_useState79, 2),
    reestMsg = _useState80[0],
    setReestMsg = _useState80[1]; // "" | "done" | error text
  var set = function set(k, v) {
    setF(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
    });
    setReestMsg("");
  };
  var reestimate = /*#__PURE__*/function () {
    var _ref73 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28() {
      var fill, upd, oft, _t31, _t32;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.p = _context28.n) {
          case 0:
            if (isPremium) {
              _context28.n = 1;
              break;
            }
            onPremiumGate({
              emoji: "✨",
              name: "AI re-estimate"
            });
            return _context28.a(2);
          case 1:
            if (!(!f.name.trim() || reest)) {
              _context28.n = 2;
              break;
            }
            return _context28.a(2);
          case 2:
            setReest(true);
            setReestMsg("");
            fill = function fill(r) {
              return setF(function (p) {
                return _objectSpread(_objectSpread({}, p), {}, {
                  kcal: String(Math.round(r.kcal)),
                  protein: String(Math.round(r.protein * 10) / 10),
                  carbs: String(Math.round(r.carbs * 10) / 10),
                  fat: String(Math.round(r.fat * 10) / 10)
                });
              });
            };
            _context28.p = 3;
            _context28.n = 4;
            return callAIJson(AI_REESTIMATE_PROMPT(f.name.trim()), 300);
          case 4:
            upd = _context28.v;
            _context28.n = 6;
            break;
          case 5:
            _context28.p = 5;
            _t31 = _context28.v;
            setReestMsg("Couldn't reach the AI — check your connection and try again.");
            setReest(false);
            return _context28.a(2);
          case 6:
            // Show the AI answer immediately — the user never waits on Open Food Facts.
            fill(upd);
            setReestMsg("done");
            setReest(false);
            // OFF is a best-effort background refinement: bounded (6s) and may not return
            // at all on a poor connection. Only upgrades the figures if it beats the AI.
            _context28.p = 7;
            _context28.n = 8;
            return searchOFT(f.name.trim());
          case 8:
            oft = _context28.v;
            if (oft && oft.confidence > upd.confidence) fill(oft);
            _context28.n = 10;
            break;
          case 9:
            _context28.p = 9;
            _t32 = _context28.v;
          case 10:
            return _context28.a(2);
        }
      }, _callee28, null, [[7, 9], [3, 5]]);
    }));
    return function reestimate() {
      return _ref73.apply(this, arguments);
    };
  }();
  var save = function save() {
    return onSave({
      name: f.name.trim() || entry.name,
      kcal: Math.round(Number(f.kcal) || 0),
      protein: Math.round((Number(f.protein) || 0) * 10) / 10,
      carbs: Math.round((Number(f.carbs) || 0) * 10) / 10,
      fat: Math.round((Number(f.fat) || 0) * 10) / 10
    });
  };
  var fld = {
    background: BG,
    border: "1px solid ".concat(BD),
    borderRadius: 9,
    color: "var(--text-hi)",
    fontSize: 13,
    padding: "8px 10px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit"
  };
  var lbl = {
    fontSize: 10,
    color: "var(--text-lo-2)",
    fontWeight: 700,
    letterSpacing: "0.05em",
    marginBottom: 3,
    display: "block"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px 14px",
      background: "var(--surface-b)"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "NAME"), /*#__PURE__*/React.createElement("input", {
    value: f.name,
    onChange: function onChange(e) {
      return set("name", e.target.value);
    },
    style: _objectSpread(_objectSpread({}, fld), {}, {
      marginBottom: 10
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "KCAL"), /*#__PURE__*/React.createElement("input", {
    value: f.kcal,
    onChange: function onChange(e) {
      return set("kcal", e.target.value);
    },
    inputMode: "numeric",
    style: fld
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "P (g)"), /*#__PURE__*/React.createElement("input", {
    value: f.protein,
    onChange: function onChange(e) {
      return set("protein", e.target.value);
    },
    inputMode: "decimal",
    style: fld
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "C (g)"), /*#__PURE__*/React.createElement("input", {
    value: f.carbs,
    onChange: function onChange(e) {
      return set("carbs", e.target.value);
    },
    inputMode: "decimal",
    style: fld
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "F (g)"), /*#__PURE__*/React.createElement("input", {
    value: f.fat,
    onChange: function onChange(e) {
      return set("fat", e.target.value);
    },
    inputMode: "decimal",
    style: fld
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: reestimate,
    disabled: reest,
    style: {
      width: "100%",
      padding: "10px",
      marginBottom: reestMsg ? 6 : 8,
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 10,
      color: A,
      fontSize: 12.5,
      fontWeight: 800,
      cursor: "pointer",
      opacity: reest ? 0.6 : 1
    }
  }, reest ? "Re-estimating…" : reestMsg === "done" ? "✓ Updated — re-estimate again" : "✨ AI re-estimate from name"), reestMsg && reestMsg !== "done" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--over-2)",
      marginBottom: 8,
      lineHeight: 1.4
    }
  }, reestMsg), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      flex: 1,
      padding: "10px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "var(--text-label)",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      flex: 1,
      padding: "10px",
      background: A,
      border: "none",
      borderRadius: 10,
      color: "var(--bg)",
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Save")));
}
function Dashboard(_ref74) {
  var logs = _ref74.logs,
    totals = _ref74.totals,
    targets = _ref74.targets,
    remaining = _ref74.remaining,
    water = _ref74.water,
    setWater = _ref74.setWater,
    mode = _ref74.mode,
    setMode = _ref74.setMode,
    setView = _ref74.setView,
    removeLog = _ref74.removeLog,
    updateLog = _ref74.updateLog,
    addToQA = _ref74.addToQA,
    hasProfile = _ref74.hasProfile,
    streak = _ref74.streak,
    streakPop = _ref74.streakPop,
    badgeGlow = _ref74.badgeGlow,
    prof = _ref74.prof,
    weighIns = _ref74.weighIns,
    onWeighIn = _ref74.onWeighIn,
    tdeeAdj = _ref74.tdeeAdj,
    baseTDEE = _ref74.baseTDEE,
    _ref74$tdeeFloor = _ref74.tdeeFloor,
    tdeeFloor = _ref74$tdeeFloor === void 0 ? baseTDEE : _ref74$tdeeFloor,
    _ref74$showWeighNudge = _ref74.showWeighNudge,
    showWeighNudge = _ref74$showWeighNudge === void 0 ? false : _ref74$showWeighNudge,
    _ref74$onNudgeDismiss = _ref74.onNudgeDismiss,
    onNudgeDismiss = _ref74$onNudgeDismiss === void 0 ? function () {} : _ref74$onNudgeDismiss,
    _ref74$onNudgeMute = _ref74.onNudgeMute,
    onNudgeMute = _ref74$onNudgeMute === void 0 ? function () {} : _ref74$onNudgeMute,
    coachKey = _ref74.coachKey,
    _ref74$cutPrompt = _ref74.cutPrompt,
    cutPrompt = _ref74$cutPrompt === void 0 ? null : _ref74$cutPrompt,
    _ref74$onCutNudgeDism = _ref74.onCutNudgeDismiss,
    onCutNudgeDismiss = _ref74$onCutNudgeDism === void 0 ? function () {} : _ref74$onCutNudgeDism,
    _ref74$onCutPromptSno = _ref74.onCutPromptSnooze,
    onCutPromptSnooze = _ref74$onCutPromptSno === void 0 ? function () {} : _ref74$onCutPromptSno,
    _ref74$onStartDietBre = _ref74.onStartDietBreak,
    onStartDietBreak = _ref74$onStartDietBre === void 0 ? function () {} : _ref74$onStartDietBre,
    _ref74$cutBar = _ref74.cutBar,
    cutBar = _ref74$cutBar === void 0 ? null : _ref74$cutBar,
    _ref74$cutGuard = _ref74.cutGuard,
    cutGuard = _ref74$cutGuard === void 0 ? null : _ref74$cutGuard,
    _ref74$showRecharged = _ref74.showRecharged,
    showRecharged = _ref74$showRecharged === void 0 ? false : _ref74$showRecharged,
    _ref74$onDismissRecha = _ref74.onDismissRecharged,
    onDismissRecharged = _ref74$onDismissRecha === void 0 ? function () {} : _ref74$onDismissRecha,
    _ref74$showGainWhileC = _ref74.showGainWhileCutting,
    showGainWhileCutting = _ref74$showGainWhileC === void 0 ? false : _ref74$showGainWhileC,
    workouts = _ref74.workouts,
    onAddWorkout = _ref74.onAddWorkout,
    onRemoveWorkout = _ref74.onRemoveWorkout,
    customKcal = _ref74.customKcal,
    onSetCustomKcal = _ref74.onSetCustomKcal,
    isCustomMode = _ref74.isCustomMode,
    aggressiveCutAcked = _ref74.aggressiveCutAcked,
    onAckAggressiveCut = _ref74.onAckAggressiveCut,
    authState = _ref74.authState,
    authUser = _ref74.authUser,
    onPremiumGate = _ref74.onPremiumGate,
    onSignOut = _ref74.onSignOut,
    isOnline = _ref74.isOnline,
    syncMsg = _ref74.syncMsg;
  var isPremium = authState === "premium";
  var _useState81 = useState(null),
    _useState82 = _slicedToArray(_useState81, 2),
    editingId = _useState82[0],
    setEditingId = _useState82[1];
  var _useState83 = useState(false),
    _useState84 = _slicedToArray(_useState83, 2),
    askCutGuard = _useState84[0],
    setAskCutGuard = _useState84[1]; // early-return confirm (file 03)

  var overAmt = Math.round(totals.kcal - targets.kcal);
  var pct = Math.min(100, totals.kcal / targets.kcal * 100);
  var mc = MODES[mode].color;
  var isTraining = workouts.length > 0;
  var todayWorkoutKcal = workouts.reduce(function (s, w) {
    return s + (w.kcal || 0);
  }, 0); // raw, for the low-fuel copy
  // Graduated calorie status: ok (≤100 over) | amber-soft (100-200) | amber (200-500) | red (500+)
  var AMBER = "var(--warn)";
  var RED = "var(--over)";
  var kcalAccent = overAmt > 500 ? RED : overAmt > 100 ? AMBER : mc;
  var kcalLabel = overAmt > 200 ? "OVER BY" : overAmt > 100 ? "JUST OVER" : "REMAINING";
  // Confidence model (Separated): headline = ESTIMATED energy-budget maturity; intake stays exact.
  var tdeeConf = tdeeConfidence((weighIns || []).length);
  var intakeConf = intakeConfidence(logs);
  var intakeShaky = logs.length > 0 && intakeConf < INTAKE_FLAG_BELOW;
  var kcalBarBg = overAmt > 500 ? RED : overAmt > 100 ? AMBER : "linear-gradient(90deg,".concat(mc, "88,").concat(mc, ")");
  var kcalBorder = overAmt > 500 ? "color-mix(in srgb, var(--over) 13%, transparent)" : overAmt > 100 ? "color-mix(in srgb, var(--warn) 13%, transparent)" : "var(--border)";
  var _useState85 = useState({}),
    _useState86 = _slicedToArray(_useState85, 2),
    savedIds = _useState86[0],
    setSavedIds = _useState86[1];
  var _useState87 = useState({}),
    _useState88 = _slicedToArray(_useState87, 2),
    qaBlink = _useState88[0],
    setQaBlink = _useState88[1]; // log.id -> tap nonce, drives re-blink on every tap
  var _useState89 = useState(false),
    _useState90 = _slicedToArray(_useState89, 2),
    editingTarget = _useState90[0],
    setEditingTarget = _useState90[1];
  var _useState91 = useState(""),
    _useState92 = _slicedToArray(_useState91, 2),
    targetInputVal = _useState92[0],
    setTargetInputVal = _useState92[1];
  var commitTarget = function commitTarget() {
    var v = parseInt(targetInputVal);
    if (v > 0) {
      haptic();
      onSetCustomKcal(v);
    }
    setEditingTarget(false);
  };

  // Warnings computed from custom target vs effective TDEE. Use the FLOORED
  // effective TDEE (mirrors App effectiveTDEE and the maintenance floor) so a
  // custom target isn't judged against a sub-floor baseline when a negative
  // adaptive adjustment is active — otherwise a real deficit would read as smaller.
  var tdee = Math.max(tdeeFloor, baseTDEE + tdeeAdj); // effective TDEE, never below sedentary (BMR × 1.2)
  var targetWarning = function () {
    if (!isCustomMode || targets.safeMinApplied) return null;
    var diff = customKcal - tdee; // negative = deficit
    if (diff < -1000) return {
      level: aggressiveCutAcked ? "amber" : "red",
      text: "This deficit is not recommended. Extreme cuts cause muscle loss, fatigue and metabolic damage. Are you sure?"
    };
    if (diff < -750) return {
      level: "amber",
      text: "This is an aggressive deficit. You may lose muscle alongside fat. Consider ".concat((tdee - 750).toLocaleString(), " kcal or above.")
    };
    // Steady-loss floor (Step 4). A typed target isn't overridden — but a number below
    // the floor we'd set for this body earns the same plain-English explanation.
    if (targets.deficitFloor && customKcal < targets.deficitFloor) return {
      level: "amber",
      text: "That's below the ".concat(targets.deficitFloor.toLocaleString(), " kcal we'd set as your steady-loss floor \u2014 losing faster than that mostly costs muscle and is harder to stick to.")
    };
    if (diff >= -150 && diff < 0) return {
      level: "info",
      text: "Deficit is small — progress will be slow but sustainable 👍"
    };
    if (diff > 0 && diff <= 150) return {
      level: "info",
      text: "Small surplus — lean gains but slow 👍"
    };
    return null;
  }();
  var handleAddToQA = /*#__PURE__*/function () {
    var _ref75 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(log) {
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.n) {
          case 0:
            _context29.n = 1;
            return addToQA(log);
          case 1:
            setSavedIds(function (p) {
              return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, log.id, true));
            });
            setQaBlink(function (p) {
              return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, log.id, (p[log.id] || 0) + 1));
            }); // re-blink even when already saved
            setTimeout(function () {
              return setSavedIds(function (p) {
                return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, log.id, false));
              });
            }, 1800);
          case 2:
            return _context29.a(2);
        }
      }, _callee29);
    }));
    return function handleAddToQA(_x40) {
      return _ref75.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 40px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: BG,
      paddingTop: 20,
      marginTop: -20,
      paddingBottom: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 26,
      fontWeight: 900,
      color: A,
      letterSpacing: "-0.02em",
      lineHeight: 1
    }
  }, "FUEL LOG"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: 12,
      color: "var(--text-label)",
      letterSpacing: "0.06em"
    }
  }, new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short"
  }).toUpperCase()), !isOnline && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 10,
      color: "var(--warn)",
      fontWeight: 700,
      letterSpacing: "0.06em"
    }
  }, "OFFLINE"), syncMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 10,
      color: "var(--text-label)"
    }
  }, syncMsg)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, streak > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "7px 10px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 900,
      color: A,
      animation: streakPop ? "chip_pop 0.6s cubic-bezier(0.34,1.56,0.64,1)" : "none"
    }
  }, "\uD83D\uDD25", streak), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("profile");
    },
    style: {
      width: 34,
      height: 34,
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "var(--text-mid)",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u2699\uFE0F"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("history");
    },
    style: {
      width: 34,
      height: 34,
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "var(--text-mid)",
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("achievements");
    },
    style: {
      width: 34,
      height: 34,
      background: "var(--surface-2)",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "var(--text-mid)",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: badgeGlow ? "chip_glow 1.5s ease-out" : "none"
    }
  }, "\uD83C\uDFC6"), isPremium && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("account");
    },
    "aria-label": "Account & Privacy",
    style: {
      width: 34,
      height: 34,
      background: "".concat(aA("18")),
      border: "1px solid ".concat(aA("44")),
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    user: authUser
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 12
    }
  }, Object.entries(MODES).map(function (_ref76) {
    var _ref77 = _slicedToArray(_ref76, 2),
      k = _ref77[0],
      v = _ref77[1];
    var active = !isCustomMode && mode === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        if (k === "cut" && cutGuard) setAskCutGuard(true);else setMode(k);
      },
      style: {
        flex: 1,
        padding: "9px 4px",
        background: active ? mix(v.color, "22") : "var(--surface-2)",
        color: active ? v.color : "var(--text-label)",
        border: "1px solid ".concat(active ? mix(v.color, "55") : BD),
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.06em"
      }
    }, v.label);
  })), askCutGuard && cutGuard && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "BACK TO CUTTING ALREADY?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "About ", cutGuard.daysLeft, " more rest ", cutGuard.daysLeft === 1 ? "day" : "days", " would recharge you fully. It's your call.", /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAskCutGuard(false);
    },
    style: {
      flex: 1,
      padding: "8px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 9,
      color: A,
      fontSize: 11.5,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Keep resting"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setAskCutGuard(false);
      setMode("cut");
    },
    style: {
      padding: "8px 14px",
      background: "transparent",
      border: "1px solid ".concat(BD),
      borderRadius: 9,
      color: "var(--text-mid)",
      fontSize: 11.5,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Cut anyway")))), /*#__PURE__*/React.createElement(WorkoutLogger, {
    workouts: workouts,
    onAdd: onAddWorkout,
    onRemove: onRemoveWorkout,
    prof: prof,
    earnedToday: targets.bonus || 0,
    isPremium: isPremium,
    onPremiumGate: onPremiumGate
  }), !hasProfile && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("profile");
    },
    style: {
      width: "100%",
      padding: "11px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("33")),
      borderRadius: 12,
      color: A,
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 12,
      letterSpacing: "0.06em"
    }
  }, "\uD83D\uDC64 Set body stats for personalised targets \u2192"), targetWarning && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, targetWarning.level === "red" ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--over-tint-7)",
      border: "1px solid color-mix(in srgb, var(--over) 27%, transparent)",
      borderRadius: 12,
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--over)",
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 6
    }
  }, "\u26A0\uFE0F NOT RECOMMENDED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--over-deep)",
      lineHeight: 1.6,
      marginBottom: 10
    }
  }, targetWarning.text), /*#__PURE__*/React.createElement("button", {
    onClick: onAckAggressiveCut,
    style: {
      background: "color-mix(in srgb, var(--over) 13%, transparent)",
      border: "1px solid color-mix(in srgb, var(--over) 27%, transparent)",
      borderRadius: 8,
      color: "var(--over-4)",
      fontSize: 11,
      fontWeight: 800,
      padding: "7px 14px",
      cursor: "pointer"
    }
  }, "Yes, I understand \u2192")) : targetWarning.level === "amber" ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-3)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "\u26A0\uFE0F ", targetWarning.text) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface)",
      border: "1px solid var(--raised-2)",
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: 11,
      color: "var(--text-mid)",
      lineHeight: 1.5
    }
  }, "\u2139 ", targetWarning.text)), targets.safeMinApplied && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "SAFE MINIMUM APPLIED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, isCustomMode ? "That's below the safe minimum for your body. We've set it to ".concat(targets.kcal.toLocaleString(), " kcal to keep you safe.") : "Your target has been set to the safe minimum.", " ", /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("profile");
    },
    style: {
      background: "none",
      border: "none",
      color: AMBER,
      fontSize: 11,
      fontWeight: 700,
      padding: 0,
      cursor: "pointer",
      textDecoration: "underline"
    }
  }, "Check your profile stats.")))), targets.bmrFloorApplied && !targets.safeMinApplied && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83D\uDEE1\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "HELD AT YOUR MINIMUM MAINTENANCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "Your maintenance can't sit below your body's sedentary energy use, so we've held today's target at ", targets.kcal.toLocaleString(), " kcal. If the scale keeps rising, a short diet break usually beats eating less."))), targets.deficitFloorApplied && !targets.safeMinApplied && !targets.bmrFloorApplied && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83D\uDEE1\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "EASED TO A STEADY PACE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "A ", MODES[mode].label.toLowerCase(), " at your size would have taken too big a bite out of today, so we've set it to ", targets.kcal.toLocaleString(), " kcal.", /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: AMBER,
      fontWeight: 700,
      fontSize: 11
    }
  }, "Why?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: "var(--text-mid)"
    }
  }, "Your floor is worked out from your own body \u2014 it's a quarter below what we think you burn in a day, so it moves as you do. Losing faster than that mostly costs you muscle, sleep and training quality, and it's much harder to stick to."))))), mode === "cut" && targets.kcal < targets.bmr && !targets.safeMinApplied && !targets.bmrFloorApplied && !targets.deficitFloorApplied && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83C\uDF19"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "BELOW YOUR RESTING METABOLISM"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "Fine short-term, not a level to live at.", /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: AMBER,
      fontWeight: 700,
      fontSize: 11
    }
  }, "Why?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: "var(--text-mid)"
    }
  }, "Your resting metabolism (", targets.bmr.toLocaleString(), " kcal) is what your body would use doing nothing at all \u2014 but you don't do nothing, so eating under it for a stretch is normal on a cut and is not the same as starving. It's a reasonable place to be for a few weeks, not a place to settle. The break prompts will tell you when you've been at it a while."))))), targets.lowFuel && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\u26FD"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "LOW ON FUEL TODAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "Today's training used about ", todayWorkoutKcal.toLocaleString(), " kcal, which doesn't leave much behind for recovery. Eating a bit more today would be worth it.", /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: AMBER,
      fontWeight: 700,
      fontSize: 11
    }
  }, "Why?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: "var(--text-mid)"
    }
  }, "What matters isn't just what you eat \u2014 it's what's left once training has taken its share. At your body composition there isn't much spare to draw on, and running short for weeks at a time tends to show up as flat training, poor sleep, low mood and hormonal changes. One light day is nothing to worry about."))))), showGainWhileCutting && /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(aA("33")),
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83D\uDCA7"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "WEIGHT UP WHILE EATING LESS THAN MAINTENANCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "This is usually water, glycogen or muscle \u2014 not a slower metabolism. Your target hasn't been lowered.", /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: A,
      fontWeight: 700,
      fontSize: 11
    }
  }, "Why?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: "var(--text-mid)"
    }
  }, "The scale weighs everything, not just fat. Under-eating and stress both make you hold water, glycogen swings a kilo either way, and training builds tissue that weighs more than it looks. None of that means you burn less than we thought, so the app leaves your number where it is rather than asking you to eat less.", " ", "If you've been training hard, updating your body-fat % in your profile keeps your targets tracking your real lean mass.")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("profile");
    },
    style: {
      background: "none",
      border: "none",
      color: A,
      fontSize: 11,
      fontWeight: 700,
      padding: "6px 0 0",
      cursor: "pointer",
      textDecoration: "underline"
    }
  }, "Update my body-fat %")))), cutBar && /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: "0.06em",
      color: cutBar.draining ? A : "var(--text-label)"
    }
  }, cutBar.draining ? cutBar.restDays > 0 ? "ON A BREAK \xB7 DAY ".concat(cutBar.restDays) : "ON A BREAK · STARTING TODAY" : "CUTTING \xB7 WEEK ".concat(cutBar.weeks)), cutBar.draining && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-mid)"
    }
  }, "about ", cutBar.daysLeft, " ", cutBar.daysLeft === 1 ? "day" : "days", " to fully recharged")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 999,
      background: "var(--surface-2)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "".concat(cutBar.pct, "%"),
      height: "100%",
      borderRadius: 999,
      background: cutBar.draining ? A : AMBER,
      transition: "width 0.4s ease"
    }
  })), cutBar.draining && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-mid)",
      lineHeight: 1.5,
      marginTop: 6
    }
  }, "Recharging now sets up your next block.", cutBar.weightUp && " Weight up a little on a break is normal — usually water and glycogen, not fat.")), showRecharged && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("33")),
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83D\uDD0B"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "RECHARGED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "You're in good shape to cut again, if you want to.")), /*#__PURE__*/React.createElement("button", {
    onClick: onDismissRecharged,
    style: {
      background: "none",
      border: "none",
      color: "var(--text-faint-2)",
      fontSize: 16,
      padding: "0 2px",
      cursor: "pointer",
      lineHeight: 1
    }
  }, "\xD7")), cutPrompt && cutPrompt.level === "soft" && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83D\uDD04"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, cutPrompt.stalled ? "YOUR LOSS HAS STALLED" : "YOU'VE BEEN CUTTING FOR ".concat(cutPrompt.weeks, " WEEKS")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, cutPrompt.stalled ? "The scale hasn't moved in about three weeks. Bodies adapt to a long deficit — a couple of weeks at maintenance is how you reset it." : "A couple of weeks at maintenance now can ease diet fatigue and make the next stretch easier.", /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: AMBER,
      fontWeight: 700,
      fontSize: 11
    }
  }, "Why?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: "var(--text-mid)"
    }
  }, cutPrompt.stalled ? "A stall isn't a discipline problem, and eating less is rarely the fix. After a long\n                       stretch in a deficit the body quietly spends less \u2014 you move less without noticing,\n                       and water can hide real fat loss for weeks. Time at maintenance settles all three\n                       and re-checks whether your maintenance estimate is still right." : "Long deficits get harder, not easier \u2014 hunger climbs, training goes flat, and holding\n                       the line takes more out of you than it did in week one. A break isn't lost progress:\n                       it's what makes the next block work, and it re-checks whether your maintenance\n                       estimate is still right.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onStartDietBreak,
    style: {
      flex: 1,
      padding: "8px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 9,
      color: A,
      fontSize: 11.5,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Start a 2-week break"), /*#__PURE__*/React.createElement("button", {
    onClick: onCutNudgeDismiss,
    style: {
      padding: "8px 14px",
      background: "transparent",
      border: "1px solid ".concat(BD),
      borderRadius: 9,
      color: "var(--text-mid)",
      fontSize: 11.5,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Not yet"))))), cutPrompt && cutPrompt.level === "hard" && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--over-tint-2)",
      border: "1px solid var(--over-tint)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\uD83D\uDD04"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--over)",
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "TIME FOR A DIET BREAK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, cutPrompt.bigLoss ? "You've lost 5% of your bodyweight this block \u2014 a great point to consolidate." : "".concat(cutPrompt.weeks, " weeks is a long stretch in a deficit. Let's spend a couple of weeks at maintenance."), /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: "var(--over)",
      fontWeight: 700,
      fontSize: 11
    }
  }, "Why?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      color: "var(--text-mid)"
    }
  }, "There's no day count at which something suddenly goes wrong \u2014 but the deeper the deficit and the longer it runs, the more it costs you in muscle, sleep, training and mood, and the more your body pushes back. Time at maintenance is how you keep the results you've earned. If you're feeling run down with it, it's worth talking to a doctor.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onStartDietBreak,
    style: {
      flex: 1,
      padding: "8px",
      background: "var(--surface-2)",
      border: "1px solid var(--over-tint)",
      borderRadius: 9,
      color: "var(--over)",
      fontSize: 11.5,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Start a 2-week break"), /*#__PURE__*/React.createElement("button", {
    onClick: onCutPromptSnooze,
    style: {
      padding: "8px 14px",
      background: "transparent",
      border: "1px solid ".concat(BD),
      borderRadius: 9,
      color: "var(--text-mid)",
      fontSize: 11.5,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Remind me in 3 days"))))), targets.floorsExceedKcal && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-tint-2)",
      border: "1px solid color-mix(in srgb, var(--warn) 20%, transparent)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 12,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 1
    }
  }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: AMBER,
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 2
    }
  }, "FLOORS KEPT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--gold-dim)",
      lineHeight: 1.5
    }
  }, "This target's too low to hit your protein and fat floors. We've kept your floors, so your macros add up to a bit more than this number."))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 22,
      border: "1px solid ".concat(kcalBorder),
      padding: "20px 22px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: mc,
      letterSpacing: "0.12em",
      fontWeight: 800
    }
  }, MODES[mode].label, isTraining ? " · ⚡" : ""), editingTarget ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: mc + "12",
      border: "1px solid ".concat(mc + "55"),
      borderRadius: 8,
      padding: "5px 10px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    value: targetInputVal,
    onChange: function onChange(e) {
      return setTargetInputVal(e.target.value);
    },
    onBlur: commitTarget,
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") e.target.blur();
      if (e.key === "Escape") setEditingTarget(false);
    },
    autoFocus: true,
    style: {
      background: "none",
      border: "none",
      color: mc,
      fontSize: 13,
      fontWeight: 900,
      width: 60,
      textAlign: "center",
      fontFamily: "inherit",
      outline: "none",
      padding: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: mc + "99"
    }
  }, "kcal")) : /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      setTargetInputVal(String(targets.kcal));
      setEditingTarget(true);
    },
    style: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: isCustomMode ? mc + "12" : "var(--surface-2)",
      border: "1px solid ".concat(isCustomMode ? mc + "44" : "var(--raised)"),
      borderRadius: 8,
      padding: "5px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: isCustomMode ? mc : "var(--text-mid-4)",
      fontWeight: 700
    }
  }, targets.kcal.toLocaleString(), " kcal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: isCustomMode ? mc + "99" : "var(--text-faint)"
    }
  }, "\u270E"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      marginBottom: 4
    }
  }, "CONSUMED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 42,
      fontWeight: 900,
      color: overAmt > 100 ? kcalAccent : "var(--text-hi-b)",
      lineHeight: 1,
      letterSpacing: "-0.03em"
    }
  }, Math.round(totals.kcal).toLocaleString(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-label)",
      fontWeight: 400,
      marginLeft: 5
    }
  }, "kcal"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      marginBottom: 4
    }
  }, kcalLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 900,
      color: kcalAccent,
      lineHeight: 1
    }
  }, Math.abs(Math.round(remaining)).toLocaleString(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: overAmt > 100 ? mix(kcalAccent, "99") : "var(--text-mid-2)",
      fontWeight: 400,
      marginLeft: 4
    }
  }, "kcal")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "var(--text-faint-2)",
      letterSpacing: "0.07em",
      fontWeight: 700,
      marginTop: 5
    },
    title: "Your energy budget (maintenance/TDEE) is estimated and improves as you log weigh-ins. Logged food is exact."
  }, "EST. BUDGET \xB7 ", tdeeConf, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10,
      background: "var(--surface-2)",
      borderRadius: 99,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: "".concat(pct, "%"),
      background: kcalBarBg,
      borderRadius: 99,
      transition: "width 0.5s"
    }
  })), intakeShaky && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-lo-2)",
      marginTop: 7,
      display: "flex",
      gap: 5,
      alignItems: "flex-start",
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2248"), /*#__PURE__*/React.createElement("span", null, "Today's intake is mostly AI-estimated (~", intakeConf, "% confident) \u2014 review elements for accuracy."))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 14
    }
  }, "MACROS"), /*#__PURE__*/React.createElement(MBar, {
    label: "PROTEIN",
    value: totals.protein,
    target: targets.protein,
    color: "var(--cut)"
  }), /*#__PURE__*/React.createElement(MBar, {
    label: "CARBS",
    value: totals.carbs,
    target: targets.carbs,
    color: "var(--warn)"
  }), /*#__PURE__*/React.createElement(MBar, {
    label: "FAT",
    value: totals.fat,
    target: targets.fat,
    color: "var(--bulk)"
  })), isPremium && /*#__PURE__*/React.createElement(CoachCard, {
    key: coachKey,
    mode: mode,
    totals: totals,
    targets: targets,
    streak: streak,
    water: water,
    logs: logs
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 20,
      padding: "16px 20px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 3
    }
  }, "WATER"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: "var(--cut)"
    }
  }, water, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--cut-tint-5)",
      fontWeight: 400,
      marginLeft: 5
    }
  }, "/ 8 glasses"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setWater(Math.max(0, water - 1));
    },
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "var(--cut-tint-3)",
      border: "1px solid var(--cut-tint-2)",
      color: "var(--cut)",
      fontSize: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setWater(water + 1);
    },
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "var(--cut-tint-4)",
      border: "1px solid var(--cut-tint)",
      color: "var(--cut)",
      fontSize: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "+"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5
    }
  }, Array.from({
    length: 8
  }).map(function (_, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        height: 6,
        borderRadius: 99,
        background: i < water ? "var(--cut)" : "var(--cut-tint-6)",
        transition: "background 0.2s"
      }
    });
  }))), showWeighNudge && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("33")),
      borderRadius: 16,
      padding: "14px 16px",
      marginBottom: 12,
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      marginTop: 1
    }
  }, "\u2696\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "var(--text-hi)",
      marginBottom: 2
    }
  }, "Time for a quick check-in?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-mid-2)",
      lineHeight: 1.5,
      marginBottom: 10
    }
  }, "It's been a week since your last weigh-in. A quick one keeps your targets accurate \u2014 we use your 7-day trend, not any single day. No pressure, whenever suits."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onNudgeDismiss,
    style: {
      padding: "8px 14px",
      borderRadius: 9,
      fontSize: 12,
      fontWeight: 800,
      border: "none",
      background: A,
      color: "var(--bg)"
    }
  }, "Log weight"), /*#__PURE__*/React.createElement("button", {
    onClick: onNudgeDismiss,
    style: {
      padding: "8px 14px",
      borderRadius: 9,
      fontSize: 12,
      fontWeight: 700,
      border: "1px solid ".concat(BD),
      background: "transparent",
      color: "var(--text-mid)"
    }
  }, "Not now"), /*#__PURE__*/React.createElement("button", {
    onClick: onNudgeMute,
    style: {
      padding: "8px 10px",
      borderRadius: 9,
      fontSize: 12,
      fontWeight: 600,
      border: "none",
      background: "transparent",
      color: "var(--text-label)"
    }
  }, "Don't remind me")))), /*#__PURE__*/React.createElement(WeighInWidget, {
    weighIns: weighIns,
    onWeighIn: onWeighIn,
    tdeeAdj: tdeeAdj,
    baseTDEE: baseTDEE,
    tdeeFloor: tdeeFloor
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10,
      marginBottom: 20
    }
  }, [{
    e: "🤖",
    l: "AI LOG",
    s: isPremium ? "describe it" : "premium ⭐",
    v: "ai",
    premium: true
  }, {
    e: "⚡",
    l: "QUICK ADD",
    s: "preset meals",
    v: "quick",
    premium: false
  }, {
    e: "🔍",
    l: "SEARCH",
    s: "food database",
    v: "search",
    premium: false
  }].map(function (b) {
    return /*#__PURE__*/React.createElement("button", {
      key: b.v,
      onClick: function onClick() {
        return b.premium && !isPremium ? onPremiumGate({
          emoji: b.e,
          name: b.l
        }) : setView(b.v);
      },
      style: {
        background: CARD,
        border: "1px solid ".concat(b.premium && !isPremium ? BD : BD),
        borderRadius: 16,
        padding: "16px 8px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        marginBottom: 5
      }
    }, b.e), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 900,
        color: b.premium && !isPremium ? "var(--text-label)" : A,
        letterSpacing: "0.07em"
      }
    }, b.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--text-faint-2)",
        marginTop: 3
      }
    }, b.s));
  })), logs.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 20,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "13px 20px 11px",
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      borderBottom: "1px solid ".concat(BD)
    }
  }, "TODAY'S LOG \xB7 ", logs.length, " ITEM", logs.length !== 1 ? "S" : ""), _toConsumableArray(logs).reverse().map(function (log, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: log.id,
      style: {
        borderBottom: i < logs.length - 1 ? "1px solid ".concat(BD) : "none"
      }
    }, editingId === log.id ? /*#__PURE__*/React.createElement(EntryEditor, {
      entry: log,
      isPremium: isPremium,
      onPremiumGate: onPremiumGate,
      onCancel: function onCancel() {
        return setEditingId(null);
      },
      onSave: function onSave(patch) {
        updateLog(log.id, patch);
        setEditingId(null);
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "13px 16px",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        return setEditingId(log.id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-hi)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, log.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-lo)",
        marginTop: 3
      }
    }, log.time, " \xB7 P:", log.protein, "g C:", log.carbs, "g F:", log.fat, "g ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-faint-2)"
      }
    }, "\u270E"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: A,
        flexShrink: 0
      }
    }, Math.round(log.kcal)), /*#__PURE__*/React.createElement("button", {
      key: "qa-" + log.id + "-" + (qaBlink[log.id] || 0),
      onClick: function onClick() {
        return handleAddToQA(log);
      },
      style: {
        flexShrink: 0,
        padding: "7px 12px",
        background: savedIds[log.id] ? aA("22") : "var(--surface-2)",
        border: "1px solid ".concat(savedIds[log.id] ? aA("66") : "var(--raised)"),
        borderRadius: 10,
        color: savedIds[log.id] ? A : "var(--text-lo-2)",
        animation: savedIds[log.id] ? "blink_add 0.4s ease-out" : "none",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer"
      }
    }, savedIds[log.id] ? "✓" : "⚡"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return removeLog(log.id);
      },
      style: {
        flexShrink: 0,
        width: 32,
        height: 32,
        background: "var(--over-tint-2)",
        border: "1px solid var(--over-tint)",
        borderRadius: 10,
        color: "var(--over-deep-2)",
        fontSize: 16,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, "\xD7")));
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "30px 20px",
      color: "var(--text-faint-2)",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 8
    }
  }, "\uD83C\uDF7D\uFE0F"), "Nothing logged yet today."));
}

// ── AI Log ────────────────────────────────────────────────────

var AI_PROMPT = function AI_PROMPT(desc) {
  return "You are a nutrition database expert with encyclopaedic knowledge of UK and international commercial food products, restaurant menus, supermarket items, and portion sizes. Your estimates directly affect someone's health and body composition goals \u2014 accuracy is CRITICAL. Under-fuelling and over-fuelling are both harmful.\n\nRules:\n- For any named restaurant, brand or product (GDK, Pret, McDonald's, Greggs, Magic Spoon, Quest, Grenade, Weetabix, Oatly etc.) use your precise knowledge of their ACTUAL menu nutrition data \u2014 never substitute a generic equivalent.\n- Break the meal into individual components. Each component gets its own nutrition estimate and confidence score.\n- Confidence score (0-100): 90+ means you have exact menu/label data. 60-89 means good knowledge but some uncertainty. Below 60 means you are estimating and the user should verify.\n- If a component is ambiguous (e.g. \"large meal\" at a restaurant that only does regular), state the ambiguity in the reasoning field.\n- Be conservative \u2014 if unsure between two estimates, explain both.\n- For ANY component whose confidence is below 80, set \"ask\" to the SINGLE highest-leverage unknown that, if clarified, would most improve the estimate: \"fat\" (hidden cooking fat \u2014 oil/butter vs dry/grilled), \"portion\" (ambiguous amount/size), or \"version\" (animal-vs-plant or major recipe variant). If confidence is 80+, or no single question would help, set \"ask\" to null.\n\nMeal to analyse: \"".concat(desc, "\"\n\nReturn ONLY valid JSON (no markdown, no preamble):\n{\n  \"items\": [\n    {\n      \"name\": \"specific item name with quantity/size\",\n      \"kcal\": number,\n      \"protein\": number,\n      \"carbs\": number,\n      \"fat\": number,\n      \"confidence\": number,\n      \"ask\": \"fat\" | \"portion\" | \"version\" | null,\n      \"reasoning\": \"one sentence explaining source of data or uncertainty\"\n    }\n  ]\n}");
};

// Vision variant — same contract, but the meal is in the attached photo. Any
// typed text is optional extra context (brand, restaurant, portion the user knows).
var AI_PHOTO_PROMPT = function AI_PHOTO_PROMPT(desc) {
  return "You are a nutrition database expert with encyclopaedic knowledge of UK and international foods, restaurant menus, supermarket items, and portion sizes. Your estimates directly affect someone's health and body composition goals \u2014 accuracy is CRITICAL.\n\nA photo of a meal is attached. Identify each distinct food on the plate and estimate its nutrition.\n\nRules:\n- Identify every distinct component you can see; estimate portion size from visual cues (plate size, utensils, relative proportions).\n- Confidence score (0-100): 90+ only when you can clearly identify a branded/known item; 60-89 for confident generic identification; below 60 when the item or portion is genuinely unclear from the image.\n- Hidden cooking fat and exact portion are the usual photo blind spots \u2014 reflect that in confidence and in \"ask\".\n- For ANY component with confidence below 80, set \"ask\" to the single highest-leverage unknown: \"fat\", \"portion\", or \"version\" (see below). Otherwise null.\n".concat(desc && desc.trim() ? "\nThe user added this context: \"".concat(desc.trim(), "\" \u2014 use it to disambiguate.\n") : "", "\n\"ask\" meanings: \"fat\" = hidden cooking fat (oil/butter vs dry/grilled); \"portion\" = ambiguous amount/size; \"version\" = animal-vs-plant or major recipe variant.\n\nReturn ONLY valid JSON (no markdown, no preamble):\n{\n  \"items\": [\n    { \"name\": \"specific food with estimated portion\", \"kcal\": number, \"protein\": number, \"carbs\": number, \"fat\": number, \"confidence\": number, \"ask\": \"fat\" | \"portion\" | \"version\" | null, \"reasoning\": \"one sentence\" }\n  ]\n}");
};
var AI_REESTIMATE_PROMPT = function AI_REESTIMATE_PROMPT(item) {
  return "You are a nutrition database expert. Re-estimate the nutritional content for this specific food item with maximum accuracy.\n\nItem: \"".concat(item, "\"\n\nApply the same rules: use exact menu/label data for branded products. Be precise, not approximate.\n\nReturn ONLY valid JSON (no markdown):\n{\n  \"name\": \"item name\",\n  \"kcal\": number,\n  \"protein\": number,\n  \"carbs\": number,\n  \"fat\": number,\n  \"confidence\": number,\n  \"reasoning\": \"one sentence explaining source\"\n}");
};
var confColor = function confColor(c) {
  return c <= 33 ? "var(--over)" : c <= 66 ? "var(--warn)" : A;
};
var confLabel = function confLabel(c) {
  return c <= 33 ? "Low" : c <= 66 ? "Medium" : "High";
};

// Normalise a model-supplied confidence to an integer 0–100. Vision models
// sometimes hand back a 0–1 fraction (e.g. 0.72) despite the prompt asking for
// 0–100 — without this, 0.72 renders as "0.72%", mis-gates follow-ups, and gets
// stored as ~1% confident (wrongly flagging the day + dropping it from
// calibration). A bare value <=1 is treated as a fraction; everything is then
// held within 0–100.
var normConf = function normConf(c) {
  var n = Number(c);
  if (!isFinite(n)) return 50;
  if (n > 0 && n <= 1) n = n * 100;
  return Math.round(Math.max(0, Math.min(100, n)));
};

// ── AI capture: confidence-gated follow-ups (coach hat, 2026-06-25) ──────────
// Threshold reuses INTAKE_FLAG_BELOW (80) — the same kcal-weighted bar that
// intakeConfidence already calls "guess-heavy". No new magic number.
var FOLLOWUP_BELOW = INTAKE_FLAG_BELOW;

// Butter only makes sense if dairy is on the user's menu. Vegan / dairy-free
// diets — or a milk/dairy allergen — switch the cooking-fat prompt to oil only.
var dairyAvoided = function dairyAvoided() {
  var diets = (DIETARY.diets || []).map(function (d) {
    return d.toLowerCase();
  });
  var allg = (DIETARY.allergens || []).map(function (a) {
    return a.toLowerCase();
  });
  return diets.some(function (d) {
    return /vegan|dairy[\s-]?free/.test(d);
  }) || allg.some(function (a) {
    return /milk|dairy/.test(a);
  });
};

// The model tags each low-confidence element with an `ask` reason code; we map
// it to a question + chips here. fat/portion refine deterministically offline
// (no extra AI call); version re-estimates the element by name (macros genuinely
// change between animal/plant versions — a faked offline swap would be a guess
// dressed as a fact, which the coach hat forbids).
var FOLLOWUP_BANK = {
  // Framed around ADDED FAT, not cooking style, so it reads sensibly for every
  // food — "grilled" is nonsense for an egg, but "any oil or butter?" is not.
  fat: {
    mode: "fat",
    q: function q(f) {
      return "Any oil".concat(dairyAvoided() ? "" : " or butter", " on the ").concat(f, "?");
    },
    chips: [{
      label: "None / dry (boiled, poached, grilled)",
      factor: 0.9,
      conf: 85
    }, {
      label: "A little",
      factor: 1.0,
      conf: 85
    }, {
      label: "Fried / generous",
      factor: 1.3,
      conf: 82
    }, {
      label: "Not sure",
      factor: 1.0,
      conf: null
    }]
  },
  portion: {
    mode: "scale",
    q: function q(f) {
      return "Roughly how much ".concat(f, "?");
    },
    chips: [{
      label: "Small (under a fist)",
      factor: 0.7,
      conf: 85
    }, {
      label: "Medium (a fist)",
      factor: 1.0,
      conf: 85
    }, {
      label: "Large (two fists+)",
      factor: 1.5,
      conf: 85
    }, {
      label: "Not sure",
      factor: 1.0,
      conf: null
    }]
  },
  version: {
    mode: "version",
    q: function q(f) {
      return "Which version of the ".concat(f, "?");
    },
    chips: [{
      label: "Standard",
      ver: "",
      conf: 85
    }, {
      label: "Vegetarian",
      ver: "vegetarian",
      conf: 85
    }, {
      label: "Vegan",
      ver: "vegan",
      conf: 85
    }, {
      label: "Not sure",
      ver: null,
      conf: null
    }]
  }
};

// Refine one element from a follow-up answer. Pure + deterministic (mirrored in
// Jest). mode "scale": portion → all macros + kcal scale. mode "fat": cooking
// fat → kcal + fat scale, protein/carbs held. Confidence rises to `conf` but
// never drops (answering only clarifies). conf null ("Not sure") = unchanged.
var refineElement = function refineElement(el, mode, factor, conf) {
  if (conf == null) return el;
  var r1 = function r1(n) {
    return Math.round(n * 10) / 10;
  };
  var out = mode === "fat" ? _objectSpread(_objectSpread({}, el), {}, {
    kcal: Math.round(el.kcal * factor),
    fat: r1(el.fat * factor)
  }) : _objectSpread(_objectSpread({}, el), {}, {
    kcal: Math.round(el.kcal * factor),
    protein: r1(el.protein * factor),
    carbs: r1(el.carbs * factor),
    fat: r1(el.fat * factor)
  });
  out.confidence = Math.max(el.confidence, conf);
  return out;
};

// Up to 2 elements worth asking about, ranked by uncertainty IMPACT =
// kcal*(100-conf) — a fuzzy big main matters, a fuzzy garnish doesn't. Only
// elements the model tagged with a known `ask` reason qualify. (coach)
var pickFollowups = function pickFollowups(items) {
  return (items || []).map(function (it, idx) {
    return {
      idx: idx,
      ask: it.ask,
      name: it.name,
      impact: (it.kcal || 0) * (100 - (it.confidence || 0))
    };
  }).filter(function (x) {
    return x.ask && FOLLOWUP_BANK[x.ask];
  }).sort(function (a, b) {
    return b.impact - a.impact;
  }).slice(0, 2);
};

// On-device speech recognition handle (null when the browser lacks it → the mic
// button gracefully hides). Only the transcript ever leaves the device.
var SpeechRec = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

// Downscale a captured photo to <=1024px and re-encode JPEG so the vision
// payload stays small (cheaper + within the worker's body limits). The result
// lives only in component state — never written to storage. Returns
// { base64, mediaType, preview }.
var fileToImage = function fileToImage(file) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1024;
  var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.7;
  return new Promise(function (resolve, reject) {
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function () {
      URL.revokeObjectURL(url);
      var scale = Math.min(1, max / Math.max(img.width, img.height));
      var w = Math.max(1, Math.round(img.width * scale));
      var h = Math.max(1, Math.round(img.height * scale));
      var cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      var dataUrl = cv.toDataURL("image/jpeg", quality);
      resolve({
        base64: dataUrl.split(",")[1],
        mediaType: "image/jpeg",
        preview: dataUrl
      });
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
};

// "Report estimate as wrong" → opens a prefilled email (Google Play GenAI app
// policy needs a working report path). Sends only what the user already gave the
// AI — the description + the numbers — never account data. (launch + design)
var reportEstimate = function reportEstimate(desc, items, totals) {
  var lines = (items || []).map(function (it) {
    return "- ".concat(it.name, ": ").concat(Math.round(it.kcal), " kcal (P").concat(it.protein, "/C").concat(it.carbs, "/F").concat(it.fat, ") ").concat(it.confidence, "%");
  }).join("\n");
  var body = "I think this AI estimate is wrong.\n\nMy description:\n" + (desc ? desc : "(photo only)") + "\n\nEstimate:\n" + lines + "\n\nTotal: " + Math.round(totals && totals.kcal || 0) + " kcal" + "\n\nWhat was off:\n";
  window.location.href = "mailto:fuellogadmin@gmail.com?subject=" + encodeURIComponent("Fuel Log — inaccurate AI estimate") + "&body=" + encodeURIComponent(body);
};
function searchOFT(_x41) {
  return _searchOFT.apply(this, arguments);
}
function _searchOFT() {
  _searchOFT = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee58(query) {
    var _p$product_name2, ctrl, timer, res, data, p, sg2, f, n, _t41;
    return _regenerator().w(function (_context58) {
      while (1) switch (_context58.p = _context58.n) {
        case 0:
          _context58.p = 0;
          // Bound this optional cross-check — OFF is flaky; never let it add a long
          // tail to an AI result. Abort after 6s and fall back to the AI estimate.
          ctrl = new AbortController();
          timer = setTimeout(function () {
            return ctrl.abort();
          }, 6000);
          _context58.p = 1;
          _context58.n = 2;
          return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms=".concat(encodeURIComponent(query), "&search_simple=1&action=process&json=1&page_size=3&fields=product_name,nutriments,serving_size"), {
            signal: ctrl.signal
          });
        case 2:
          res = _context58.v;
        case 3:
          _context58.p = 3;
          clearTimeout(timer);
          return _context58.f(3);
        case 4:
          _context58.n = 5;
          return res.json();
        case 5:
          data = _context58.v;
          p = (data.products || []).find(function (p) {
            var _p$nutriments;
            return ((_p$nutriments = p.nutriments) === null || _p$nutriments === void 0 ? void 0 : _p$nutriments["energy-kcal_100g"]) != null;
          });
          if (p) {
            _context58.n = 6;
            break;
          }
          return _context58.a(2, null);
        case 6:
          sg2 = parseFloat(p.serving_size) || 100, f = sg2 / 100, n = p.nutriments;
          return _context58.a(2, {
            name: (_p$product_name2 = p.product_name) === null || _p$product_name2 === void 0 ? void 0 : _p$product_name2.trim(),
            kcal: Math.round((n["energy-kcal_100g"] || 0) * f),
            protein: Math.round((n["proteins_100g"] || 0) * f * 10) / 10,
            carbs: Math.round((n["carbohydrates_100g"] || 0) * f * 10) / 10,
            fat: Math.round((n["fat_100g"] || 0) * f * 10) / 10,
            confidence: 98,
            reasoning: "Open Food Facts label data \u2014 ".concat(p.product_name, " per serving (~").concat(Math.round(sg2), "g)"),
            source: "oft"
          });
        case 7:
          _context58.p = 7;
          _t41 = _context58.v;
          return _context58.a(2, null);
      }
    }, _callee58, null, [[1,, 3, 4], [0, 7]]);
  }));
  return _searchOFT.apply(this, arguments);
}
function ItemRow(_ref78) {
  var item = _ref78.item,
    onReestimate = _ref78.onReestimate,
    reestimating = _ref78.reestimating;
  var _useState93 = useState(false),
    _useState94 = _slicedToArray(_useState93, 2),
    editing = _useState94[0],
    setEditing = _useState94[1];
  var _useState95 = useState(item.name),
    _useState96 = _slicedToArray(_useState95, 2),
    draft = _useState96[0],
    setDraft = _useState96[1];
  var cc = confColor(item.confidence);
  var itemAllergens = scanAllergens(item.name, DIETARY.allergens); // zero-token backstop

  var submit = function submit() {
    setEditing(false);
    if (draft.trim() !== item.name) onReestimate(draft.trim());
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg)",
      borderRadius: 12,
      padding: "12px 14px",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      paddingRight: 10
    }
  }, editing ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: function onChange(e) {
      return setDraft(e.target.value);
    },
    style: _objectSpread(_objectSpread({}, INP), {}, {
      padding: "6px 10px",
      fontSize: 13,
      flex: 1
    }),
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && submit();
    },
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    style: {
      padding: "6px 12px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 900,
      cursor: "pointer"
    }
  }, reestimating ? "..." : "↺")) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-hi)",
      cursor: "pointer"
    },
    onClick: function onClick() {
      return setEditing(true);
    }
  }, item.name, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)"
    }
  }, "\u270F\uFE0F")), item.source === "oft" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--cut)",
      marginTop: 2,
      letterSpacing: "0.06em"
    }
  }, "\uD83D\uDCE6 LABEL DATA")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: A
    }
  }, Math.round(item.kcal)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: cc,
      fontWeight: 700,
      marginTop: 1
    }
  }, item.confidence, "% ", confLabel(item.confidence)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo)"
    }
  }, "P:", item.protein, "g \xB7 C:", item.carbs, "g \xB7 F:", item.fat, "g"), item.reasoning && !editing && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      marginTop: 5,
      lineHeight: 1.5,
      fontStyle: "italic"
    }
  }, item.reasoning), itemAllergens.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: "var(--bulk-2)",
      fontWeight: 700,
      lineHeight: 1.4
    }
  }, "\u26A0\uFE0F Contains ", itemAllergens.join(", "), " \u2014 flagged from your allergies."));
}
function AILog(_ref79) {
  var onAdd = _ref79.onAdd,
    onBack = _ref79.onBack;
  var _useState97 = useState(""),
    _useState98 = _slicedToArray(_useState97, 2),
    desc = _useState98[0],
    setDesc = _useState98[1];
  var _useState99 = useState(false),
    _useState100 = _slicedToArray(_useState99, 2),
    loading = _useState100[0],
    setLoading = _useState100[1];
  var _useState101 = useState(null),
    _useState102 = _slicedToArray(_useState101, 2),
    items = _useState102[0],
    setItems = _useState102[1];
  var _useState103 = useState(null),
    _useState104 = _slicedToArray(_useState103, 2),
    reestIdx = _useState104[0],
    setReestIdx = _useState104[1];
  var _useState105 = useState(""),
    _useState106 = _slicedToArray(_useState105, 2),
    error = _useState106[0],
    setError = _useState106[1];
  var _useState107 = useState(false),
    _useState108 = _slicedToArray(_useState107, 2),
    loggedAll = _useState108[0],
    setLoggedAll = _useState108[1];
  var _useState109 = useState({}),
    _useState110 = _slicedToArray(_useState109, 2),
    loggedCount = _useState110[0],
    setLoggedCount = _useState110[1]; // idx -> times logged (ephemeral; resets on unmount)
  // Capture adapters — voice transcript + transient photo. The photo lives ONLY
  // here in memory ({base64, preview}); it is never written to storage and never
  // included in the saved record (see logAll). It is discarded when we unmount.
  var _useState111 = useState(null),
    _useState112 = _slicedToArray(_useState111, 2),
    photo = _useState112[0],
    setPhoto = _useState112[1];
  var _useState113 = useState(false),
    _useState114 = _slicedToArray(_useState113, 2),
    listening = _useState114[0],
    setListening = _useState114[1];
  var _useState115 = useState(false),
    _useState116 = _slicedToArray(_useState115, 2),
    micDenied = _useState116[0],
    setMicDenied = _useState116[1];
  var _useState117 = useState(false),
    _useState118 = _slicedToArray(_useState117, 2),
    usedVoice = _useState118[0],
    setUsedVoice = _useState118[1];
  // Confidence-gated follow-ups: which questions to ask + answered/skipped log.
  var _useState119 = useState([]),
    _useState120 = _slicedToArray(_useState119, 2),
    followups = _useState120[0],
    setFollowups = _useState120[1]; // [{idx, ask, name}]
  var _useState121 = useState({}),
    _useState122 = _slicedToArray(_useState121, 2),
    fuDone = _useState122[0],
    setFuDone = _useState122[1]; // idx -> true once answered/skipped
  var _useState123 = useState([]),
    _useState124 = _slicedToArray(_useState123, 2),
    fuLog = _useState124[0],
    setFuLog = _useState124[1]; // [{q, a}] persisted with the meal
  var recRef = React.useRef(null);
  var fileRef = React.useRef(null);

  // Stop any in-flight speech recognition if we leave the screen.
  useEffect(function () {
    return function () {
      try {
        recRef.current && recRef.current.stop();
      } catch (e) {}
    };
  }, []);
  var totals = items ? items.reduce(function (a, it) {
    return {
      kcal: a.kcal + it.kcal,
      protein: a.protein + it.protein,
      carbs: a.carbs + it.carbs,
      fat: a.fat + it.fat
    };
  }, {
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }) : null;

  // kcal-weighted (matches intakeConfidence + what logAll stores) so a fuzzy big
  // item drags the meal's confidence more than a fuzzy garnish.
  var avgConf = items ? totals && totals.kcal > 0 ? Math.round(items.reduce(function (a, it) {
    return a + it.confidence * it.kcal;
  }, 0) / totals.kcal) : Math.round(items.reduce(function (a, it) {
    return a + it.confidence;
  }, 0) / items.length) : 0;
  var voiceAvailable = !!SpeechRec && !micDenied;
  var capError = /limit reached|sign in/i.test(error);
  var pendingFollowups = followups.filter(function (fu) {
    return !fuDone[fu.idx];
  });
  var startVoice = function startVoice() {
    if (!SpeechRec || listening) return;
    var rec;
    try {
      rec = new SpeechRec();
    } catch (e) {
      return;
    }
    rec.lang = "en-GB";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = function (ev) {
      var t = Array.from(ev.results).map(function (r) {
        return r[0].transcript;
      }).join(" ").trim();
      if (t) {
        setDesc(function (d) {
          return (d ? d.trim() + " " : "") + t;
        });
        setUsedVoice(true);
      }
    };
    rec.onerror = function (ev) {
      if (ev && ev.error === "not-allowed") setMicDenied(true);
      setListening(false);
    };
    rec.onend = function () {
      return setListening(false);
    };
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch (e) {
      setListening(false);
    }
  };
  var stopVoice = function stopVoice() {
    try {
      recRef.current && recRef.current.stop();
    } catch (e) {}
    setListening(false);
  };
  var onPickPhoto = /*#__PURE__*/function () {
    var _ref80 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(e) {
      var file, _t33, _t34;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.p = _context30.n) {
          case 0:
            file = e.target.files && e.target.files[0];
            e.target.value = ""; // let the same file be re-picked
            if (file) {
              _context30.n = 1;
              break;
            }
            return _context30.a(2);
          case 1:
            _context30.p = 1;
            _t33 = setPhoto;
            _context30.n = 2;
            return fileToImage(file);
          case 2:
            _t33(_context30.v);
            setError("");
            _context30.n = 4;
            break;
          case 3:
            _context30.p = 3;
            _t34 = _context30.v;
            setError("Couldn't read that image — try another photo.");
          case 4:
            return _context30.a(2);
        }
      }, _callee30, null, [[1, 3]]);
    }));
    return function onPickPhoto(_x42) {
      return _ref80.apply(this, arguments);
    };
  }();
  var estimate = /*#__PURE__*/function () {
    var _ref81 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
      var parsed, aiItems, oftResults, merged, k, wConf, _t35, _t36;
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.p = _context31.n) {
          case 0:
            if (!(!desc.trim() && !photo)) {
              _context31.n = 1;
              break;
            }
            return _context31.a(2);
          case 1:
            setLoading(true);
            setError("");
            setItems(null);
            setLoggedAll(false);
            setLoggedCount({});
            setFollowups([]);
            setFuDone({});
            setFuLog([]);
            _context31.p = 2;
            if (!photo) {
              _context31.n = 4;
              break;
            }
            _context31.n = 3;
            return callAIJson([{
              type: "image",
              source: {
                type: "base64",
                media_type: photo.mediaType,
                data: photo.base64
              }
            }, {
              type: "text",
              text: AI_PHOTO_PROMPT(desc)
            }], 2000);
          case 3:
            _t35 = _context31.v;
            _context31.n = 6;
            break;
          case 4:
            _context31.n = 5;
            return callAIJson(AI_PROMPT(desc), 2000);
          case 5:
            _t35 = _context31.v;
          case 6:
            parsed = _t35;
            aiItems = parsed.items || []; // OFT parallel lookup for each item
            _context31.n = 7;
            return Promise.all(aiItems.map(function (it) {
              return searchOFT(it.name);
            }));
          case 7:
            oftResults = _context31.v;
            merged = aiItems.map(function (it, i) {
              var oft = oftResults[i];
              // Normalise the AI confidence (vision models may return a 0–1 fraction).
              var ai = _objectSpread(_objectSpread({}, it), {}, {
                confidence: normConf(it.confidence)
              });
              // Use OFT data if found AND it has higher confidence than AI estimate.
              // Carry the AI's `ask` reason across (OFT doesn't set it).
              if (oft && oft.confidence > ai.confidence) return _objectSpread(_objectSpread({}, oft), {}, {
                name: it.name,
                ask: null
              });
              return ai;
            });
            setItems(merged);
            // Confidence-gated: only ask when the kcal-weighted estimate is below the
            // "guess-heavy" bar, and only the top-2 highest-leverage unknowns.
            k = merged.reduce(function (a, it) {
              return a + (it.kcal || 0);
            }, 0);
            wConf = k > 0 ? Math.round(merged.reduce(function (a, it) {
              return a + it.confidence * (it.kcal || 0);
            }, 0) / k) : 100;
            setFollowups(wConf < FOLLOWUP_BELOW ? pickFollowups(merged) : []);
            _context31.n = 9;
            break;
          case 8:
            _context31.p = 8;
            _t36 = _context31.v;
            setError("Estimation failed: " + _t36.message);
          case 9:
            setLoading(false);
          case 10:
            return _context31.a(2);
        }
      }, _callee31, null, [[2, 8]]);
    }));
    return function estimate() {
      return _ref81.apply(this, arguments);
    };
  }();

  // Answer one follow-up: fat/portion refine offline (deterministic), version
  // re-estimates the element by name (its macros genuinely change). "Not sure"
  // keeps the estimate at its lower confidence.
  var answerFollowup = function answerFollowup(fu, chip) {
    var bank = FOLLOWUP_BANK[fu.ask];
    var foodName = items[fu.idx] ? items[fu.idx].name : fu.name;
    setFuLog(function (prev) {
      return [].concat(_toConsumableArray(prev), [{
        q: bank.q(foodName),
        a: chip.label
      }]);
    });
    setFuDone(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, fu.idx, true));
    });
    if (chip.conf == null) return; // "Not sure" → no refinement
    if (bank.mode === "version") {
      if (chip.ver) reestimate(fu.idx, foodName + " (" + chip.ver + ")");
    } else {
      setItems(function (prev) {
        return prev.map(function (it, i) {
          return i === fu.idx ? refineElement(it, bank.mode, chip.factor, chip.conf) : it;
        });
      });
    }
  };
  var reestimate = /*#__PURE__*/function () {
    var _ref82 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(idx, newName) {
      var updated, oft, u, _final, _t37;
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.p = _context32.n) {
          case 0:
            setReestIdx(idx);
            _context32.p = 1;
            _context32.n = 2;
            return callAIJson(AI_REESTIMATE_PROMPT(newName), 300);
          case 2:
            updated = _context32.v;
            _context32.n = 3;
            return searchOFT(newName);
          case 3:
            oft = _context32.v;
            u = _objectSpread(_objectSpread({}, updated), {}, {
              confidence: normConf(updated.confidence)
            });
            _final = oft && oft.confidence > u.confidence ? _objectSpread(_objectSpread({}, oft), {}, {
              name: newName
            }) : _objectSpread(_objectSpread({}, u), {}, {
              name: newName
            });
            setItems(function (prev) {
              return prev.map(function (it, i) {
                return i === idx ? _final : it;
              });
            });
            _context32.n = 5;
            break;
          case 4:
            _context32.p = 4;
            _t37 = _context32.v;
          case 5:
            setReestIdx(null);
          case 6:
            return _context32.a(2);
        }
      }, _callee32, null, [[1, 4]]);
    }));
    return function reestimate(_x43, _x44) {
      return _ref82.apply(this, arguments);
    };
  }();
  var logAll = function logAll() {
    if (!totals) return;
    // Preserve the structured meal ELEMENTS as the source of truth, plus an
    // impact-weighted estimation confidence. The display name keeps the FULL
    // description — truncation is presentation-only (CSS), never in the data.
    var elements = items.map(function (it) {
      return {
        name: it.name,
        kcal: Math.round(it.kcal),
        protein: Math.round(it.protein * 10) / 10,
        carbs: Math.round(it.carbs * 10) / 10,
        fat: Math.round(it.fat * 10) / 10,
        conf: it.confidence
      };
    });
    var conf = totals.kcal > 0 ? Math.round(elements.reduce(function (a, e) {
      return a + e.conf * e.kcal;
    }, 0) / totals.kcal) : avgConf;
    // The record carries numbers + answers + flags — NEVER the photo or any audio.
    var source = photo ? "ai-photo" : usedVoice ? "ai-voice" : "ai-text";
    onAdd({
      name: desc.trim() || "Photo meal",
      kcal: Math.round(totals.kcal),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      conf: conf,
      elements: elements,
      source: source,
      followups: fuLog
    });
    onBack();
  };
  var logItem = function logItem(item, idx) {
    var source = photo ? "ai-photo" : usedVoice ? "ai-voice" : "ai-text";
    onAdd({
      name: item.name,
      kcal: Math.round(item.kcal),
      protein: Math.round(item.protein * 10) / 10,
      carbs: Math.round(item.carbs * 10) / 10,
      fat: Math.round(item.fat * 10) / 10,
      conf: item.confidence,
      source: source
    });
    setLoggedCount(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, idx, (prev[idx] || 0) + 1));
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 40px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(BackHdr, {
    title: "AI MEAL LOG",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-mid)",
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Type it, dictate it, or photograph it \u2014 I'll break it down item by item with confidence scores. Tap any item to correct it and re-estimate."), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: function onChange(e) {
      return setDesc(e.target.value);
    },
    rows: 4,
    placeholder: "e.g. 'GDK large mixed meat meal with small chips and Coke Zero, bowl of Magic Spoon cereal, Pret chicken bacon sandwich'",
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 14,
      padding: "14px 16px",
      color: "var(--text-hi)",
      fontSize: 14,
      resize: "none",
      fontFamily: "inherit",
      outline: "none",
      lineHeight: 1.6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      lineHeight: 1.5,
      marginTop: 6
    }
  }, "Just the food \u2014 no personal details needed. Dictation runs on your device; only the text is sent. A photo is used once to estimate the meal and is never stored."), photo && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      position: "relative",
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid ".concat(BD)
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo.preview,
    alt: "meal",
    style: {
      width: "100%",
      display: "block",
      maxHeight: 220,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setPhoto(null);
    },
    "aria-label": "Remove photo",
    style: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      background: "rgba(0,0,0,0.6)",
      color: "#fff",
      border: "none",
      fontSize: 16,
      fontWeight: 900,
      cursor: "pointer"
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12
    }
  }, voiceAvailable && /*#__PURE__*/React.createElement("button", {
    onClick: listening ? stopVoice : startVoice,
    "aria-label": "Dictate meal",
    style: {
      flexShrink: 0,
      width: 54,
      padding: "15px 0",
      borderRadius: 14,
      background: listening ? A : "var(--surface-2)",
      color: listening ? "var(--bg)" : A,
      border: "1px solid ".concat(listening ? A : aA("44")),
      fontSize: 18,
      cursor: "pointer",
      animation: listening ? "blink_add 1s ease-in-out infinite" : "none"
    }
  }, listening ? "⏹" : "🎤"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return fileRef.current && fileRef.current.click();
    },
    "aria-label": "Photograph meal",
    style: {
      flexShrink: 0,
      width: 54,
      padding: "15px 0",
      borderRadius: 14,
      background: "var(--surface-2)",
      color: A,
      border: "1px solid ".concat(aA("44")),
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83D\uDCF7"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    onChange: onPickPhoto,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: estimate,
    disabled: loading || !desc.trim() && !photo,
    style: {
      flex: 1,
      padding: "15px",
      background: loading || !desc.trim() && !photo ? "var(--surface-2)" : A,
      color: loading || !desc.trim() && !photo ? "var(--border-strong)" : "var(--bg)",
      border: "none",
      borderRadius: 14,
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: "0.08em",
      cursor: loading || !desc.trim() && !photo ? "not-allowed" : "pointer"
    }
  }, loading ? "⚡ ANALYSING..." : photo ? "🤖 ANALYSE PHOTO" : "🤖 ANALYSE MEAL")), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--bulk-3)",
      fontSize: 12,
      marginTop: 14,
      background: "var(--over-tint-3)",
      border: "1px solid var(--bulk-tint)",
      borderRadius: 10,
      padding: "12px 14px",
      lineHeight: 1.6
    }
  }, error, capError &&
  /*#__PURE__*/
  // Cap reached / session expired — degrade gracefully. The typed text
  // and any photo are kept; offer manual entry instead of losing them.
  React.createElement("button", {
    onClick: onBack,
    style: {
      display: "block",
      marginTop: 10,
      padding: "9px 14px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 10,
      color: A,
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer"
    }
  }, "Switch to manual entry \u2192")), items && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 14,
      padding: "12px 16px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.1em",
      fontWeight: 800
    }
  }, "OVERALL CONFIDENCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: confColor(avgConf)
    }
  }, avgConf, "% ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, confLabel(avgConf)))), items.map(function (item, i) {
    return /*#__PURE__*/React.createElement(ItemRow, {
      key: i,
      item: item,
      reestimating: reestIdx === i,
      onReestimate: function onReestimate(newName) {
        return reestimate(i, newName);
      }
    });
  }), pendingFollowups.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(aA("44")),
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 4
    }
  }, "QUICK CHECK \xB7 OPTIONAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      marginBottom: 12,
      lineHeight: 1.5
    }
  }, "A couple of taps sharpen the estimate \u2014 or just log it below."), pendingFollowups.map(function (fu) {
    var bank = FOLLOWUP_BANK[fu.ask];
    var food = items[fu.idx] ? items[fu.idx].name : fu.name;
    return /*#__PURE__*/React.createElement("div", {
      key: fu.idx,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: "var(--text-hi)",
        marginBottom: 8
      }
    }, bank.q(food)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, bank.chips.map(function (chip) {
      return /*#__PURE__*/React.createElement("button", {
        key: chip.label,
        onClick: function onClick() {
          return answerFollowup(fu, chip);
        },
        style: {
          padding: "8px 12px",
          borderRadius: 20,
          background: "var(--surface-2)",
          border: "1px solid ".concat(aA("44")),
          color: "var(--text-mid-6)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer"
        }
      }, chip.label);
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(aA("33")),
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 10
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    label: "KCAL",
    value: Math.round(totals.kcal),
    color: A
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "PROTEIN",
    value: Math.round(totals.protein) + "g",
    color: "var(--cut)"
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "CARBS",
    value: Math.round(totals.carbs) + "g",
    color: "var(--warn)"
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "FAT",
    value: Math.round(totals.fat) + "g",
    color: "var(--bulk)"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: logAll,
    style: {
      width: "100%",
      padding: "14px",
      background: A,
      color: "var(--bg)",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900,
      cursor: "pointer",
      marginBottom: 8
    }
  }, "+ LOG ALL AS ONE ENTRY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-lo-2)",
      textAlign: "center",
      marginBottom: 12
    }
  }, "or tap individual items to log them separately \u2191"), items.map(function (item, i) {
    var count = loggedCount[i] || 0;
    var added = count > 0;
    var tag = added ? "✓ Added" + (count > 1 ? " ×" + count : "") + " · " : "+ ";
    return (
      /*#__PURE__*/
      // key includes the count so each repeat tap remounts the row and re-runs blink_add
      React.createElement("button", {
        key: i + "-" + count,
        onClick: function onClick() {
          return logItem(item, i);
        },
        style: {
          width: "100%",
          padding: "10px 14px",
          background: added ? aA("1e") : "var(--surface-2)",
          border: "1px solid ".concat(added ? aA("66") : BD),
          borderRadius: 10,
          color: added ? A : "var(--text-mid-6)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 6,
          animation: added ? "blink_add 0.4s ease-out" : "none",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between"
        }
      }, /*#__PURE__*/React.createElement("span", null, tag, item.name), /*#__PURE__*/React.createElement("span", {
        style: {
          color: A,
          fontWeight: 900
        }
      }, Math.round(item.kcal), " kcal"))
    );
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return reportEstimate(desc, items, totals);
    },
    style: {
      display: "block",
      margin: "10px auto 0",
      padding: "6px 10px",
      background: "none",
      border: "none",
      color: "var(--text-lo-2)",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "underline"
    }
  }, "\u2690 Report estimate as wrong")));
}

// ── Quick Add ─────────────────────────────────────────────────

function QuickAdd(_ref83) {
  var onAdd = _ref83.onAdd,
    onBack = _ref83.onBack,
    meals = _ref83.meals,
    setMeals = _ref83.setMeals,
    _ref83$isPremium = _ref83.isPremium,
    isPremium = _ref83$isPremium === void 0 ? false : _ref83$isPremium,
    _ref83$onPremiumGate = _ref83.onPremiumGate,
    onPremiumGate = _ref83$onPremiumGate === void 0 ? function () {} : _ref83$onPremiumGate;
  var _useState125 = useState(""),
    _useState126 = _slicedToArray(_useState125, 2),
    search = _useState126[0],
    setSearch = _useState126[1];
  var _useState127 = useState(null),
    _useState128 = _slicedToArray(_useState127, 2),
    modal = _useState128[0],
    setModal = _useState128[1];
  var save = /*#__PURE__*/function () {
    var _ref84 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33(m) {
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.n) {
          case 0:
            setMeals(m);
            _context33.n = 1;
            return ss("meals", JSON.stringify(m));
          case 1:
            return _context33.a(2);
        }
      }, _callee33);
    }));
    return function save(_x45) {
      return _ref84.apply(this, arguments);
    };
  }();
  var handleSave = function handleSave(saved) {
    if (modal.index != null) {
      var u = _toConsumableArray(meals);
      u[modal.index] = saved;
      save(u);
    } else save([].concat(_toConsumableArray(meals), [saved]));
    setModal(null);
  };
  var indexed = meals.map(function (m, i) {
    return _objectSpread(_objectSpread({}, m), {}, {
      _i: i
    });
  });
  var filtered = indexed.filter(function (m) {
    return m.name.toLowerCase().includes(search.toLowerCase());
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 40px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, modal !== null && /*#__PURE__*/React.createElement(MealForm, {
    meal: modal.meal,
    onSave: handleSave,
    onCancel: function onCancel() {
      return setModal(null);
    },
    isPremium: isPremium,
    onPremiumGate: onPremiumGate
  }), /*#__PURE__*/React.createElement(BackHdr, {
    title: "QUICK ADD",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    },
    placeholder: "Search meals...",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: 1,
      padding: "12px 16px"
    })
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal({
        meal: null,
        index: null
      });
    },
    style: {
      padding: "12px 18px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("44")),
      borderRadius: 12,
      color: A,
      fontWeight: 900,
      fontSize: 16,
      flexShrink: 0
    }
  }, "\uFF0B")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, filtered.map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m._i,
      style: {
        background: CARD,
        border: "1px solid ".concat(BD),
        borderRadius: 14,
        padding: "13px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        onAdd(m);
        onBack();
      },
      style: {
        flex: 1,
        background: "none",
        border: "none",
        textAlign: "left",
        padding: 0,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-hi)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-lo)",
        marginTop: 3
      }
    }, "P:", m.protein, "g \xB7 C:", m.carbs, "g \xB7 F:", m.fat, "g")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: A,
        flexShrink: 0
      }
    }, m.kcal), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setModal({
          meal: m,
          index: m._i
        });
      },
      style: {
        background: "none",
        border: "none",
        fontSize: 15,
        padding: "4px 6px",
        flexShrink: 0
      }
    }, "\u270F\uFE0F"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        haptic();
        save(meals.filter(function (_, i) {
          return i !== m._i;
        }));
      },
      style: {
        background: "none",
        border: "none",
        fontSize: 15,
        padding: "4px 6px",
        flexShrink: 0
      }
    }, "\uD83D\uDDD1\uFE0F"));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--text-faint-2)",
      padding: "30px 0",
      fontSize: 14
    }
  }, "No meals found")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      haptic();
      save([].concat(DEF_MEALS));
    },
    style: {
      marginTop: 16,
      width: "100%",
      padding: "11px",
      background: "none",
      border: "1px dashed var(--border)",
      borderRadius: 12,
      color: "var(--text-faint-2)",
      fontSize: 12,
      fontFamily: "inherit"
    }
  }, "\u21A9 Reset to defaults"));
}

// ── Food Search ───────────────────────────────────────────────

function FoodSearch(_ref85) {
  var onAdd = _ref85.onAdd,
    onBack = _ref85.onBack;
  var _useState129 = useState(""),
    _useState130 = _slicedToArray(_useState129, 2),
    q = _useState130[0],
    setQ = _useState130[1];
  var _useState131 = useState([]),
    _useState132 = _slicedToArray(_useState131, 2),
    results = _useState132[0],
    setResults = _useState132[1];
  var _useState133 = useState(false),
    _useState134 = _slicedToArray(_useState133, 2),
    loading = _useState134[0],
    setLoading = _useState134[1];
  var _useState135 = useState(""),
    _useState136 = _slicedToArray(_useState135, 2),
    error = _useState136[0],
    setError = _useState136[1];
  var _useState137 = useState(false),
    _useState138 = _slicedToArray(_useState137, 2),
    done = _useState138[0],
    setDone = _useState138[1];
  var search = /*#__PURE__*/function () {
    var _ref86 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
      var res, data, parseServing, parseKcal, valid, _t38;
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.p = _context34.n) {
          case 0:
            if (q.trim()) {
              _context34.n = 1;
              break;
            }
            return _context34.a(2);
          case 1:
            setLoading(true);
            setError("");
            setResults([]);
            setDone(true);
            _context34.p = 2;
            _context34.n = 3;
            return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms=".concat(encodeURIComponent(q), "&search_simple=1&action=process&json=1&page_size=15&fields=product_name,nutriments,serving_size,brands"));
          case 3:
            res = _context34.v;
            if (res.ok) {
              _context34.n = 4;
              break;
            }
            throw new Error("Network error");
          case 4:
            _context34.n = 5;
            return res.json();
          case 5:
            data = _context34.v;
            parseServing = function parseServing(raw) {
              if (!raw) return 100;
              var n = parseFloat(raw);
              return isFinite(n) && n > 5 && n < 2000 ? n : 100;
            };
            parseKcal = function parseKcal(n) {
              if (n["energy-kcal_100g"] != null) return n["energy-kcal_100g"];
              if (n["energy_100g"] != null) return n["energy_100g"] / 4.184;
              return null;
            };
            valid = (data.products || []).filter(function (p) {
              var _p$product_name;
              return ((_p$product_name = p.product_name) === null || _p$product_name === void 0 ? void 0 : _p$product_name.trim()) && parseKcal(p.nutriments || {}) != null;
            });
            if (valid.length) {
              _context34.n = 6;
              break;
            }
            setError("No results — try a brand name or simpler search term.");
            setLoading(false);
            return _context34.a(2);
          case 6:
            setResults(valid.slice(0, 12).map(function (p) {
              var _p$brands;
              var n = p.nutriments,
                sg2 = parseServing(p.serving_size),
                f = sg2 / 100;
              var kcal100 = parseKcal(n);
              var brand = (_p$brands = p.brands) === null || _p$brands === void 0 || (_p$brands = _p$brands.split(",")[0]) === null || _p$brands === void 0 ? void 0 : _p$brands.trim();
              return {
                name: [p.product_name.trim(), brand].filter(Boolean).join(" – "),
                kcal: Math.round(kcal100 * f),
                protein: Math.round((n["proteins_100g"] || 0) * f * 10) / 10,
                carbs: Math.round((n["carbohydrates_100g"] || 0) * f * 10) / 10,
                fat: Math.round((n["fat_100g"] || 0) * f * 10) / 10,
                notes: "Per serving (~".concat(Math.round(sg2), "g)")
              };
            }));
            _context34.n = 8;
            break;
          case 7:
            _context34.p = 7;
            _t38 = _context34.v;
            setError("Search failed — check your internet connection.");
          case 8:
            setLoading(false);
          case 9:
            return _context34.a(2);
        }
      }, _callee34, null, [[2, 7]]);
    }));
    return function search() {
      return _ref86.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 40px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(BackHdr, {
    title: "FOOD SEARCH",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-mid)",
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Search millions of products via Open Food Facts."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: function onChange(e) {
      return setQ(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && search();
    },
    placeholder: "e.g. 'Grenade bar', 'Weetabix'...",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: 1,
      padding: "13px 16px"
    })
  }), /*#__PURE__*/React.createElement("button", {
    onClick: search,
    disabled: loading || !q.trim(),
    style: {
      padding: "13px 16px",
      background: q.trim() && !loading ? A : "var(--surface-2)",
      color: q.trim() && !loading ? "var(--bg)" : "var(--border-strong)",
      border: "none",
      borderRadius: 12,
      fontWeight: 900,
      fontSize: 13,
      flexShrink: 0,
      letterSpacing: "0.06em"
    }
  }, loading ? "..." : "SEARCH")), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--text-label)",
      padding: 24,
      fontSize: 14
    }
  }, "\uD83D\uDD0D Searching..."), error && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--over)",
      fontSize: 13,
      textAlign: "center",
      marginBottom: 10
    }
  }, error), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, results.map(function (r, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        onAdd(r);
        onBack();
      },
      style: {
        background: CARD,
        border: "1px solid ".concat(BD),
        borderRadius: 14,
        padding: "14px 16px",
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        paddingRight: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-hi)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-lo)",
        marginTop: 3
      }
    }, r.notes, " \xB7 P:", r.protein, "g \xB7 C:", r.carbs, "g \xB7 F:", r.fat, "g")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: A,
        flexShrink: 0
      }
    }, r.kcal));
  })), done && !results.length && !loading && !error && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--text-faint-2)",
      padding: "30px 0"
    }
  }, "No results"));
}

// ── History ───────────────────────────────────────────────────

var chartsAvailable = typeof ResponsiveContainer !== "undefined";
function History(_ref87) {
  var _MODES$day$mode, _MODES$day$mode2, _MODES$day$mode3;
  var history = _ref87.history,
    onBack = _ref87.onBack,
    onUpdateDay = _ref87.onUpdateDay,
    _ref87$weighIns = _ref87.weighIns,
    weighIns = _ref87$weighIns === void 0 ? [] : _ref87$weighIns,
    _ref87$meals = _ref87.meals,
    meals = _ref87$meals === void 0 ? DEF_MEALS : _ref87$meals,
    _ref87$setMeals = _ref87.setMeals,
    setMeals = _ref87$setMeals === void 0 ? function () {} : _ref87$setMeals,
    _ref87$isPremium = _ref87.isPremium,
    isPremium = _ref87$isPremium === void 0 ? false : _ref87$isPremium,
    _ref87$onPremiumGate = _ref87.onPremiumGate,
    onPremiumGate = _ref87$onPremiumGate === void 0 ? function () {} : _ref87$onPremiumGate;
  var RANGES = ["DAY", "W", "30D", "3M", "1Y", "ALL"];
  var RLBL = {
    DAY: "Day",
    W: "7 Days",
    "30D": "30 Days",
    "3M": "3 Months",
    "1Y": "Year",
    ALL: "All Time"
  };
  var MM = {
    KCAL: {
      key: "kcal",
      label: "Kcal",
      color: "var(--accent)",
      unit: ""
    },
    PROTEIN: {
      key: "protein",
      label: "Protein",
      color: "var(--cut)",
      unit: "g"
    },
    CARBS: {
      key: "carbs",
      label: "Carbs",
      color: "var(--warn)",
      unit: "g"
    },
    FAT: {
      key: "fat",
      label: "Fat",
      color: "var(--bulk)",
      unit: "g"
    }
  };
  var _useState139 = useState("30D"),
    _useState140 = _slicedToArray(_useState139, 2),
    range = _useState140[0],
    setRange = _useState140[1];
  var _useState141 = useState(["KCAL"]),
    _useState142 = _slicedToArray(_useState141, 2),
    metrics = _useState142[0],
    setMetrics = _useState142[1];
  var _useState143 = useState(false),
    _useState144 = _slicedToArray(_useState143, 2),
    showWeight = _useState144[0],
    setShowWeight = _useState144[1];
  var _useState145 = useState("line"),
    _useState146 = _slicedToArray(_useState145, 2),
    chartType = _useState146[0],
    setChartType = _useState146[1];
  var _useState147 = useState(Math.max(0, history.length - 1)),
    _useState148 = _slicedToArray(_useState147, 2),
    dayIdx = _useState148[0],
    setDayIdx = _useState148[1];
  var _useState149 = useState(null),
    _useState150 = _slicedToArray(_useState149, 2),
    addCtx = _useState150[0],
    setAddCtx = _useState150[1];
  var _useState151 = useState(null),
    _useState152 = _slicedToArray(_useState151, 2),
    editId = _useState152[0],
    setEditId = _useState152[1];
  var wPref = getWUnit(); // kg · st · lb
  var wUnit = wChartUnit(wPref); // chart axis label: kg, else lb (st plots in lb)
  var wConv = function wConv(kg) {
    return wChartNum(kg, wPref);
  }; // stored kg → chart number

  var toggleM = function toggleM(m) {
    return setMetrics(function (p) {
      return p.includes(m) ? p.length > 1 ? p.filter(function (x) {
        return x !== m;
      }) : p : [].concat(_toConsumableArray(p), [m]);
    });
  };
  var filtered = function () {
    if (range === "DAY") return history;
    var days = {
      W: 7,
      "30D": 30,
      "3M": 90,
      "1Y": 365,
      ALL: 99999
    }[range];
    var cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    return history.filter(function (d) {
      return d.date >= cutoff;
    });
  }();
  var filteredWeighIns = function () {
    if (range === "DAY" || !weighIns.length) return [];
    var days = {
      W: 7,
      "30D": 30,
      "3M": 90,
      "1Y": 365,
      ALL: 99999
    }[range];
    var cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    return weighIns.filter(function (w) {
      return w.date >= cutoff;
    });
  }();

  // Merge weight into chart data by date
  var weightByDate = Object.fromEntries(filteredWeighIns.map(function (w) {
    return [w.date, w.weight];
  }));
  var chartData = filtered.map(function (d) {
    var _weightByDate$d$date;
    return {
      date: fmtShort(d.date),
      KCAL: d.kcal,
      PROTEIN: Math.round(d.protein),
      CARBS: Math.round(d.carbs),
      FAT: Math.round(d.fat),
      WEIGHT: (_weightByDate$d$date = weightByDate[d.date]) !== null && _weightByDate$d$date !== void 0 ? _weightByDate$d$date : null
    };
  });

  // Weight-only chart data with 7-day rolling average
  var weightChartData = filteredWeighIns.map(function (w, i, arr) {
    var win = arr.slice(Math.max(0, i - 6), i + 1);
    var avg = win.reduce(function (s, x) {
      return s + x.weight;
    }, 0) / win.length;
    return {
      date: fmtShort(w.date),
      WEIGHT: wConv(w.weight),
      ROLLING: win.length >= 3 ? Math.round(wConv(avg) * 10) / 10 : null
    };
  });
  var day = history[dayIdx] || null;
  var dayTots = day ? sumLogs(day.logs || []) : null;
  var pieData = dayTots ? [{
    name: "Protein",
    value: Math.round(dayTots.protein),
    color: "var(--cut)"
  }, {
    name: "Carbs",
    value: Math.round(dayTots.carbs),
    color: "var(--warn)"
  }, {
    name: "Fat",
    value: Math.round(dayTots.fat),
    color: "var(--bulk)"
  }] : [];
  var patch = function patch(p) {
    var u = _objectSpread(_objectSpread({}, day), p);
    if (p.logs) {
      var t = sumLogs(p.logs);
      u.kcal = Math.round(t.kcal);
      u.protein = Math.round(t.protein * 10) / 10;
      u.carbs = Math.round(t.carbs * 10) / 10;
      u.fat = Math.round(t.fat * 10) / 10;
    }
    onUpdateDay(u);
  };
  var exportCSV = function exportCSV() {
    var rows = [["Date", "Mode", "Calories", "Protein(g)", "Carbs(g)", "Fat(g)", "Water", "Training"]];
    history.forEach(function (d) {
      return rows.push([d.date, d.mode || "", Math.round(d.kcal), Math.round(d.protein), Math.round(d.carbs), Math.round(d.fat), d.water, d.training ? "Yes" : "No"]);
    });
    var a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.map(function (r) {
      return r.join(",");
    }).join("\n"));
    a.download = "fuel-log-" + todayKey() + ".csv";
    a.click();
  };
  var addEntry = function addEntry(e) {
    patch({
      logs: [].concat(_toConsumableArray(day.logs || []), [_objectSpread(_objectSpread({}, e), {}, {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      })])
    });
    setAddCtx(null);
  };
  if (addCtx === "quick") return /*#__PURE__*/React.createElement(QuickAdd, {
    meals: meals,
    setMeals: setMeals,
    onAdd: addEntry,
    onBack: function onBack() {
      return setAddCtx(null);
    },
    isPremium: isPremium,
    onPremiumGate: onPremiumGate
  });
  if (addCtx === "manual") return /*#__PURE__*/React.createElement(MealForm, {
    onSave: addEntry,
    onCancel: function onCancel() {
      return setAddCtx(null);
    },
    isPremium: isPremium,
    onPremiumGate: onPremiumGate
  });
  if (addCtx === "ai") return /*#__PURE__*/React.createElement(AILog, {
    onAdd: addEntry,
    onBack: function onBack() {
      return setAddCtx(null);
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 50px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(BackHdr, {
    title: "HISTORY",
    onBack: onBack,
    right: history.length > 0 && /*#__PURE__*/React.createElement("button", {
      onClick: exportCSV,
      style: {
        padding: "8px 14px",
        background: "var(--surface-2)",
        border: "1px solid ".concat(aA("44")),
        borderRadius: 10,
        color: A,
        fontSize: 11,
        fontWeight: 900,
        cursor: "pointer",
        letterSpacing: "0.07em"
      }
    }, "\uD83D\uDCE5 CSV")
  }), history.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "60px 20px",
      color: "var(--text-faint-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 10
    }
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14
    }
  }, "No history yet \u2014 days auto-save as you log.")), history.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 18,
      overflowX: "auto",
      paddingBottom: 4
    }
  }, RANGES.map(function (r) {
    return /*#__PURE__*/React.createElement("button", {
      key: r,
      onClick: function onClick() {
        return setRange(r);
      },
      style: {
        padding: "7px 14px",
        background: range === r ? A : "var(--surface-2)",
        color: range === r ? "var(--bg)" : "var(--text-mid)",
        border: "1px solid ".concat(range === r ? A : BD),
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 900,
        flexShrink: 0
      }
    }, RLBL[r]);
  })), range === "DAY" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 16,
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setDayIdx(function (i) {
        return Math.max(0, i - 1);
      });
    },
    disabled: dayIdx === 0,
    style: {
      background: "none",
      border: "none",
      color: dayIdx === 0 ? "var(--text-disabled)" : "var(--text-mid-2)",
      fontSize: 24,
      padding: "0 6px",
      lineHeight: 1
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "var(--text-hi)"
    }
  }, day ? fmtFull(day.date) : "—"), day && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      justifyContent: "center",
      marginTop: 5
    }
  }, day.mode && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 900,
      color: ((_MODES$day$mode = MODES[day.mode]) === null || _MODES$day$mode === void 0 ? void 0 : _MODES$day$mode.color) || A,
      background: (((_MODES$day$mode2 = MODES[day.mode]) === null || _MODES$day$mode2 === void 0 ? void 0 : _MODES$day$mode2.color) || A) + "22",
      padding: "2px 8px",
      borderRadius: 99
    }
  }, (_MODES$day$mode3 = MODES[day.mode]) === null || _MODES$day$mode3 === void 0 ? void 0 : _MODES$day$mode3.label), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return patch({
        training: !day.training
      });
    },
    style: {
      fontSize: 10,
      fontWeight: 900,
      padding: "2px 8px",
      background: day.training ? aA("22") : "var(--surface-2)",
      color: day.training ? A : "var(--text-label)",
      border: "1px solid ".concat(day.training ? aA("44") : BD),
      borderRadius: 99
    }
  }, day.training ? "⚡ TRAINING" : "💤 REST"))), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setDayIdx(function (i) {
        return Math.min(history.length - 1, i + 1);
      });
    },
    disabled: dayIdx === history.length - 1,
    style: {
      background: "none",
      border: "none",
      color: dayIdx === history.length - 1 ? "var(--text-disabled)" : "var(--text-mid-2)",
      fontSize: 24,
      padding: "0 6px",
      lineHeight: 1
    }
  }, "\u203A")), day && dayTots && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56,
      fontWeight: 900,
      color: A,
      lineHeight: 1,
      letterSpacing: "-0.03em"
    }
  }, Math.round(dayTots.kcal).toLocaleString()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-label)",
      marginTop: 4,
      letterSpacing: "0.12em"
    }
  }, "CALORIES"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      marginTop: 6,
      color: "var(--text-label)"
    }
  }, "P:", Math.round(dayTots.protein), "g \xB7 C:", Math.round(dayTots.carbs), "g \xB7 F:", Math.round(dayTots.fat), "g")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 20,
      padding: "20px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 14
    }
  }, "MACRO BREAKDOWN"), chartsAvailable ? /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 160
  }, /*#__PURE__*/React.createElement(PieChart, null, /*#__PURE__*/React.createElement(Pie, {
    data: pieData,
    cx: "50%",
    cy: "50%",
    innerRadius: 40,
    outerRadius: 70,
    dataKey: "value",
    paddingAngle: 3
  }, pieData.map(function (e, i) {
    return /*#__PURE__*/React.createElement(Cell, {
      key: i,
      fill: rc(e.color)
    });
  })), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: function formatter(v, n) {
      return [v + "g", n];
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      padding: "8px 0"
    }
  }, "Charts unavailable \u2014 Recharts CDN failed to load."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 16,
      marginTop: 8
    }
  }, pieData.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: p.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-mid-6)"
      }
    }, p.name, ": ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--text-hi)"
      }
    }, p.value, "g")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 16,
      padding: "14px 18px",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-label)",
      letterSpacing: "0.1em",
      fontWeight: 800
    }
  }, "WATER "), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--cut)",
      fontWeight: 900
    }
  }, day.water, " / 8")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return patch({
        water: Math.max(0, (day.water || 0) - 1)
      });
    },
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "var(--cut-tint-3)",
      border: "1px solid var(--cut-tint-2)",
      color: "var(--cut)",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return patch({
        water: (day.water || 0) + 1
      });
    },
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "var(--cut-tint-4)",
      border: "1px solid var(--cut-tint)",
      color: "var(--cut)",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "+"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      overflow: "hidden",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 18px 10px",
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      borderBottom: "1px solid ".concat(BD),
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, "FOODS \xB7 ", (day.logs || []).length, " ITEMS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--text-lo-2)"
    }
  }, "\xD7 to remove")), (day.logs || []).length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px",
      textAlign: "center",
      color: "var(--text-faint-2)",
      fontSize: 13
    }
  }, "No foods logged"), (day.logs || []).map(function (log, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: log.id || i,
      style: {
        borderBottom: i < day.logs.length - 1 ? "1px solid ".concat(BD) : "none"
      }
    }, editId === (log.id || i) ? /*#__PURE__*/React.createElement(EntryEditor, {
      entry: log,
      isPremium: isPremium,
      onPremiumGate: onPremiumGate,
      onCancel: function onCancel() {
        return setEditId(null);
      },
      onSave: function onSave(p) {
        patch({
          logs: (day.logs || []).map(function (l) {
            return (l.id || l) === (log.id || log) ? _objectSpread(_objectSpread({}, l), p) : l;
          })
        });
        setEditId(null);
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 16px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        return setEditId(log.id || i);
      },
      style: {
        flex: 1,
        minWidth: 0,
        paddingRight: 10,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-hi)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, log.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-lo)",
        marginTop: 2
      }
    }, "P:", log.protein, "g C:", log.carbs, "g F:", log.fat, "g ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-faint-2)"
      }
    }, "\u270E"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: A,
        flexShrink: 0
      }
    }, Math.round(log.kcal)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return patch({
          logs: (day.logs || []).filter(function (l) {
            return l.id !== log.id && l !== log;
          })
        });
      },
      style: {
        background: "none",
        border: "none",
        color: "var(--text-disabled)",
        fontSize: 18,
        padding: "2px 10px"
      }
    }, "\xD7")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAddCtx("quick");
    },
    style: {
      flex: 1,
      padding: "11px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("33")),
      borderRadius: 12,
      color: A,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: "0.07em"
    }
  }, "\u26A1 QUICK ADD"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAddCtx("ai");
    },
    style: {
      flex: 1,
      padding: "11px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("33")),
      borderRadius: 12,
      color: A,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: "0.07em"
    }
  }, "\uD83E\uDD16 AI LOG"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAddCtx("manual");
    },
    style: {
      flex: 1,
      padding: "11px",
      background: "var(--surface-2)",
      border: "1px solid ".concat(aA("33")),
      borderRadius: 12,
      color: A,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: "0.07em"
    }
  }, "\uFF0B MANUAL")))), range !== "DAY" && filtered.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginBottom: 12,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, Object.entries(MM).map(function (_ref88) {
    var _ref89 = _slicedToArray(_ref88, 2),
      k = _ref89[0],
      m = _ref89[1];
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        setShowWeight(false);
        toggleM(k);
      },
      style: {
        padding: "6px 13px",
        background: !showWeight && metrics.includes(k) ? mix(m.color, "22") : "var(--surface-2)",
        color: !showWeight && metrics.includes(k) ? m.color : "var(--text-label)",
        border: "1px solid ".concat(!showWeight && metrics.includes(k) ? mix(m.color, "55") : BD),
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 900
      }
    }, m.label);
  }), filteredWeighIns.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setShowWeight(function (w) {
        return !w;
      });
    },
    style: {
      padding: "6px 13px",
      background: showWeight ? "color-mix(in srgb, var(--cut) 13%, transparent)" : "var(--surface-2)",
      color: showWeight ? "var(--cut)" : "var(--text-label)",
      border: "1px solid ".concat(showWeight ? "color-mix(in srgb, var(--cut) 33%, transparent)" : BD),
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 900
    }
  }, "\u2696\uFE0F Weight"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 6
    }
  }, [["line", "📈"], ["bar", "📊"]].map(function (_ref90) {
    var _ref91 = _slicedToArray(_ref90, 2),
      t = _ref91[0],
      e = _ref91[1];
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: function onClick() {
        return setChartType(t);
      },
      style: {
        padding: "6px 12px",
        background: chartType === t ? "var(--border)" : "var(--surface-2)",
        color: chartType === t ? "var(--text-hi)" : "var(--text-label)",
        border: "1px solid ".concat(chartType === t ? "var(--raised-2)" : BD),
        borderRadius: 8,
        fontSize: 12
      }
    }, e);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 20,
      padding: "16px 8px 8px",
      marginBottom: 16
    }
  }, chartsAvailable ? /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 200
  }, showWeight ? /*#__PURE__*/React.createElement(LineChart, {
    data: weightChartData,
    margin: {
      top: 5,
      right: 10,
      left: -20,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "date",
    tick: {
      fill: rc("var(--text-lo)"),
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: rc("var(--text-lo)"),
      fontSize: 10
    },
    axisLine: false,
    tickLine: false,
    domain: ["auto", "auto"]
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: function formatter(v, n) {
      return [v + " " + wUnit, n === "ROLLING" ? "7-day avg" : "Weight"];
    }
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "WEIGHT",
    stroke: rc("var(--cut)"),
    strokeWidth: 1.5,
    dot: {
      r: 2.5,
      fill: rc("var(--cut)")
    },
    name: "Weight",
    connectNulls: false
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "ROLLING",
    stroke: rc(A),
    strokeWidth: 2.5,
    dot: false,
    name: "ROLLING",
    connectNulls: true
  })) : chartType === "line" ? /*#__PURE__*/React.createElement(LineChart, {
    data: chartData,
    margin: {
      top: 5,
      right: 10,
      left: -20,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "date",
    tick: {
      fill: rc("var(--text-lo)"),
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: rc("var(--text-lo)"),
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(Tooltip, null), metrics.map(function (m) {
    return /*#__PURE__*/React.createElement(Line, {
      key: m,
      type: "monotone",
      dataKey: m,
      stroke: rc(MM[m].color),
      strokeWidth: 2.5,
      dot: false,
      name: m
    });
  })) : /*#__PURE__*/React.createElement(BarChart, {
    data: chartData,
    margin: {
      top: 5,
      right: 10,
      left: -20,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "date",
    tick: {
      fill: rc("var(--text-lo)"),
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: rc("var(--text-lo)"),
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(Tooltip, null), metrics.map(function (m) {
    return /*#__PURE__*/React.createElement(Bar, {
      key: m,
      dataKey: m,
      fill: rc(MM[m].color),
      radius: [4, 4, 0, 0],
      name: m,
      maxBarSize: 28
    });
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      padding: "12px 8px"
    }
  }, "Charts unavailable \u2014 Recharts CDN failed to load.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      padding: "16px 18px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 12
    }
  }, RLBL[range].toUpperCase(), " AVERAGES \xB7 ", filtered.length, " DAYS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8
    }
  }, Object.entries(MM).map(function (_ref92) {
    var _ref93 = _slicedToArray(_ref92, 2),
      k = _ref93[0],
      m = _ref93[1];
    var avg = filtered.length ? filtered.reduce(function (a, d) {
      return a + (d[m.key] || 0);
    }, 0) / filtered.length : 0;
    return /*#__PURE__*/React.createElement(Chip, {
      key: k,
      label: m.label.toUpperCase(),
      value: Math.round(avg) + m.unit,
      color: m.color
    });
  })), filteredWeighIns.length >= 2 && function () {
    var first = wConv(filteredWeighIns[0].weight);
    var last = wConv(filteredWeighIns[filteredWeighIns.length - 1].weight);
    var diff = Math.round((last - first) * 10) / 10;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: "flex",
        justifyContent: "space-between",
        background: "var(--bg)",
        borderRadius: 10,
        padding: "10px 14px",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--text-label)",
        letterSpacing: "0.08em",
        fontWeight: 800
      }
    }, "\u2696\uFE0F WEIGHT TREND"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-lo)",
        marginTop: 2
      }
    }, first, wUnit, " \u2192 ", last, wUnit)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: diff <= 0 ? A : "var(--bulk)"
      }
    }, diff > 0 ? "+" : "", diff, " ", wUnit));
  }()), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 18px 10px",
      fontSize: 11,
      color: "var(--text-label)",
      letterSpacing: "0.12em",
      fontWeight: 800,
      borderBottom: "1px solid ".concat(BD)
    }
  }, filtered.length, " DAYS LOGGED"), _toConsumableArray(filtered).reverse().map(function (d, i) {
    var _MODES$d$mode, _MODES$d$mode2;
    return /*#__PURE__*/React.createElement("div", {
      key: d.date,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: i < filtered.length - 1 ? "1px solid ".concat(BD) : "none",
        cursor: "pointer"
      },
      onClick: function onClick() {
        setRange("DAY");
        setDayIdx(history.findIndex(function (h) {
          return h.date === d.date;
        }));
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-hi)"
      }
    }, fmtFull(d.date), d.mode && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 900,
        color: ((_MODES$d$mode = MODES[d.mode]) === null || _MODES$d$mode === void 0 ? void 0 : _MODES$d$mode.color) || A,
        marginLeft: 8
      }
    }, (_MODES$d$mode2 = MODES[d.mode]) === null || _MODES$d$mode2 === void 0 ? void 0 : _MODES$d$mode2.label), d.training && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: A,
        marginLeft: 6
      }
    }, "\u26A1")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-lo)",
        marginTop: 2
      }
    }, "P:", Math.round(d.protein), "g \xB7 C:", Math.round(d.carbs), "g \xB7 F:", Math.round(d.fat), "g \xB7 \uD83D\uDCA7", d.water)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: A
      }
    }, Math.round(d.kcal)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-lo-2)"
      }
    }, "\u203A")));
  }))), range !== "DAY" && filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0",
      color: "var(--text-faint-2)",
      fontSize: 14
    }
  }, "No data for this range yet.")));
}

// ── Achievements ──────────────────────────────────────────────

function Achievements(_ref94) {
  var earnedBdgs = _ref94.earnedBdgs,
    onBack = _ref94.onBack;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 50px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(BackHdr, {
    title: "ACHIEVEMENTS \uD83C\uDFC6",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-mid)",
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, "\xD72 progression: Bronze 3 \u2192 Silver 6 \u2192 Gold 12 \u2192 Platinum 24 \u2192 Diamond 48 \u2192 Elite 96"), BDGS.map(function (b) {
    var earned = TIERS.map(function (_, i) {
      return earnedBdgs.includes(b.id + "_" + i);
    });
    var top = earned.lastIndexOf(true);
    return /*#__PURE__*/React.createElement("div", {
      key: b.id,
      style: {
        background: CARD,
        border: "1px solid ".concat(top >= 0 ? aA("22") : BD),
        borderRadius: 18,
        padding: "16px 20px",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 36
      }
    }, b.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: "var(--text-hi)"
      }
    }, b.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-label)",
        marginTop: 2
      }
    }, top >= 0 ? "".concat(TIER_ICONS[top], " ").concat(TIER_NAMES[top], " \xB7 ").concat(TIERS[top], " ").concat(b.desc) : "Not yet \xB7 first at ".concat(TIERS[0], " ").concat(b.desc)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5
      }
    }, TIERS.map(function (t, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: 1,
          textAlign: "center",
          opacity: earned[i] ? 1 : 0.2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 16
        }
      }, TIER_ICONS[i]), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: earned[i] ? A : "var(--text-lo-2)",
          marginTop: 2,
          fontWeight: earned[i] ? 700 : 400
        }
      }, t));
    })));
  }), earnedBdgs.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "30px 0",
      color: "var(--text-faint-2)",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 10
    }
  }, "\uD83C\uDFC6"), "No badges yet \u2014 keep logging!"));
}

// ── Badge celebrations (rarity-scaled) ────────────────────────
// Gold tier and above earn a full-screen fanfare; the number counts up and the
// overlay auto-dismisses after ~2.5s (tap to dismiss early). Daily streaks are a
// quiet chip pop (in the header) — this overlay is reserved for the rare events.
function BadgeFanfare(_ref95) {
  var badge = _ref95.badge,
    onDone = _ref95.onDone;
  var b = badge.b,
    i = badge.i;
  var target = TIERS[i];
  var _useState153 = useState(0),
    _useState154 = _slicedToArray(_useState153, 2),
    count = _useState154[0],
    setCount = _useState154[1];
  var _useState155 = useState(function () {
      return Array.from({
        length: 18
      }, function (_, k) {
        return {
          x: 5 + Math.random() * 90,
          y: 5 + Math.random() * 90,
          size: 16 + Math.random() * 22,
          delay: Math.random() * 0.6,
          dur: 0.8 + Math.random() * 0.5,
          emoji: k % 5 === 0 ? "🎉" : k % 5 === 1 ? "🎊" : b.emoji
        };
      });
    }),
    _useState156 = _slicedToArray(_useState155, 1),
    floaters = _useState156[0];
  useEffect(function () {
    var dur = 900,
      start = Date.now();
    var _tick = function tick() {
      var p = Math.min(1, (Date.now() - start) / dur);
      setCount(Math.round(target * p));
      if (p < 1) requestAnimationFrame(_tick);
    };
    requestAnimationFrame(_tick);
    var t = setTimeout(onDone, 2500);
    return function () {
      return clearTimeout(t);
    };
  }, []); // eslint-disable-line

  return /*#__PURE__*/React.createElement("div", {
    onClick: onDone,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 24,
      animation: "bf_fade 0.18s ease-out"
    }
  }, /*#__PURE__*/React.createElement("style", null, "\n        @keyframes bf_fade  { from{opacity:0} to{opacity:1} }\n        @keyframes bf_float { from{transform:translateY(0) rotate(-12deg)} to{transform:translateY(-22px) rotate(12deg)} }\n        @keyframes bf_pop   { 0%{transform:scale(0.3);opacity:0} 65%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }\n      "), floaters.map(function (f, k) {
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        position: "absolute",
        left: "".concat(f.x, "%"),
        top: "".concat(f.y, "%"),
        fontSize: f.size,
        pointerEvents: "none",
        userSelect: "none",
        opacity: 0.85,
        animation: "bf_float ".concat(f.dur, "s ease-in-out infinite alternate"),
        animationDelay: "".concat(f.delay, "s")
      }
    }, f.emoji);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 96,
      lineHeight: 1,
      animation: "bf_pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both"
    }
  }, b.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginTop: 8
    }
  }, TIER_ICONS[i], " ", TIER_NAMES[i].toUpperCase(), " UNLOCKED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 900,
      color: "var(--text-hi)",
      marginTop: 6
    }
  }, b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 60,
      fontWeight: 900,
      color: A,
      lineHeight: 1.1,
      marginTop: 8,
      textShadow: "0 0 30px ".concat(aA("88"))
    }
  }, count), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-label)",
      marginTop: 2
    }
  }, b.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-faint)",
      marginTop: 20,
      letterSpacing: "0.08em"
    }
  }, "tap to dismiss")));
}

// Daily streak → the quietest celebration: a small pip in the thumb zone (where the user is
// mid-log), not the off-screen header. Springs in, fades out, ~1.4s, never blocks the log flow.
function StreakPip(_ref96) {
  var streak = _ref96.streak,
    onDone = _ref96.onDone;
  useEffect(function () {
    var t = setTimeout(onDone, 1400);
    return function () {
      return clearTimeout(t);
    };
  }, []); // eslint-disable-line
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 96,
      display: "flex",
      justifyContent: "center",
      zIndex: 1000,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("style", null, "\n        @keyframes pip_in  { 0%{transform:scale(0.5) translateY(8px);opacity:0} 55%{transform:scale(1.12)} 100%{transform:scale(1) translateY(0);opacity:1} }\n        @keyframes pip_out { to{opacity:0;transform:translateY(-6px)} }\n      "), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      background: CARD,
      border: "1px solid ".concat(aA("44")),
      borderRadius: 999,
      padding: "8px 14px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
      animation: "pip_in 0.32s cubic-bezier(0.34,1.56,0.64,1), pip_out 0.3s ease-in 1.05s forwards"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83D\uDD25"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: A
    }
  }, streak), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: "var(--text-label)",
      letterSpacing: "0.08em"
    }
  }, "DAY STREAK")));
}

// Bronze / Silver badge → a quiet bottom toast, no overlay. Auto-dismisses ~2.8s.
function BadgeToast(_ref97) {
  var badge = _ref97.badge,
    onDone = _ref97.onDone;
  var b = badge.b,
    i = badge.i;
  useEffect(function () {
    var t = setTimeout(onDone, 2800);
    return function () {
      return clearTimeout(t);
    };
  }, []); // eslint-disable-line
  return /*#__PURE__*/React.createElement("div", {
    onClick: onDone,
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 24,
      display: "flex",
      justifyContent: "center",
      zIndex: 1000,
      pointerEvents: "none",
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes bt_in { 0%{transform:translateY(20px);opacity:0} 100%{transform:translateY(0);opacity:1} }"), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: "auto",
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: CARD,
      border: "1px solid ".concat(aA("44")),
      borderRadius: 999,
      padding: "10px 16px",
      maxWidth: "100%",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      animation: "bt_in 0.3s ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, b.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      fontWeight: 800,
      letterSpacing: "0.1em"
    }
  }, TIER_ICONS[i], " ", TIER_NAMES[i].toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: "var(--text-hi)"
    }
  }, b.name))));
}

// Plain text toast — the badge one carries a tier and an emoji, this one just says a
// thing and goes away. Same dismiss-on-tap and the same 2.8s as BadgeToast.
function NoteToast(_ref98) {
  var text = _ref98.text,
    onDone = _ref98.onDone;
  useEffect(function () {
    var t = setTimeout(onDone, 2800);
    return function () {
      return clearTimeout(t);
    };
  }, []); // eslint-disable-line
  return /*#__PURE__*/React.createElement("div", {
    onClick: onDone,
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 24,
      display: "flex",
      justifyContent: "center",
      zIndex: 1000,
      pointerEvents: "none",
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes bt_in { 0%{transform:translateY(20px);opacity:0} 100%{transform:translateY(0);opacity:1} }"), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: "auto",
      background: CARD,
      border: "1px solid ".concat(aA("44")),
      borderRadius: 999,
      padding: "10px 16px",
      maxWidth: "100%",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      animation: "bt_in 0.3s ease-out",
      fontSize: 12.5,
      fontWeight: 800,
      color: "var(--text-hi)"
    }
  }, text));
}

// ── Root ──────────────────────────────────────────────────────

function App() {
  var _useState157 = useState("dashboard"),
    _useState158 = _slicedToArray(_useState157, 2),
    view = _useState158[0],
    setView = _useState158[1];
  var _useState159 = useState([]),
    _useState160 = _slicedToArray(_useState159, 2),
    logs = _useState160[0],
    setLogs = _useState160[1];
  var _useState161 = useState(0),
    _useState162 = _slicedToArray(_useState161, 2),
    water = _useState162[0],
    setWater = _useState162[1];
  var _useState163 = useState("cut"),
    _useState164 = _slicedToArray(_useState163, 2),
    mode = _useState164[0],
    setMode = _useState164[1];
  var _useState165 = useState(null),
    _useState166 = _slicedToArray(_useState165, 2),
    prof = _useState166[0],
    setProf = _useState166[1];
  var _useState167 = useState([]),
    _useState168 = _slicedToArray(_useState167, 2),
    hist = _useState168[0],
    setHist = _useState168[1];
  var _useState169 = useState([].concat(DEF_MEALS)),
    _useState170 = _slicedToArray(_useState169, 2),
    meals = _useState170[0],
    setMeals = _useState170[1];
  var _useState171 = useState([]),
    _useState172 = _slicedToArray(_useState171, 2),
    workouts = _useState172[0],
    setWorkouts = _useState172[1];
  // Prior two days' total workout kcal [yesterday, 2 days ago] — feeds the smoothed
  // earn-to-eat window (energy-model Step 3). Today's comes from `workouts` live.
  var _useState173 = useState([0, 0]),
    _useState174 = _slicedToArray(_useState173, 2),
    priorWorkoutKcal = _useState174[0],
    setPriorWorkoutKcal = _useState174[1];
  var _useState175 = useState([]),
    _useState176 = _slicedToArray(_useState175, 2),
    earnedBdgs = _useState176[0],
    setEarnedBdgs = _useState176[1];
  var _useState177 = useState(null),
    _useState178 = _slicedToArray(_useState177, 2),
    newBadge = _useState178[0],
    setNewBadge = _useState178[1];
  var _useState179 = useState(false),
    _useState180 = _slicedToArray(_useState179, 2),
    ready = _useState180[0],
    setReady = _useState180[1];
  var _useState181 = useState([]),
    _useState182 = _slicedToArray(_useState181, 2),
    weighIns = _useState182[0],
    setWeighIns = _useState182[1];
  var _useState183 = useState(0),
    _useState184 = _slicedToArray(_useState183, 2),
    tdeeAdj = _useState184[0],
    setTdeeAdj = _useState184[1];
  var _useState185 = useState([]),
    _useState186 = _slicedToArray(_useState185, 2),
    adjLog = _useState186[0],
    setAdjLog = _useState186[1]; // recent {date,adj} events — dead-time comp (local-only)
  var _useState187 = useState(null),
    _useState188 = _slicedToArray(_useState187, 2),
    weighNudgeAt = _useState188[0],
    setWeighNudgeAt = _useState188[1]; // last weigh-in-nudge dismissal (ms; local-only)
  var _useState189 = useState(EMPTY_CUT_BLOCK),
    _useState190 = _slicedToArray(_useState189, 2),
    cutBlock = _useState190[0],
    setCutBlock = _useState190[1]; // cut-cycling state (Step 5); 4 fields sync
  var _useState191 = useState(0),
    _useState192 = _slicedToArray(_useState191, 2),
    coachKey = _useState192[0],
    setCoachKey = _useState192[1];
  var _useState193 = useState(null),
    _useState194 = _slicedToArray(_useState193, 2),
    streakPop = _useState194[0],
    setStreakPop = _useState194[1]; // new streak number → fires the bottom pip (+ header chip pop) on first log of a new day
  var _useState195 = useState(null),
    _useState196 = _slicedToArray(_useState195, 2),
    badgeToast = _useState196[0],
    setBadgeToast = _useState196[1]; // Bronze/Silver badge → quiet toast + 🏆 glow
  var _useState197 = useState(null),
    _useState198 = _slicedToArray(_useState197, 2),
    noteToast = _useState198[0],
    setNoteToast = _useState198[1]; // plain one-line confirmations
  var _useState199 = useState(false),
    _useState200 = _slicedToArray(_useState199, 2),
    badgeGlow = _useState200[0],
    setBadgeGlow = _useState200[1]; // the 🏆 glow paired with the toast
  var _useState201 = useState(null),
    _useState202 = _slicedToArray(_useState201, 2),
    customKcal = _useState202[0],
    setCustomKcal = _useState202[1];
  var _useState203 = useState(false),
    _useState204 = _slicedToArray(_useState203, 2),
    aggressiveCutAcked = _useState204[0],
    setAggressiveCutAcked = _useState204[1];
  var _useState205 = useState(0),
    _useState206 = _slicedToArray(_useState205, 2),
    setThemeTick = _useState206[1]; // force re-render on live OS theme change (System mode → charts re-resolve)

  // CSS handles the repaint itself; this only re-resolves JS-read colours (Recharts) when the OS flips.
  useEffect(function () {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function onChange() {
      if (window.__fuelSyncChrome) window.__fuelSyncChrome();
      setThemeTick(function (t) {
        return t + 1;
      });
    };
    try {
      mq.addEventListener("change", onChange);
    } catch (e) {
      mq.addListener(onChange);
    }
    return function () {
      try {
        mq.removeEventListener("change", onChange);
      } catch (e) {
        mq.removeListener(onChange);
      }
    };
  }, []);

  // ── Auth state ────────────────────────────────────────────────
  var _useState207 = useState("anonymous"),
    _useState208 = _slicedToArray(_useState207, 2),
    authState = _useState208[0],
    setAuthState = _useState208[1];
  var _useState209 = useState(null),
    _useState210 = _slicedToArray(_useState209, 2),
    authUser = _useState210[0],
    setAuthUser = _useState210[1];
  var _useState211 = useState(null),
    _useState212 = _slicedToArray(_useState211, 2),
    premiumGate = _useState212[0],
    setPremiumGate = _useState212[1]; // {emoji, name} | null
  var _useState213 = useState(false),
    _useState214 = _slicedToArray(_useState213, 2),
    showSignIn = _useState214[0],
    setShowSignIn = _useState214[1];
  var _useState215 = useState(false),
    _useState216 = _slicedToArray(_useState215, 2),
    showSignOut = _useState216[0],
    setShowSignOut = _useState216[1];
  var _useState217 = useState(false),
    _useState218 = _slicedToArray(_useState217, 2),
    showLapsed = _useState218[0],
    setShowLapsed = _useState218[1];
  var _useState219 = useState(false),
    _useState220 = _slicedToArray(_useState219, 2),
    needsConsent = _useState220[0],
    setNeedsConsent = _useState220[1]; // retroactive Art. 9 consent (R2)
  var _useState221 = useState(null),
    _useState222 = _slicedToArray(_useState221, 2),
    consentInfo = _useState222[0],
    setConsentInfo = _useState222[1]; // parsed local health_consent for display
  var _useState223 = useState(navigator.onLine),
    _useState224 = _slicedToArray(_useState223, 2),
    isOnline = _useState224[0],
    setIsOnline = _useState224[1];
  var _useState225 = useState(""),
    _useState226 = _slicedToArray(_useState225, 2),
    syncMsg = _useState226[0],
    setSyncMsg = _useState226[1];
  useEffect(function () {
    var up = function up() {
      return setIsOnline(true);
    };
    var down = function down() {
      return setIsOnline(false);
    };
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return function () {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []); // eslint-disable-line

  // Top-align every page on first access — reset scroll whenever the view changes
  useEffect(function () {
    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  }, [view]);

  // Expose dev refresh hook for test harness
  useEffect(function () {
    window.__devRefreshCoach = function () {
      ss("coach__" + todayKey(), JSON.stringify({
        tip: "",
        r: 0
      }));
      setCoachKey(function (k) {
        return k + 1;
      });
    };
    return function () {
      delete window.__devRefreshCoach;
    };
  }, []); // eslint-disable-line

  useEffect(function () {
    var load = /*#__PURE__*/function () {
      var _ref99 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
        var k, lv, wv, mv, pv, pp, mv2, wkv, prior, d, pwv, bv, hv, wiv, tav, alv, wnv, cbv, ckv, n, acv, asv, auv, u, hc, hcParsed;
        return _regenerator().w(function (_context35) {
          while (1) switch (_context35.n) {
            case 0:
              _context35.n = 1;
              return runMigrations();
            case 1:
              k = todayKey();
              _context35.n = 2;
              return sg("logs__" + k);
            case 2:
              lv = _context35.v;
              if (lv) setLogs(JSON.parse(lv));
              _context35.n = 3;
              return sg("water__" + k);
            case 3:
              wv = _context35.v;
              if (wv) setWater(parseInt(wv) || 0);
              _context35.n = 4;
              return sg("mode__" + k);
            case 4:
              mv = _context35.v;
              if (mv) setMode(mv);
              _context35.n = 5;
              return sg("profile");
            case 5:
              pv = _context35.v;
              if (pv) {
                pp = JSON.parse(pv);
                setProf(pp);
                setDietaryCache(pp.dietary);
              }
              _context35.n = 6;
              return sg("meals");
            case 6:
              mv2 = _context35.v;
              if (mv2) setMeals(JSON.parse(mv2));
              _context35.n = 7;
              return sg("workouts__" + k);
            case 7:
              wkv = _context35.v;
              if (wkv) setWorkouts(JSON.parse(wkv));
              // Prior two days' workout kcal for the smoothed earn-to-eat window (Step 3).
              prior = [];
              d = 1;
            case 8:
              if (!(d <= 2)) {
                _context35.n = 11;
                break;
              }
              _context35.n = 9;
              return sg("workouts__" + dateKey(new Date(Date.now() - d * 86400000)));
            case 9:
              pwv = _context35.v;
              prior.push(pwv ? JSON.parse(pwv).reduce(function (s, w) {
                return s + (w.kcal || 0);
              }, 0) : 0);
            case 10:
              d++;
              _context35.n = 8;
              break;
            case 11:
              setPriorWorkoutKcal(prior);
              _context35.n = 12;
              return sg("badges");
            case 12:
              bv = _context35.v;
              if (bv) setEarnedBdgs(JSON.parse(bv));
              _context35.n = 13;
              return sg("history");
            case 13:
              hv = _context35.v;
              if (hv) setHist(JSON.parse(hv));
              _context35.n = 14;
              return sg("weighins");
            case 14:
              wiv = _context35.v;
              if (wiv) setWeighIns(JSON.parse(wiv));
              _context35.n = 15;
              return sg("tdee_adj");
            case 15:
              tav = _context35.v;
              if (tav) setTdeeAdj(parseInt(tav) || 0);
              _context35.n = 16;
              return sg("tdee_adj_log");
            case 16:
              alv = _context35.v;
              if (alv) {
                try {
                  setAdjLog(JSON.parse(alv) || []);
                } catch (e) {}
              }
              _context35.n = 17;
              return sg("weigh_nudge_dismissed");
            case 17:
              wnv = _context35.v;
              if (wnv) setWeighNudgeAt(parseInt(wnv) || null);
              _context35.n = 18;
              return sg("cut_block");
            case 18:
              cbv = _context35.v;
              if (cbv) {
                try {
                  setCutBlock(_objectSpread(_objectSpread({}, EMPTY_CUT_BLOCK), JSON.parse(cbv)));
                } catch (e) {}
              }
              _context35.n = 19;
              return sg("target_kcal");
            case 19:
              ckv = _context35.v;
              if (ckv) {
                n = parseInt(ckv);
                if (n > 0) setCustomKcal(n);
              }
              _context35.n = 20;
              return sg("aggressive_cut_acked");
            case 20:
              acv = _context35.v;
              if (acv) setAggressiveCutAcked(true);

              // Auth — load premium state and check expiry
              _context35.n = 21;
              return sg("auth_state");
            case 21:
              asv = _context35.v;
              _context35.n = 22;
              return sg("auth_user");
            case 22:
              auv = _context35.v;
              if (!(asv === "premium" && auv)) {
                _context35.n = 26;
                break;
              }
              u = JSON.parse(auv);
              if (!(u.subExpiry && Date.now() > u.subExpiry)) {
                _context35.n = 24;
                break;
              }
              _context35.n = 23;
              return ss("auth_state", "anonymous");
            case 23:
              setShowLapsed(true);
              _context35.n = 26;
              break;
            case 24:
              setAuthState("premium");
              setAuthUser(u);
              // Retroactive consent guard (R2): premium users from before consent existed,
              // or who haven't agreed to the current policy version, must consent before continuing.
              _context35.n = 25;
              return sg("health_consent");
            case 25:
              hc = _context35.v;
              hcParsed = null;
              try {
                hcParsed = hc ? JSON.parse(hc) : null;
              } catch (e) {}
              if (hcParsed) setConsentInfo(hcParsed);
              if (!hcParsed || hcParsed.version !== POLICY_VERSION) setNeedsConsent(true);
              // Background pull — app shows immediately from local, Supabase data merges in
              if (u.id && navigator.onLine) {
                pullFromSupabase(u.id).then(function (pulled) {
                  if (pulled.profile) {
                    setProf(pulled.profile);
                    setDietaryCache(pulled.profile.dietary);
                  }
                  if (pulled.cutBlock) setCutBlock(pulled.cutBlock);
                  if (pulled.weighIns) setWeighIns(pulled.weighIns);
                  if (pulled.meals) setMeals(pulled.meals);
                  if (pulled.badges) setEarnedBdgs(pulled.badges);
                  if (pulled.settings) {
                    if (pulled.settings.mode) setMode(pulled.settings.mode);
                    if (pulled.settings.tdee_adj != null) setTdeeAdj(Number(pulled.settings.tdee_adj));
                    if (pulled.settings.custom_kcal != null) setCustomKcal(Number(pulled.settings.custom_kcal));
                    if (pulled.settings.aggressive_cut_acked) setAggressiveCutAcked(true);
                  }
                  if (pulled.history) {
                    setHist(pulled.history);
                    var tod = todayKey();
                    var snap = pulled.history.find(function (h) {
                      return h.date === tod;
                    });
                    if (snap) {
                      setLogs(snap.logs || []);
                      setWater(snap.water || 0);
                    }
                  }
                  if (pulled.workouts) {
                    setWorkouts(pulled.workouts[todayKey()] || []);
                    setPriorWorkoutKcal(priorFromByDate(pulled.workouts));
                  }
                })["catch"](function () {});
              }
            case 26:
              setReady(true);
            case 27:
              return _context35.a(2);
          }
        }, _callee35);
      }));
      return function load() {
        return _ref99.apply(this, arguments);
      };
    }();
    load();
  }, []); // eslint-disable-line

  // Badge check
  useEffect(function () {
    if (!ready || !hist.length) return;
    var streak = calcStreak(hist);
    var metrics = {
      streak: streak,
      logger: hist.filter(function (d) {
        var _d$logs;
        return ((_d$logs = d.logs) === null || _d$logs === void 0 ? void 0 : _d$logs.length) > 0;
      }).length,
      hydrated: hist.filter(function (d) {
        return (d.water || 0) >= 8;
      }).length
    };
    var newlyEarned = [];
    BDGS.forEach(function (b) {
      var val = metrics[b.id] || 0;
      TIERS.forEach(function (t, i) {
        if (val >= t && !earnedBdgs.includes(b.id + "_" + i)) newlyEarned.push({
          b: b,
          i: i,
          key: b.id + "_" + i
        });
      });
    });
    if (newlyEarned.length) {
      var updated = [].concat(_toConsumableArray(earnedBdgs), _toConsumableArray(newlyEarned.map(function (x) {
        return x.key;
      })));
      setEarnedBdgs(updated);
      ss("badges", JSON.stringify(updated));
      var top = newlyEarned[newlyEarned.length - 1]; // celebrate the highest new tier earned
      if (top.i >= 2) {
        // Gold tier and above → full fanfare overlay
        setNewBadge(top);
      } else {
        // Bronze / Silver → quiet toast + 🏆 glow, no overlay
        setBadgeToast(top);
        setBadgeGlow(true);
        setTimeout(function () {
          return setBadgeGlow(false);
        }, 1600);
      }
      if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncBadges(authUser.id, updated)["catch"](function () {});
    }
  }, [hist]); // eslint-disable-line

  var saveLogs = /*#__PURE__*/function () {
    var _ref100 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(l) {
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.n) {
          case 0:
            setLogs(l);
            _context36.n = 1;
            return ss("logs__" + todayKey(), JSON.stringify(l));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncFoodLogs(authUser.id, todayKey(), l)["catch"](function () {});
          case 2:
            return _context36.a(2);
        }
      }, _callee36);
    }));
    return function saveLogs(_x46) {
      return _ref100.apply(this, arguments);
    };
  }();
  var saveWater = /*#__PURE__*/function () {
    var _ref101 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(w) {
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.n) {
          case 0:
            setWater(w);
            _context37.n = 1;
            return ss("water__" + todayKey(), String(w));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncWater(authUser.id, todayKey(), w)["catch"](function () {});
          case 2:
            return _context37.a(2);
        }
      }, _callee37);
    }));
    return function saveWater(_x47) {
      return _ref101.apply(this, arguments);
    };
  }();
  var saveMode = /*#__PURE__*/function () {
    var _ref102 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(m) {
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.n) {
          case 0:
            setMode(m);
            _context38.n = 1;
            return ss("mode__" + todayKey(), m);
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, m, tdeeAdj, customKcal, aggressiveCutAcked)["catch"](function () {});
          case 2:
            return _context38.a(2);
        }
      }, _callee38);
    }));
    return function saveMode(_x48) {
      return _ref102.apply(this, arguments);
    };
  }();
  var saveProf = /*#__PURE__*/function () {
    var _ref103 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(p) {
      return _regenerator().w(function (_context39) {
        while (1) switch (_context39.n) {
          case 0:
            setProf(p);
            setDietaryCache(p.dietary); // keep the AI-prompt cache in step with the saved config
            _context39.n = 1;
            return ss("profile", JSON.stringify(p));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncProfile(authUser.id, p)["catch"](function () {});
          case 2:
            return _context39.a(2);
        }
      }, _callee39);
    }));
    return function saveProf(_x49) {
      return _ref103.apply(this, arguments);
    };
  }();
  var saveWorkouts = /*#__PURE__*/function () {
    var _ref104 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(w) {
      return _regenerator().w(function (_context40) {
        while (1) switch (_context40.n) {
          case 0:
            setWorkouts(w);
            _context40.n = 1;
            return ss("workouts__" + todayKey(), JSON.stringify(w));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncWorkouts(authUser.id, todayKey(), w)["catch"](function () {});
          case 2:
            return _context40.a(2);
        }
      }, _callee40);
    }));
    return function saveWorkouts(_x50) {
      return _ref104.apply(this, arguments);
    };
  }();
  // [yesterday, 2-days-ago] total workout kcal from a dateKey→workouts[] map (smoothed
  // earn-to-eat window, Step 3). Used on sync pulls where we have the whole byDate map.
  var priorFromByDate = function priorFromByDate(byDate) {
    return [1, 2].map(function (d) {
      var arr = byDate[dateKey(new Date(Date.now() - d * 86400000))] || [];
      return arr.reduce(function (s, w) {
        return s + (w.kcal || 0);
      }, 0);
    });
  };
  var addLog = /*#__PURE__*/function () {
    var _ref105 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41(e) {
      var isFirstToday, popKey, today, simulatedHist, ns;
      return _regenerator().w(function (_context41) {
        while (1) switch (_context41.n) {
          case 0:
            haptic();
            isFirstToday = logs.length === 0;
            _context41.n = 1;
            return saveLogs([].concat(_toConsumableArray(logs), [_objectSpread(_objectSpread({}, e), {}, {
              id: Date.now(),
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            })]));
          case 1:
            if (isFirstToday) {
              popKey = "streak_pop__" + todayKey();
              if (!localStorage.getItem(popKey)) {
                today = todayKey();
                simulatedHist = [].concat(_toConsumableArray(hist.filter(function (d) {
                  return d.date !== today;
                })), [{
                  date: today,
                  logs: [e]
                }]);
                ns = calcStreak(simulatedHist);
                if (ns > 0) {
                  // quiet pip at the point of action — no overlay, no sound, once per day
                  localStorage.setItem(popKey, "1");
                  setStreakPop(ns);
                }
              }
            }
          case 2:
            return _context41.a(2);
        }
      }, _callee41);
    }));
    return function addLog(_x51) {
      return _ref105.apply(this, arguments);
    };
  }();
  var removeLog = function removeLog(id) {
    haptic();
    return saveLogs(logs.filter(function (l) {
      return l.id !== id;
    }));
  };
  var updateLog = function updateLog(id, patch) {
    haptic();
    return saveLogs(logs.map(function (l) {
      return l.id === id ? _objectSpread(_objectSpread({}, l), patch) : l;
    }));
  };
  var addWorkout = function addWorkout(w) {
    haptic();
    return saveWorkouts([].concat(_toConsumableArray(workouts), [w]));
  };
  var removeWorkout = function removeWorkout(id) {
    haptic();
    return saveWorkouts(workouts.filter(function (w) {
      return w.id !== id;
    }));
  };
  var saveCustomKcal = /*#__PURE__*/function () {
    var _ref106 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42(kcal) {
      return _regenerator().w(function (_context42) {
        while (1) switch (_context42.n) {
          case 0:
            setCustomKcal(kcal);
            if (!(kcal == null)) {
              _context42.n = 2;
              break;
            }
            _context42.n = 1;
            return ss("target_kcal", "");
          case 1:
            _context42.n = 3;
            break;
          case 2:
            _context42.n = 3;
            return ss("target_kcal", String(kcal));
          case 3:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, tdeeAdj, kcal, aggressiveCutAcked)["catch"](function () {});
          case 4:
            return _context42.a(2);
        }
      }, _callee42);
    }));
    return function saveCustomKcal(_x52) {
      return _ref106.apply(this, arguments);
    };
  }();
  var handleSetMode = /*#__PURE__*/function () {
    var _ref107 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43(m) {
      return _regenerator().w(function (_context43) {
        while (1) switch (_context43.n) {
          case 0:
            _context43.n = 1;
            return saveMode(m);
          case 1:
            _context43.n = 2;
            return saveCustomKcal(null);
          case 2:
            // Sync once more with correct (m, null) pair to resolve any stale-closure race
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, m, tdeeAdj, null, aggressiveCutAcked)["catch"](function () {});
          case 3:
            return _context43.a(2);
        }
      }, _callee43);
    }));
    return function handleSetMode(_x53) {
      return _ref107.apply(this, arguments);
    };
  }();
  var handleAckAggressiveCut = /*#__PURE__*/function () {
    var _ref108 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44() {
      return _regenerator().w(function (_context44) {
        while (1) switch (_context44.n) {
          case 0:
            setAggressiveCutAcked(true);
            _context44.n = 1;
            return ss("aggressive_cut_acked", "1");
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, tdeeAdj, customKcal, true)["catch"](function () {});
          case 2:
            return _context44.a(2);
        }
      }, _callee44);
    }));
    return function handleAckAggressiveCut() {
      return _ref108.apply(this, arguments);
    };
  }();
  var saveMeals = /*#__PURE__*/function () {
    var _ref109 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45(updated) {
      return _regenerator().w(function (_context45) {
        while (1) switch (_context45.n) {
          case 0:
            setMeals(updated);
            _context45.n = 1;
            return ss("meals", JSON.stringify(updated));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncMeals(authUser.id, updated)["catch"](function () {});
          case 2:
            return _context45.a(2);
        }
      }, _callee45);
    }));
    return function saveMeals(_x54) {
      return _ref109.apply(this, arguments);
    };
  }();
  var addToQA = /*#__PURE__*/function () {
    var _ref110 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46(entry) {
      var name, clean;
      return _regenerator().w(function (_context46) {
        while (1) switch (_context46.n) {
          case 0:
            name = entry.name;
            if (!meals.find(function (m) {
              return m.name.toLowerCase() === name.toLowerCase();
            })) {
              _context46.n = 1;
              break;
            }
            return _context46.a(2);
          case 1:
            haptic();
            clean = {
              name: name,
              kcal: Math.round(entry.kcal),
              protein: Math.round(entry.protein * 10) / 10,
              carbs: Math.round(entry.carbs * 10) / 10,
              fat: Math.round(entry.fat * 10) / 10
            };
            _context46.n = 2;
            return saveMeals([].concat(_toConsumableArray(meals), [clean]));
          case 2:
            return _context46.a(2);
        }
      }, _callee46);
    }));
    return function addToQA(_x55) {
      return _ref110.apply(this, arguments);
    };
  }();

  // ── Auth handlers ─────────────────────────────────────────────

  var handleSignInSuccess = /*#__PURE__*/function () {
    var _ref111 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47(googleUser, grantedBy, consentMeta) {
      var user, rec, pulled, tod, snap, _t39;
      return _regenerator().w(function (_context47) {
        while (1) switch (_context47.p = _context47.n) {
          case 0:
            user = {
              id: googleUser.id || null,
              name: googleUser.name || "User",
              email: googleUser.email || "",
              picture: googleUser.picture || "",
              grantedBy: grantedBy,
              subExpiry: null,
              // null = no expiry (voucher phase); real payments will set this
              since: Date.now()
            };
            setAuthUser(user);
            setAuthState("premium");
            _context47.n = 1;
            return ss("auth_state", "premium");
          case 1:
            _context47.n = 2;
            return ss("auth_user", JSON.stringify(user));
          case 2:
            if (!consentMeta) {
              _context47.n = 4;
              break;
            }
            rec = _objectSpread(_objectSpread({}, consentMeta), {}, {
              version: consentMeta.policyVersion
            });
            _context47.n = 3;
            return ss("health_consent", JSON.stringify(rec));
          case 3:
            setConsentInfo(rec);
          case 4:
            setShowSignIn(false);
            setPremiumGate(null);
            if (!(user.id && navigator.onLine)) {
              _context47.n = 11;
              break;
            }
            setSyncMsg("Syncing your data…");
            _context47.p = 5;
            if (!consentMeta) {
              _context47.n = 6;
              break;
            }
            _context47.n = 6;
            return syncConsent(user.id, consentMeta);
          case 6:
            _context47.n = 7;
            return migrateLocalToSupabase(user.id);
          case 7:
            _context47.n = 8;
            return pullFromSupabase(user.id);
          case 8:
            pulled = _context47.v;
            if (pulled.profile) {
              setProf(pulled.profile);
              setDietaryCache(pulled.profile.dietary);
            }
            if (pulled.cutBlock) setCutBlock(pulled.cutBlock);
            if (pulled.weighIns) setWeighIns(pulled.weighIns);
            if (pulled.meals) setMeals(pulled.meals);
            if (pulled.badges) setEarnedBdgs(pulled.badges);
            if (pulled.settings) {
              if (pulled.settings.mode) setMode(pulled.settings.mode);
              if (pulled.settings.tdee_adj != null) setTdeeAdj(Number(pulled.settings.tdee_adj));
              if (pulled.settings.custom_kcal != null) setCustomKcal(Number(pulled.settings.custom_kcal));
              if (pulled.settings.aggressive_cut_acked) setAggressiveCutAcked(true);
            }
            if (pulled.history) {
              setHist(pulled.history);
              tod = todayKey();
              snap = pulled.history.find(function (h) {
                return h.date === tod;
              });
              if (snap) {
                setLogs(snap.logs || []);
                setWater(snap.water || 0);
              }
            }
            if (pulled.workouts) {
              setWorkouts(pulled.workouts[todayKey()] || []);
              setPriorWorkoutKcal(priorFromByDate(pulled.workouts));
            }
            _context47.n = 10;
            break;
          case 9:
            _context47.p = 9;
            _t39 = _context47.v;
          case 10:
            setSyncMsg("");
          case 11:
            return _context47.a(2);
        }
      }, _callee47, null, [[5, 9]]);
    }));
    return function handleSignInSuccess(_x56, _x57, _x58) {
      return _ref111.apply(this, arguments);
    };
  }();

  // Agree to the current policy version (retroactive / re-consent flow, R2).
  var handleConsent = /*#__PURE__*/function () {
    var _ref112 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48() {
      var meta, rec;
      return _regenerator().w(function (_context48) {
        while (1) switch (_context48.n) {
          case 0:
            meta = {
              ageConfirmedAt: null,
              healthConsentAt: Date.now(),
              policyVersion: POLICY_VERSION
            };
            rec = _objectSpread(_objectSpread({}, meta), {}, {
              version: POLICY_VERSION
            });
            _context48.n = 1;
            return ss("health_consent", JSON.stringify(rec));
          case 1:
            setConsentInfo(rec);
            if (!(authUser !== null && authUser !== void 0 && authUser.id)) {
              _context48.n = 2;
              break;
            }
            _context48.n = 2;
            return syncConsent(authUser.id, meta);
          case 2:
            setNeedsConsent(false);
          case 3:
            return _context48.a(2);
        }
      }, _callee48);
    }));
    return function handleConsent() {
      return _ref112.apply(this, arguments);
    };
  }();
  var handleSignOut = /*#__PURE__*/function () {
    var _ref113 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49() {
      var clearKeys, _i2, _clearKeys, k, i, key, _t40;
      return _regenerator().w(function (_context49) {
        while (1) switch (_context49.p = _context49.n) {
          case 0:
            if (!sb()) {
              _context49.n = 4;
              break;
            }
            _context49.p = 1;
            _context49.n = 2;
            return sb().auth.signOut();
          case 2:
            _context49.n = 4;
            break;
          case 3:
            _context49.p = 3;
            _t40 = _context49.v;
          case 4:
            clearKeys = ["auth_state", "auth_user", "profile", "meals", "history", "badges", "weighins", "tdee_adj", "tdee_adj_log", "weigh_nudge_dismissed", "cut_block", "target_kcal", "aggressive_cut_acked", "health_consent"];
            _i2 = 0, _clearKeys = clearKeys;
          case 5:
            if (!(_i2 < _clearKeys.length)) {
              _context49.n = 7;
              break;
            }
            k = _clearKeys[_i2];
            _context49.n = 6;
            return ss(k, "");
          case 6:
            _i2++;
            _context49.n = 5;
            break;
          case 7:
            try {
              for (i = localStorage.length - 1; i >= 0; i--) {
                key = localStorage.key(i);
                if (key && (key.startsWith("logs__") || key.startsWith("water__") || key.startsWith("workouts__") || key.startsWith("mode__") || key.startsWith("coach__") || key.startsWith("streak_pop__") || key.startsWith("sync_migrated__"))) {
                  localStorage.removeItem(key);
                }
              }
            } catch (e) {}
            setAuthState("anonymous");
            setAuthUser(null);
            setLogs([]);
            setWater(0);
            setMode("cut");
            setProf(null);
            setHist([]);
            setMeals([].concat(DEF_MEALS));
            setWorkouts([]);
            setEarnedBdgs([]);
            setWeighIns([]);
            setTdeeAdj(0);
            setAdjLog([]);
            setWeighNudgeAt(null);
            setCustomKcal(null);
            setCutBlock(EMPTY_CUT_BLOCK);
            setConsentInfo(null);
            setNeedsConsent(false);
            setShowSignOut(false);
            setView("dashboard");
          case 8:
            return _context49.a(2);
        }
      }, _callee49, null, [[1, 3]]);
    }));
    return function handleSignOut() {
      return _ref113.apply(this, arguments);
    };
  }();

  // Assemble a portable copy of everything stored for this user (R4 — access/portability).
  // Start clean (Profile). Zeroes the adaptive adjustment and the dead-time log it uses,
  // then pushes the zero to Supabase in the same breath — otherwise the next background
  // pull would helpfully restore the old value and undo it. Weigh-ins and history are left
  // alone: they are data, and the estimate rebuilds itself from them.
  var resetTdeeAdj = /*#__PURE__*/function () {
    var _ref114 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50() {
      return _regenerator().w(function (_context50) {
        while (1) switch (_context50.n) {
          case 0:
            setTdeeAdj(0);
            setAdjLog([]);
            _context50.n = 1;
            return ss("tdee_adj", "0");
          case 1:
            _context50.n = 2;
            return ss("tdee_adj_log", JSON.stringify([]));
          case 2:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, 0, customKcal, aggressiveCutAcked)["catch"](function () {});
            setNoteToast("Adjustment reset — the app will re-learn from your weigh-ins");
          case 3:
            return _context50.a(2);
        }
      }, _callee50);
    }));
    return function resetTdeeAdj() {
      return _ref114.apply(this, arguments);
    };
  }();
  var handleExport = function handleExport() {
    var workoutsByDate = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith("workouts__")) {
          var v = localStorage.getItem(key);
          if (v) workoutsByDate[key.replace("workouts__", "")] = JSON.parse(v);
        }
      }
    } catch (e) {}
    var data = {
      app: "Fuel Log",
      exportedAt: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
      account: {
        name: (authUser === null || authUser === void 0 ? void 0 : authUser.name) || null,
        email: (authUser === null || authUser === void 0 ? void 0 : authUser.email) || null
      },
      consent: consentInfo || null,
      profile: prof || null,
      settings: {
        mode: mode,
        tdeeAdj: tdeeAdj,
        customKcal: customKcal,
        aggressiveCutAcked: aggressiveCutAcked
      },
      weighIns: weighIns,
      meals: meals,
      badges: earnedBdgs,
      history: hist,
      workoutsByDate: workoutsByDate
    };
    try {
      var blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "fuel-log-export-" + todayKey() + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        return URL.revokeObjectURL(url);
      }, 2000);
    } catch (e) {}
  };

  // Permanently delete the account (R5). Worker cascades the delete; then wipe locally.
  var handleDeleteAccount = /*#__PURE__*/function () {
    var _ref115 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51() {
      return _regenerator().w(function (_context51) {
        while (1) switch (_context51.n) {
          case 0:
            _context51.n = 1;
            return deleteAccountRequest();
          case 1:
            _context51.n = 2;
            return handleSignOut();
          case 2:
            return _context51.a(2);
        }
      }, _callee51);
    }));
    return function handleDeleteAccount() {
      return _ref115.apply(this, arguments);
    };
  }();
  useEffect(function () {
    if (!ready) return;
    var k = todayKey();
    var tots = sumLogs(logs);
    var snap = {
      date: k,
      mode: mode,
      kcal: Math.round(tots.kcal),
      protein: Math.round(tots.protein * 10) / 10,
      carbs: Math.round(tots.carbs * 10) / 10,
      fat: Math.round(tots.fat * 10) / 10,
      water: water,
      training: workouts.length > 0,
      logs: _toConsumableArray(logs)
    };
    var upd = [].concat(_toConsumableArray(hist.filter(function (d) {
      return d.date !== k;
    })), [snap]).sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
    setHist(upd);
    ss("history", JSON.stringify(upd));
    if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncHistory(authUser.id, upd)["catch"](function () {});
  }, [logs, water, workouts, mode, ready]); // eslint-disable-line

  var updateDay = /*#__PURE__*/function () {
    var _ref116 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52(upd) {
      var nh;
      return _regenerator().w(function (_context52) {
        while (1) switch (_context52.n) {
          case 0:
            nh = [].concat(_toConsumableArray(hist.filter(function (d) {
              return d.date !== upd.date;
            })), [upd]).sort(function (a, b) {
              return a.date.localeCompare(b.date);
            });
            setHist(nh);
            _context52.n = 1;
            return ss("history", JSON.stringify(nh));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) {
              syncHistory(authUser.id, nh)["catch"](function () {});
              if (upd.logs) syncFoodLogs(authUser.id, upd.date, upd.logs)["catch"](function () {});
            }
          case 2:
            return _context52.a(2);
        }
      }, _callee52);
    }));
    return function updateDay(_x59) {
      return _ref116.apply(this, arguments);
    };
  }();
  var onWeighIn = /*#__PURE__*/function () {
    var _ref117 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53(weight) {
      var entry, updated, updatedProf, base, wk, weekAgoKey, inFlight, result, newAdj, applied, nextLog;
      return _regenerator().w(function (_context53) {
        while (1) switch (_context53.n) {
          case 0:
            haptic();
            entry = {
              date: todayKey(),
              weight: weight
            };
            updated = [].concat(_toConsumableArray(weighIns.filter(function (w) {
              return w.date !== entry.date;
            })), [entry]).sort(function (a, b) {
              return a.date.localeCompare(b.date);
            });
            setWeighIns(updated);
            _context53.n = 1;
            return ss("weighins", JSON.stringify(updated));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncWeighIns(authUser.id, updated)["catch"](function () {});

            // Sync profile weight so targets recalculate immediately
            updatedProf = _objectSpread(_objectSpread({}, prof || DEF_PROFILE), {}, {
              weight: weight
            });
            _context53.n = 2;
            return saveProf(updatedProf);
          case 2:
            // Run calibration whenever a new weigh-in arrives — measure the deficit against the
            // seeded estimate (activity-adjusted) currently shown to the user, plus any adaptive adj.
            // Dead-time compensation: the 7-day weight window can't yet reflect adjustments made in
            // the last 7 days, so pass their sum so the controller doesn't re-count them (kills the
            // overshoot the old ±150 integrator had). The log is local-only convergence bookkeeping.
            base = seedTDEE(updatedProf);
            wk = new Date();
            wk.setDate(wk.getDate() - 7);
            weekAgoKey = dateKey(wk);
            inFlight = adjLog.filter(function (a) {
              return a.date > weekAgoKey;
            }).reduce(function (s, a) {
              return s + a.adj;
            }, 0);
            result = runCalibration(hist, updated, base + tdeeAdj, inFlight);
            if (!(result && Math.abs(result.adj) >= CAL_MIN_STEP)) {
              _context53.n = 5;
              break;
            }
            newAdj = Math.max(-ADJ_CAP, Math.min(ADJ_CAP, tdeeAdj + result.adj));
            applied = newAdj - tdeeAdj;
            if (!(applied !== 0)) {
              _context53.n = 5;
              break;
            }
            setTdeeAdj(newAdj);
            _context53.n = 3;
            return ss("tdee_adj", String(newAdj));
          case 3:
            nextLog = [].concat(_toConsumableArray(adjLog), [{
              date: todayKey(),
              adj: applied
            }]).slice(-14);
            setAdjLog(nextLog);
            _context53.n = 4;
            return ss("tdee_adj_log", JSON.stringify(nextLog));
          case 4:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, newAdj, customKcal, aggressiveCutAcked)["catch"](function () {});
          case 5:
            return _context53.a(2);
        }
      }, _callee53);
    }));
    return function onWeighIn(_x60) {
      return _ref117.apply(this, arguments);
    };
  }();
  var p = prof || DEF_PROFILE;
  var baseTDEE = seedTDEE(p); // seeded estimate (activity-adjusted); may exceed sedentary
  var tdeeFloor = sedentaryFloorOf(p); // absolute maintenance floor (BMR × 1.2)
  // Mirror calcTargets: the adaptive adjustment can lift maintenance but never pull it
  // below sedentary TDEE (BMR × 1.2). The floor is sedentary, NOT the seed — so a negative
  // adjustment on a higher-activity seed still bites down to sedentary.
  var effectiveTDEE = Math.max(tdeeFloor, baseTDEE + tdeeAdj);
  var effectiveMode = customKcal != null ? customKcal > effectiveTDEE ? "bulk" : customKcal < effectiveTDEE ? "cut" : "maintain" : mode;

  // Weigh-in check-in nudge (energy Step 2 companion; features/energy-safety/06). Anchor on
  // the last weigh-in, or (if never weighed) the first day the user was active, so a week of
  // silence surfaces one gentle, cadence-respecting prompt.
  var weighNudgeAnchorTs = weighIns.length ? new Date(weighIns[weighIns.length - 1].date).getTime() : hist.length ? hist.reduce(function (m, d) {
    return Math.min(m, new Date(d.date).getTime());
  }, Infinity) : null;
  var showWeighNudge = shouldNudgeWeighIn({
    cadence: weighCadenceOf(p),
    lastActivityTs: weighNudgeAnchorTs,
    dismissedTs: weighNudgeAt,
    now: Date.now()
  });
  var dismissWeighNudge = /*#__PURE__*/function () {
    var _ref118 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54() {
      var ts;
      return _regenerator().w(function (_context54) {
        while (1) switch (_context54.n) {
          case 0:
            ts = Date.now();
            setWeighNudgeAt(ts);
            _context54.n = 1;
            return ss("weigh_nudge_dismissed", String(ts));
          case 1:
            return _context54.a(2);
        }
      }, _callee54);
    }));
    return function dismissWeighNudge() {
      return _ref118.apply(this, arguments);
    };
  }();
  var muteWeighNudge = /*#__PURE__*/function () {
    var _ref119 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55() {
      return _regenerator().w(function (_context55) {
        while (1) switch (_context55.n) {
          case 0:
            _context55.n = 1;
            return dismissWeighNudge();
          case 1:
            _context55.n = 2;
            return saveProf(_objectSpread(_objectSpread({}, p), {}, {
              weighCadence: "off"
            }));
          case 2:
            return _context55.a(2);
        }
      }, _callee55);
    }));
    return function muteWeighNudge() {
      return _ref119.apply(this, arguments);
    };
  }();

  // Earn-to-eat is SMOOTHED (Step 3): today's applied bonus is a weighted average of
  // today's + the prior two days' workout kcal, not today's raw session total. This
  // damps the same-day spike and carries a hard session's fuel into the next days.
  var todayWorkoutKcal = workouts.reduce(function (s, w) {
    return s + (w.kcal || 0);
  }, 0);
  var smoothedBonus = smoothWorkoutKcal([todayWorkoutKcal].concat(_toConsumableArray(priorWorkoutKcal)));
  // Raw (unsmoothed) burn goes in separately: the target is built from the smoothed
  // bonus, but energy availability asks what today's body actually spent (Step 4).
  var baseTargets = calcTargets(p, effectiveMode, smoothedBonus, tdeeAdj, todayWorkoutKcal);
  var targets = function () {
    if (customKcal == null) return baseTargets;
    var safeMin = SAFE_MIN[p.sex || "male"] || 1400;
    var safeKcal = Math.max(safeMin, customKcal);
    // Floors hold; carbs absorb the change — never proportionally scale protein/fat
    // (the old bug dragged fat under its hormonal floor on a deep custom cut).
    var m = computeMacros(p, effectiveMode, safeKcal);
    return _objectSpread(_objectSpread({}, baseTargets), {}, {
      kcal: safeKcal,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
      floorsExceedKcal: m.floorsExceedKcal,
      safeMinApplied: safeKcal > customKcal,
      customKcalApplied: true,
      // A typed target is the user's own choice: the steady-loss floor WARNS here
      // (see targetWarning) instead of silently overriding the number they set.
      deficitFloorApplied: false,
      ea: energyAvailability(safeKcal, todayWorkoutKcal, p),
      lowFuel: isLeanBody(p) && todayWorkoutKcal > 0 && energyAvailability(safeKcal, todayWorkoutKcal, p) < EA_HARD
    });
  }();

  // ── Cut cycling (energy Step 5; features/energy-safety/02) ──────
  // How much today weighs comes from the PRESCRIBED deficit depth. Whether it counts at
  // all comes from the declared mode + the weight-trend backstop — never from food logs,
  // because a patchy logger is exactly the user this protects.
  var todayK = todayKey();
  var todayLoad = dayCutLoad(targets.kcal, effectiveTDEE);
  var lossRate = weeklyLossFrac(weighIns, todayK);
  var trendCutting = lossRate != null && lossRate >= TREND_CUT_RATE;
  var cuttingToday = effectiveMode === "cut" && todayLoad > 0 || trendCutting;
  // A trend-detected cut still needs a weight. If the label says "Maintain" the
  // prescribed deficit is ~0, so fall back to the reference deficit rather than
  // accruing nothing — the scale is the evidence here, not the setting.
  var todayCutLoad = cuttingToday ? todayLoad > 0 ? todayLoad : 1 : 0;

  // Catch up every day since the last accrual, so closing the app never stops the clock.
  // Idempotent by date — re-opening today cannot double-count.
  useEffect(function () {
    if (!ready || cutBlock.lastAccrued === todayK) return;
    var next = accrueCutBlock(cutBlock, todayK, {
      cutting: cuttingToday,
      load: todayCutLoad,
      weight: weighIns.length ? weighIns[weighIns.length - 1].weight : p.weight || null
    });
    setCutBlock(next);
    ss("cut_block", JSON.stringify(next));
    if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncCutBlock(authUser.id, next)["catch"](function () {});
  }, [ready, cuttingToday, todayCutLoad, todayK]); // eslint-disable-line

  // Loss since this block opened, for BLOCK_LOSS_TRIGGER (5% of bodyweight).
  var blockNowAvg = weighRollingAvg(weighIns, dateKey(new Date(Date.now() + 86400000)), 7);
  var blockLossFrac = cutBlock.start && cutBlock.startWeight && blockNowAvg ? (cutBlock.startWeight - blockNowAvg) / cutBlock.startWeight : null;
  // Three weeks of scale, for the stall check. Same rolling averages, longer span.
  var stallRate = trendLossFrac(weighIns, todayK, STALL_WEEKS * 7);
  var cutPrompt = cutPromptFor({
    block: cutBlock,
    profile: p,
    todayK: todayK,
    lossFrac: blockLossFrac,
    stallRate: stallRate,
    cutting: cuttingToday
  });
  // The gauge, the guard and the one celebration card (file 03).
  var cutBar = cutBarFor({
    block: cutBlock,
    profile: p,
    todayK: todayK,
    cutting: cuttingToday,
    weightUp: lossRate != null && lossRate < 0
  });
  var cutGuard = cutGuardFor({
    block: cutBlock,
    profile: p,
    cutting: cuttingToday
  });
  var showRecharged = rechargedCardDue(cutBlock, todayK);
  // File 04: the scale went up over two weeks while eating below maintenance. The
  // calibration has already refused to act on it; this card is the explanation.
  var showGainWhileCutting = gainWhileCutting({
    weighIns: weighIns,
    todayK: todayK,
    cutting: cuttingToday
  });
  var saveCutBlock = /*#__PURE__*/function () {
    var _ref120 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee56(next) {
      return _regenerator().w(function (_context56) {
        while (1) switch (_context56.n) {
          case 0:
            setCutBlock(next);
            _context56.n = 1;
            return ss("cut_block", JSON.stringify(next));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncCutBlock(authUser.id, next)["catch"](function () {});
          case 2:
            return _context56.a(2);
        }
      }, _callee56);
    }));
    return function saveCutBlock(_x61) {
      return _ref120.apply(this, arguments);
    };
  }();
  var dismissCutNudge = function dismissCutNudge() {
    return saveCutBlock(_objectSpread(_objectSpread({}, cutBlock), {}, {
      nudgeAt: Date.now()
    }));
  };
  var snoozeCutPrompt = function snoozeCutPrompt() {
    return saveCutBlock(_objectSpread(_objectSpread({}, cutBlock), {}, {
      snoozeAt: Date.now()
    }));
  };
  var dismissRecharged = function dismissRecharged() {
    return saveCutBlock(_objectSpread(_objectSpread({}, cutBlock), {}, {
      rechargedOn: null
    }));
  };
  // Starting a break is one tap and nothing more: it switches to Maintain, which IS the
  // break. There is no state to enter, so there is nothing here to fail at later — from
  // tomorrow the daily accrual drains the block instead of filling it, and the gauge is
  // the tracked feedback. The snoozes clear so the prompt goes quiet honestly.
  var startDietBreak = /*#__PURE__*/function () {
    var _ref121 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee57() {
      return _regenerator().w(function (_context57) {
        while (1) switch (_context57.n) {
          case 0:
            _context57.n = 1;
            return handleSetMode("maintain");
          case 1:
            _context57.n = 2;
            return saveCutBlock(_objectSpread(_objectSpread({}, cutBlock), {}, {
              nudgeAt: null,
              snoozeAt: null
            }));
          case 2:
            setNoteToast("Break started — eat at maintenance and recharge");
          case 3:
            return _context57.a(2);
        }
      }, _callee57);
    }));
    return function startDietBreak() {
      return _ref121.apply(this, arguments);
    };
  }();
  var totals = sumLogs(logs);
  var remaining = targets.kcal - totals.kcal;
  var streak = calcStreak(hist);
  if (!ready) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: BG,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A,
      fontSize: 16,
      fontWeight: 900,
      letterSpacing: "0.12em"
    }
  }, "LOADING..."));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: BG,
      color: "#fff",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }
  }, /*#__PURE__*/React.createElement("style", null, "\n        * { box-sizing: border-box; }\n        input::placeholder, textarea::placeholder { color: var(--text-faint-2); }\n        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }\n        select { background: var(--bg); color: var(--text-hi); }\n        button { cursor: pointer; }\n        button:disabled { cursor: not-allowed; }\n        @keyframes blink_add { 0%{opacity:0.4;transform:scale(0.985)} 55%{opacity:1;transform:scale(1.015)} 100%{opacity:1;transform:scale(1)} }\n        @keyframes chip_pop  { 0%{transform:scale(1)} 35%{transform:scale(1.32)} 100%{transform:scale(1)} }\n        @keyframes chip_glow { 0%,100%{box-shadow:0 0 0 0 transparent;transform:scale(1)} 30%{box-shadow:0 0 14px 2px var(--accent);transform:scale(1.14)} 60%{box-shadow:0 0 8px 1px var(--accent);transform:scale(1)} }\n      "), DEV && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 6,
      left: 6,
      zIndex: 2000,
      display: "flex",
      gap: 4,
      flexWrap: "wrap",
      maxWidth: 160
    }
  }, [["pop", function () {
    return setStreakPop(3);
  }], ["🥉", function () {
    return setBadgeToast({
      b: BDGS[0],
      i: 0
    });
  }], ["🥈", function () {
    return setBadgeToast({
      b: BDGS[1],
      i: 1
    });
  }], ["🥇", function () {
    return setNewBadge({
      b: BDGS[0],
      i: 2
    });
  }], ["👑", function () {
    return setNewBadge({
      b: BDGS[1],
      i: 5
    });
  }]].map(function (_ref122) {
    var _ref123 = _slicedToArray(_ref122, 2),
      lbl = _ref123[0],
      fn = _ref123[1];
    return /*#__PURE__*/React.createElement("button", {
      key: lbl,
      onClick: fn,
      style: {
        fontSize: 11,
        padding: "4px 7px",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        color: "var(--text-mid)",
        opacity: 0.85
      }
    }, lbl);
  })), streakPop != null && /*#__PURE__*/React.createElement(StreakPip, {
    streak: streakPop,
    onDone: function onDone() {
      return setStreakPop(null);
    }
  }), badgeToast && /*#__PURE__*/React.createElement(BadgeToast, {
    badge: badgeToast,
    onDone: function onDone() {
      return setBadgeToast(null);
    }
  }), noteToast && /*#__PURE__*/React.createElement(NoteToast, {
    text: noteToast,
    onDone: function onDone() {
      return setNoteToast(null);
    }
  }), premiumGate && !showSignIn && /*#__PURE__*/React.createElement(PremiumModal, {
    feature: premiumGate,
    onUpgrade: function onUpgrade() {
      return setShowSignIn(true);
    },
    onDismiss: function onDismiss() {
      return setPremiumGate(null);
    }
  }), showSignIn && /*#__PURE__*/React.createElement(SignInModal, {
    onSuccess: handleSignInSuccess,
    onCancel: function onCancel() {
      setShowSignIn(false);
      setPremiumGate(null);
    }
  }), showSignOut && /*#__PURE__*/React.createElement(SignOutModal, {
    userName: authUser === null || authUser === void 0 ? void 0 : authUser.name,
    onConfirm: handleSignOut,
    onCancel: function onCancel() {
      return setShowSignOut(false);
    }
  }), showLapsed && /*#__PURE__*/React.createElement(LapsedModal, {
    onRenew: function onRenew() {
      setShowLapsed(false);
      setShowSignIn(true);
    },
    onDismiss: function onDismiss() {
      return setShowLapsed(false);
    }
  }), needsConsent && authState === "premium" && /*#__PURE__*/React.createElement(ConsentModal, {
    onConsent: handleConsent,
    onSignOut: handleSignOut
  }), newBadge && /*#__PURE__*/React.createElement(BadgeFanfare, {
    badge: newBadge,
    onDone: function onDone() {
      return setNewBadge(null);
    }
  }), view === "dashboard" && /*#__PURE__*/React.createElement(Dashboard, {
    logs: logs,
    totals: totals,
    targets: targets,
    remaining: remaining,
    water: water,
    setWater: saveWater,
    mode: effectiveMode,
    setMode: handleSetMode,
    setView: setView,
    removeLog: removeLog,
    updateLog: updateLog,
    addToQA: addToQA,
    hasProfile: !!prof,
    streak: streak,
    streakPop: streakPop != null,
    badgeGlow: badgeGlow,
    prof: prof,
    weighIns: weighIns,
    onWeighIn: onWeighIn,
    tdeeAdj: tdeeAdj,
    baseTDEE: baseTDEE,
    tdeeFloor: tdeeFloor,
    showWeighNudge: showWeighNudge,
    onNudgeDismiss: dismissWeighNudge,
    onNudgeMute: muteWeighNudge,
    coachKey: coachKey,
    cutPrompt: cutPrompt,
    onCutNudgeDismiss: dismissCutNudge,
    onCutPromptSnooze: snoozeCutPrompt,
    onStartDietBreak: startDietBreak,
    cutBar: cutBar,
    cutGuard: cutGuard,
    showRecharged: showRecharged,
    onDismissRecharged: dismissRecharged,
    showGainWhileCutting: showGainWhileCutting,
    workouts: workouts,
    onAddWorkout: addWorkout,
    onRemoveWorkout: removeWorkout,
    customKcal: customKcal,
    onSetCustomKcal: saveCustomKcal,
    isCustomMode: customKcal != null,
    aggressiveCutAcked: aggressiveCutAcked,
    onAckAggressiveCut: handleAckAggressiveCut,
    authState: authState,
    authUser: authUser,
    onPremiumGate: function onPremiumGate(feature) {
      return setPremiumGate(feature);
    },
    onSignOut: function onSignOut() {
      return setShowSignOut(true);
    },
    isOnline: isOnline,
    syncMsg: syncMsg
  }), view === "profile" && /*#__PURE__*/React.createElement(ProfileScreen, {
    profile: prof || DEF_PROFILE,
    onSave: saveProf,
    onBack: function onBack() {
      return setView("dashboard");
    },
    tdeeAdj: tdeeAdj,
    weighIns: weighIns,
    aggressiveCutAcked: aggressiveCutAcked,
    onResetAdjustment: resetTdeeAdj
  }), view === "ai" && /*#__PURE__*/React.createElement(AILog, {
    onAdd: addLog,
    onBack: function onBack() {
      return setView("dashboard");
    }
  }), view === "quick" && /*#__PURE__*/React.createElement(QuickAdd, {
    onAdd: addLog,
    onBack: function onBack() {
      return setView("dashboard");
    },
    meals: meals,
    setMeals: saveMeals,
    isPremium: authState === "premium",
    onPremiumGate: function onPremiumGate(feature) {
      return setPremiumGate(feature);
    }
  }), view === "search" && /*#__PURE__*/React.createElement(FoodSearch, {
    onAdd: addLog,
    onBack: function onBack() {
      return setView("dashboard");
    }
  }), view === "history" && /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(History, {
    history: hist,
    onBack: function onBack() {
      return setView("dashboard");
    },
    onUpdateDay: updateDay,
    weighIns: weighIns,
    meals: meals,
    setMeals: saveMeals,
    isPremium: authState === "premium",
    onPremiumGate: function onPremiumGate(feature) {
      return setPremiumGate(feature);
    }
  })), view === "achievements" && /*#__PURE__*/React.createElement(Achievements, {
    earnedBdgs: earnedBdgs,
    onBack: function onBack() {
      return setView("dashboard");
    }
  }), view === "account" && /*#__PURE__*/React.createElement(AccountScreen, {
    user: authUser,
    consentInfo: consentInfo,
    onBack: function onBack() {
      return setView("dashboard");
    },
    onExport: handleExport,
    onSignOut: function onSignOut() {
      return setShowSignOut(true);
    },
    onDelete: handleDeleteAccount
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
