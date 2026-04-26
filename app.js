function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ─────────────────────────────────────────────────────────────
// FUEL LOG — src/app.jsx
// Build: npx babel src/app.jsx --presets @babel/preset-react -o app.js
// ─────────────────────────────────────────────────────────────

var exports = window.exports || {};
// ── Constants ─────────────────────────────────────────────────

var A = "#a3ff4b",
  BG = "#0b0d0b",
  CARD = "#111311",
  BD = "#1c201c";

// ── Auth / Premium ────────────────────────────────────────────
// Fill GOOGLE_CLIENT_ID after Google Cloud Console setup — see DOCS.md §29.
// Leave empty ("") to skip Google Sign In and go straight to voucher entry (dev mode).
var GOOGLE_CLIENT_ID = "922818167366-5nl6qfteipui307j1oi7asu7d3bkgvat.apps.googleusercontent.com";
var VOUCHER_CODE = "FreeFoodTips2026";
var MODES = {
  cut: {
    label: "CUT",
    color: "#4b9fff",
    adj: -500
  },
  maintain: {
    label: "MAINTAIN",
    color: "#a3ff4b",
    adj: 0
  },
  bulk: {
    label: "BULK",
    color: "#ff7b4b",
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
  sex: null
};
var AI_ENDPOINT = "https://fuellog.adriandavidrichards.workers.dev";
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
var calcTargets = function calcTargets(p, mode) {
  var totalWorkoutKcal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var tdeeAdj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var w = Number(p.weight) || 80;
  var bf = Number(p.bodyFat) || 18;
  var sex = p.sex || "male";
  var lbm = w * (1 - bf / 100);
  var bmr = Math.round(370 + 21.6 * lbm);
  var tdee = Math.round(bmr * 1.2) + tdeeAdj;
  var kcal = tdee + MODES[mode].adj + (totalWorkoutKcal || 0);
  var protein = Math.round(lbm * (sex === "female" ? mode === "cut" ? 2.0 : mode === "bulk" ? 1.8 : 1.6 : mode === "cut" ? 2.2 : mode === "bulk" ? 2.0 : 1.8));
  var fat = Math.round(w * (sex === "female" ? mode === "cut" ? 0.7 : 0.9 : mode === "cut" ? 0.8 : 1.0));
  var safeMin = SAFE_MIN[sex] || 1400;
  var safeMinApplied = kcal < safeMin;
  if (safeMinApplied) kcal = safeMin;
  var carbs = Math.max(50, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return {
    kcal: kcal,
    protein: protein,
    carbs: carbs,
    fat: fat,
    tdee: tdee,
    bmr: bmr,
    lbm: Math.round(lbm),
    bonus: totalWorkoutKcal || 0,
    safeMinApplied: safeMinApplied
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
var runCalibration = function runCalibration(history, weighIns, baseTDEE) {
  if (weighIns.length < 8) return null;
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
  var avgKcal = recentHist.reduce(function (a, d) {
    return a + d.kcal;
  }, 0) / recentHist.length;
  var avgDeficit = baseTDEE - avgKcal;
  var expectedChange = -(avgDeficit * 7) / 7700;
  var discrepancy = actualChange - expectedChange;
  var adj = Math.max(-150, Math.min(150, Math.round(-discrepancy * 7700 / 7 / 50) * 50));
  var confidence = weighIns.length >= 28 ? "high" : weighIns.length >= 14 ? "medium" : "low";
  return {
    adj: adj,
    confidence: confidence,
    actualChange: Math.round(actualChange * 10) / 10,
    expectedChange: Math.round(expectedChange * 10) / 10,
    avgKcal: Math.round(avgKcal)
  };
};
var sg = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(k) {
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
    return _ref.apply(this, arguments);
  };
}();
var ss = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(k, v) {
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
    return _ref2.apply(this, arguments);
  };
}();
var parseJwt = function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    return {};
  }
};

// ── Supabase cloud sync ───────────────────────────────────────
var sb = function sb() {
  return window.supabaseClient;
};
var syncUpsert = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(table, rows, conflict) {
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
    return _ref3.apply(this, arguments);
  };
}();
var syncFoodLogs = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(uid, date, logs) {
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
    return _ref4.apply(this, arguments);
  };
}();
var syncWater = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(uid, date, glasses) {
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
    return _ref5.apply(this, arguments);
  };
}();
var syncWorkouts = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(uid, date, ws) {
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
    return _ref6.apply(this, arguments);
  };
}();
var syncProfile = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(uid, p) {
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
    return _ref7.apply(this, arguments);
  };
}();
var syncWeighIns = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(uid, wis) {
    var now;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !(wis !== null && wis !== void 0 && wis.length))) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          now = new Date().toISOString();
          _context8.n = 2;
          return syncUpsert("weigh_ins", wis.map(function (w) {
            return {
              user_id: uid,
              date: w.date,
              weight: w.weight,
              updated_at: now
            };
          }), "user_id,date");
        case 2:
          return _context8.a(2);
      }
    }, _callee8);
  }));
  return function syncWeighIns(_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();
var syncSettings = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(uid, mode, tdeeAdj, customKcal, acked) {
    var _t7;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2);
        case 1:
          _context9.p = 1;
          _context9.n = 2;
          return sb().from("settings").upsert({
            id: uid,
            mode: mode || "cut",
            tdee_adj: tdeeAdj || 0,
            custom_kcal: customKcal || null,
            aggressive_cut_acked: !!acked,
            updated_at: new Date().toISOString()
          });
        case 2:
          _context9.n = 4;
          break;
        case 3:
          _context9.p = 3;
          _t7 = _context9.v;
        case 4:
          return _context9.a(2);
      }
    }, _callee9, null, [[1, 3]]);
  }));
  return function syncSettings(_x18, _x19, _x20, _x21, _x22) {
    return _ref9.apply(this, arguments);
  };
}();
var syncMeals = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(uid, meals) {
    var now;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2);
        case 1:
          now = new Date().toISOString();
          _context0.n = 2;
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
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return function syncMeals(_x23, _x24) {
    return _ref0.apply(this, arguments);
  };
}();
var syncBadges = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(uid, keys) {
    var now;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !(keys !== null && keys !== void 0 && keys.length))) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2);
        case 1:
          now = new Date().toISOString();
          _context1.n = 2;
          return syncUpsert("badges", keys.map(function (badge_key) {
            return {
              user_id: uid,
              badge_key: badge_key,
              updated_at: now
            };
          }), "user_id,badge_key");
        case 2:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return function syncBadges(_x25, _x26) {
    return _ref1.apply(this, arguments);
  };
}();
var syncHistory = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(uid, hist) {
    var now;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          if (!(!uid || !navigator.onLine || !(hist !== null && hist !== void 0 && hist.length))) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2);
        case 1:
          now = new Date().toISOString();
          _context10.n = 2;
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
          return _context10.a(2);
      }
    }, _callee10);
  }));
  return function syncHistory(_x27, _x28) {
    return _ref10.apply(this, arguments);
  };
}();
var migrateLocalToSupabase = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(uid) {
    var migKey, pv, wiv, m, ta, ck, ak, mv, bv, hv, hist, _iterator, _step, _snap$logs, snap, i, key, v, _t8, _t9, _t0, _t1, _t10, _t11;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          migKey = "sync_migrated__" + uid;
          if (!localStorage.getItem(migKey)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2);
        case 1:
          _context11.p = 1;
          _context11.n = 2;
          return sg("profile");
        case 2:
          pv = _context11.v;
          if (!pv) {
            _context11.n = 3;
            break;
          }
          _context11.n = 3;
          return syncProfile(uid, JSON.parse(pv));
        case 3:
          _context11.n = 4;
          return sg("weighins");
        case 4:
          wiv = _context11.v;
          if (!wiv) {
            _context11.n = 5;
            break;
          }
          _context11.n = 5;
          return syncWeighIns(uid, JSON.parse(wiv));
        case 5:
          _context11.n = 6;
          return sg("mode__" + todayKey());
        case 6:
          _t8 = _context11.v;
          if (_t8) {
            _context11.n = 7;
            break;
          }
          _t8 = "cut";
        case 7:
          m = _t8;
          _t0 = parseInt;
          _context11.n = 8;
          return sg("tdee_adj");
        case 8:
          _t1 = _context11.v;
          if (_t1) {
            _context11.n = 9;
            break;
          }
          _t1 = "0";
        case 9:
          _t9 = _t0(_t1);
          if (_t9) {
            _context11.n = 10;
            break;
          }
          _t9 = 0;
        case 10:
          ta = _t9;
          _context11.n = 11;
          return sg("target_kcal");
        case 11:
          ck = _context11.v;
          _context11.n = 12;
          return sg("aggressive_cut_acked");
        case 12:
          ak = _context11.v;
          _context11.n = 13;
          return syncSettings(uid, m, ta, ck ? parseInt(ck) : null, !!ak);
        case 13:
          _context11.n = 14;
          return sg("meals");
        case 14:
          mv = _context11.v;
          if (!mv) {
            _context11.n = 15;
            break;
          }
          _context11.n = 15;
          return syncMeals(uid, JSON.parse(mv));
        case 15:
          _context11.n = 16;
          return sg("badges");
        case 16:
          bv = _context11.v;
          if (!bv) {
            _context11.n = 17;
            break;
          }
          _context11.n = 17;
          return syncBadges(uid, JSON.parse(bv));
        case 17:
          _context11.n = 18;
          return sg("history");
        case 18:
          hv = _context11.v;
          if (!hv) {
            _context11.n = 27;
            break;
          }
          hist = JSON.parse(hv);
          _context11.n = 19;
          return syncHistory(uid, hist);
        case 19:
          _iterator = _createForOfIteratorHelper(hist);
          _context11.p = 20;
          _iterator.s();
        case 21:
          if ((_step = _iterator.n()).done) {
            _context11.n = 24;
            break;
          }
          snap = _step.value;
          if (!((_snap$logs = snap.logs) !== null && _snap$logs !== void 0 && _snap$logs.length)) {
            _context11.n = 22;
            break;
          }
          _context11.n = 22;
          return syncFoodLogs(uid, snap.date, snap.logs);
        case 22:
          if (!snap.water) {
            _context11.n = 23;
            break;
          }
          _context11.n = 23;
          return syncWater(uid, snap.date, snap.water);
        case 23:
          _context11.n = 21;
          break;
        case 24:
          _context11.n = 26;
          break;
        case 25:
          _context11.p = 25;
          _t10 = _context11.v;
          _iterator.e(_t10);
        case 26:
          _context11.p = 26;
          _iterator.f();
          return _context11.f(26);
        case 27:
          i = 0;
        case 28:
          if (!(i < localStorage.length)) {
            _context11.n = 30;
            break;
          }
          key = localStorage.key(i);
          if (!(key !== null && key !== void 0 && key.startsWith("workouts__"))) {
            _context11.n = 29;
            break;
          }
          v = localStorage.getItem(key);
          if (!v) {
            _context11.n = 29;
            break;
          }
          _context11.n = 29;
          return syncWorkouts(uid, key.replace("workouts__", ""), JSON.parse(v));
        case 29:
          i++;
          _context11.n = 28;
          break;
        case 30:
          localStorage.setItem(migKey, "1");
          _context11.n = 32;
          break;
        case 31:
          _context11.p = 31;
          _t11 = _context11.v;
        case 32:
          return _context11.a(2);
      }
    }, _callee11, null, [[20, 25, 26, 27], [1, 31]]);
  }));
  return function migrateLocalToSupabase(_x29) {
    return _ref11.apply(this, arguments);
  };
}();
var pullFromSupabase = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(uid) {
    var _weighR$data, _mealsR$data, _badgesR$data, _histR$data, _workR$data, _yield$Promise$all, _yield$Promise$all2, profR, weighR, settR, mealsR, badgesR, histR, foodR, waterR, workR, result, p, wi, s, meals, keys, foodByDate, _iterator2, _step2, f, waterByDate, _iterator3, _step3, w, fullHist, _iterator4, _step4, snap, byDate, _iterator5, _step5, _w, _i, _Object$entries, _Object$entries$_i, d, ws, _t12, _t13;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          if (!(!uid || !navigator.onLine)) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2, {});
        case 1:
          _context12.p = 1;
          _context12.n = 2;
          return Promise.all([sb().from("profiles").select("*").eq("id", uid).maybeSingle(), sb().from("weigh_ins").select("*").eq("user_id", uid).order("date"), sb().from("settings").select("*").eq("id", uid).maybeSingle(), sb().from("meal_library").select("*").eq("user_id", uid), sb().from("badges").select("badge_key").eq("user_id", uid), sb().from("history_snapshots").select("*").eq("user_id", uid).order("date"), sb().from("food_logs").select("*").eq("user_id", uid).order("date"), sb().from("water_logs").select("*").eq("user_id", uid).order("date"), sb().from("workouts").select("*").eq("user_id", uid).order("date")]);
        case 2:
          _yield$Promise$all = _context12.v;
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
            _context12.n = 4;
            break;
          }
          p = {
            weight: profR.data.weight,
            height: profR.data.height,
            bodyFat: profR.data.body_fat,
            sex: profR.data.sex
          };
          _context12.n = 3;
          return ss("profile", JSON.stringify(p));
        case 3:
          result.profile = p;
        case 4:
          if (!((_weighR$data = weighR.data) !== null && _weighR$data !== void 0 && _weighR$data.length)) {
            _context12.n = 6;
            break;
          }
          wi = weighR.data.map(function (r) {
            return {
              date: r.date,
              weight: Number(r.weight)
            };
          });
          _context12.n = 5;
          return ss("weighins", JSON.stringify(wi));
        case 5:
          result.weighIns = wi;
        case 6:
          if (!settR.data) {
            _context12.n = 11;
            break;
          }
          s = settR.data;
          if (!s.mode) {
            _context12.n = 7;
            break;
          }
          _context12.n = 7;
          return ss("mode__" + todayKey(), s.mode);
        case 7:
          if (!(s.tdee_adj != null)) {
            _context12.n = 8;
            break;
          }
          _context12.n = 8;
          return ss("tdee_adj", String(s.tdee_adj));
        case 8:
          if (!(s.custom_kcal != null)) {
            _context12.n = 9;
            break;
          }
          _context12.n = 9;
          return ss("target_kcal", String(s.custom_kcal));
        case 9:
          if (!s.aggressive_cut_acked) {
            _context12.n = 10;
            break;
          }
          _context12.n = 10;
          return ss("aggressive_cut_acked", "1");
        case 10:
          result.settings = s;
        case 11:
          if (!((_mealsR$data = mealsR.data) !== null && _mealsR$data !== void 0 && _mealsR$data.length)) {
            _context12.n = 13;
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
          _context12.n = 12;
          return ss("meals", JSON.stringify(meals));
        case 12:
          result.meals = meals;
        case 13:
          if (!((_badgesR$data = badgesR.data) !== null && _badgesR$data !== void 0 && _badgesR$data.length)) {
            _context12.n = 15;
            break;
          }
          keys = badgesR.data.map(function (b) {
            return b.badge_key;
          });
          _context12.n = 14;
          return ss("badges", JSON.stringify(keys));
        case 14:
          result.badges = keys;
        case 15:
          foodByDate = {};
          if (foodR.data) {
            _iterator2 = _createForOfIteratorHelper(foodR.data);
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                f = _step2.value;
                if (!foodByDate[f.date]) foodByDate[f.date] = [];
                foodByDate[f.date].push({
                  id: f.entry_id,
                  name: f.name,
                  kcal: Number(f.kcal),
                  protein: Number(f.protein),
                  carbs: Number(f.carbs),
                  fat: Number(f.fat),
                  time: f.time
                });
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
          waterByDate = {};
          if (waterR.data) {
            _iterator3 = _createForOfIteratorHelper(waterR.data);
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                w = _step3.value;
                waterByDate[w.date] = w.glasses;
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
          if (!((_histR$data = histR.data) !== null && _histR$data !== void 0 && _histR$data.length)) {
            _context12.n = 25;
            break;
          }
          fullHist = histR.data.map(function (h) {
            var _ref13, _waterByDate$h$date;
            return {
              date: h.date,
              mode: h.mode,
              kcal: h.kcal,
              protein: h.protein,
              carbs: h.carbs,
              fat: h.fat,
              training: h.training,
              water: (_ref13 = (_waterByDate$h$date = waterByDate[h.date]) !== null && _waterByDate$h$date !== void 0 ? _waterByDate$h$date : h.water) !== null && _ref13 !== void 0 ? _ref13 : 0,
              logs: foodByDate[h.date] || []
            };
          });
          _context12.n = 16;
          return ss("history", JSON.stringify(fullHist));
        case 16:
          _iterator4 = _createForOfIteratorHelper(fullHist);
          _context12.p = 17;
          _iterator4.s();
        case 18:
          if ((_step4 = _iterator4.n()).done) {
            _context12.n = 21;
            break;
          }
          snap = _step4.value;
          _context12.n = 19;
          return ss("logs__" + snap.date, JSON.stringify(snap.logs || []));
        case 19:
          _context12.n = 20;
          return ss("water__" + snap.date, String(snap.water || 0));
        case 20:
          _context12.n = 18;
          break;
        case 21:
          _context12.n = 23;
          break;
        case 22:
          _context12.p = 22;
          _t12 = _context12.v;
          _iterator4.e(_t12);
        case 23:
          _context12.p = 23;
          _iterator4.f();
          return _context12.f(23);
        case 24:
          result.history = fullHist;
        case 25:
          if (!((_workR$data = workR.data) !== null && _workR$data !== void 0 && _workR$data.length)) {
            _context12.n = 29;
            break;
          }
          byDate = {};
          _iterator5 = _createForOfIteratorHelper(workR.data);
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              _w = _step5.value;
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
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          _i = 0, _Object$entries = Object.entries(byDate);
        case 26:
          if (!(_i < _Object$entries.length)) {
            _context12.n = 28;
            break;
          }
          _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), d = _Object$entries$_i[0], ws = _Object$entries$_i[1];
          _context12.n = 27;
          return ss("workouts__" + d, JSON.stringify(ws));
        case 27:
          _i++;
          _context12.n = 26;
          break;
        case 28:
          result.workouts = byDate;
        case 29:
          return _context12.a(2, result);
        case 30:
          _context12.p = 30;
          _t13 = _context12.v;
          return _context12.a(2, {});
      }
    }, _callee12, null, [[17, 22, 23, 24], [1, 30]]);
  }));
  return function pullFromSupabase(_x30) {
    return _ref12.apply(this, arguments);
  };
}();

