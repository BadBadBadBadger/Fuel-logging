function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
var ACTIVITY = {
  sedentary: {
    label: "Sedentary",
    mult: 1.2
  },
  light: {
    label: "Lightly Active",
    mult: 1.375
  },
  moderate: {
    label: "Moderately Active",
    mult: 1.55
  },
  active: {
    label: "Very Active",
    mult: 1.725
  },
  very: {
    label: "Extra Active",
    mult: 1.9
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
  bodyFat: 18
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
  var d = new Date();
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
var calcTargets = function calcTargets(p, mode) {
  var totalWorkoutKcal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var tdeeAdj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var w = Number(p.weight) || 80;
  var bf = Number(p.bodyFat) || 18;
  var lbm = w * (1 - bf / 100);
  var bmr = Math.round(370 + 21.6 * lbm);
  var tdee = Math.round(bmr * 1.2) + tdeeAdj;
  var kcal = tdee + MODES[mode].adj + (totalWorkoutKcal || 0);
  var protein = Math.round(lbm * (mode === "cut" ? 2.2 : mode === "bulk" ? 2.0 : 1.8));
  var fat = Math.round(w * (mode === "cut" ? 0.8 : 1.0));
  var carbs = Math.max(50, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return {
    kcal: kcal,
    protein: protein,
    carbs: carbs,
    fat: fat,
    tdee: tdee,
    bmr: bmr,
    lbm: Math.round(lbm),
    bonus: totalWorkoutKcal || 0
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
}(React.Component); // ── Shared UI ─────────────────────────────────────────────────
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
function Btn(_ref3) {
  var onClick = _ref3.onClick,
    disabled = _ref3.disabled,
    style = _ref3.style,
    children = _ref3.children;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    style: _objectSpread({
      cursor: disabled ? "not-allowed" : "pointer"
    }, style)
  }, children);
}
function BackHdr(_ref4) {
  var title = _ref4.title,
    onBack = _ref4.onBack,
    right = _ref4.right;
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
  }, /*#__PURE__*/React.createElement(Btn, {
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
function Chip(_ref5) {
  var label = _ref5.label,
    value = _ref5.value,
    color = _ref5.color;
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
function MBar(_ref6) {
  var label = _ref6.label,
    value = _ref6.value,
    target = _ref6.target,
    color = _ref6.color;
  var pct = Math.min(100, value / target * 100);
  var over = value > target;
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
      color: over ? "#ff5555" : "#8aaa80"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: over ? "#ff5555" : "#6a8a60"
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
      background: over ? "#ff5555" : color,
      borderRadius: 99,
      transition: "width 0.4s"
    }
  })));
}

// ── Coach Card ────────────────────────────────────────────────

function CoachCard(_ref7) {
  var mode = _ref7.mode,
    totals = _ref7.totals,
    targets = _ref7.targets,
    streak = _ref7.streak,
    water = _ref7.water;
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    tip = _useState2[0],
    setTip = _useState2[1];
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    refreshes = _useState4[0],
    setRefreshes = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    loading = _useState6[0],
    setLoading = _useState6[1];
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
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var h, timeLabel, prompt, res, data, t, r, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (!(loading || refreshes >= 3)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            setLoading(true);
            _context3.p = 2;
            h = getCurrentHour();
            timeLabel = h < 6 ? "early morning" : h < 12 ? "morning" : h < 14 ? "midday" : h < 18 ? "afternoon" : h < 21 ? "evening" : "night";
            prompt = "You are a supportive fitness coach. Local time: ".concat(timeLabel, " (").concat(h, ":00). Today: ").concat(mode, " mode, ").concat(Math.round(totals.kcal), "/").concat(targets.kcal, " kcal, protein ").concat(Math.round(totals.protein), "g/").concat(targets.protein, "g, ").concat(water, "/8 glasses, ").concat(streak, " day streak.\nWrite exactly 3 sentences: 1) honest observation about today 2) a food or habit suggestion appropriate for ").concat(timeLabel, " 3) genuine praise. Brief, personal, max one emoji per sentence.");
            _context3.n = 3;
            return fetch(AI_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 200,
                messages: [{
                  role: "user",
                  content: prompt
                }]
              })
            });
          case 3:
            res = _context3.v;
            _context3.n = 4;
            return res.json();
          case 4:
            data = _context3.v;
            t = (data.content || []).map(function (b) {
              return b.text || "";
            }).join("").trim();
            r = refreshes + 1;
            setTip(t);
            setRefreshes(r);
            _context3.n = 5;
            return ss("coach__" + todayKey(), JSON.stringify({
              tip: t,
              r: r
            }));
          case 5:
            _context3.n = 7;
            break;
          case 6:
            _context3.p = 6;
            _t3 = _context3.v;
          case 7:
            setLoading(false);
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 6]]);
    }));
    return function gen() {
      return _ref8.apply(this, arguments);
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

function ProfileScreen(_ref9) {
  var profile = _ref9.profile,
    onSave = _ref9.onSave,
    onBack = _ref9.onBack,
    _ref9$tdeeAdj = _ref9.tdeeAdj,
    tdeeAdj = _ref9$tdeeAdj === void 0 ? 0 : _ref9$tdeeAdj,
    _ref9$weighIns = _ref9.weighIns,
    weighIns = _ref9$weighIns === void 0 ? [] : _ref9$weighIns;
  var _useState7 = useState(_objectSpread(_objectSpread({}, DEF_PROFILE), profile)),
    _useState8 = _slicedToArray(_useState7, 2),
    f = _useState8[0],
    setF = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    saved = _useState0[0],
    setSaved = _useState0[1];
  var set = function set(k, v) {
    return setF(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
    });
  };
  var valid = Number(f.weight) > 0 && Number(f.height) > 0 && Number(f.bodyFat) > 0 && Number(f.bodyFat) < 100;
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
  }, [f.weight, f.height, f.bodyFat]); // eslint-disable-line

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
    style: _objectSpread(_objectSpread({}, INP), {}, {
      marginBottom: 4
    })
  }), /*#__PURE__*/React.createElement("div", {
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
  }].map(function (_ref0) {
    var mode = _ref0.mode,
      label = _ref0.label,
      color = _ref0.color;
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
    }, [["KCAL", "kcal", ""], ["P", "protein", "g"], ["C", "carbs", "g"], ["F", "fat", "g"]].map(function (_ref1) {
      var _ref10 = _slicedToArray(_ref1, 3),
        k = _ref10[0],
        key = _ref10[1],
        u = _ref10[2];
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
  }, "Workout kcal are added when you log sessions on the dashboard.")));
}

// ── Meal Form ─────────────────────────────────────────────────