// ── Data migrations ───────────────────────────────────────────
// Bump SCHEMA_VERSION and add a migration block each time the stored
// data shape changes. runMigrations() is called once on startup.

var SCHEMA_VERSION = 1;
var runMigrations = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
    var stored, v;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          _context13.n = 1;
          return sg("fuel_schema_v");
        case 1:
          stored = _context13.v;
          v = stored ? parseInt(stored) : 0;
          if (!(v >= SCHEMA_VERSION)) {
            _context13.n = 2;
            break;
          }
          return _context13.a(2);
        case 2:
          _context13.n = 3;
          return ss("fuel_schema_v", String(SCHEMA_VERSION));
        case 3:
          return _context13.a(2);
      }
    }, _callee13);
  }));
  return function runMigrations() {
    return _ref14.apply(this, arguments);
  };
}();

// Shared AI fetch — returns the text content string, throws on failure
var callAI = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(prompt) {
    var maxTokens,
      res,
      data,
      _args14 = arguments;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          maxTokens = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : 500;
          _context14.n = 1;
          return fetch(AI_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
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
        case 1:
          res = _context14.v;
          _context14.n = 2;
          return res.json();
        case 2:
          data = _context14.v;
          return _context14.a(2, (data.content || []).map(function (b) {
            return b.text || "";
          }).join("").trim());
      }
    }, _callee14);
  }));
  return function callAI(_x31) {
    return _ref15.apply(this, arguments);
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
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(prompt) {
    var maxTokens,
      text,
      _args15 = arguments;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          maxTokens = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : 500;
          _context15.n = 1;
          return callAI(prompt, maxTokens);
        case 1:
          text = _context15.v;
          return _context15.a(2, repairJson(text));
      }
    }, _callee15);
  }));
  return function callAIJson(_x32) {
    return _ref16.apply(this, arguments);
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
          color: "#ff5555",
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
          background: "#1a0d0d",
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
function PremiumModal(_ref17) {
  var feature = _ref17.feature,
    onUpgrade = _ref17.onUpgrade,
    onDismiss = _ref17.onDismiss;
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
      zIndex: 999,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "36px 28px",
      textAlign: "center",
      border: "1px solid ".concat(A, "44"),
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
      color: "#d8e8d0",
      marginBottom: 8
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#556050",
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "AI features require a Premium account"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0b0d0b",
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
  }, "PREMIUM UNLOCKS"), [["🤖", "AI Meal Log — describe any meal"], ["🏋️", "Workout AI Parser — paste and analyse"], ["🧑‍💼", "Daily Coach — personalised tips"], ["☁️", "Cloud sync — log on any device"]].map(function (_ref18, i) {
    var _ref19 = _slicedToArray(_ref18, 2),
      e = _ref19[0],
      t = _ref19[1];
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
        color: "#8aaa80",
        lineHeight: 1.4
      }
    }, t));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#445040",
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
      color: "#0b0d0b",
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
      color: "#445040",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Maybe Later")));
}
function SignInModal(_ref20) {
  var onSuccess = _ref20.onSuccess,
    onCancel = _ref20.onCancel;
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
  useEffect(function () {
    if (step !== "google" || devMode || typeof google === "undefined") return;
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: function () {
          var _callback = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(resp) {
            var _yield$sb$auth$signIn, data, error, u, p, _t14;
            return _regenerator().w(function (_context16) {
              while (1) switch (_context16.p = _context16.n) {
                case 0:
                  _context16.p = 0;
                  _context16.n = 1;
                  return sb().auth.signInWithIdToken({
                    provider: "google",
                    token: resp.credential
                  });
                case 1:
                  _yield$sb$auth$signIn = _context16.v;
                  data = _yield$sb$auth$signIn.data;
                  error = _yield$sb$auth$signIn.error;
                  if (!error) {
                    _context16.n = 2;
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
                  _context16.n = 4;
                  break;
                case 3:
                  _context16.p = 3;
                  _t14 = _context16.v;
                  p = parseJwt(resp.credential);
                  setGUser({
                    name: p.name || "User",
                    email: p.email || "",
                    picture: p.picture || ""
                  });
                case 4:
                  setStep("payment");
                case 5:
                  return _context16.a(2);
              }
            }, _callee16, null, [[0, 3]]);
          }));
          function callback(_x33) {
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
  }, [step]); // eslint-disable-line

  var handleVoucher = function handleVoucher() {
    if (voucher.trim().toUpperCase() === VOUCHER_CODE.toUpperCase()) {
      onSuccess(gUser || {
        name: "Guest",
        email: "",
        picture: ""
      }, "voucher");
    } else {
      setVError("That code isn't right — check the spelling and try again.");
    }
  };
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
      border: "1px solid ".concat(A, "33"),
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
      color: "#d8e8d0",
      textAlign: "center",
      marginBottom: 6
    }
  }, "Sign in to continue"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#445040",
      textAlign: "center",
      lineHeight: 1.6,
      marginBottom: 24
    }
  }, "We use Google Sign In to protect your account. No separate password needed."), /*#__PURE__*/React.createElement("div", {
    id: "gsi-btn",
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      width: "100%",
      padding: "10px",
      background: "none",
      color: "#445040",
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
      color: "#d8e8d0",
      marginBottom: 14
    }
  }, "Start your free trial"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0b0d0b",
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
      color: "#445040",
      marginTop: 3
    }
  }, "then \xA34.99/month or \xA349.99/year"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      marginTop: 6
    }
  }, "Cancel anytime before trial ends")), /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      width: "100%",
      padding: "14px",
      background: "#1c201c",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      color: "#445040",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 16,
      cursor: "not-allowed"
    }
  }, "Subscribe \u2014 Coming Soon"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#556050",
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
      background: "#0b0d0b",
      border: "1px solid ".concat(vError ? "#ff5555" : BD),
      borderRadius: 10,
      padding: "12px 14px",
      color: "#d8e8d0",
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      marginBottom: vError ? 6 : 10
    }
  }), vError && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#ff5555",
      marginBottom: 10
    }
  }, vError), /*#__PURE__*/React.createElement("button", {
    onClick: handleVoucher,
    style: {
      width: "100%",
      padding: "12px",
      background: "#161a16",
      border: "1px solid ".concat(BD),
      borderRadius: 12,
      color: "#8aaa80",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 10
    }
  }, "Redeem Code"), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      width: "100%",
      padding: "10px",
      background: "none",
      color: "#445040",
      border: "none",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"))));
}
function SignOutModal(_ref21) {
  var userName = _ref21.userName,
    onConfirm = _ref21.onConfirm,
    onCancel = _ref21.onCancel;
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
      color: "#d8e8d0",
      textAlign: "center",
      marginBottom: 10
    }
  }, "Sign out", userName ? ", ".concat(userName.split(" ")[0]) : "", "?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#556050",
      lineHeight: 1.7,
      marginBottom: 22,
      textAlign: "center"
    }
  }, "Signing out will remove local data.", /*#__PURE__*/React.createElement("br", null), "Your cloud data is safe and will restore on next login."), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      width: "100%",
      padding: "13px",
      background: "#1a0d0d",
      border: "1px solid #3a1a1a",
      borderRadius: 12,
      color: "#ff5555",
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
      color: "#0b0d0b",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900
    }
  }, "Stay Signed In")));
}
function LapsedModal(_ref22) {
  var onRenew = _ref22.onRenew,
    onDismiss = _ref22.onDismiss;
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
      border: "1px solid #ffb84b44",
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
      color: "#d8e8d0",
      textAlign: "center",
      marginBottom: 10
    }
  }, "Your Premium subscription has ended"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#556050",
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
      color: "#0b0d0b",
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
      color: "#445040",
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
  background: "#0b0d0b",
  border: "1px solid ".concat(BD),
  borderRadius: 10,
  padding: "12px 14px",
  color: "#d8e8d0",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none"
};
function BackHdr(_ref23) {
  var title = _ref23.title,
    onBack = _ref23.onBack,
    right = _ref23.right;
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
      background: "#161a16",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      width: 36,
      height: 36,
      color: "#7a9a70",
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
function Chip(_ref24) {
  var label = _ref24.label,
    value = _ref24.value,
    color = _ref24.color;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      background: "#0b0d0b",
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
      color: "#3d4a38",
      marginTop: 2,
      letterSpacing: "0.05em"
    }
  }, label));
}
function MBar(_ref25) {
  var label = _ref25.label,
    value = _ref25.value,
    target = _ref25.target,
    color = _ref25.color;
  var pct = Math.min(100, value / target * 100);
  var overG = value - target;
  var accent = overG > 15 ? "#ff5555" : overG > 5 ? "#ffb84b" : null;
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
      color: accent || "#8aaa80"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent || "#6a8a60"
    }
  }, Math.round(value), "g / ", target, "g")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      background: "#1a1a1a",
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

// ── Streak Celebration ────────────────────────────────────────

function StreakCelebration(_ref26) {
  var anim = _ref26.anim,
    onDone = _ref26.onDone;
  var prevStreak = anim.prevStreak,
    newStreak = anim.newStreak,
    isMilestone = anim.isMilestone;
  var _useState9 = useState(prevStreak),
    _useState0 = _slicedToArray(_useState9, 2),
    count = _useState0[0],
    setCount = _useState0[1];

  // Pre-computed floaters — stable across re-renders via useState initializer
  var _useState1 = useState(function () {
      var n = isMilestone ? 26 : 14;
      return Array.from({
        length: n
      }, function (_, i) {
        return {
          x: 5 + Math.random() * 90,
          y: 5 + Math.random() * 90,
          size: isMilestone ? 22 + Math.random() * 30 : 16 + Math.random() * 20,
          delay: Math.random() * 0.7,
          dur: 0.8 + Math.random() * 0.5,
          emoji: isMilestone && i % 4 === 0 ? i % 8 === 0 ? "🎉" : "🎊" : "🔥"
        };
      });
    }),
    _useState10 = _slicedToArray(_useState1, 1),
    floaters = _useState10[0];
  useEffect(function () {
    // ── Web Audio: whoosh then heavy thud ──────────────────────
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Whoosh: sawtooth sweep 800 → 180 Hz
      var osc = ctx.createOscillator();
      var g1 = ctx.createGain();
      osc.connect(g1);
      g1.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.32);
      g1.gain.setValueAtTime(0.22, ctx.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.32);
      // Heavy thud: noise burst at 0.4s
      var sr = ctx.sampleRate;
      var buf = ctx.createBuffer(1, Math.ceil(sr * 0.55), sr);
      var ch = buf.getChannelData(0);
      for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.07));
      var src = ctx.createBufferSource();
      var g2 = ctx.createGain();
      src.buffer = buf;
      src.connect(g2);
      g2.connect(ctx.destination);
      g2.gain.setValueAtTime(1.8, ctx.currentTime + 0.42);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      src.start(ctx.currentTime + 0.42);
    } catch (e) {}

    // ── Count up prevStreak → newStreak over 800ms ─────────────
    var duration = 800;
    var start = Date.now();
    var range = newStreak - prevStreak;
    var _tick = function tick() {
      var p = Math.min(1, (Date.now() - start) / duration);
      setCount(Math.round(prevStreak + range * p));
      if (p < 1) requestAnimationFrame(_tick);
    };
    requestAnimationFrame(_tick);
    var timer = setTimeout(onDone, 1500);
    return function () {
      return clearTimeout(timer);
    };
  }, []); // eslint-disable-line

  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.93)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "sc_fade 0.18s ease-out"
    }
  }, /*#__PURE__*/React.createElement("style", null, "\n        @keyframes sc_fade  { from{opacity:0} to{opacity:1} }\n        @keyframes sc_float { from{transform:translateY(0) rotate(-12deg)} to{transform:translateY(-24px) rotate(12deg)} }\n        @keyframes sc_pop   { 0%{transform:scale(0.25);opacity:0} 65%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }\n        @keyframes sc_pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.14)} }\n        @keyframes sc_num   { 0%{transform:scale(0.4);opacity:0} 100%{transform:scale(1);opacity:1} }\n      "), floaters.map(function (f, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: "absolute",
        left: "".concat(f.x, "%"),
        top: "".concat(f.y, "%"),
        fontSize: f.size,
        pointerEvents: "none",
        userSelect: "none",
        animation: "sc_float ".concat(f.dur, "s ease-in-out infinite alternate"),
        animationDelay: "".concat(f.delay, "s"),
        opacity: 0.88
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
      fontSize: isMilestone ? 128 : 108,
      lineHeight: 1,
      animation: "sc_pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both"
    }
  }, "\uD83D\uDCAA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: isMilestone ? 92 : 78,
      fontWeight: 900,
      color: A,
      textShadow: "0 0 40px ".concat(A, "99"),
      lineHeight: 1,
      marginTop: -10,
      animation: isMilestone ? "sc_pulse 0.55s ease-in-out 0.45s infinite" : "sc_num 0.45s ease-out 0.2s both"
    }
  }, count), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: A,
      fontWeight: 900,
      letterSpacing: "0.14em",
      marginTop: 12,
      textShadow: "0 0 18px ".concat(A, "66")
    }
  }, isMilestone ? "\uD83C\uDFC6 ".concat(newStreak, " DAY MILESTONE!") : "DAY STREAK 🔥"), isMilestone && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 38,
      marginTop: 18,
      animation: "sc_pop 0.4s ease-out 0.5s both"
    }
  }, "\uD83C\uDF89\uD83C\uDF8A\uD83C\uDF89\uD83C\uDF8A\uD83C\uDF89")));
}

// ── Coach Card ────────────────────────────────────────────────

function CoachCard(_ref27) {
  var mode = _ref27.mode,
    totals = _ref27.totals,
    targets = _ref27.targets,
    streak = _ref27.streak,
    water = _ref27.water;
  var _useState11 = useState(""),
    _useState12 = _slicedToArray(_useState11, 2),
    tip = _useState12[0],
    setTip = _useState12[1];
  var _useState13 = useState(0),
    _useState14 = _slicedToArray(_useState13, 2),
    refreshes = _useState14[0],
    setRefreshes = _useState14[1];
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    loading = _useState16[0],
    setLoading = _useState16[1];
  useEffect(function () {
    sg("coach__" + todayKey()).then(function (v) {
      if (v) {
        var d = JSON.parse(v);
        setTip(d.tip || "");
        setRefreshes(d.r || 0);
      }
    });
  }, []);
  useEffect(function () {
    if (!tip && !loading && totals.kcal >= 200) gen();
  }, [totals.kcal]); // eslint-disable-line

  var gen = /*#__PURE__*/function () {
    var _ref28 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var h, timeLabel, prompt, t, r, _t15;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.p = _context17.n) {
          case 0:
            if (!(loading || refreshes >= 3)) {
              _context17.n = 1;
              break;
            }
            return _context17.a(2);
          case 1:
            setLoading(true);
            _context17.p = 2;
            h = getCurrentHour();
            timeLabel = h < 6 ? "early morning" : h < 12 ? "morning" : h < 14 ? "midday" : h < 18 ? "afternoon" : h < 21 ? "evening" : "night";
            prompt = "You are a supportive fitness coach. Local time: ".concat(timeLabel, " (").concat(h, ":00). Today: ").concat(mode, " mode, ").concat(Math.round(totals.kcal), "/").concat(targets.kcal, " kcal, protein ").concat(Math.round(totals.protein), "g/").concat(targets.protein, "g, ").concat(water, "/8 glasses, ").concat(streak, " day streak.\nWrite exactly 3 sentences: 1) honest observation about today 2) a food or habit suggestion appropriate for ").concat(timeLabel, " 3) genuine praise. Brief, personal, max one emoji per sentence.");
            _context17.n = 3;
            return callAI(prompt, 200);
          case 3:
            t = _context17.v;
            r = refreshes + 1;
            setTip(t);
            setRefreshes(r);
            _context17.n = 4;
            return ss("coach__" + todayKey(), JSON.stringify({
              tip: t,
              r: r
            }));
          case 4:
            _context17.n = 6;
            break;
          case 5:
            _context17.p = 5;
            _t15 = _context17.v;
          case 6:
            setLoading(false);
          case 7:
            return _context17.a(2);
        }
      }, _callee17, null, [[2, 5]]);
    }));
    return function gen() {
      return _ref28.apply(this, arguments);
    };
  }();
  if (totals.kcal < 200 && !tip) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(A, "22"),
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
      color: "#556050",
      cursor: "pointer",
      fontSize: 13,
      padding: "2px 6px"
    }
  }, loading ? "..." : "↺", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#334a30"
    }
  }, 3 - refreshes))), loading && !tip && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#445040",
      marginTop: 4
    }
  }, "Generating your tip..."), tip && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: "#b8d4a8",
      lineHeight: 1.7
    }
  }, tip));
}

// ── Profile ───────────────────────────────────────────────────

function ProfileScreen(_ref29) {
  var profile = _ref29.profile,
    onSave = _ref29.onSave,
    onBack = _ref29.onBack,
    _ref29$tdeeAdj = _ref29.tdeeAdj,
    tdeeAdj = _ref29$tdeeAdj === void 0 ? 0 : _ref29$tdeeAdj,
    _ref29$weighIns = _ref29.weighIns,
    weighIns = _ref29$weighIns === void 0 ? [] : _ref29$weighIns,
    _ref29$aggressiveCutA = _ref29.aggressiveCutAcked,
    aggressiveCutAcked = _ref29$aggressiveCutA === void 0 ? false : _ref29$aggressiveCutA;
  var _useState17 = useState(_objectSpread(_objectSpread({}, DEF_PROFILE), profile)),
    _useState18 = _slicedToArray(_useState17, 2),
    f = _useState18[0],
    setF = _useState18[1];
  var _useState19 = useState(false),
    _useState20 = _slicedToArray(_useState19, 2),
    saved = _useState20[0],
    setSaved = _useState20[1];
  var _useState21 = useState(false),
    _useState22 = _slicedToArray(_useState21, 2),
    bfFocused = _useState22[0],
    setBfFocused = _useState22[1];
  var set = function set(k, v) {
    return setF(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
    });
  };
  var valid = Number(f.weight) > 0 && Number(f.height) > 0 && Number(f.bodyFat) > 0 && Number(f.bodyFat) < 100;
  var bfVal = Number(f.bodyFat);
  var bfImplausible = bfVal > 0 && (bfVal < 4 || bfVal > 50);
  var prev = calcTargets(f, "cut", 0, 0);
  var formulaTDEE = prev.tdee;
  var adjTDEE = formulaTDEE + tdeeAdj;
  var confidence = weighIns.length >= 28 ? "Calibrated" : weighIns.length >= 14 ? "Learning" : weighIns.length >= 7 ? "Estimating" : null;
  useEffect(function () {
    if (!valid) return;
    var t = setTimeout(function () {
      onSave(f);
      setSaved(true);
      setTimeout(function () {
        return setSaved(false);
      }, 1800);
    }, 600);
    return function () {
      return clearTimeout(t);
    };
  }, [f.weight, f.height, f.bodyFat, f.sex]); // eslint-disable-line

  var row = function row(label, val, unit) {
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#d8e8d0";
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
        color: "#556050"
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
        color: "#445040",
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
      color: "#556050",
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, "Targets use ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#7a9a70"
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
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 14
    }
  }, "BODY STATS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 14
    }
  }, [{
    k: "weight",
    l: "WEIGHT",
    u: "kg"
  }, {
    k: "height",
    l: "HEIGHT",
    u: "cm"
  }].map(function (fl) {
    return /*#__PURE__*/React.createElement("div", {
      key: fl.k
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: A,
        letterSpacing: "0.1em",
        fontWeight: 800,
        marginBottom: 5
      }
    }, fl.l, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#445040"
      }
    }, "(", fl.u, ")")), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      value: f[fl.k],
      onChange: function onChange(e) {
        return set(fl.k, e.target.value);
      },
      style: INP
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A,
      letterSpacing: "0.1em",
      fontWeight: 800,
      marginBottom: 5
    }
  }, "BODY FAT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#445040"
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
      color: "#7a9a70",
      marginBottom: 6,
      lineHeight: 1.5
    }
  }, "Not sure? Use 25% for men or 30% for women as a starting estimate. A more accurate figure improves your calorie and macro targets."), bfImplausible && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#ffb84b",
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
      color: "#445040",
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
        border: "1px solid ".concat(f.sex === s ? A + "88" : BD),
        background: f.sex === s ? A + "18" : "#0b0d0b",
        color: f.sex === s ? A : "#445040"
      }
    }, s === "male" ? "MALE" : "FEMALE");
  })), !f.sex && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#ffb84b",
      marginBottom: 10,
      lineHeight: 1.5
    }
  }, "Set your sex for more accurate targets \u2014 defaulting to male calculations."), f.sex === "female" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#7a9a70",
      marginBottom: 10,
      lineHeight: 1.5
    }
  }, "Targets may need adjusting around your cycle \u2014 override anytime."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      marginBottom: 14,
      lineHeight: 1.5
    }
  }, "Base TDEE uses BMR \xD7 1.2 (sedentary baseline). Workout calories are added when you log sessions.")), valid && /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(BD),
      borderRadius: 18,
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 12
    }
  }, "CALCULATED STATS"), row("Lean Body Mass", prev.lbm, "kg", "#4b9fff"), row("BMR", prev.bmr, "kcal/day", "#ffb84b"), row("Formula TDEE", formulaTDEE, "kcal/day", "#8aaa80"), tdeeAdj !== 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid ".concat(BD)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#556050"
    }
  }, "Adaptive adjustment"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: tdeeAdj > 0 ? A : "#ff7b4b"
    }
  }, tdeeAdj > 0 ? "+" : "", tdeeAdj, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#445040"
    }
  }, "kcal/day"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid ".concat(BD)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#556050"
    }
  }, "Effective TDEE ", confidence && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: tdeeAdj !== 0 ? A : "#445040"
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
      color: "#445040"
    }
  }, "kcal/day"))), !confidence && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      marginTop: 6,
      lineHeight: 1.5
    }
  }, "Log your weight daily from the dashboard to enable adaptive calibration."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 11,
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 10
    }
  }, "TARGETS BY MODE"), [{
    mode: "cut",
    label: "CUT",
    color: "#4b9fff"
  }, {
    mode: "maintain",
    label: "MAINTAIN",
    color: A
  }, {
    mode: "bulk",
    label: "BULK",
    color: "#ff7b4b"
  }].map(function (_ref30) {
    var mode = _ref30.mode,
      label = _ref30.label,
      color = _ref30.color;
    var t = calcTargets(f, mode, 0, tdeeAdj);
    return /*#__PURE__*/React.createElement("div", {
      key: mode,
      style: {
        background: "#0b0d0b",
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
    }, [["KCAL", "kcal", ""], ["P", "protein", "g"], ["C", "carbs", "g"], ["F", "fat", "g"]].map(function (_ref31) {
      var _ref32 = _slicedToArray(_ref31, 3),
        k = _ref32[0],
        key = _ref32[1],
        u = _ref32[2];
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
          color: "#334a30",
          marginTop: 1
        }
      }, k));
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      marginTop: 8
    }
  }, "Workout kcal are added when you log sessions on the dashboard.")), aggressiveCutAcked && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#1a1000",
      border: "1px solid #ffb84b33",
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
      color: "#8a7030",
      lineHeight: 1.5
    }
  }, "You have previously acknowledged an aggressive cut target. Review your profile stats and targets if your circumstances have changed.")));
}

// ── Meal Form ─────────────────────────────────────────────────