function MealForm(_ref11) {
  var meal = _ref11.meal,
    onSave = _ref11.onSave,
    onCancel = _ref11.onCancel;
  var blank = {
    name: "",
    kcal: "",
    protein: "",
    carbs: "",
    fat: ""
  };
  var _useState1 = useState(meal ? {
      name: meal.name,
      kcal: String(meal.kcal),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat)
    } : blank),
    _useState10 = _slicedToArray(_useState1, 2),
    f = _useState10[0],
    setF = _useState10[1];
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
  }, meal ? "EDIT MEAL" : "ADD MEAL"), /*#__PURE__*/React.createElement(Btn, {
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
  })), /*#__PURE__*/React.createElement(Btn, {
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

function WeighInWidget(_ref12) {
  var weighIns = _ref12.weighIns,
    onWeighIn = _ref12.onWeighIn,
    tdeeAdj = _ref12.tdeeAdj,
    baseTDEE = _ref12.baseTDEE;
  var _useState11 = useState(""),
    _useState12 = _slicedToArray(_useState11, 2),
    val = _useState12[0],
    setVal = _useState12[1];
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
  }), /*#__PURE__*/React.createElement(Btn, {
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

function WorkoutLogger(_ref13) {
  var workouts = _ref13.workouts,
    onAdd = _ref13.onAdd,
    onRemove = _ref13.onRemove,
    prof = _ref13.prof;
  var _useState13 = useState("legs"),
    _useState14 = _slicedToArray(_useState13, 2),
    type = _useState14[0],
    setType = _useState14[1];
  var _useState15 = useState(45),
    _useState16 = _slicedToArray(_useState15, 2),
    dur = _useState16[0],
    setDur = _useState16[1];
  var _useState17 = useState("moderate"),
    _useState18 = _slicedToArray(_useState17, 2),
    intensity = _useState18[0],
    setIntensity = _useState18[1];
  var _useState19 = useState(false),
    _useState20 = _slicedToArray(_useState19, 2),
    hevyMode = _useState20[0],
    setHevyMode = _useState20[1];
  var _useState21 = useState(""),
    _useState22 = _slicedToArray(_useState21, 2),
    hevyText = _useState22[0],
    setHevyText = _useState22[1];
  var _useState23 = useState(false),
    _useState24 = _slicedToArray(_useState23, 2),
    hevyLoading = _useState24[0],
    setHevyLoading = _useState24[1];
  var _useState25 = useState(null),
    _useState26 = _slicedToArray(_useState25, 2),
    hevyResult = _useState26[0],
    setHevyResult = _useState26[1];
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
    var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var res, data, text, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            if (!(!hevyText.trim() || hevyLoading)) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            setHevyLoading(true);
            setHevyResult(null);
            _context4.p = 2;
            _context4.n = 3;
            return fetch(AI_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 200,
                messages: [{
                  role: "user",
                  content: "Parse this workout log and estimate calories burned. User: ".concat(p.weight, "kg bodyweight, ").concat(p.bodyFat, "% body fat.\n\nWorkout:\n").concat(hevyText, "\n\nReturn ONLY valid JSON: {\"estimatedKcal\":number,\"type\":\"legs|push|pull|fullbody|cardio\",\"intensity\":\"light|moderate|heavy\",\"summary\":\"brief 1 line description\"}")
                }]
              })
            });
          case 3:
            res = _context4.v;
            _context4.n = 4;
            return res.json();
          case 4:
            data = _context4.v;
            text = (data.content || []).map(function (b) {
              return b.text || "";
            }).join("").trim();
            setHevyResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
            _context4.n = 6;
            break;
          case 5:
            _context4.p = 5;
            _t4 = _context4.v;
            setHevyResult({
              error: "Parse failed — Cloudflare Worker required."
            });
          case 6:
            setHevyLoading(false);
          case 7:
            return _context4.a(2);
        }
      }, _callee4, null, [[2, 5]]);
    }));
    return function parseWorkout() {
      return _ref14.apply(this, arguments);
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
      return setHevyMode(true);
    },
    style: {
      padding: "10px 14px",
      background: "#0b0d0b",
      border: "1px solid ".concat(A, "33"),
      borderRadius: 10,
      color: A,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\uD83D\uDCCB Paste log"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
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

function Dashboard(_ref15) {
  var logs = _ref15.logs,
    totals = _ref15.totals,
    targets = _ref15.targets,
    remaining = _ref15.remaining,
    water = _ref15.water,
    setWater = _ref15.setWater,
    mode = _ref15.mode,
    setMode = _ref15.setMode,
    setView = _ref15.setView,
    removeLog = _ref15.removeLog,
    addToQA = _ref15.addToQA,
    hasProfile = _ref15.hasProfile,
    streak = _ref15.streak,
    prof = _ref15.prof,
    weighIns = _ref15.weighIns,
    onWeighIn = _ref15.onWeighIn,
    tdeeAdj = _ref15.tdeeAdj,
    baseTDEE = _ref15.baseTDEE,
    coachKey = _ref15.coachKey,
    workouts = _ref15.workouts,
    onAddWorkout = _ref15.onAddWorkout,
    onRemoveWorkout = _ref15.onRemoveWorkout;
  var over = totals.kcal > targets.kcal;
  var pct = Math.min(100, totals.kcal / targets.kcal * 100);
  var mc = MODES[mode].color;
  var isTraining = workouts.length > 0;
  var _useState27 = useState({}),
    _useState28 = _slicedToArray(_useState27, 2),
    savedIds = _useState28[0],
    setSavedIds = _useState28[1];
  var handleAddToQA = /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(log) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
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
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return function handleAddToQA(_x4) {
      return _ref16.apply(this, arguments);
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
  }).toUpperCase())), /*#__PURE__*/React.createElement("div", {
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
  }, "\uD83D\uDD25", streak), /*#__PURE__*/React.createElement(Btn, {
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
  }, "\u2699\uFE0F"), /*#__PURE__*/React.createElement(Btn, {
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
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement(Btn, {
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
  }, "\uD83C\uDFC6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 12
    }
  }, Object.entries(MODES).map(function (_ref17) {
    var _ref18 = _slicedToArray(_ref17, 2),
      k = _ref18[0],
      v = _ref18[1];
    return /*#__PURE__*/React.createElement(Btn, {
      key: k,
      onClick: function onClick() {
        return setMode(k);
      },
      style: {
        flex: 1,
        padding: "9px 4px",
        background: mode === k ? v.color + "22" : "#131a11",
        color: mode === k ? v.color : "#445040",
        border: "1px solid ".concat(mode === k ? v.color + "55" : BD),
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
    prof: prof
  }), !hasProfile && /*#__PURE__*/React.createElement(Btn, {
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
  }, "\uD83D\uDC64 Set body stats for personalised targets \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: 22,
      border: "1px solid ".concat(over ? "#ff555328" : "#1c241c"),
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
  }, MODES[mode].label, isTraining ? " · ⚡" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#2e3a2c"
    }
  }, "TARGET ", targets.kcal.toLocaleString(), " kcal")), /*#__PURE__*/React.createElement("div", {
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
      color: over ? "#ff5555" : "#e8f0e0",
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
  }, over ? "OVER BY" : "REMAINING"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 900,
      color: over ? "#ff5555" : mc,
      lineHeight: 1
    }
  }, Math.abs(Math.round(remaining)).toLocaleString(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: over ? "#aa3333" : "#6a9a30",
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
      background: over ? "#ff5555" : "linear-gradient(90deg,".concat(mc, "88,").concat(mc, ")"),
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
  })), /*#__PURE__*/React.createElement(CoachCard, {
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
  }, /*#__PURE__*/React.createElement(Btn, {
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
  }, "\u2212"), /*#__PURE__*/React.createElement(Btn, {
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
    s: "describe it",
    v: "ai"
  }, {
    e: "⚡",
    l: "QUICK ADD",
    s: "preset meals",
    v: "quick"
  }, {
    e: "🔍",
    l: "SEARCH",
    s: "food database",
    v: "search"
  }].map(function (b) {
    return /*#__PURE__*/React.createElement(Btn, {
      key: b.v,
      onClick: function onClick() {
        return setView(b.v);
      },
      style: {
        background: CARD,
        border: "1px solid ".concat(BD),
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
        color: A,
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
function searchOFT(_x5) {
  return _searchOFT.apply(this, arguments);
}
function _searchOFT() {
  _searchOFT = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(query) {
    var _p$product_name2, res, data, p, sg2, f, n, _t8;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          _context17.p = 0;
          _context17.n = 1;
          return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms=".concat(encodeURIComponent(query), "&search_simple=1&action=process&json=1&page_size=3&fields=product_name,nutriments,serving_size"));
        case 1:
          res = _context17.v;
          _context17.n = 2;
          return res.json();
        case 2:
          data = _context17.v;
          p = (data.products || []).find(function (p) {
            var _p$nutriments;
            return ((_p$nutriments = p.nutriments) === null || _p$nutriments === void 0 ? void 0 : _p$nutriments["energy-kcal_100g"]) != null;
          });
          if (p) {
            _context17.n = 3;
            break;
          }
          return _context17.a(2, null);
        case 3:
          sg2 = parseFloat(p.serving_size) || 100, f = sg2 / 100, n = p.nutriments;
          return _context17.a(2, {
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
          _context17.p = 4;
          _t8 = _context17.v;
          return _context17.a(2, null);
      }
    }, _callee17, null, [[0, 4]]);
  }));
  return _searchOFT.apply(this, arguments);
}
function ItemRow(_ref19) {
  var item = _ref19.item,
    onReestimate = _ref19.onReestimate,
    reestimating = _ref19.reestimating;
  var _useState29 = useState(false),
    _useState30 = _slicedToArray(_useState29, 2),
    editing = _useState30[0],
    setEditing = _useState30[1];
  var _useState31 = useState(item.name),
    _useState32 = _slicedToArray(_useState31, 2),
    draft = _useState32[0],
    setDraft = _useState32[1];
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
function AILog(_ref20) {
  var onAdd = _ref20.onAdd,
    onBack = _ref20.onBack;
  var _useState33 = useState(""),
    _useState34 = _slicedToArray(_useState33, 2),
    desc = _useState34[0],
    setDesc = _useState34[1];
  var _useState35 = useState(false),
    _useState36 = _slicedToArray(_useState35, 2),
    loading = _useState36[0],
    setLoading = _useState36[1];
  var _useState37 = useState(null),
    _useState38 = _slicedToArray(_useState37, 2),
    items = _useState38[0],
    setItems = _useState38[1];
  var _useState39 = useState(null),
    _useState40 = _slicedToArray(_useState39, 2),
    reestIdx = _useState40[0],
    setReestIdx = _useState40[1];
  var _useState41 = useState(""),
    _useState42 = _slicedToArray(_useState41, 2),
    error = _useState42[0],
    setError = _useState42[1];
  var _useState43 = useState(false),
    _useState44 = _slicedToArray(_useState43, 2),
    loggedAll = _useState44[0],
    setLoggedAll = _useState44[1];
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
    var _ref21 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var aiPromise, aiData, text, parsed, aiItems, oftResults, merged, _t5;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            if (desc.trim()) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2);
          case 1:
            setLoading(true);
            setError("");
            setItems(null);
            setLoggedAll(false);
            _context6.p = 2;
            // Fire AI and OFT searches in parallel
            aiPromise = fetch(AI_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                messages: [{
                  role: "user",
                  content: AI_PROMPT(desc)
                }]
              })
            }).then(function (r) {
              return r.json();
            });
            _context6.n = 3;
            return aiPromise;
          case 3:
            aiData = _context6.v;
            text = (aiData.content || []).map(function (b) {
              return b.text || "";
            }).join("");
            parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
            aiItems = parsed.items || []; // OFT parallel lookup for each item
            _context6.n = 4;
            return Promise.all(aiItems.map(function (it) {
              return searchOFT(it.name);
            }));
          case 4:
            oftResults = _context6.v;
            merged = aiItems.map(function (it, i) {
              var oft = oftResults[i];
              // Use OFT data if found AND it has higher confidence than AI estimate
              if (oft && oft.confidence > it.confidence) return _objectSpread(_objectSpread({}, oft), {}, {
                name: it.name
              });
              return it;
            });
            setItems(merged);
            _context6.n = 6;
            break;
          case 5:
            _context6.p = 5;
            _t5 = _context6.v;
            setError("Estimation failed: " + _t5.message);
          case 6:
            setLoading(false);
          case 7:
            return _context6.a(2);
        }
      }, _callee6, null, [[2, 5]]);
    }));
    return function estimate() {
      return _ref21.apply(this, arguments);
    };
  }();
  var reestimate = /*#__PURE__*/function () {
    var _ref22 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(idx, newName) {
      var res, data, text, updated, oft, _final, _t6;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            setReestIdx(idx);
            _context7.p = 1;
            _context7.n = 2;
            return fetch(AI_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 300,
                messages: [{
                  role: "user",
                  content: AI_REESTIMATE_PROMPT(newName)
                }]
              })
            });
          case 2:
            res = _context7.v;
            _context7.n = 3;
            return res.json();
          case 3:
            data = _context7.v;
            text = (data.content || []).map(function (b) {
              return b.text || "";
            }).join("");
            updated = JSON.parse(text.replace(/```json|```/g, "").trim()); // Try OFT for the new name too
            _context7.n = 4;
            return searchOFT(newName);
          case 4:
            oft = _context7.v;
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
            _context7.n = 6;
            break;
          case 5:
            _context7.p = 5;
            _t6 = _context7.v;
          case 6:
            setReestIdx(null);
          case 7:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 5]]);
    }));
    return function reestimate(_x6, _x7) {
      return _ref22.apply(this, arguments);
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

function QuickAdd(_ref23) {
  var onAdd = _ref23.onAdd,
    onBack = _ref23.onBack,
    meals = _ref23.meals,
    setMeals = _ref23.setMeals;
  var _useState45 = useState(""),
    _useState46 = _slicedToArray(_useState45, 2),
    search = _useState46[0],
    setSearch = _useState46[1];
  var _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    modal = _useState48[0],
    setModal = _useState48[1];
  var save = /*#__PURE__*/function () {
    var _ref24 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(m) {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            setMeals(m);
            _context8.n = 1;
            return ss("meals", JSON.stringify(m));
          case 1:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return function save(_x8) {
      return _ref24.apply(this, arguments);
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
  }), /*#__PURE__*/React.createElement(Btn, {
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
    }, /*#__PURE__*/React.createElement(Btn, {
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
    }, m.kcal), /*#__PURE__*/React.createElement(Btn, {
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
    }, "\u270F\uFE0F"), /*#__PURE__*/React.createElement(Btn, {
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
  }, "No meals found")), /*#__PURE__*/React.createElement(Btn, {
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

function FoodSearch(_ref25) {
  var onAdd = _ref25.onAdd,
    onBack = _ref25.onBack;
  var _useState49 = useState(""),
    _useState50 = _slicedToArray(_useState49, 2),
    q = _useState50[0],
    setQ = _useState50[1];
  var _useState51 = useState([]),
    _useState52 = _slicedToArray(_useState51, 2),
    results = _useState52[0],
    setResults = _useState52[1];
  var _useState53 = useState(false),
    _useState54 = _slicedToArray(_useState53, 2),
    loading = _useState54[0],
    setLoading = _useState54[1];
  var _useState55 = useState(""),
    _useState56 = _slicedToArray(_useState55, 2),
    error = _useState56[0],
    setError = _useState56[1];
  var _useState57 = useState(false),
    _useState58 = _slicedToArray(_useState57, 2),
    done = _useState58[0],
    setDone = _useState58[1];
  var search = /*#__PURE__*/function () {
    var _ref26 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var res, data, parseServing, parseKcal, valid, _t7;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            if (q.trim()) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2);
          case 1:
            setLoading(true);
            setError("");
            setResults([]);
            setDone(true);
            _context9.p = 2;
            _context9.n = 3;
            return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms=".concat(encodeURIComponent(q), "&search_simple=1&action=process&json=1&page_size=15&fields=product_name,nutriments,serving_size,brands"));
          case 3:
            res = _context9.v;
            if (res.ok) {
              _context9.n = 4;
              break;
            }
            throw new Error("Network error");
          case 4:
            _context9.n = 5;
            return res.json();
          case 5:
            data = _context9.v;
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
              _context9.n = 6;
              break;
            }
            setError("No results — try a brand name or simpler search term.");
            setLoading(false);
            return _context9.a(2);
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
            _context9.n = 8;
            break;
          case 7:
            _context9.p = 7;
            _t7 = _context9.v;
            setError("Search failed — check your internet connection.");
          case 8:
            setLoading(false);
          case 9:
            return _context9.a(2);
        }
      }, _callee9, null, [[2, 7]]);
    }));
    return function search() {
      return _ref26.apply(this, arguments);
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
  }), /*#__PURE__*/React.createElement(Btn, {
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
    return /*#__PURE__*/React.createElement(Btn, {
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
function History(_ref27) {
  var _MODES$day$mode, _MODES$day$mode2, _MODES$day$mode3;
  var history = _ref27.history,
    onBack = _ref27.onBack,
    onUpdateDay = _ref27.onUpdateDay,
    _ref27$weighIns = _ref27.weighIns,
    weighIns = _ref27$weighIns === void 0 ? [] : _ref27$weighIns;
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
  var _useState59 = useState("30D"),
    _useState60 = _slicedToArray(_useState59, 2),
    range = _useState60[0],
    setRange = _useState60[1];
  var _useState61 = useState(["KCAL"]),
    _useState62 = _slicedToArray(_useState61, 2),
    metrics = _useState62[0],
    setMetrics = _useState62[1];
  var _useState63 = useState(false),
    _useState64 = _slicedToArray(_useState63, 2),
    showWeight = _useState64[0],
    setShowWeight = _useState64[1];
  var _useState65 = useState("line"),
    _useState66 = _slicedToArray(_useState65, 2),
    chartType = _useState66[0],
    setChartType = _useState66[1];
  var _useState67 = useState(Math.max(0, history.length - 1)),
    _useState68 = _slicedToArray(_useState67, 2),
    dayIdx = _useState68[0],
    setDayIdx = _useState68[1];
  var _useState69 = useState(null),
    _useState70 = _slicedToArray(_useState69, 2),
    addCtx = _useState70[0],
    setAddCtx = _useState70[1];
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
    right: history.length > 0 && /*#__PURE__*/React.createElement(Btn, {
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
    return /*#__PURE__*/React.createElement(Btn, {
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
  }, /*#__PURE__*/React.createElement(Btn, {
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
  }, (_MODES$day$mode3 = MODES[day.mode]) === null || _MODES$day$mode3 === void 0 ? void 0 : _MODES$day$mode3.label), /*#__PURE__*/React.createElement(Btn, {
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
  }, day.training ? "⚡ TRAINING" : "💤 REST"))), /*#__PURE__*/React.createElement(Btn, {
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
  }, /*#__PURE__*/React.createElement(Btn, {
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
  }, "\u2212"), /*#__PURE__*/React.createElement(Btn, {
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
    }, Math.round(log.kcal)), /*#__PURE__*/React.createElement(Btn, {
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
  }, /*#__PURE__*/React.createElement(Btn, {
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
  }, "\u26A1 QUICK ADD"), /*#__PURE__*/React.createElement(Btn, {
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
  }, Object.entries(MM).map(function (_ref28) {
    var _ref29 = _slicedToArray(_ref28, 2),
      k = _ref29[0],
      m = _ref29[1];
    return /*#__PURE__*/React.createElement(Btn, {
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
  }), filteredWeighIns.length > 0 && /*#__PURE__*/React.createElement(Btn, {
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
  }, [["line", "📈"], ["bar", "📊"]].map(function (_ref30) {
    var _ref31 = _slicedToArray(_ref30, 2),
      t = _ref31[0],
      e = _ref31[1];
    return /*#__PURE__*/React.createElement(Btn, {
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
  }, Object.entries(MM).map(function (_ref32) {
    var _ref33 = _slicedToArray(_ref32, 2),
      k = _ref33[0],
      m = _ref33[1];
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

function Achievements(_ref34) {
  var earnedBdgs = _ref34.earnedBdgs,
    onBack = _ref34.onBack;
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
  var _useState71 = useState("dashboard"),
    _useState72 = _slicedToArray(_useState71, 2),
    view = _useState72[0],
    setView = _useState72[1];
  var _useState73 = useState([]),
    _useState74 = _slicedToArray(_useState73, 2),
    logs = _useState74[0],
    setLogs = _useState74[1];
  var _useState75 = useState(0),
    _useState76 = _slicedToArray(_useState75, 2),
    water = _useState76[0],
    setWater = _useState76[1];
  var _useState77 = useState("cut"),
    _useState78 = _slicedToArray(_useState77, 2),
    mode = _useState78[0],
    setMode = _useState78[1];
  var _useState79 = useState(null),
    _useState80 = _slicedToArray(_useState79, 2),
    prof = _useState80[0],
    setProf = _useState80[1];
  var _useState81 = useState([]),
    _useState82 = _slicedToArray(_useState81, 2),
    hist = _useState82[0],
    setHist = _useState82[1];
  var _useState83 = useState([].concat(DEF_MEALS)),
    _useState84 = _slicedToArray(_useState83, 2),
    meals = _useState84[0],
    setMeals = _useState84[1];
  var _useState85 = useState([]),
    _useState86 = _slicedToArray(_useState85, 2),
    workouts = _useState86[0],
    setWorkouts = _useState86[1];
  var _useState87 = useState([]),
    _useState88 = _slicedToArray(_useState87, 2),
    earnedBdgs = _useState88[0],
    setEarnedBdgs = _useState88[1];
  var _useState89 = useState(null),
    _useState90 = _slicedToArray(_useState89, 2),
    newBadge = _useState90[0],
    setNewBadge = _useState90[1];
  var _useState91 = useState(false),
    _useState92 = _slicedToArray(_useState91, 2),
    ready = _useState92[0],
    setReady = _useState92[1];
  var _useState93 = useState([]),
    _useState94 = _slicedToArray(_useState93, 2),
    weighIns = _useState94[0],
    setWeighIns = _useState94[1];
  var _useState95 = useState(0),
    _useState96 = _slicedToArray(_useState95, 2),
    tdeeAdj = _useState96[0],
    setTdeeAdj = _useState96[1];
  var _useState97 = useState(0),
    _useState98 = _slicedToArray(_useState97, 2),
    coachKey = _useState98[0],
    setCoachKey = _useState98[1];

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
      var _ref35 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var k, lv, wv, mv, pv, mv2, wkv, bv, hv, wiv, tav;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              k = todayKey();
              _context0.n = 1;
              return sg("logs__" + k);
            case 1:
              lv = _context0.v;
              if (lv) setLogs(JSON.parse(lv));
              _context0.n = 2;
              return sg("water__" + k);
            case 2:
              wv = _context0.v;
              if (wv) setWater(parseInt(wv) || 0);
              _context0.n = 3;
              return sg("mode__" + k);
            case 3:
              mv = _context0.v;
              if (mv) setMode(mv);
              _context0.n = 4;
              return sg("profile");
            case 4:
              pv = _context0.v;
              if (pv) setProf(JSON.parse(pv));
              _context0.n = 5;
              return sg("meals");
            case 5:
              mv2 = _context0.v;
              if (mv2) setMeals(JSON.parse(mv2));
              _context0.n = 6;
              return sg("workouts__" + k);
            case 6:
              wkv = _context0.v;
              if (wkv) setWorkouts(JSON.parse(wkv));
              _context0.n = 7;
              return sg("badges");
            case 7:
              bv = _context0.v;
              if (bv) setEarnedBdgs(JSON.parse(bv));
              _context0.n = 8;
              return sg("history");
            case 8:
              hv = _context0.v;
              if (hv) setHist(JSON.parse(hv));
              _context0.n = 9;
              return sg("weighins");
            case 9:
              wiv = _context0.v;
              if (wiv) setWeighIns(JSON.parse(wiv));
              _context0.n = 10;
              return sg("tdee_adj");
            case 10:
              tav = _context0.v;
              if (tav) setTdeeAdj(parseInt(tav) || 0);
              setReady(true);
            case 11:
              return _context0.a(2);
          }
        }, _callee0);
      }));
      return function load() {
        return _ref35.apply(this, arguments);
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
    }
  }, [hist]); // eslint-disable-line

  var saveLogs = /*#__PURE__*/function () {
    var _ref36 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(l) {
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            setLogs(l);
            _context1.n = 1;
            return ss("logs__" + todayKey(), JSON.stringify(l));
          case 1:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return function saveLogs(_x9) {
      return _ref36.apply(this, arguments);
    };
  }();
  var saveWater = /*#__PURE__*/function () {
    var _ref37 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(w) {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            setWater(w);
            _context10.n = 1;
            return ss("water__" + todayKey(), String(w));
          case 1:
            return _context10.a(2);
        }
      }, _callee10);
    }));
    return function saveWater(_x0) {
      return _ref37.apply(this, arguments);
    };
  }();
  var saveMode = /*#__PURE__*/function () {
    var _ref38 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(m) {
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            setMode(m);
            _context11.n = 1;
            return ss("mode__" + todayKey(), m);
          case 1:
            return _context11.a(2);
        }
      }, _callee11);
    }));
    return function saveMode(_x1) {
      return _ref38.apply(this, arguments);
    };
  }();
  var saveProf = /*#__PURE__*/function () {
    var _ref39 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(p) {
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            setProf(p);
            _context12.n = 1;
            return ss("profile", JSON.stringify(p));
          case 1:
            return _context12.a(2);
        }
      }, _callee12);
    }));
    return function saveProf(_x10) {
      return _ref39.apply(this, arguments);
    };
  }();
  var saveWorkouts = /*#__PURE__*/function () {
    var _ref40 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(w) {
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            setWorkouts(w);
            _context13.n = 1;
            return ss("workouts__" + todayKey(), JSON.stringify(w));
          case 1:
            return _context13.a(2);
        }
      }, _callee13);
    }));
    return function saveWorkouts(_x11) {
      return _ref40.apply(this, arguments);
    };
  }();
  var addLog = function addLog(e) {
    return saveLogs([].concat(_toConsumableArray(logs), [_objectSpread(_objectSpread({}, e), {}, {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    })]));
  };
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
  var addToQA = /*#__PURE__*/function () {
    var _ref41 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(entry) {
      var name, clean, updated;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            name = entry.name;
            if (!meals.find(function (m) {
              return m.name.toLowerCase() === name.toLowerCase();
            })) {
              _context14.n = 1;
              break;
            }
            return _context14.a(2);
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
            _context14.n = 2;
            return ss("meals", JSON.stringify(updated));
          case 2:
            return _context14.a(2);
        }
      }, _callee14);
    }));
    return function addToQA(_x12) {
      return _ref41.apply(this, arguments);
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
  }, [logs, water, workouts, mode, ready]); // eslint-disable-line

  var updateDay = /*#__PURE__*/function () {
    var _ref42 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(upd) {
      var nh;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            nh = [].concat(_toConsumableArray(hist.filter(function (d) {
              return d.date !== upd.date;
            })), [upd]).sort(function (a, b) {
              return a.date.localeCompare(b.date);
            });
            setHist(nh);
            _context15.n = 1;
            return ss("history", JSON.stringify(nh));
          case 1:
            return _context15.a(2);
        }
      }, _callee15);
    }));
    return function updateDay(_x13) {
      return _ref42.apply(this, arguments);
    };
  }();
  var onWeighIn = /*#__PURE__*/function () {
    var _ref43 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(weight) {
      var entry, updated, p, base, result, newAdj;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
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
            _context16.n = 1;
            return ss("weighins", JSON.stringify(updated));
          case 1:
            // Run calibration whenever a new weigh-in arrives
            p = prof || DEF_PROFILE;
            base = Math.round((370 + 21.6 * (p.weight * (1 - p.bodyFat / 100))) * 1.2);
            result = runCalibration(hist, updated, base + tdeeAdj);
            if (!(result && Math.abs(result.adj) >= 50)) {
              _context16.n = 2;
              break;
            }
            newAdj = Math.max(-600, Math.min(600, tdeeAdj + result.adj));
            setTdeeAdj(newAdj);
            _context16.n = 2;
            return ss("tdee_adj", String(newAdj));
          case 2:
            return _context16.a(2);
        }
      }, _callee16);
    }));
    return function onWeighIn(_x14) {
      return _ref43.apply(this, arguments);
    };
  }();
  var p = prof || DEF_PROFILE;
  var baseTDEE = Math.round((370 + 21.6 * (p.weight * (1 - p.bodyFat / 100))) * 1.2);
  var targets = calcTargets(prof || DEF_PROFILE, mode, workouts.reduce(function (s, w) {
    return s + (w.kcal || 0);
  }, 0), tdeeAdj);
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
  }, /*#__PURE__*/React.createElement("style", null, "\n        * { box-sizing: border-box; }\n        input::placeholder, textarea::placeholder { color: #2a3228; }\n        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }\n        select { background: #0b0d0b; color: #d8e8d0; }\n      "), newBadge && /*#__PURE__*/React.createElement("div", {
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
    mode: mode,
    setMode: saveMode,
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
    onRemoveWorkout: removeWorkout
  }), view === "profile" && /*#__PURE__*/React.createElement(ProfileScreen, {
    profile: prof || DEF_PROFILE,
    onSave: saveProf,
    onBack: function onBack() {
      return setView("dashboard");
    },
    tdeeAdj: tdeeAdj,
    weighIns: weighIns
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