function MealForm(_ref33) {
  var meal = _ref33.meal,
    onSave = _ref33.onSave,
    onCancel = _ref33.onCancel;
  var blank = {
    name: "",
    kcal: "",
    protein: "",
    carbs: "",
    fat: ""
  };
  var _useState23 = useState(meal ? {
      name: meal.name,
      kcal: String(meal.kcal),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat)
    } : blank),
    _useState24 = _slicedToArray(_useState23, 2),
    f = _useState24[0],
    setF = _useState24[1];
  var set = function set(k, v) {
    return setF(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
    });
  };
  var ok = f.name.trim() && Number(f.kcal) > 0;
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
      color: "#556050",
      fontSize: 24
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#445040",
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
    c: "#4b9fff"
  }, {
    k: "carbs",
    l: "CARBS (g)",
    c: "#ffb84b"
  }, {
    k: "fat",
    l: "FAT (g)",
    c: "#ff7b4b"
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
    onClick: function onClick() {
      return ok && onSave({
        name: f.name.trim(),
        kcal: Number(f.kcal) || 0,
        protein: Number(f.protein) || 0,
        carbs: Number(f.carbs) || 0,
        fat: Number(f.fat) || 0
      });
    },
    disabled: !ok,
    style: {
      width: "100%",
      padding: "15px",
      background: ok ? A : "#161a16",
      color: ok ? "#0b0d0b" : "#2e3a2c",
      border: "none",
      borderRadius: 13,
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: "0.08em"
    }
  }, meal ? "SAVE CHANGES" : "ADD MEAL")));
}

// ── Weigh-In Widget ───────────────────────────────────────────

function WeighInWidget(_ref34) {
  var weighIns = _ref34.weighIns,
    onWeighIn = _ref34.onWeighIn,
    tdeeAdj = _ref34.tdeeAdj,
    baseTDEE = _ref34.baseTDEE;
  var _useState25 = useState(""),
    _useState26 = _slicedToArray(_useState25, 2),
    val = _useState26[0],
    setVal = _useState26[1];
  var today = todayKey();
  var todayEntry = weighIns.find(function (w) {
    return w.date === today;
  });
  var weeks = Math.floor(weighIns.length / 7);
  var trend7 = function () {
    if (weighIns.length < 4) return null;
    var recent = weighIns.slice(-7);
    var old = recent[0].weight;
    var now = recent[recent.length - 1].weight;
    return Math.round((now - old) * 10) / 10;
  }();
  var confidence = weighIns.length >= 28 ? "Calibrated" : weighIns.length >= 14 ? "Learning" : "Estimating";
  var confColor2 = weighIns.length >= 28 ? A : weighIns.length >= 14 ? "#ffb84b" : "#556050";
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
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 4
    }
  }, "BODY WEIGHT"), todayEntry ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: "#d8e8d0"
    }
  }, todayEntry.weight, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#445040",
      marginLeft: 4
    }
  }, "kg"), trend7 !== null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: trend7 <= 0 ? "#a3ff4b" : "#ff7b4b",
      marginLeft: 10
    }
  }, trend7 > 0 ? "+" : "", trend7, "kg/wk")) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#334a30",
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
  }, confidence.toUpperCase()), weeks >= 1 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: A,
      marginTop: 2
    }
  }, "~", (baseTDEE + tdeeAdj).toLocaleString(), " kcal"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#445040",
      marginTop: 1
    }
  }, "est. TDEE", tdeeAdj !== 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: tdeeAdj > 0 ? A : "#ff7b4b"
    }
  }, " ", tdeeAdj > 0 ? "+" : "", tdeeAdj))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      marginTop: 4,
      maxWidth: 100,
      textAlign: "right",
      lineHeight: 1.4
    }
  }, "Log daily to calibrate your TDEE"))), !todayEntry && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    min: "30",
    max: "300",
    value: val,
    onChange: function onChange(e) {
      return setVal(e.target.value);
    },
    placeholder: "kg today...",
    style: _objectSpread(_objectSpread({}, INP), {}, {
      flex: 1,
      padding: "10px 12px",
      fontSize: 13
    }),
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && Number(val) > 0 && (onWeighIn(Number(val)), setVal(""));
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (Number(val) > 0) {
        onWeighIn(Number(val));
        setVal("");
      }
    },
    disabled: !Number(val),
    style: {
      padding: "10px 18px",
      background: Number(val) > 0 ? A : "#161a16",
      color: Number(val) > 0 ? "#0b0d0b" : "#2e3a2c",
      border: "none",
      borderRadius: 10,
      fontWeight: 900,
      fontSize: 13
    }
  }, "LOG")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      lineHeight: 1.5
    }
  }, weeks < 1 && "Targets use the Katch-McArdle formula. Once you have a week of weigh-ins, they'll self-adjust to your real metabolism.", weeks >= 1 && weeks < 2 && "\uD83D\uDD04 ".concat(confidence, " \u2014 ").concat(weighIns.length, " weigh-ins so far. 2+ weeks unlocks calibration."), weeks >= 2 && tdeeAdj === 0 && "Formula TDEE matches your results — no adjustment needed yet.", weeks >= 2 && tdeeAdj !== 0 && "Your real TDEE is ".concat(tdeeAdj > 0 ? "higher" : "lower", " than the formula predicts. Targets adjusted accordingly.")));
}

// ── Workout Logger ────────────────────────────────────────────

function WorkoutLogger(_ref35) {
  var workouts = _ref35.workouts,
    onAdd = _ref35.onAdd,
    onRemove = _ref35.onRemove,
    prof = _ref35.prof,
    isPremium = _ref35.isPremium,
    onPremiumGate = _ref35.onPremiumGate;
  var _useState27 = useState("legs"),
    _useState28 = _slicedToArray(_useState27, 2),
    type = _useState28[0],
    setType = _useState28[1];
  var _useState29 = useState(45),
    _useState30 = _slicedToArray(_useState29, 2),
    dur = _useState30[0],
    setDur = _useState30[1];
  var _useState31 = useState("moderate"),
    _useState32 = _slicedToArray(_useState31, 2),
    intensity = _useState32[0],
    setIntensity = _useState32[1];
  var _useState33 = useState(false),
    _useState34 = _slicedToArray(_useState33, 2),
    hevyMode = _useState34[0],
    setHevyMode = _useState34[1];
  var _useState35 = useState(""),
    _useState36 = _slicedToArray(_useState35, 2),
    hevyText = _useState36[0],
    setHevyText = _useState36[1];
  var _useState37 = useState(false),
    _useState38 = _slicedToArray(_useState37, 2),
    hevyLoading = _useState38[0],
    setHevyLoading = _useState38[1];
  var _useState39 = useState(null),
    _useState40 = _slicedToArray(_useState39, 2),
    hevyResult = _useState40[0],
    setHevyResult = _useState40[1];
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
    var _ref36 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
      var prompt, _t16, _t17;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.p = _context18.n) {
          case 0:
            if (!(!hevyText.trim() || hevyLoading)) {
              _context18.n = 1;
              break;
            }
            return _context18.a(2);
          case 1:
            setHevyLoading(true);
            setHevyResult(null);
            _context18.p = 2;
            prompt = "Parse this workout log and estimate calories burned. User: ".concat(p.weight, "kg bodyweight, ").concat(p.bodyFat, "% body fat.\n\nWorkout:\n").concat(hevyText, "\n\nReturn ONLY valid JSON: {\"estimatedKcal\":number,\"type\":\"legs|push|pull|fullbody|cardio\",\"intensity\":\"light|moderate|heavy\",\"summary\":\"brief 1 line description\"}");
            _t16 = setHevyResult;
            _context18.n = 3;
            return callAIJson(prompt, 200);
          case 3:
            _t16(_context18.v);
            _context18.n = 5;
            break;
          case 4:
            _context18.p = 4;
            _t17 = _context18.v;
            setHevyResult({
              error: "Parse failed — Cloudflare Worker required."
            });
          case 5:
            setHevyLoading(false);
          case 6:
            return _context18.a(2);
        }
      }, _callee18, null, [[2, 4]]);
    }));
    return function parseWorkout() {
      return _ref36.apply(this, arguments);
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
      color: "#445040",
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
  }, totalKcal, " kcal added")), workouts.length > 0 && /*#__PURE__*/React.createElement("div", {
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
        background: "#0b0d0b",
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
        color: "#6a9a60",
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, w.notes || "".concat(w.type, " \xB7 ").concat(w.duration, "min \xB7 ").concat(w.intensity)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "#334a30",
        flexShrink: 0
      }
    }, w.time), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onRemove(w.id);
      },
      style: {
        background: "none",
        border: "none",
        color: "#443030",
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
      color: "#445040"
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
      color: "#0b0d0b",
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
      background: "#0b0d0b",
      border: "1px solid ".concat(isPremium ? A + "33" : BD),
      borderRadius: 10,
      color: isPremium ? A : "#445040",
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
      background: "#0b0d0b",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      padding: "10px 12px",
      color: "#d8e8d0",
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
      background: hevyText.trim() && !hevyLoading ? A : "#161a16",
      color: hevyText.trim() && !hevyLoading ? "#0b0d0b" : "#2e3a2c",
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
      color: "#445040",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "\u2190 Back")), hevyResult && !hevyResult.error && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#0a1a0a",
      borderRadius: 8,
      padding: "8px 12px",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#6a9a60",
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
      color: "#0b0d0b",
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
      color: "#ff7070",
      marginTop: 4
    }
  }, hevyResult.error)));
}

// ── Dashboard ─────────────────────────────────────────────────

function Dashboard(_ref37) {
  var logs = _ref37.logs,
    totals = _ref37.totals,
    targets = _ref37.targets,
    remaining = _ref37.remaining,
    water = _ref37.water,
    setWater = _ref37.setWater,
    mode = _ref37.mode,
    setMode = _ref37.setMode,
    setView = _ref37.setView,
    removeLog = _ref37.removeLog,
    addToQA = _ref37.addToQA,
    hasProfile = _ref37.hasProfile,
    streak = _ref37.streak,
    prof = _ref37.prof,
    weighIns = _ref37.weighIns,
    onWeighIn = _ref37.onWeighIn,
    tdeeAdj = _ref37.tdeeAdj,
    baseTDEE = _ref37.baseTDEE,
    coachKey = _ref37.coachKey,
    workouts = _ref37.workouts,
    onAddWorkout = _ref37.onAddWorkout,
    onRemoveWorkout = _ref37.onRemoveWorkout,
    customKcal = _ref37.customKcal,
    onSetCustomKcal = _ref37.onSetCustomKcal,
    isCustomMode = _ref37.isCustomMode,
    aggressiveCutAcked = _ref37.aggressiveCutAcked,
    onAckAggressiveCut = _ref37.onAckAggressiveCut,
    authState = _ref37.authState,
    authUser = _ref37.authUser,
    onPremiumGate = _ref37.onPremiumGate,
    onSignOut = _ref37.onSignOut,
    isOnline = _ref37.isOnline,
    syncMsg = _ref37.syncMsg;
  var isPremium = authState === "premium";
  var overAmt = Math.round(totals.kcal - targets.kcal);
  var pct = Math.min(100, totals.kcal / targets.kcal * 100);
  var mc = MODES[mode].color;
  var isTraining = workouts.length > 0;
  // Graduated calorie status: ok (≤100 over) | amber-soft (100-200) | amber (200-500) | red (500+)
  var AMBER = "#ffb84b";
  var RED = "#ff5555";
  var kcalAccent = overAmt > 500 ? RED : overAmt > 100 ? AMBER : mc;
  var kcalLabel = overAmt > 200 ? "OVER BY" : overAmt > 100 ? "JUST OVER" : "REMAINING";
  var kcalBarBg = overAmt > 500 ? RED : overAmt > 100 ? AMBER : "linear-gradient(90deg,".concat(mc, "88,").concat(mc, ")");
  var kcalBorder = overAmt > 500 ? "#ff555322" : overAmt > 100 ? "#ffb84b22" : "#1c241c";
  var _useState41 = useState({}),
    _useState42 = _slicedToArray(_useState41, 2),
    savedIds = _useState42[0],
    setSavedIds = _useState42[1];
  var _useState43 = useState(false),
    _useState44 = _slicedToArray(_useState43, 2),
    editingTarget = _useState44[0],
    setEditingTarget = _useState44[1];
  var _useState45 = useState(""),
    _useState46 = _slicedToArray(_useState45, 2),
    targetInputVal = _useState46[0],
    setTargetInputVal = _useState46[1];
  var commitTarget = function commitTarget() {
    var v = parseInt(targetInputVal);
    if (v > 0) onSetCustomKcal(v);
    setEditingTarget(false);
  };

  // Warnings computed from custom target vs effective TDEE
  var tdee = targets.tdee; // effective TDEE (formula + adaptive adj)
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
    var _ref38 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(log) {
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            _context19.n = 1;
            return addToQA(log);
          case 1:
            setSavedIds(function (p) {
              return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, log.id, true));
            });
            setTimeout(function () {
              return setSavedIds(function (p) {
                return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, log.id, false));
              });
            }, 1800);
          case 2:
            return _context19.a(2);
        }
      }, _callee19);
    }));
    return function handleAddToQA(_x34) {
      return _ref38.apply(this, arguments);
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
      marginBottom: 16
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
      color: "#445040",
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
      color: "#ffb84b",
      fontWeight: 700,
      letterSpacing: "0.06em"
    }
  }, "OFFLINE"), syncMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 10,
      color: "#445040"
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
      background: "#131a11",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 900,
      color: A
    }
  }, "\uD83D\uDD25", streak), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("profile");
    },
    style: {
      width: 34,
      height: 34,
      background: "#131a11",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "#556050",
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
      background: "#131a11",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "#556050",
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
      background: "#131a11",
      border: "1px solid ".concat(BD),
      borderRadius: 10,
      color: "#556050",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\uD83C\uDFC6"), isPremium && /*#__PURE__*/React.createElement("button", {
    onClick: onSignOut,
    style: {
      width: 34,
      height: 34,
      background: "".concat(A, "18"),
      border: "1px solid ".concat(A, "44"),
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: 0
    }
  }, authUser !== null && authUser !== void 0 && authUser.picture ? /*#__PURE__*/React.createElement("img", {
    src: authUser.picture,
    width: 34,
    height: 34,
    style: {
      display: "block",
      borderRadius: 10
    },
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: A
    }
  }, ((authUser === null || authUser === void 0 ? void 0 : authUser.name) || "P")[0].toUpperCase())))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 12
    }
  }, Object.entries(MODES).map(function (_ref39) {
    var _ref40 = _slicedToArray(_ref39, 2),
      k = _ref40[0],
      v = _ref40[1];
    var active = !isCustomMode && mode === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return setMode(k);
      },
      style: {
        flex: 1,
        padding: "9px 4px",
        background: active ? v.color + "22" : "#131a11",
        color: active ? v.color : "#445040",
        border: "1px solid ".concat(active ? v.color + "55" : BD),
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.06em"
      }
    }, v.label);
  })), /*#__PURE__*/React.createElement(WorkoutLogger, {
    workouts: workouts,
    onAdd: onAddWorkout,
    onRemove: onRemoveWorkout,
    prof: prof,
    isPremium: isPremium,
    onPremiumGate: onPremiumGate
  }), !hasProfile && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setView("profile");
    },
    style: {
      width: "100%",
      padding: "11px",
      background: "#131a11",
      border: "1px solid ".concat(A, "33"),
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
      background: "#1a0505",
      border: "1px solid #ff555544",
      borderRadius: 12,
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#ff5555",
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: 6
    }
  }, "\u26A0\uFE0F NOT RECOMMENDED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#aa4444",
      lineHeight: 1.6,
      marginBottom: 10
    }
  }, targetWarning.text), /*#__PURE__*/React.createElement("button", {
    onClick: onAckAggressiveCut,
    style: {
      background: "#ff555522",
      border: "1px solid #ff555544",
      borderRadius: 8,
      color: "#ff7777",
      fontSize: 11,
      fontWeight: 800,
      padding: "7px 14px",
      cursor: "pointer"
    }
  }, "Yes, I understand \u2192")) : targetWarning.level === "amber" ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#151000",
      border: "1px solid #ffb84b33",
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: 11,
      color: "#8a7030",
      lineHeight: 1.5
    }
  }, "\u26A0\uFE0F ", targetWarning.text) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#101510",
      border: "1px solid #3a5030",
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: 11,
      color: "#556050",
      lineHeight: 1.5
    }
  }, "\u2139 ", targetWarning.text)), targets.safeMinApplied && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#1a1200",
      border: "1px solid #ffb84b33",
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
      color: "#8a7030",
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
  }, "Check your profile stats.")))), /*#__PURE__*/React.createElement("div", {
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
      background: isCustomMode ? mc + "12" : "#161a14",
      border: "1px solid ".concat(isCustomMode ? mc + "44" : "#2a3828"),
      borderRadius: 8,
      padding: "5px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: isCustomMode ? mc : "#6a9060",
      fontWeight: 700
    }
  }, targets.kcal.toLocaleString(), " kcal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: isCustomMode ? mc + "99" : "#4a6a44"
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
      color: "#445040",
      letterSpacing: "0.12em",
      marginBottom: 4
    }
  }, "CONSUMED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 42,
      fontWeight: 900,
      color: overAmt > 100 ? kcalAccent : "#e8f0e0",
      lineHeight: 1,
      letterSpacing: "-0.03em"
    }
  }, Math.round(totals.kcal).toLocaleString(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "#445040",
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
      color: "#445040",
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
      color: overAmt > 100 ? kcalAccent + "99" : "#6a9a30",
      fontWeight: 400,
      marginLeft: 4
    }
  }, "kcal")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10,
      background: "#161a16",
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
  }))), /*#__PURE__*/React.createElement("div", {
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
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 14
    }
  }, "MACROS"), /*#__PURE__*/React.createElement(MBar, {
    label: "PROTEIN",
    value: totals.protein,
    target: targets.protein,
    color: "#4b9fff"
  }), /*#__PURE__*/React.createElement(MBar, {
    label: "CARBS",
    value: totals.carbs,
    target: targets.carbs,
    color: "#ffb84b"
  }), /*#__PURE__*/React.createElement(MBar, {
    label: "FAT",
    value: totals.fat,
    target: targets.fat,
    color: "#ff7b4b"
  })), isPremium && /*#__PURE__*/React.createElement(CoachCard, {
    key: coachKey,
    mode: mode,
    totals: totals,
    targets: targets,
    streak: streak,
    water: water
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
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 3
    }
  }, "WATER"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: "#4b9fff"
    }
  }, water, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "#2a4060",
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
      background: "#131826",
      border: "1px solid #1e2a3a",
      color: "#4b9fff",
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
      background: "#0f1c2e",
      border: "1px solid #2a4a7a",
      color: "#4b9fff",
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
        background: i < water ? "#4b9fff" : "#161a26",
        transition: "background 0.2s"
      }
    });
  }))), /*#__PURE__*/React.createElement(WeighInWidget, {
    weighIns: weighIns,
    onWeighIn: onWeighIn,
    tdeeAdj: tdeeAdj,
    baseTDEE: baseTDEE
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
        color: b.premium && !isPremium ? "#445040" : A,
        letterSpacing: "0.07em"
      }
    }, b.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#334030",
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
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      borderBottom: "1px solid ".concat(BD)
    }
  }, "TODAY'S LOG \xB7 ", logs.length, " ITEM", logs.length !== 1 ? "S" : ""), _toConsumableArray(logs).reverse().map(function (log, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: log.id,
      style: {
        display: "flex",
        alignItems: "center",
        padding: "13px 16px",
        borderBottom: i < logs.length - 1 ? "1px solid ".concat(BD) : "none",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: "#d8e8d0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, log.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#3d4a38",
        marginTop: 3
      }
    }, log.time, " \xB7 P:", log.protein, "g C:", log.carbs, "g F:", log.fat, "g")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: A,
        flexShrink: 0
      }
    }, Math.round(log.kcal)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleAddToQA(log);
      },
      style: {
        flexShrink: 0,
        padding: "7px 12px",
        background: savedIds[log.id] ? A + "22" : "#131a11",
        border: "1px solid ".concat(savedIds[log.id] ? A + "66" : "#2a4a28"),
        borderRadius: 10,
        color: savedIds[log.id] ? A : "#4a8a40",
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
        background: "#1a0d0d",
        border: "1px solid #3a1a1a",
        borderRadius: 10,
        color: "#884444",
        fontSize: 16,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, "\xD7"));
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "30px 20px",
      color: "#2a3228",
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
  return "You are a nutrition database expert with encyclopaedic knowledge of UK and international commercial food products, restaurant menus, supermarket items, and portion sizes. Your estimates directly affect someone's health and body composition goals \u2014 accuracy is CRITICAL. Under-fuelling and over-fuelling are both harmful.\n\nRules:\n- For any named restaurant, brand or product (GDK, Pret, McDonald's, Greggs, Magic Spoon, Quest, Grenade, Weetabix, Oatly etc.) use your precise knowledge of their ACTUAL menu nutrition data \u2014 never substitute a generic equivalent.\n- Break the meal into individual components. Each component gets its own nutrition estimate and confidence score.\n- Confidence score (0-100): 90+ means you have exact menu/label data. 60-89 means good knowledge but some uncertainty. Below 60 means you are estimating and the user should verify.\n- If a component is ambiguous (e.g. \"large meal\" at a restaurant that only does regular), state the ambiguity in the reasoning field.\n- Be conservative \u2014 if unsure between two estimates, explain both.\n\nMeal to analyse: \"".concat(desc, "\"\n\nReturn ONLY valid JSON (no markdown, no preamble):\n{\n  \"items\": [\n    {\n      \"name\": \"specific item name with quantity/size\",\n      \"kcal\": number,\n      \"protein\": number,\n      \"carbs\": number,\n      \"fat\": number,\n      \"confidence\": number,\n      \"reasoning\": \"one sentence explaining source of data or uncertainty\"\n    }\n  ]\n}");
};
var AI_REESTIMATE_PROMPT = function AI_REESTIMATE_PROMPT(item) {
  return "You are a nutrition database expert. Re-estimate the nutritional content for this specific food item with maximum accuracy.\n\nItem: \"".concat(item, "\"\n\nApply the same rules: use exact menu/label data for branded products. Be precise, not approximate.\n\nReturn ONLY valid JSON (no markdown):\n{\n  \"name\": \"item name\",\n  \"kcal\": number,\n  \"protein\": number,\n  \"carbs\": number,\n  \"fat\": number,\n  \"confidence\": number,\n  \"reasoning\": \"one sentence explaining source\"\n}");
};
var confColor = function confColor(c) {
  return c <= 33 ? "#ff5555" : c <= 66 ? "#ffb84b" : A;
};
var confLabel = function confLabel(c) {
  return c <= 33 ? "Low" : c <= 66 ? "Medium" : "High";
};
function searchOFT(_x35) {
  return _searchOFT.apply(this, arguments);
}
function _searchOFT() {
  _searchOFT = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(query) {
    var _p$product_name2, res, data, p, sg2, f, n, _t23;
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.p = _context39.n) {
        case 0:
          _context39.p = 0;
          _context39.n = 1;
          return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms=".concat(encodeURIComponent(query), "&search_simple=1&action=process&json=1&page_size=3&fields=product_name,nutriments,serving_size"));
        case 1:
          res = _context39.v;
          _context39.n = 2;
          return res.json();
        case 2:
          data = _context39.v;
          p = (data.products || []).find(function (p) {
            var _p$nutriments;
            return ((_p$nutriments = p.nutriments) === null || _p$nutriments === void 0 ? void 0 : _p$nutriments["energy-kcal_100g"]) != null;
          });
          if (p) {
            _context39.n = 3;
            break;
          }
          return _context39.a(2, null);
        case 3:
          sg2 = parseFloat(p.serving_size) || 100, f = sg2 / 100, n = p.nutriments;
          return _context39.a(2, {
            name: (_p$product_name2 = p.product_name) === null || _p$product_name2 === void 0 ? void 0 : _p$product_name2.trim(),
            kcal: Math.round((n["energy-kcal_100g"] || 0) * f),
            protein: Math.round((n["proteins_100g"] || 0) * f * 10) / 10,
            carbs: Math.round((n["carbohydrates_100g"] || 0) * f * 10) / 10,
            fat: Math.round((n["fat_100g"] || 0) * f * 10) / 10,
            confidence: 98,
            reasoning: "Open Food Facts label data \u2014 ".concat(p.product_name, " per serving (~").concat(Math.round(sg2), "g)"),
            source: "oft"
          });
        case 4:
          _context39.p = 4;
          _t23 = _context39.v;
          return _context39.a(2, null);
      }
    }, _callee39, null, [[0, 4]]);
  }));
  return _searchOFT.apply(this, arguments);
}
function ItemRow(_ref41) {
  var item = _ref41.item,
    onReestimate = _ref41.onReestimate,
    reestimating = _ref41.reestimating;
  var _useState47 = useState(false),
    _useState48 = _slicedToArray(_useState47, 2),
    editing = _useState48[0],
    setEditing = _useState48[1];
  var _useState49 = useState(item.name),
    _useState50 = _slicedToArray(_useState49, 2),
    draft = _useState50[0],
    setDraft = _useState50[1];
  var cc = confColor(item.confidence);
  var submit = function submit() {
    setEditing(false);
    if (draft.trim() !== item.name) onReestimate(draft.trim());
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0b0d0b",
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
      color: "#0b0d0b",
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
      color: "#d8e8d0",
      cursor: "pointer"
    },
    onClick: function onClick() {
      return setEditing(true);
    }
  }, item.name, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#334a30"
    }
  }, "\u270F\uFE0F")), item.source === "oft" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#4b9fff",
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
      color: "#3d4a38"
    }
  }, "P:", item.protein, "g \xB7 C:", item.carbs, "g \xB7 F:", item.fat, "g"), item.reasoning && !editing && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#334a30",
      marginTop: 5,
      lineHeight: 1.5,
      fontStyle: "italic"
    }
  }, item.reasoning));
}
function AILog(_ref42) {
  var onAdd = _ref42.onAdd,
    onBack = _ref42.onBack;
  var _useState51 = useState(""),
    _useState52 = _slicedToArray(_useState51, 2),
    desc = _useState52[0],
    setDesc = _useState52[1];
  var _useState53 = useState(false),
    _useState54 = _slicedToArray(_useState53, 2),
    loading = _useState54[0],
    setLoading = _useState54[1];
  var _useState55 = useState(null),
    _useState56 = _slicedToArray(_useState55, 2),
    items = _useState56[0],
    setItems = _useState56[1];
  var _useState57 = useState(null),
    _useState58 = _slicedToArray(_useState57, 2),
    reestIdx = _useState58[0],
    setReestIdx = _useState58[1];
  var _useState59 = useState(""),
    _useState60 = _slicedToArray(_useState59, 2),
    error = _useState60[0],
    setError = _useState60[1];
  var _useState61 = useState(false),
    _useState62 = _slicedToArray(_useState61, 2),
    loggedAll = _useState62[0],
    setLoggedAll = _useState62[1];
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
  var avgConf = items ? Math.round(items.reduce(function (a, it) {
    return a + it.confidence;
  }, 0) / items.length) : 0;
  var estimate = /*#__PURE__*/function () {
    var _ref43 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
      var parsed, aiItems, oftResults, merged, _t18;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.p = _context20.n) {
          case 0:
            if (desc.trim()) {
              _context20.n = 1;
              break;
            }
            return _context20.a(2);
          case 1:
            setLoading(true);
            setError("");
            setItems(null);
            setLoggedAll(false);
            _context20.p = 2;
            _context20.n = 3;
            return callAIJson(AI_PROMPT(desc), 2000);
          case 3:
            parsed = _context20.v;
            aiItems = parsed.items || []; // OFT parallel lookup for each item
            _context20.n = 4;
            return Promise.all(aiItems.map(function (it) {
              return searchOFT(it.name);
            }));
          case 4:
            oftResults = _context20.v;
            merged = aiItems.map(function (it, i) {
              var oft = oftResults[i];
              // Use OFT data if found AND it has higher confidence than AI estimate
              if (oft && oft.confidence > it.confidence) return _objectSpread(_objectSpread({}, oft), {}, {
                name: it.name
              });
              return it;
            });
            setItems(merged);
            _context20.n = 6;
            break;
          case 5:
            _context20.p = 5;
            _t18 = _context20.v;
            setError("Estimation failed: " + _t18.message);
          case 6:
            setLoading(false);
          case 7:
            return _context20.a(2);
        }
      }, _callee20, null, [[2, 5]]);
    }));
    return function estimate() {
      return _ref43.apply(this, arguments);
    };
  }();
  var reestimate = /*#__PURE__*/function () {
    var _ref44 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(idx, newName) {
      var updated, oft, _final, _t19;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.p = _context21.n) {
          case 0:
            setReestIdx(idx);
            _context21.p = 1;
            _context21.n = 2;
            return callAIJson(AI_REESTIMATE_PROMPT(newName), 300);
          case 2:
            updated = _context21.v;
            _context21.n = 3;
            return searchOFT(newName);
          case 3:
            oft = _context21.v;
            _final = oft && oft.confidence > updated.confidence ? _objectSpread(_objectSpread({}, oft), {}, {
              name: newName
            }) : _objectSpread(_objectSpread({}, updated), {}, {
              name: newName
            });
            setItems(function (prev) {
              return prev.map(function (it, i) {
                return i === idx ? _final : it;
              });
            });
            _context21.n = 5;
            break;
          case 4:
            _context21.p = 4;
            _t19 = _context21.v;
          case 5:
            setReestIdx(null);
          case 6:
            return _context21.a(2);
        }
      }, _callee21, null, [[1, 4]]);
    }));
    return function reestimate(_x36, _x37) {
      return _ref44.apply(this, arguments);
    };
  }();
  var logAll = function logAll() {
    if (!totals) return;
    var name = desc.length > 40 ? desc.slice(0, 37) + "..." : desc;
    onAdd({
      name: name,
      kcal: Math.round(totals.kcal),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10
    });
    onBack();
  };
  var logItem = function logItem(item) {
    onAdd({
      name: item.name,
      kcal: Math.round(item.kcal),
      protein: Math.round(item.protein * 10) / 10,
      carbs: Math.round(item.carbs * 10) / 10,
      fat: Math.round(item.fat * 10) / 10
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
      color: "#556050",
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Describe your meal \u2014 I'll break it down item by item with confidence scores. Tap any item to correct it and re-estimate."), /*#__PURE__*/React.createElement("textarea", {
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
      color: "#d8e8d0",
      fontSize: 14,
      resize: "none",
      fontFamily: "inherit",
      outline: "none",
      lineHeight: 1.6
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: estimate,
    disabled: loading || !desc.trim(),
    style: {
      width: "100%",
      marginTop: 12,
      padding: "15px",
      background: loading || !desc.trim() ? "#161a16" : A,
      color: loading || !desc.trim() ? "#2e3a2c" : "#0b0d0b",
      border: "none",
      borderRadius: 14,
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: "0.08em",
      cursor: loading || !desc.trim() ? "not-allowed" : "pointer"
    }
  }, loading ? "⚡ ANALYSING..." : "🤖 ANALYSE MEAL"), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#ff8855",
      fontSize: 12,
      marginTop: 14,
      background: "#1a0d08",
      border: "1px solid #3a1a0a",
      borderRadius: 10,
      padding: "12px 14px",
      lineHeight: 1.6
    }
  }, error), items && /*#__PURE__*/React.createElement("div", {
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
      color: "#445040",
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
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      border: "1px solid ".concat(A, "33"),
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
    color: "#4b9fff"
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "CARBS",
    value: Math.round(totals.carbs) + "g",
    color: "#ffb84b"
  }), /*#__PURE__*/React.createElement(Chip, {
    label: "FAT",
    value: Math.round(totals.fat) + "g",
    color: "#ff7b4b"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: logAll,
    style: {
      width: "100%",
      padding: "14px",
      background: A,
      color: "#0b0d0b",
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
      color: "#334a30",
      textAlign: "center",
      marginBottom: 12
    }
  }, "or tap individual items to log them separately \u2191"), items.map(function (item, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return logItem(item);
      },
      style: {
        width: "100%",
        padding: "10px 14px",
        background: "#131a11",
        border: "1px solid ".concat(BD),
        borderRadius: 10,
        color: "#8aaa80",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 6,
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", null, "+ ", item.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: A,
        fontWeight: 900
      }
    }, Math.round(item.kcal), " kcal"));
  })));
}

// ── Quick Add ─────────────────────────────────────────────────

function QuickAdd(_ref45) {
  var onAdd = _ref45.onAdd,
    onBack = _ref45.onBack,
    meals = _ref45.meals,
    setMeals = _ref45.setMeals;
  var _useState63 = useState(""),
    _useState64 = _slicedToArray(_useState63, 2),
    search = _useState64[0],
    setSearch = _useState64[1];
  var _useState65 = useState(null),
    _useState66 = _slicedToArray(_useState65, 2),
    modal = _useState66[0],
    setModal = _useState66[1];
  var save = /*#__PURE__*/function () {
    var _ref46 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(m) {
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.n) {
          case 0:
            setMeals(m);
            _context22.n = 1;
            return ss("meals", JSON.stringify(m));
          case 1:
            return _context22.a(2);
        }
      }, _callee22);
    }));
    return function save(_x38) {
      return _ref46.apply(this, arguments);
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
    }
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
      background: "#131a11",
      border: "1px solid ".concat(A, "44"),
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
        color: "#d8e8d0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#3d4a38",
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
        return save(meals.filter(function (_, i) {
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
      color: "#2a3228",
      padding: "30px 0",
      fontSize: 14
    }
  }, "No meals found")), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return save([].concat(DEF_MEALS));
    },
    style: {
      marginTop: 16,
      width: "100%",
      padding: "11px",
      background: "none",
      border: "1px dashed #1a2a18",
      borderRadius: 12,
      color: "#2a3a28",
      fontSize: 12,
      fontFamily: "inherit"
    }
  }, "\u21A9 Reset to defaults"));
}

// ── Food Search ───────────────────────────────────────────────

function FoodSearch(_ref47) {
  var onAdd = _ref47.onAdd,
    onBack = _ref47.onBack;
  var _useState67 = useState(""),
    _useState68 = _slicedToArray(_useState67, 2),
    q = _useState68[0],
    setQ = _useState68[1];
  var _useState69 = useState([]),
    _useState70 = _slicedToArray(_useState69, 2),
    results = _useState70[0],
    setResults = _useState70[1];
  var _useState71 = useState(false),
    _useState72 = _slicedToArray(_useState71, 2),
    loading = _useState72[0],
    setLoading = _useState72[1];
  var _useState73 = useState(""),
    _useState74 = _slicedToArray(_useState73, 2),
    error = _useState74[0],
    setError = _useState74[1];
  var _useState75 = useState(false),
    _useState76 = _slicedToArray(_useState75, 2),
    done = _useState76[0],
    setDone = _useState76[1];
  var search = /*#__PURE__*/function () {
    var _ref48 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      var res, data, parseServing, parseKcal, valid, _t20;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.p = _context23.n) {
          case 0:
            if (q.trim()) {
              _context23.n = 1;
              break;
            }
            return _context23.a(2);
          case 1:
            setLoading(true);
            setError("");
            setResults([]);
            setDone(true);
            _context23.p = 2;
            _context23.n = 3;
            return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms=".concat(encodeURIComponent(q), "&search_simple=1&action=process&json=1&page_size=15&fields=product_name,nutriments,serving_size,brands"));
          case 3:
            res = _context23.v;
            if (res.ok) {
              _context23.n = 4;
              break;
            }
            throw new Error("Network error");
          case 4:
            _context23.n = 5;
            return res.json();
          case 5:
            data = _context23.v;
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
              _context23.n = 6;
              break;
            }
            setError("No results — try a brand name or simpler search term.");
            setLoading(false);
            return _context23.a(2);
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
            _context23.n = 8;
            break;
          case 7:
            _context23.p = 7;
            _t20 = _context23.v;
            setError("Search failed — check your internet connection.");
          case 8:
            setLoading(false);
          case 9:
            return _context23.a(2);
        }
      }, _callee23, null, [[2, 7]]);
    }));
    return function search() {
      return _ref48.apply(this, arguments);
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
      color: "#556050",
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
      background: q.trim() && !loading ? A : "#161a16",
      color: q.trim() && !loading ? "#0b0d0b" : "#2e3a2c",
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
      color: "#445040",
      padding: 24,
      fontSize: 14
    }
  }, "\uD83D\uDD0D Searching..."), error && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ff5555",
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
        color: "#d8e8d0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#3d4a38",
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
      color: "#2a3228",
      padding: "30px 0"
    }
  }, "No results"));
}

// ── History ───────────────────────────────────────────────────

var chartsAvailable = typeof ResponsiveContainer !== "undefined";
function History(_ref49) {
  var _MODES$day$mode, _MODES$day$mode2, _MODES$day$mode3;
  var history = _ref49.history,
    onBack = _ref49.onBack,
    onUpdateDay = _ref49.onUpdateDay,
    _ref49$weighIns = _ref49.weighIns,
    weighIns = _ref49$weighIns === void 0 ? [] : _ref49$weighIns;
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
      color: "#a3ff4b",
      unit: ""
    },
    PROTEIN: {
      key: "protein",
      label: "Protein",
      color: "#4b9fff",
      unit: "g"
    },
    CARBS: {
      key: "carbs",
      label: "Carbs",
      color: "#ffb84b",
      unit: "g"
    },
    FAT: {
      key: "fat",
      label: "Fat",
      color: "#ff7b4b",
      unit: "g"
    }
  };
  var _useState77 = useState("30D"),
    _useState78 = _slicedToArray(_useState77, 2),
    range = _useState78[0],
    setRange = _useState78[1];
  var _useState79 = useState(["KCAL"]),
    _useState80 = _slicedToArray(_useState79, 2),
    metrics = _useState80[0],
    setMetrics = _useState80[1];
  var _useState81 = useState(false),
    _useState82 = _slicedToArray(_useState81, 2),
    showWeight = _useState82[0],
    setShowWeight = _useState82[1];
  var _useState83 = useState("line"),
    _useState84 = _slicedToArray(_useState83, 2),
    chartType = _useState84[0],
    setChartType = _useState84[1];
  var _useState85 = useState(Math.max(0, history.length - 1)),
    _useState86 = _slicedToArray(_useState85, 2),
    dayIdx = _useState86[0],
    setDayIdx = _useState86[1];
  var _useState87 = useState(null),
    _useState88 = _slicedToArray(_useState87, 2),
    addCtx = _useState88[0],
    setAddCtx = _useState88[1];
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
      WEIGHT: w.weight,
      ROLLING: win.length >= 3 ? Math.round(avg * 10) / 10 : null
    };
  });
  var day = history[dayIdx] || null;
  var dayTots = day ? sumLogs(day.logs || []) : null;
  var pieData = dayTots ? [{
    name: "Protein",
    value: Math.round(dayTots.protein),
    color: "#4b9fff"
  }, {
    name: "Carbs",
    value: Math.round(dayTots.carbs),
    color: "#ffb84b"
  }, {
    name: "Fat",
    value: Math.round(dayTots.fat),
    color: "#ff7b4b"
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 50px",
      maxWidth: 500,
      margin: "0 auto"
    }
  }, addCtx === "quick" && /*#__PURE__*/React.createElement(QuickAdd, {
    meals: DEF_MEALS,
    setMeals: function setMeals() {},
    onAdd: function onAdd(e) {
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
    },
    onBack: function onBack() {
      return setAddCtx(null);
    }
  }), addCtx === "manual" && /*#__PURE__*/React.createElement(MealForm, {
    onSave: function onSave(e) {
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
    },
    onCancel: function onCancel() {
      return setAddCtx(null);
    }
  }), /*#__PURE__*/React.createElement(BackHdr, {
    title: "HISTORY",
    onBack: onBack,
    right: history.length > 0 && /*#__PURE__*/React.createElement("button", {
      onClick: exportCSV,
      style: {
        padding: "8px 14px",
        background: "#131a11",
        border: "1px solid ".concat(A, "44"),
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
      color: "#2a3228"
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
        background: range === r ? A : "#131a11",
        color: range === r ? "#0b0d0b" : "#556050",
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
      color: dayIdx === 0 ? "#2a3028" : "#7a9a70",
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
      color: "#d8e8d0"
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
      background: day.training ? A + "22" : "#131a11",
      color: day.training ? A : "#445040",
      border: "1px solid ".concat(day.training ? A + "44" : BD),
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
      color: dayIdx === history.length - 1 ? "#2a3028" : "#7a9a70",
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
      color: "#445040",
      marginTop: 4,
      letterSpacing: "0.12em"
    }
  }, "CALORIES"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      marginTop: 6,
      color: "#445040"
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
      color: "#445040",
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
      fill: e.color
    });
  })), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: function formatter(v, n) {
      return [v + "g", n];
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#445040",
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
        color: "#8aaa80"
      }
    }, p.name, ": ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#d8e8d0"
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
      color: "#445040",
      letterSpacing: "0.1em",
      fontWeight: 800
    }
  }, "WATER "), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "#4b9fff",
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
      background: "#131826",
      border: "1px solid #1e2a3a",
      color: "#4b9fff",
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
      background: "#0f1c2e",
      border: "1px solid #2a4a7a",
      color: "#4b9fff",
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
      color: "#445040",
      letterSpacing: "0.12em",
      fontWeight: 800,
      borderBottom: "1px solid ".concat(BD),
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, "FOODS \xB7 ", (day.logs || []).length, " ITEMS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#334a30"
    }
  }, "\xD7 to remove")), (day.logs || []).length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px",
      textAlign: "center",
      color: "#2a3228",
      fontSize: 13
    }
  }, "No foods logged"), (day.logs || []).map(function (log, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: log.id || i,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 16px",
        borderBottom: i < day.logs.length - 1 ? "1px solid ".concat(BD) : "none"
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
        color: "#d8e8d0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, log.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#3d4a38",
        marginTop: 2
      }
    }, "P:", log.protein, "g C:", log.carbs, "g F:", log.fat, "g")), /*#__PURE__*/React.createElement("span", {
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
        color: "#2a3028",
        fontSize: 18,
        padding: "2px 10px"
      }
    }, "\xD7"));
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
      background: "#131a11",
      border: "1px solid ".concat(A, "33"),
      borderRadius: 12,
      color: A,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: "0.07em"
    }
  }, "\u26A1 QUICK ADD"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setAddCtx("manual");
    },
    style: {
      flex: 1,
      padding: "11px",
      background: "#131a11",
      border: "1px solid ".concat(A, "33"),
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
  }, Object.entries(MM).map(function (_ref50) {
    var _ref51 = _slicedToArray(_ref50, 2),
      k = _ref51[0],
      m = _ref51[1];
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        setShowWeight(false);
        toggleM(k);
      },
      style: {
        padding: "6px 13px",
        background: !showWeight && metrics.includes(k) ? m.color + "22" : "#131a11",
        color: !showWeight && metrics.includes(k) ? m.color : "#445040",
        border: "1px solid ".concat(!showWeight && metrics.includes(k) ? m.color + "55" : BD),
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
      background: showWeight ? "#4b9fff22" : "#131a11",
      color: showWeight ? "#4b9fff" : "#445040",
      border: "1px solid ".concat(showWeight ? "#4b9fff55" : BD),
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
  }, [["line", "📈"], ["bar", "📊"]].map(function (_ref52) {
    var _ref53 = _slicedToArray(_ref52, 2),
      t = _ref53[0],
      e = _ref53[1];
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: function onClick() {
        return setChartType(t);
      },
      style: {
        padding: "6px 12px",
        background: chartType === t ? "#1e2a1e" : "#131a11",
        color: chartType === t ? "#d8e8d0" : "#445040",
        border: "1px solid ".concat(chartType === t ? "#334a33" : BD),
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
      fill: "#3d4a38",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: "#3d4a38",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false,
    domain: ["auto", "auto"]
  }), /*#__PURE__*/React.createElement(Tooltip, {
    formatter: function formatter(v, n) {
      return [v + " kg", n === "ROLLING" ? "7-day avg" : "Weight"];
    }
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "WEIGHT",
    stroke: "#4b9fff",
    strokeWidth: 1.5,
    dot: {
      r: 2.5,
      fill: "#4b9fff"
    },
    name: "Weight",
    connectNulls: false
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "ROLLING",
    stroke: A,
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
      fill: "#3d4a38",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: "#3d4a38",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(Tooltip, null), metrics.map(function (m) {
    return /*#__PURE__*/React.createElement(Line, {
      key: m,
      type: "monotone",
      dataKey: m,
      stroke: MM[m].color,
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
      fill: "#3d4a38",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: "#3d4a38",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(Tooltip, null), metrics.map(function (m) {
    return /*#__PURE__*/React.createElement(Bar, {
      key: m,
      dataKey: m,
      fill: MM[m].color,
      radius: [4, 4, 0, 0],
      name: m,
      maxBarSize: 28
    });
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#445040",
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
      color: "#445040",
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
  }, Object.entries(MM).map(function (_ref54) {
    var _ref55 = _slicedToArray(_ref54, 2),
      k = _ref55[0],
      m = _ref55[1];
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
    var first = filteredWeighIns[0].weight;
    var last = filteredWeighIns[filteredWeighIns.length - 1].weight;
    var diff = Math.round((last - first) * 10) / 10;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: "flex",
        justifyContent: "space-between",
        background: "#0b0d0b",
        borderRadius: 10,
        padding: "10px 14px",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#445040",
        letterSpacing: "0.08em",
        fontWeight: 800
      }
    }, "\u2696\uFE0F WEIGHT TREND"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#3d4a38",
        marginTop: 2
      }
    }, filteredWeighIns[0].weight, "kg \u2192 ", last, "kg")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: diff <= 0 ? A : "#ff7b4b"
      }
    }, diff > 0 ? "+" : "", diff, " kg"));
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
      color: "#445040",
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
        color: "#d8e8d0"
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
        color: "#3d4a38",
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
        color: "#334a30"
      }
    }, "\u203A")));
  }))), range !== "DAY" && filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0",
      color: "#2a3228",
      fontSize: 14
    }
  }, "No data for this range yet.")));
}

// ── Achievements ──────────────────────────────────────────────

function Achievements(_ref56) {
  var earnedBdgs = _ref56.earnedBdgs,
    onBack = _ref56.onBack;
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
      color: "#556050",
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
        border: "1px solid ".concat(top >= 0 ? A + "22" : BD),
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
        color: "#d8e8d0"
      }
    }, b.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#445040",
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
          color: earned[i] ? A : "#334a30",
          marginTop: 2,
          fontWeight: earned[i] ? 700 : 400
        }
      }, t));
    })));
  }), earnedBdgs.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "30px 0",
      color: "#2a3228",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 10
    }
  }, "\uD83C\uDFC6"), "No badges yet \u2014 keep logging!"));
}

// ── Root ──────────────────────────────────────────────────────

function App() {
  var _useState89 = useState("dashboard"),
    _useState90 = _slicedToArray(_useState89, 2),
    view = _useState90[0],
    setView = _useState90[1];
  var _useState91 = useState([]),
    _useState92 = _slicedToArray(_useState91, 2),
    logs = _useState92[0],
    setLogs = _useState92[1];
  var _useState93 = useState(0),
    _useState94 = _slicedToArray(_useState93, 2),
    water = _useState94[0],
    setWater = _useState94[1];
  var _useState95 = useState("cut"),
    _useState96 = _slicedToArray(_useState95, 2),
    mode = _useState96[0],
    setMode = _useState96[1];
  var _useState97 = useState(null),
    _useState98 = _slicedToArray(_useState97, 2),
    prof = _useState98[0],
    setProf = _useState98[1];
  var _useState99 = useState([]),
    _useState100 = _slicedToArray(_useState99, 2),
    hist = _useState100[0],
    setHist = _useState100[1];
  var _useState101 = useState([].concat(DEF_MEALS)),
    _useState102 = _slicedToArray(_useState101, 2),
    meals = _useState102[0],
    setMeals = _useState102[1];
  var _useState103 = useState([]),
    _useState104 = _slicedToArray(_useState103, 2),
    workouts = _useState104[0],
    setWorkouts = _useState104[1];
  var _useState105 = useState([]),
    _useState106 = _slicedToArray(_useState105, 2),
    earnedBdgs = _useState106[0],
    setEarnedBdgs = _useState106[1];
  var _useState107 = useState(null),
    _useState108 = _slicedToArray(_useState107, 2),
    newBadge = _useState108[0],
    setNewBadge = _useState108[1];
  var _useState109 = useState(false),
    _useState110 = _slicedToArray(_useState109, 2),
    ready = _useState110[0],
    setReady = _useState110[1];
  var _useState111 = useState([]),
    _useState112 = _slicedToArray(_useState111, 2),
    weighIns = _useState112[0],
    setWeighIns = _useState112[1];
  var _useState113 = useState(0),
    _useState114 = _slicedToArray(_useState113, 2),
    tdeeAdj = _useState114[0],
    setTdeeAdj = _useState114[1];
  var _useState115 = useState(0),
    _useState116 = _slicedToArray(_useState115, 2),
    coachKey = _useState116[0],
    setCoachKey = _useState116[1];
  var _useState117 = useState(null),
    _useState118 = _slicedToArray(_useState117, 2),
    streakAnim = _useState118[0],
    setStreakAnim = _useState118[1];
  var _useState119 = useState(null),
    _useState120 = _slicedToArray(_useState119, 2),
    customKcal = _useState120[0],
    setCustomKcal = _useState120[1];
  var _useState121 = useState(false),
    _useState122 = _slicedToArray(_useState121, 2),
    aggressiveCutAcked = _useState122[0],
    setAggressiveCutAcked = _useState122[1];

  // ── Auth state ────────────────────────────────────────────────
  var _useState123 = useState("anonymous"),
    _useState124 = _slicedToArray(_useState123, 2),
    authState = _useState124[0],
    setAuthState = _useState124[1];
  var _useState125 = useState(null),
    _useState126 = _slicedToArray(_useState125, 2),
    authUser = _useState126[0],
    setAuthUser = _useState126[1];
  var _useState127 = useState(null),
    _useState128 = _slicedToArray(_useState127, 2),
    premiumGate = _useState128[0],
    setPremiumGate = _useState128[1]; // {emoji, name} | null
  var _useState129 = useState(false),
    _useState130 = _slicedToArray(_useState129, 2),
    showSignIn = _useState130[0],
    setShowSignIn = _useState130[1];
  var _useState131 = useState(false),
    _useState132 = _slicedToArray(_useState131, 2),
    showSignOut = _useState132[0],
    setShowSignOut = _useState132[1];
  var _useState133 = useState(false),
    _useState134 = _slicedToArray(_useState133, 2),
    showLapsed = _useState134[0],
    setShowLapsed = _useState134[1];
  var _useState135 = useState(navigator.onLine),
    _useState136 = _slicedToArray(_useState135, 2),
    isOnline = _useState136[0],
    setIsOnline = _useState136[1];
  var _useState137 = useState(""),
    _useState138 = _slicedToArray(_useState137, 2),
    syncMsg = _useState138[0],
    setSyncMsg = _useState138[1];
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
      var _ref57 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
        var k, lv, wv, mv, pv, mv2, wkv, bv, hv, wiv, tav, ckv, n, acv, asv, auv, u;
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.n) {
            case 0:
              _context24.n = 1;
              return runMigrations();
            case 1:
              k = todayKey();
              _context24.n = 2;
              return sg("logs__" + k);
            case 2:
              lv = _context24.v;
              if (lv) setLogs(JSON.parse(lv));
              _context24.n = 3;
              return sg("water__" + k);
            case 3:
              wv = _context24.v;
              if (wv) setWater(parseInt(wv) || 0);
              _context24.n = 4;
              return sg("mode__" + k);
            case 4:
              mv = _context24.v;
              if (mv) setMode(mv);
              _context24.n = 5;
              return sg("profile");
            case 5:
              pv = _context24.v;
              if (pv) setProf(JSON.parse(pv));
              _context24.n = 6;
              return sg("meals");
            case 6:
              mv2 = _context24.v;
              if (mv2) setMeals(JSON.parse(mv2));
              _context24.n = 7;
              return sg("workouts__" + k);
            case 7:
              wkv = _context24.v;
              if (wkv) setWorkouts(JSON.parse(wkv));
              _context24.n = 8;
              return sg("badges");
            case 8:
              bv = _context24.v;
              if (bv) setEarnedBdgs(JSON.parse(bv));
              _context24.n = 9;
              return sg("history");
            case 9:
              hv = _context24.v;
              if (hv) setHist(JSON.parse(hv));
              _context24.n = 10;
              return sg("weighins");
            case 10:
              wiv = _context24.v;
              if (wiv) setWeighIns(JSON.parse(wiv));
              _context24.n = 11;
              return sg("tdee_adj");
            case 11:
              tav = _context24.v;
              if (tav) setTdeeAdj(parseInt(tav) || 0);
              _context24.n = 12;
              return sg("target_kcal");
            case 12:
              ckv = _context24.v;
              if (ckv) {
                n = parseInt(ckv);
                if (n > 0) setCustomKcal(n);
              }
              _context24.n = 13;
              return sg("aggressive_cut_acked");
            case 13:
              acv = _context24.v;
              if (acv) setAggressiveCutAcked(true);

              // Auth — load premium state and check expiry
              _context24.n = 14;
              return sg("auth_state");
            case 14:
              asv = _context24.v;
              _context24.n = 15;
              return sg("auth_user");
            case 15:
              auv = _context24.v;
              if (!(asv === "premium" && auv)) {
                _context24.n = 18;
                break;
              }
              u = JSON.parse(auv);
              if (!(u.subExpiry && Date.now() > u.subExpiry)) {
                _context24.n = 17;
                break;
              }
              _context24.n = 16;
              return ss("auth_state", "anonymous");
            case 16:
              setShowLapsed(true);
              _context24.n = 18;
              break;
            case 17:
              setAuthState("premium");
              setAuthUser(u);
              // Background pull — app shows immediately from local, Supabase data merges in
              if (u.id && navigator.onLine) {
                pullFromSupabase(u.id).then(function (pulled) {
                  if (pulled.profile) setProf(pulled.profile);
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
                  if (pulled.workouts) setWorkouts(pulled.workouts[todayKey()] || []);
                })["catch"](function () {});
              }
            case 18:
              setReady(true);
            case 19:
              return _context24.a(2);
          }
        }, _callee24);
      }));
      return function load() {
        return _ref57.apply(this, arguments);
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
      setNewBadge(newlyEarned[0]);
      if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncBadges(authUser.id, updated)["catch"](function () {});
    }
  }, [hist]); // eslint-disable-line

  var saveLogs = /*#__PURE__*/function () {
    var _ref58 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(l) {
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.n) {
          case 0:
            setLogs(l);
            _context25.n = 1;
            return ss("logs__" + todayKey(), JSON.stringify(l));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncFoodLogs(authUser.id, todayKey(), l)["catch"](function () {});
          case 2:
            return _context25.a(2);
        }
      }, _callee25);
    }));
    return function saveLogs(_x39) {
      return _ref58.apply(this, arguments);
    };
  }();
  var saveWater = /*#__PURE__*/function () {
    var _ref59 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(w) {
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.n) {
          case 0:
            setWater(w);
            _context26.n = 1;
            return ss("water__" + todayKey(), String(w));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncWater(authUser.id, todayKey(), w)["catch"](function () {});
          case 2:
            return _context26.a(2);
        }
      }, _callee26);
    }));
    return function saveWater(_x40) {
      return _ref59.apply(this, arguments);
    };
  }();
  var saveMode = /*#__PURE__*/function () {
    var _ref60 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27(m) {
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.n) {
          case 0:
            setMode(m);
            _context27.n = 1;
            return ss("mode__" + todayKey(), m);
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, m, tdeeAdj, customKcal, aggressiveCutAcked)["catch"](function () {});
          case 2:
            return _context27.a(2);
        }
      }, _callee27);
    }));
    return function saveMode(_x41) {
      return _ref60.apply(this, arguments);
    };
  }();
  var saveProf = /*#__PURE__*/function () {
    var _ref61 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(p) {
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.n) {
          case 0:
            setProf(p);
            _context28.n = 1;
            return ss("profile", JSON.stringify(p));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncProfile(authUser.id, p)["catch"](function () {});
          case 2:
            return _context28.a(2);
        }
      }, _callee28);
    }));
    return function saveProf(_x42) {
      return _ref61.apply(this, arguments);
    };
  }();
  var saveWorkouts = /*#__PURE__*/function () {
    var _ref62 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(w) {
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.n) {
          case 0:
            setWorkouts(w);
            _context29.n = 1;
            return ss("workouts__" + todayKey(), JSON.stringify(w));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncWorkouts(authUser.id, todayKey(), w)["catch"](function () {});
          case 2:
            return _context29.a(2);
        }
      }, _callee29);
    }));
    return function saveWorkouts(_x43) {
      return _ref62.apply(this, arguments);
    };
  }();
  var addLog = /*#__PURE__*/function () {
    var _ref63 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(e) {
      var isFirstToday, animKey, today, simulatedHist, newStreak;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.n) {
          case 0:
            isFirstToday = logs.length === 0;
            _context30.n = 1;
            return saveLogs([].concat(_toConsumableArray(logs), [_objectSpread(_objectSpread({}, e), {}, {
              id: Date.now(),
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            })]));
          case 1:
            if (isFirstToday) {
              animKey = "streak_anim__" + todayKey();
              if (!localStorage.getItem(animKey)) {
                today = todayKey();
                simulatedHist = [].concat(_toConsumableArray(hist.filter(function (d) {
                  return d.date !== today;
                })), [{
                  date: today,
                  logs: [e]
                }]);
                newStreak = calcStreak(simulatedHist);
                if (newStreak > 0) {
                  localStorage.setItem(animKey, "1");
                  setStreakAnim({
                    prevStreak: Math.max(0, newStreak - 1),
                    newStreak: newStreak,
                    isMilestone: [7, 14, 30, 50, 100].includes(newStreak)
                  });
                }
              }
            }
          case 2:
            return _context30.a(2);
        }
      }, _callee30);
    }));
    return function addLog(_x44) {
      return _ref63.apply(this, arguments);
    };
  }();
  var removeLog = function removeLog(id) {
    return saveLogs(logs.filter(function (l) {
      return l.id !== id;
    }));
  };
  var addWorkout = function addWorkout(w) {
    return saveWorkouts([].concat(_toConsumableArray(workouts), [w]));
  };
  var removeWorkout = function removeWorkout(id) {
    return saveWorkouts(workouts.filter(function (w) {
      return w.id !== id;
    }));
  };
  var saveCustomKcal = /*#__PURE__*/function () {
    var _ref64 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(kcal) {
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.n) {
          case 0:
            setCustomKcal(kcal);
            if (!(kcal == null)) {
              _context31.n = 2;
              break;
            }
            _context31.n = 1;
            return ss("target_kcal", "");
          case 1:
            _context31.n = 3;
            break;
          case 2:
            _context31.n = 3;
            return ss("target_kcal", String(kcal));
          case 3:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, tdeeAdj, kcal, aggressiveCutAcked)["catch"](function () {});
          case 4:
            return _context31.a(2);
        }
      }, _callee31);
    }));
    return function saveCustomKcal(_x45) {
      return _ref64.apply(this, arguments);
    };
  }();
  var handleSetMode = /*#__PURE__*/function () {
    var _ref65 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(m) {
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.n) {
          case 0:
            _context32.n = 1;
            return saveMode(m);
          case 1:
            _context32.n = 2;
            return saveCustomKcal(null);
          case 2:
            // Sync once more with correct (m, null) pair to resolve any stale-closure race
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, m, tdeeAdj, null, aggressiveCutAcked)["catch"](function () {});
          case 3:
            return _context32.a(2);
        }
      }, _callee32);
    }));
    return function handleSetMode(_x46) {
      return _ref65.apply(this, arguments);
    };
  }();
  var handleAckAggressiveCut = /*#__PURE__*/function () {
    var _ref66 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.n) {
          case 0:
            setAggressiveCutAcked(true);
            _context33.n = 1;
            return ss("aggressive_cut_acked", "1");
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, tdeeAdj, customKcal, true)["catch"](function () {});
          case 2:
            return _context33.a(2);
        }
      }, _callee33);
    }));
    return function handleAckAggressiveCut() {
      return _ref66.apply(this, arguments);
    };
  }();
  var addToQA = /*#__PURE__*/function () {
    var _ref67 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34(entry) {
      var name, clean, updated;
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.n) {
          case 0:
            name = entry.name;
            if (!meals.find(function (m) {
              return m.name.toLowerCase() === name.toLowerCase();
            })) {
              _context34.n = 1;
              break;
            }
            return _context34.a(2);
          case 1:
            clean = {
              name: name,
              kcal: Math.round(entry.kcal),
              protein: Math.round(entry.protein * 10) / 10,
              carbs: Math.round(entry.carbs * 10) / 10,
              fat: Math.round(entry.fat * 10) / 10
            };
            updated = [].concat(_toConsumableArray(meals), [clean]);
            setMeals(updated);
            _context34.n = 2;
            return ss("meals", JSON.stringify(updated));
          case 2:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncMeals(authUser.id, updated)["catch"](function () {});
          case 3:
            return _context34.a(2);
        }
      }, _callee34);
    }));
    return function addToQA(_x47) {
      return _ref67.apply(this, arguments);
    };
  }();

  // ── Auth handlers ─────────────────────────────────────────────

  var handleSignInSuccess = /*#__PURE__*/function () {
    var _ref68 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(googleUser, grantedBy) {
      var user, pulled, tod, snap, _t21;
      return _regenerator().w(function (_context35) {
        while (1) switch (_context35.p = _context35.n) {
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
            _context35.n = 1;
            return ss("auth_state", "premium");
          case 1:
            _context35.n = 2;
            return ss("auth_user", JSON.stringify(user));
          case 2:
            setShowSignIn(false);
            setPremiumGate(null);
            if (!(user.id && navigator.onLine)) {
              _context35.n = 8;
              break;
            }
            setSyncMsg("Syncing your data…");
            _context35.p = 3;
            _context35.n = 4;
            return migrateLocalToSupabase(user.id);
          case 4:
            _context35.n = 5;
            return pullFromSupabase(user.id);
          case 5:
            pulled = _context35.v;
            if (pulled.profile) setProf(pulled.profile);
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
            if (pulled.workouts) setWorkouts(pulled.workouts[todayKey()] || []);
            _context35.n = 7;
            break;
          case 6:
            _context35.p = 6;
            _t21 = _context35.v;
          case 7:
            setSyncMsg("");
          case 8:
            return _context35.a(2);
        }
      }, _callee35, null, [[3, 6]]);
    }));
    return function handleSignInSuccess(_x48, _x49) {
      return _ref68.apply(this, arguments);
    };
  }();
  var handleSignOut = /*#__PURE__*/function () {
    var _ref69 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36() {
      var clearKeys, _i2, _clearKeys, k, i, key, _t22;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.p = _context36.n) {
          case 0:
            if (!sb()) {
              _context36.n = 4;
              break;
            }
            _context36.p = 1;
            _context36.n = 2;
            return sb().auth.signOut();
          case 2:
            _context36.n = 4;
            break;
          case 3:
            _context36.p = 3;
            _t22 = _context36.v;
          case 4:
            clearKeys = ["auth_state", "auth_user", "profile", "meals", "history", "badges", "weighins", "tdee_adj", "target_kcal", "aggressive_cut_acked"];
            _i2 = 0, _clearKeys = clearKeys;
          case 5:
            if (!(_i2 < _clearKeys.length)) {
              _context36.n = 7;
              break;
            }
            k = _clearKeys[_i2];
            _context36.n = 6;
            return ss(k, "");
          case 6:
            _i2++;
            _context36.n = 5;
            break;
          case 7:
            try {
              for (i = localStorage.length - 1; i >= 0; i--) {
                key = localStorage.key(i);
                if (key && (key.startsWith("logs__") || key.startsWith("water__") || key.startsWith("workouts__") || key.startsWith("mode__") || key.startsWith("coach__") || key.startsWith("streak_anim__") || key.startsWith("sync_migrated__"))) {
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
            setCustomKcal(null);
            setShowSignOut(false);
          case 8:
            return _context36.a(2);
        }
      }, _callee36, null, [[1, 3]]);
    }));
    return function handleSignOut() {
      return _ref69.apply(this, arguments);
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
    var _ref70 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(upd) {
      var nh;
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.n) {
          case 0:
            nh = [].concat(_toConsumableArray(hist.filter(function (d) {
              return d.date !== upd.date;
            })), [upd]).sort(function (a, b) {
              return a.date.localeCompare(b.date);
            });
            setHist(nh);
            _context37.n = 1;
            return ss("history", JSON.stringify(nh));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) {
              syncHistory(authUser.id, nh)["catch"](function () {});
              if (upd.logs) syncFoodLogs(authUser.id, upd.date, upd.logs)["catch"](function () {});
            }
          case 2:
            return _context37.a(2);
        }
      }, _callee37);
    }));
    return function updateDay(_x50) {
      return _ref70.apply(this, arguments);
    };
  }();
  var onWeighIn = /*#__PURE__*/function () {
    var _ref71 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(weight) {
      var entry, updated, updatedProf, base, result, newAdj;
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.n) {
          case 0:
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
            _context38.n = 1;
            return ss("weighins", JSON.stringify(updated));
          case 1:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncWeighIns(authUser.id, updated)["catch"](function () {});

            // Sync profile weight so targets recalculate immediately
            updatedProf = _objectSpread(_objectSpread({}, prof || DEF_PROFILE), {}, {
              weight: weight
            });
            _context38.n = 2;
            return saveProf(updatedProf);
          case 2:
            // Run calibration whenever a new weigh-in arrives
            base = Math.round((370 + 21.6 * (updatedProf.weight * (1 - updatedProf.bodyFat / 100))) * 1.2);
            result = runCalibration(hist, updated, base + tdeeAdj);
            if (!(result && Math.abs(result.adj) >= 50)) {
              _context38.n = 4;
              break;
            }
            newAdj = Math.max(-600, Math.min(600, tdeeAdj + result.adj));
            setTdeeAdj(newAdj);
            _context38.n = 3;
            return ss("tdee_adj", String(newAdj));
          case 3:
            if (authState === "premium" && authUser !== null && authUser !== void 0 && authUser.id) syncSettings(authUser.id, mode, newAdj, customKcal, aggressiveCutAcked)["catch"](function () {});
          case 4:
            return _context38.a(2);
        }
      }, _callee38);
    }));
    return function onWeighIn(_x51) {
      return _ref71.apply(this, arguments);
    };
  }();
  var p = prof || DEF_PROFILE;
  var baseTDEE = Math.round((370 + 21.6 * (p.weight * (1 - p.bodyFat / 100))) * 1.2);
  var effectiveTDEE = baseTDEE + tdeeAdj;
  var effectiveMode = customKcal != null ? customKcal > effectiveTDEE ? "bulk" : customKcal < effectiveTDEE ? "cut" : "maintain" : mode;
  var workoutKcal = workouts.reduce(function (s, w) {
    return s + (w.kcal || 0);
  }, 0);
  var baseTargets = calcTargets(p, effectiveMode, workoutKcal, tdeeAdj);
  var targets = function () {
    if (customKcal == null) return baseTargets;
    var safeMin = SAFE_MIN[p.sex || "male"] || 1400;
    var safeKcal = Math.max(safeMin, customKcal);
    var scale = baseTargets.kcal > 0 ? safeKcal / baseTargets.kcal : 1;
    return _objectSpread(_objectSpread({}, baseTargets), {}, {
      kcal: safeKcal,
      protein: Math.round(baseTargets.protein * scale),
      carbs: Math.max(50, Math.round(baseTargets.carbs * scale)),
      fat: Math.round(baseTargets.fat * scale),
      safeMinApplied: safeKcal > customKcal,
      customKcalApplied: true
    });
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
  }, /*#__PURE__*/React.createElement("style", null, "\n        * { box-sizing: border-box; }\n        input::placeholder, textarea::placeholder { color: #2a3228; }\n        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }\n        select { background: #0b0d0b; color: #d8e8d0; }\n        button { cursor: pointer; }\n        button:disabled { cursor: not-allowed; }\n      "), streakAnim && /*#__PURE__*/React.createElement(StreakCelebration, {
    anim: streakAnim,
    onDone: function onDone() {
      return setStreakAnim(null);
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
  }), newBadge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 24,
      padding: "36px 28px",
      textAlign: "center",
      border: "1px solid ".concat(A, "44"),
      maxWidth: 300,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 72,
      marginBottom: 12
    }
  }, newBadge.b.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A,
      letterSpacing: "0.12em",
      fontWeight: 800,
      marginBottom: 6
    }
  }, TIER_ICONS[newBadge.i], " ", TIER_NAMES[newBadge.i].toUpperCase(), " UNLOCKED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: "#d8e8d0",
      marginBottom: 6
    }
  }, newBadge.b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#445040",
      marginBottom: 24
    }
  }, TIERS[newBadge.i], " ", newBadge.b.desc), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setNewBadge(null);
    },
    style: {
      width: "100%",
      padding: "14px",
      background: A,
      color: "#0b0d0b",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 900,
      cursor: "pointer"
    }
  }, "KEEP GOING \uD83D\uDD25"))), view === "dashboard" && /*#__PURE__*/React.createElement(Dashboard, {
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
    addToQA: addToQA,
    hasProfile: !!prof,
    streak: streak,
    prof: prof,
    weighIns: weighIns,
    onWeighIn: onWeighIn,
    tdeeAdj: tdeeAdj,
    baseTDEE: baseTDEE,
    coachKey: coachKey,
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
    aggressiveCutAcked: aggressiveCutAcked
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
    setMeals: setMeals
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
    weighIns: weighIns
  })), view === "achievements" && /*#__PURE__*/React.createElement(Achievements, {
    earnedBdgs: earnedBdgs,
    onBack: function onBack() {
      return setView("dashboard");
    }
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
