import {
  require_react_dom
} from "./chunk-PRK46SJB.js";
import {
  require_react
} from "./chunk-FLAVOKRJ.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS,
  __toESM
} from "./chunk-AC2VUBZ6.js";

// node_modules/@react-spring/rafz/dist/react-spring-rafz.esm.js
function schedule(fn, queue) {
  if (sync) {
    queue.delete(fn);
    fn(0);
  } else {
    queue.add(fn);
    start();
  }
}
function start() {
  if (ts < 0) {
    ts = 0;
    if (raf.frameLoop !== "demand") {
      nativeRaf(loop);
    }
  }
}
function stop() {
  ts = -1;
}
function loop() {
  if (~ts) {
    nativeRaf(loop);
    raf.batchedUpdates(update);
  }
}
function update() {
  let prevTs = ts;
  ts = raf.now();
  let count = findTimeout(ts);
  if (count) {
    eachSafely(timeouts.splice(0, count), (t) => t.handler());
    pendingCount -= count;
  }
  if (!pendingCount) {
    stop();
    return;
  }
  onStartQueue.flush();
  updateQueue.flush(prevTs ? Math.min(64, ts - prevTs) : 16.667);
  onFrameQueue.flush();
  writeQueue.flush();
  onFinishQueue.flush();
}
function makeQueue() {
  let next = /* @__PURE__ */ new Set();
  let current = next;
  return {
    add(fn) {
      pendingCount += current == next && !next.has(fn) ? 1 : 0;
      next.add(fn);
    },
    delete(fn) {
      pendingCount -= current == next && next.has(fn) ? 1 : 0;
      return next.delete(fn);
    },
    flush(arg) {
      if (current.size) {
        next = /* @__PURE__ */ new Set();
        pendingCount -= current.size;
        eachSafely(current, (fn) => fn(arg) && next.add(fn));
        pendingCount += next.size;
        current = next;
      }
    }
  };
}
function eachSafely(values, each2) {
  values.forEach((value) => {
    try {
      each2(value);
    } catch (e) {
      raf.catch(e);
    }
  });
}
var updateQueue, raf, writeQueue, onStartQueue, onFrameQueue, onFinishQueue, timeouts, findTimeout, nativeRaf, ts, pendingCount, sync;
var init_react_spring_rafz_esm = __esm({
  "node_modules/@react-spring/rafz/dist/react-spring-rafz.esm.js"() {
    updateQueue = makeQueue();
    raf = (fn) => schedule(fn, updateQueue);
    writeQueue = makeQueue();
    raf.write = (fn) => schedule(fn, writeQueue);
    onStartQueue = makeQueue();
    raf.onStart = (fn) => schedule(fn, onStartQueue);
    onFrameQueue = makeQueue();
    raf.onFrame = (fn) => schedule(fn, onFrameQueue);
    onFinishQueue = makeQueue();
    raf.onFinish = (fn) => schedule(fn, onFinishQueue);
    timeouts = [];
    raf.setTimeout = (handler, ms) => {
      let time = raf.now() + ms;
      let cancel = () => {
        let i = timeouts.findIndex((t) => t.cancel == cancel);
        if (~i)
          timeouts.splice(i, 1);
        pendingCount -= ~i ? 1 : 0;
      };
      let timeout = {
        time,
        handler,
        cancel
      };
      timeouts.splice(findTimeout(time), 0, timeout);
      pendingCount += 1;
      start();
      return timeout;
    };
    findTimeout = (time) => ~(~timeouts.findIndex((t) => t.time > time) || ~timeouts.length);
    raf.cancel = (fn) => {
      onStartQueue.delete(fn);
      onFrameQueue.delete(fn);
      onFinishQueue.delete(fn);
      updateQueue.delete(fn);
      writeQueue.delete(fn);
    };
    raf.sync = (fn) => {
      sync = true;
      raf.batchedUpdates(fn);
      sync = false;
    };
    raf.throttle = (fn) => {
      let lastArgs;
      function queuedFn() {
        try {
          fn(...lastArgs);
        } finally {
          lastArgs = null;
        }
      }
      function throttled(...args) {
        lastArgs = args;
        raf.onStart(queuedFn);
      }
      throttled.handler = fn;
      throttled.cancel = () => {
        onStartQueue.delete(queuedFn);
        lastArgs = null;
      };
      return throttled;
    };
    nativeRaf = typeof window != "undefined" ? window.requestAnimationFrame : () => {
    };
    raf.use = (impl) => nativeRaf = impl;
    raf.now = typeof performance != "undefined" ? () => performance.now() : Date.now;
    raf.batchedUpdates = (fn) => fn();
    raf.catch = console.error;
    raf.frameLoop = "always";
    raf.advance = () => {
      if (raf.frameLoop !== "demand") {
        console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand");
      } else {
        update();
      }
    };
    ts = -1;
    pendingCount = 0;
    sync = false;
  }
});

// node_modules/@react-spring/shared/dist/react-spring-shared.esm.js
function noop() {
}
function isEqual(a, b) {
  if (is.arr(a)) {
    if (!is.arr(b) || a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i])
        return false;
    }
    return true;
  }
  return a === b;
}
function eachProp(obj, fn, ctx2) {
  if (is.arr(obj)) {
    for (let i = 0; i < obj.length; i++) {
      fn.call(ctx2, obj[i], `${i}`);
    }
    return;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn.call(ctx2, obj[key], key);
    }
  }
}
function flush(queue, iterator) {
  if (queue.size) {
    const items = Array.from(queue);
    queue.clear();
    each(items, iterator);
  }
}
function flushStartQueue() {
  startQueue.forEach(startSafely);
  startQueue.clear();
  raf(advance);
}
function startSafely(animation) {
  if (!currentFrame.includes(animation))
    startUnsafely(animation);
}
function startUnsafely(animation) {
  currentFrame.splice(findIndex(currentFrame, (other) => other.priority > animation.priority), 0, animation);
}
function advance(dt) {
  const nextFrame = prevFrame;
  for (let i = 0; i < currentFrame.length; i++) {
    const animation = currentFrame[i];
    priority = animation.priority;
    if (!animation.idle) {
      willAdvance(animation);
      animation.advance(dt);
      if (!animation.idle) {
        nextFrame.push(animation);
      }
    }
  }
  priority = 0;
  prevFrame = currentFrame;
  prevFrame.length = 0;
  currentFrame = nextFrame;
  return currentFrame.length > 0;
}
function findIndex(arr, test) {
  const index = arr.findIndex(test);
  return index < 0 ? arr.length : index;
}
function call(...parts) {
  return "\\(\\s*(" + parts.join(")\\s*,\\s*(") + ")\\s*\\)";
}
function normalizeColor(color) {
  let match;
  if (typeof color === "number") {
    return color >>> 0 === color && color >= 0 && color <= 4294967295 ? color : null;
  }
  if (match = hex6.exec(color))
    return parseInt(match[1] + "ff", 16) >>> 0;
  if (colors$1 && colors$1[color] !== void 0) {
    return colors$1[color];
  }
  if (match = rgb.exec(color)) {
    return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | 255) >>> 0;
  }
  if (match = rgba.exec(color)) {
    return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | parse1(match[4])) >>> 0;
  }
  if (match = hex3.exec(color)) {
    return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + "ff", 16) >>> 0;
  }
  if (match = hex8.exec(color))
    return parseInt(match[1], 16) >>> 0;
  if (match = hex4.exec(color)) {
    return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + match[4] + match[4], 16) >>> 0;
  }
  if (match = hsl.exec(color)) {
    return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | 255) >>> 0;
  }
  if (match = hsla.exec(color)) {
    return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | parse1(match[4])) >>> 0;
  }
  return null;
}
function hue2rgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslToRgb(h, s, l) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return Math.round(r * 255) << 24 | Math.round(g * 255) << 16 | Math.round(b * 255) << 8;
}
function parse255(str) {
  const int = parseInt(str, 10);
  if (int < 0)
    return 0;
  if (int > 255)
    return 255;
  return int;
}
function parse360(str) {
  const int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}
function parse1(str) {
  const num = parseFloat(str);
  if (num < 0)
    return 0;
  if (num > 1)
    return 255;
  return Math.round(num * 255);
}
function parsePercentage(str) {
  const int = parseFloat(str);
  if (int < 0)
    return 0;
  if (int > 100)
    return 1;
  return int / 100;
}
function colorToRgba(input) {
  let int32Color = normalizeColor(input);
  if (int32Color === null)
    return input;
  int32Color = int32Color || 0;
  let r = (int32Color & 4278190080) >>> 24;
  let g = (int32Color & 16711680) >>> 16;
  let b = (int32Color & 65280) >>> 8;
  let a = (int32Color & 255) / 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map) {
  let result = map ? map(input) : input;
  if (result < inputMin) {
    if (extrapolateLeft === "identity")
      return result;
    else if (extrapolateLeft === "clamp")
      result = inputMin;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity")
      return result;
    else if (extrapolateRight === "clamp")
      result = inputMax;
  }
  if (outputMin === outputMax)
    return outputMin;
  if (inputMin === inputMax)
    return input <= inputMin ? outputMin : outputMax;
  if (inputMin === -Infinity)
    result = -result;
  else if (inputMax === Infinity)
    result = result - inputMin;
  else
    result = (result - inputMin) / (inputMax - inputMin);
  result = easing(result);
  if (outputMin === -Infinity)
    result = -result;
  else if (outputMax === Infinity)
    result = result + outputMin;
  else
    result = result * (outputMax - outputMin) + outputMin;
  return result;
}
function findRange(input, inputRange) {
  for (var i = 1; i < inputRange.length - 1; ++i)
    if (inputRange[i] >= input)
      break;
  return i - 1;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function callFluidObserver(observer, event) {
  if (observer.eventObserved) {
    observer.eventObserved(event);
  } else {
    observer(event);
  }
}
function callFluidObservers(target, event) {
  let observers = target[$observers];
  if (observers) {
    observers.forEach((observer) => {
      callFluidObserver(observer, event);
    });
  }
}
function addFluidObserver(target, observer) {
  if (target[$get]) {
    let observers = target[$observers];
    if (!observers) {
      setHidden(target, $observers, observers = /* @__PURE__ */ new Set());
    }
    if (!observers.has(observer)) {
      observers.add(observer);
      if (target.observerAdded) {
        target.observerAdded(observers.size, observer);
      }
    }
  }
  return observer;
}
function removeFluidObserver(target, observer) {
  let observers = target[$observers];
  if (observers && observers.has(observer)) {
    const count = observers.size - 1;
    if (count) {
      observers.delete(observer);
    } else {
      target[$observers] = null;
    }
    if (target.observerRemoved) {
      target.observerRemoved(count, observer);
    }
  }
}
function deprecateInterpolate() {
  warnInterpolate(`${prefix}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
function deprecateDirectCall() {
  warnDirectCall(`${prefix}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function isAnimatedString(value) {
  return is.str(value) && (value[0] == "#" || /\d/.test(value) || !isSSR() && cssVariableRegex.test(value) || value in (colors$1 || {}));
}
function useForceUpdate() {
  const update3 = (0, import_react.useState)()[1];
  const isMounted = useIsMounted();
  return () => {
    if (isMounted.current) {
      update3(Math.random());
    }
  };
}
function useMemoOne(getResult, inputs) {
  const [initial] = (0, import_react.useState)(() => ({
    inputs,
    result: getResult()
  }));
  const committed = (0, import_react.useRef)();
  const prevCache = committed.current;
  let cache = prevCache;
  if (cache) {
    const useCache = Boolean(inputs && cache.inputs && areInputsEqual(inputs, cache.inputs));
    if (!useCache) {
      cache = {
        inputs,
        result: getResult()
      };
    }
  } else {
    cache = initial;
  }
  (0, import_react.useEffect)(() => {
    committed.current = cache;
    if (prevCache == initial) {
      initial.inputs = initial.result = void 0;
    }
  }, [cache]);
  return cache.result;
}
function areInputsEqual(next, prev) {
  if (next.length !== prev.length) {
    return false;
  }
  for (let i = 0; i < next.length; i++) {
    if (next[i] !== prev[i]) {
      return false;
    }
  }
  return true;
}
function usePrev(value) {
  const prevRef = (0, import_react.useRef)();
  (0, import_react.useEffect)(() => {
    prevRef.current = value;
  });
  return prevRef.current;
}
var import_react, defineHidden, is, each, toArray, flushCalls, isSSR, createStringInterpolator$1, to, colors$1, skipAnimation, willAdvance, assign, globals, startQueue, currentFrame, prevFrame, priority, frameLoop, colors, NUMBER, PERCENTAGE, rgb, rgba, hsl, hsla, hex3, hex4, hex6, hex8, createInterpolator, $get, $observers, hasFluidValue, getFluidValue, getFluidObservers, FluidValue, setFluidGetter, setHidden, numberRegex, colorRegex, unitRegex, rgbaRegex, cssVariableRegex, variableToRgba, parseCSSVariable, namedColorRegex, rgbaRound, createStringInterpolator, prefix, once, warnInterpolate, warnDirectCall, useIsomorphicLayoutEffect, useIsMounted, useOnce, emptyDeps, useReducedMotion;
var init_react_spring_shared_esm = __esm({
  "node_modules/@react-spring/shared/dist/react-spring-shared.esm.js"() {
    init_react_spring_rafz_esm();
    init_react_spring_rafz_esm();
    import_react = __toESM(require_react());
    defineHidden = (obj, key, value) => Object.defineProperty(obj, key, {
      value,
      writable: true,
      configurable: true
    });
    is = {
      arr: Array.isArray,
      obj: (a) => !!a && a.constructor.name === "Object",
      fun: (a) => typeof a === "function",
      str: (a) => typeof a === "string",
      num: (a) => typeof a === "number",
      und: (a) => a === void 0
    };
    each = (obj, fn) => obj.forEach(fn);
    toArray = (a) => is.und(a) ? [] : is.arr(a) ? a : [a];
    flushCalls = (queue, ...args) => flush(queue, (fn) => fn(...args));
    isSSR = () => typeof window === "undefined" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
    colors$1 = null;
    skipAnimation = false;
    willAdvance = noop;
    assign = (globals2) => {
      if (globals2.to)
        to = globals2.to;
      if (globals2.now)
        raf.now = globals2.now;
      if (globals2.colors !== void 0)
        colors$1 = globals2.colors;
      if (globals2.skipAnimation != null)
        skipAnimation = globals2.skipAnimation;
      if (globals2.createStringInterpolator)
        createStringInterpolator$1 = globals2.createStringInterpolator;
      if (globals2.requestAnimationFrame)
        raf.use(globals2.requestAnimationFrame);
      if (globals2.batchedUpdates)
        raf.batchedUpdates = globals2.batchedUpdates;
      if (globals2.willAdvance)
        willAdvance = globals2.willAdvance;
      if (globals2.frameLoop)
        raf.frameLoop = globals2.frameLoop;
    };
    globals = Object.freeze({
      __proto__: null,
      get createStringInterpolator() {
        return createStringInterpolator$1;
      },
      get to() {
        return to;
      },
      get colors() {
        return colors$1;
      },
      get skipAnimation() {
        return skipAnimation;
      },
      get willAdvance() {
        return willAdvance;
      },
      assign
    });
    startQueue = /* @__PURE__ */ new Set();
    currentFrame = [];
    prevFrame = [];
    priority = 0;
    frameLoop = {
      get idle() {
        return !startQueue.size && !currentFrame.length;
      },
      start(animation) {
        if (priority > animation.priority) {
          startQueue.add(animation);
          raf.onStart(flushStartQueue);
        } else {
          startSafely(animation);
          raf(advance);
        }
      },
      advance,
      sort(animation) {
        if (priority) {
          raf.onFrame(() => frameLoop.sort(animation));
        } else {
          const prevIndex = currentFrame.indexOf(animation);
          if (~prevIndex) {
            currentFrame.splice(prevIndex, 1);
            startUnsafely(animation);
          }
        }
      },
      clear() {
        currentFrame = [];
        startQueue.clear();
      }
    };
    colors = {
      transparent: 0,
      aliceblue: 4042850303,
      antiquewhite: 4209760255,
      aqua: 16777215,
      aquamarine: 2147472639,
      azure: 4043309055,
      beige: 4126530815,
      bisque: 4293182719,
      black: 255,
      blanchedalmond: 4293643775,
      blue: 65535,
      blueviolet: 2318131967,
      brown: 2771004159,
      burlywood: 3736635391,
      burntsienna: 3934150143,
      cadetblue: 1604231423,
      chartreuse: 2147418367,
      chocolate: 3530104575,
      coral: 4286533887,
      cornflowerblue: 1687547391,
      cornsilk: 4294499583,
      crimson: 3692313855,
      cyan: 16777215,
      darkblue: 35839,
      darkcyan: 9145343,
      darkgoldenrod: 3095792639,
      darkgray: 2846468607,
      darkgreen: 6553855,
      darkgrey: 2846468607,
      darkkhaki: 3182914559,
      darkmagenta: 2332068863,
      darkolivegreen: 1433087999,
      darkorange: 4287365375,
      darkorchid: 2570243327,
      darkred: 2332033279,
      darksalmon: 3918953215,
      darkseagreen: 2411499519,
      darkslateblue: 1211993087,
      darkslategray: 793726975,
      darkslategrey: 793726975,
      darkturquoise: 13554175,
      darkviolet: 2483082239,
      deeppink: 4279538687,
      deepskyblue: 12582911,
      dimgray: 1768516095,
      dimgrey: 1768516095,
      dodgerblue: 512819199,
      firebrick: 2988581631,
      floralwhite: 4294635775,
      forestgreen: 579543807,
      fuchsia: 4278255615,
      gainsboro: 3705462015,
      ghostwhite: 4177068031,
      gold: 4292280575,
      goldenrod: 3668254975,
      gray: 2155905279,
      green: 8388863,
      greenyellow: 2919182335,
      grey: 2155905279,
      honeydew: 4043305215,
      hotpink: 4285117695,
      indianred: 3445382399,
      indigo: 1258324735,
      ivory: 4294963455,
      khaki: 4041641215,
      lavender: 3873897215,
      lavenderblush: 4293981695,
      lawngreen: 2096890111,
      lemonchiffon: 4294626815,
      lightblue: 2916673279,
      lightcoral: 4034953471,
      lightcyan: 3774873599,
      lightgoldenrodyellow: 4210742015,
      lightgray: 3553874943,
      lightgreen: 2431553791,
      lightgrey: 3553874943,
      lightpink: 4290167295,
      lightsalmon: 4288707327,
      lightseagreen: 548580095,
      lightskyblue: 2278488831,
      lightslategray: 2005441023,
      lightslategrey: 2005441023,
      lightsteelblue: 2965692159,
      lightyellow: 4294959359,
      lime: 16711935,
      limegreen: 852308735,
      linen: 4210091775,
      magenta: 4278255615,
      maroon: 2147483903,
      mediumaquamarine: 1724754687,
      mediumblue: 52735,
      mediumorchid: 3126187007,
      mediumpurple: 2473647103,
      mediumseagreen: 1018393087,
      mediumslateblue: 2070474495,
      mediumspringgreen: 16423679,
      mediumturquoise: 1221709055,
      mediumvioletred: 3340076543,
      midnightblue: 421097727,
      mintcream: 4127193855,
      mistyrose: 4293190143,
      moccasin: 4293178879,
      navajowhite: 4292783615,
      navy: 33023,
      oldlace: 4260751103,
      olive: 2155872511,
      olivedrab: 1804477439,
      orange: 4289003775,
      orangered: 4282712319,
      orchid: 3664828159,
      palegoldenrod: 4008225535,
      palegreen: 2566625535,
      paleturquoise: 2951671551,
      palevioletred: 3681588223,
      papayawhip: 4293907967,
      peachpuff: 4292524543,
      peru: 3448061951,
      pink: 4290825215,
      plum: 3718307327,
      powderblue: 2967529215,
      purple: 2147516671,
      rebeccapurple: 1714657791,
      red: 4278190335,
      rosybrown: 3163525119,
      royalblue: 1097458175,
      saddlebrown: 2336560127,
      salmon: 4202722047,
      sandybrown: 4104413439,
      seagreen: 780883967,
      seashell: 4294307583,
      sienna: 2689740287,
      silver: 3233857791,
      skyblue: 2278484991,
      slateblue: 1784335871,
      slategray: 1887473919,
      slategrey: 1887473919,
      snow: 4294638335,
      springgreen: 16744447,
      steelblue: 1182971135,
      tan: 3535047935,
      teal: 8421631,
      thistle: 3636451583,
      tomato: 4284696575,
      turquoise: 1088475391,
      violet: 4001558271,
      wheat: 4125012991,
      white: 4294967295,
      whitesmoke: 4126537215,
      yellow: 4294902015,
      yellowgreen: 2597139199
    };
    NUMBER = "[-+]?\\d*\\.?\\d+";
    PERCENTAGE = NUMBER + "%";
    rgb = new RegExp("rgb" + call(NUMBER, NUMBER, NUMBER));
    rgba = new RegExp("rgba" + call(NUMBER, NUMBER, NUMBER, NUMBER));
    hsl = new RegExp("hsl" + call(NUMBER, PERCENTAGE, PERCENTAGE));
    hsla = new RegExp("hsla" + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
    hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
    hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
    hex6 = /^#([0-9a-fA-F]{6})$/;
    hex8 = /^#([0-9a-fA-F]{8})$/;
    createInterpolator = (range, output, extrapolate) => {
      if (is.fun(range)) {
        return range;
      }
      if (is.arr(range)) {
        return createInterpolator({
          range,
          output,
          extrapolate
        });
      }
      if (is.str(range.output[0])) {
        return createStringInterpolator$1(range);
      }
      const config2 = range;
      const outputRange = config2.output;
      const inputRange = config2.range || [0, 1];
      const extrapolateLeft = config2.extrapolateLeft || config2.extrapolate || "extend";
      const extrapolateRight = config2.extrapolateRight || config2.extrapolate || "extend";
      const easing = config2.easing || ((t) => t);
      return (input) => {
        const range2 = findRange(input, inputRange);
        return interpolate(input, inputRange[range2], inputRange[range2 + 1], outputRange[range2], outputRange[range2 + 1], easing, extrapolateLeft, extrapolateRight, config2.map);
      };
    };
    $get = Symbol.for("FluidValue.get");
    $observers = Symbol.for("FluidValue.observers");
    hasFluidValue = (arg) => Boolean(arg && arg[$get]);
    getFluidValue = (arg) => arg && arg[$get] ? arg[$get]() : arg;
    getFluidObservers = (target) => target[$observers] || null;
    FluidValue = class {
      constructor(get) {
        this[$get] = void 0;
        this[$observers] = void 0;
        if (!get && !(get = this.get)) {
          throw Error("Unknown getter");
        }
        setFluidGetter(this, get);
      }
    };
    setFluidGetter = (target, get) => setHidden(target, $get, get);
    setHidden = (target, key, value) => Object.defineProperty(target, key, {
      value,
      writable: true,
      configurable: true
    });
    numberRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
    unitRegex = new RegExp(`(${numberRegex.source})(%|[a-z]+)`, "i");
    rgbaRegex = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi;
    cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
    variableToRgba = (input) => {
      const [token, fallback] = parseCSSVariable(input);
      if (!token || isSSR()) {
        return input;
      }
      const value = window.getComputedStyle(document.documentElement).getPropertyValue(token);
      if (value) {
        return value.trim();
      } else if (fallback && fallback.startsWith("--")) {
        const _value = window.getComputedStyle(document.documentElement).getPropertyValue(fallback);
        if (_value) {
          return _value;
        } else {
          return input;
        }
      } else if (fallback && cssVariableRegex.test(fallback)) {
        return variableToRgba(fallback);
      } else if (fallback) {
        return fallback;
      }
      return input;
    };
    parseCSSVariable = (current) => {
      const match = cssVariableRegex.exec(current);
      if (!match)
        return [,];
      const [, token, fallback] = match;
      return [token, fallback];
    };
    rgbaRound = (_, p1, p2, p3, p4) => `rgba(${Math.round(p1)}, ${Math.round(p2)}, ${Math.round(p3)}, ${p4})`;
    createStringInterpolator = (config2) => {
      if (!namedColorRegex)
        namedColorRegex = colors$1 ? new RegExp(`(${Object.keys(colors$1).join("|")})(?!\\w)`, "g") : /^\b$/;
      const output = config2.output.map((value) => {
        return getFluidValue(value).replace(cssVariableRegex, variableToRgba).replace(colorRegex, colorToRgba).replace(namedColorRegex, colorToRgba);
      });
      const keyframes = output.map((value) => value.match(numberRegex).map(Number));
      const outputRanges = keyframes[0].map((_, i) => keyframes.map((values) => {
        if (!(i in values)) {
          throw Error('The arity of each "output" value must be equal');
        }
        return values[i];
      }));
      const interpolators = outputRanges.map((output2) => createInterpolator(_extends({}, config2, {
        output: output2
      })));
      return (input) => {
        var _output$find;
        const missingUnit = !unitRegex.test(output[0]) && ((_output$find = output.find((value) => unitRegex.test(value))) == null ? void 0 : _output$find.replace(numberRegex, ""));
        let i = 0;
        return output[0].replace(numberRegex, () => `${interpolators[i++](input)}${missingUnit || ""}`).replace(rgbaRegex, rgbaRound);
      };
    };
    prefix = "react-spring: ";
    once = (fn) => {
      const func = fn;
      let called = false;
      if (typeof func != "function") {
        throw new TypeError(`${prefix}once requires a function parameter`);
      }
      return (...args) => {
        if (!called) {
          func(...args);
          called = true;
        }
      };
    };
    warnInterpolate = once(console.warn);
    warnDirectCall = once(console.warn);
    useIsomorphicLayoutEffect = isSSR() ? import_react.useEffect : import_react.useLayoutEffect;
    useIsMounted = () => {
      const isMounted = (0, import_react.useRef)(false);
      useIsomorphicLayoutEffect(() => {
        isMounted.current = true;
        return () => {
          isMounted.current = false;
        };
      }, []);
      return isMounted;
    };
    useOnce = (effect) => (0, import_react.useEffect)(effect, emptyDeps);
    emptyDeps = [];
    useReducedMotion = () => {
      const [reducedMotion, setReducedMotion] = (0, import_react.useState)(null);
      useIsomorphicLayoutEffect(() => {
        const mql = window.matchMedia("(prefers-reduced-motion)");
        const handleMediaChange = (e) => {
          setReducedMotion(e.matches);
          assign({
            skipAnimation: e.matches
          });
        };
        handleMediaChange(mql);
        mql.addEventListener("change", handleMediaChange);
        return () => {
          mql.removeEventListener("change", handleMediaChange);
        };
      }, []);
      return reducedMotion;
    };
  }
});

// node_modules/@react-spring/animated/dist/react-spring-animated.esm.js
function makeAnimated(value) {
  const nodeType = isAnimatedString(value) ? AnimatedString : AnimatedValue;
  return nodeType.create(value);
}
function getAnimatedType(value) {
  const parentNode = getAnimated(value);
  return parentNode ? parentNode.constructor : is.arr(value) ? AnimatedArray : isAnimatedString(value) ? AnimatedString : AnimatedValue;
}
function _extends2() {
  _extends2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends2.apply(this, arguments);
}
function getAnimatedState(props, host2) {
  const dependencies = /* @__PURE__ */ new Set();
  TreeContext.dependencies = dependencies;
  if (props.style)
    props = _extends2({}, props, {
      style: host2.createAnimatedStyle(props.style)
    });
  props = new AnimatedObject(props);
  TreeContext.dependencies = null;
  return [props, dependencies];
}
function updateRef(ref, value) {
  if (ref) {
    if (is.fun(ref))
      ref(value);
    else
      ref.current = value;
  }
  return value;
}
var React, import_react2, $node, isAnimated, getAnimated, setAnimated, getPayload, Animated, AnimatedValue, AnimatedString, TreeContext, AnimatedObject, AnimatedArray, withAnimated, PropsObserver, cacheKey, createHost, getDisplayName;
var init_react_spring_animated_esm = __esm({
  "node_modules/@react-spring/animated/dist/react-spring-animated.esm.js"() {
    init_react_spring_shared_esm();
    React = __toESM(require_react());
    import_react2 = __toESM(require_react());
    $node = Symbol.for("Animated:node");
    isAnimated = (value) => !!value && value[$node] === value;
    getAnimated = (owner) => owner && owner[$node];
    setAnimated = (owner, node) => defineHidden(owner, $node, node);
    getPayload = (owner) => owner && owner[$node] && owner[$node].getPayload();
    Animated = class {
      constructor() {
        this.payload = void 0;
        setAnimated(this, this);
      }
      getPayload() {
        return this.payload || [];
      }
    };
    AnimatedValue = class extends Animated {
      constructor(_value) {
        super();
        this.done = true;
        this.elapsedTime = void 0;
        this.lastPosition = void 0;
        this.lastVelocity = void 0;
        this.v0 = void 0;
        this.durationProgress = 0;
        this._value = _value;
        if (is.num(this._value)) {
          this.lastPosition = this._value;
        }
      }
      static create(value) {
        return new AnimatedValue(value);
      }
      getPayload() {
        return [this];
      }
      getValue() {
        return this._value;
      }
      setValue(value, step) {
        if (is.num(value)) {
          this.lastPosition = value;
          if (step) {
            value = Math.round(value / step) * step;
            if (this.done) {
              this.lastPosition = value;
            }
          }
        }
        if (this._value === value) {
          return false;
        }
        this._value = value;
        return true;
      }
      reset() {
        const {
          done
        } = this;
        this.done = false;
        if (is.num(this._value)) {
          this.elapsedTime = 0;
          this.durationProgress = 0;
          this.lastPosition = this._value;
          if (done)
            this.lastVelocity = null;
          this.v0 = null;
        }
      }
    };
    AnimatedString = class extends AnimatedValue {
      constructor(value) {
        super(0);
        this._string = null;
        this._toString = void 0;
        this._toString = createInterpolator({
          output: [value, value]
        });
      }
      static create(value) {
        return new AnimatedString(value);
      }
      getValue() {
        let value = this._string;
        return value == null ? this._string = this._toString(this._value) : value;
      }
      setValue(value) {
        if (is.str(value)) {
          if (value == this._string) {
            return false;
          }
          this._string = value;
          this._value = 1;
        } else if (super.setValue(value)) {
          this._string = null;
        } else {
          return false;
        }
        return true;
      }
      reset(goal) {
        if (goal) {
          this._toString = createInterpolator({
            output: [this.getValue(), goal]
          });
        }
        this._value = 0;
        super.reset();
      }
    };
    TreeContext = {
      dependencies: null
    };
    AnimatedObject = class extends Animated {
      constructor(source) {
        super();
        this.source = source;
        this.setValue(source);
      }
      getValue(animated2) {
        const values = {};
        eachProp(this.source, (source, key) => {
          if (isAnimated(source)) {
            values[key] = source.getValue(animated2);
          } else if (hasFluidValue(source)) {
            values[key] = getFluidValue(source);
          } else if (!animated2) {
            values[key] = source;
          }
        });
        return values;
      }
      setValue(source) {
        this.source = source;
        this.payload = this._makePayload(source);
      }
      reset() {
        if (this.payload) {
          each(this.payload, (node) => node.reset());
        }
      }
      _makePayload(source) {
        if (source) {
          const payload = /* @__PURE__ */ new Set();
          eachProp(source, this._addToPayload, payload);
          return Array.from(payload);
        }
      }
      _addToPayload(source) {
        if (TreeContext.dependencies && hasFluidValue(source)) {
          TreeContext.dependencies.add(source);
        }
        const payload = getPayload(source);
        if (payload) {
          each(payload, (node) => this.add(node));
        }
      }
    };
    AnimatedArray = class extends AnimatedObject {
      constructor(source) {
        super(source);
      }
      static create(source) {
        return new AnimatedArray(source);
      }
      getValue() {
        return this.source.map((node) => node.getValue());
      }
      setValue(source) {
        const payload = this.getPayload();
        if (source.length == payload.length) {
          return payload.map((node, i) => node.setValue(source[i])).some(Boolean);
        }
        super.setValue(source.map(makeAnimated));
        return true;
      }
    };
    withAnimated = (Component, host2) => {
      const hasInstance = !is.fun(Component) || Component.prototype && Component.prototype.isReactComponent;
      return (0, import_react2.forwardRef)((givenProps, givenRef) => {
        const instanceRef = (0, import_react2.useRef)(null);
        const ref = hasInstance && (0, import_react2.useCallback)((value) => {
          instanceRef.current = updateRef(givenRef, value);
        }, [givenRef]);
        const [props, deps] = getAnimatedState(givenProps, host2);
        const forceUpdate = useForceUpdate();
        const callback = () => {
          const instance = instanceRef.current;
          if (hasInstance && !instance) {
            return;
          }
          const didUpdate = instance ? host2.applyAnimatedValues(instance, props.getValue(true)) : false;
          if (didUpdate === false) {
            forceUpdate();
          }
        };
        const observer = new PropsObserver(callback, deps);
        const observerRef = (0, import_react2.useRef)();
        useIsomorphicLayoutEffect(() => {
          observerRef.current = observer;
          each(deps, (dep) => addFluidObserver(dep, observer));
          return () => {
            if (observerRef.current) {
              each(observerRef.current.deps, (dep) => removeFluidObserver(dep, observerRef.current));
              raf.cancel(observerRef.current.update);
            }
          };
        });
        (0, import_react2.useEffect)(callback, []);
        useOnce(() => () => {
          const observer2 = observerRef.current;
          each(observer2.deps, (dep) => removeFluidObserver(dep, observer2));
        });
        const usedProps = host2.getComponentProps(props.getValue());
        return React.createElement(Component, _extends2({}, usedProps, {
          ref
        }));
      });
    };
    PropsObserver = class {
      constructor(update3, deps) {
        this.update = update3;
        this.deps = deps;
      }
      eventObserved(event) {
        if (event.type == "change") {
          raf.write(this.update);
        }
      }
    };
    cacheKey = Symbol.for("AnimatedComponent");
    createHost = (components, {
      applyAnimatedValues: _applyAnimatedValues = () => false,
      createAnimatedStyle: _createAnimatedStyle = (style) => new AnimatedObject(style),
      getComponentProps: _getComponentProps = (props) => props
    } = {}) => {
      const hostConfig = {
        applyAnimatedValues: _applyAnimatedValues,
        createAnimatedStyle: _createAnimatedStyle,
        getComponentProps: _getComponentProps
      };
      const animated2 = (Component) => {
        const displayName = getDisplayName(Component) || "Anonymous";
        if (is.str(Component)) {
          Component = animated2[Component] || (animated2[Component] = withAnimated(Component, hostConfig));
        } else {
          Component = Component[cacheKey] || (Component[cacheKey] = withAnimated(Component, hostConfig));
        }
        Component.displayName = `Animated(${displayName})`;
        return Component;
      };
      eachProp(components, (Component, key) => {
        if (is.arr(components)) {
          key = getDisplayName(Component);
        }
        animated2[key] = animated2(Component);
      });
      return {
        animated: animated2
      };
    };
    getDisplayName = (arg) => is.str(arg) ? arg : arg && is.str(arg.displayName) ? arg.displayName : is.fun(arg) && arg.name || null;
  }
});

// node_modules/@react-spring/types/animated.js
var init_animated = __esm({
  "node_modules/@react-spring/types/animated.js"() {
  }
});

// node_modules/@react-spring/types/interpolation.js
var init_interpolation = __esm({
  "node_modules/@react-spring/types/interpolation.js"() {
  }
});

// node_modules/@react-spring/core/dist/react-spring-core.esm.js
function _extends3() {
  _extends3 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends3.apply(this, arguments);
}
function callProp(value, ...args) {
  return is.fun(value) ? value(...args) : value;
}
function getForwardProps(props) {
  const forward = {};
  let count = 0;
  eachProp(props, (value, prop) => {
    if (!RESERVED_PROPS[prop]) {
      forward[prop] = value;
      count++;
    }
  });
  if (count) {
    return forward;
  }
}
function inferTo(props) {
  const to3 = getForwardProps(props);
  if (to3) {
    const out = {
      to: to3
    };
    eachProp(props, (val, key) => key in to3 || (out[key] = val));
    return out;
  }
  return _extends3({}, props);
}
function computeGoal(value) {
  value = getFluidValue(value);
  return is.arr(value) ? value.map(computeGoal) : isAnimatedString(value) ? globals.createStringInterpolator({
    range: [0, 1],
    output: [value, value]
  })(1) : value;
}
function hasProps(props) {
  for (const _ in props)
    return true;
  return false;
}
function isAsyncTo(to3) {
  return is.fun(to3) || is.arr(to3) && is.obj(to3[0]);
}
function detachRefs(ctrl, ref) {
  var _ctrl$ref;
  (_ctrl$ref = ctrl.ref) == null ? void 0 : _ctrl$ref.delete(ctrl);
  ref == null ? void 0 : ref.delete(ctrl);
}
function replaceRef(ctrl, ref) {
  if (ref && ctrl.ref !== ref) {
    var _ctrl$ref2;
    (_ctrl$ref2 = ctrl.ref) == null ? void 0 : _ctrl$ref2.delete(ctrl);
    ref.add(ctrl);
    ctrl.ref = ref;
  }
}
function useChain(refs, timeSteps, timeFrame = 1e3) {
  useIsomorphicLayoutEffect(() => {
    if (timeSteps) {
      let prevDelay = 0;
      each(refs, (ref, i) => {
        const controllers = ref.current;
        if (controllers.length) {
          let delay = timeFrame * timeSteps[i];
          if (isNaN(delay))
            delay = prevDelay;
          else
            prevDelay = delay;
          each(controllers, (ctrl) => {
            each(ctrl.queue, (props) => {
              const memoizedDelayProp = props.delay;
              props.delay = (key) => delay + callProp(memoizedDelayProp || 0, key);
            });
          });
          ref.start();
        }
      });
    } else {
      let p = Promise.resolve();
      each(refs, (ref) => {
        const controllers = ref.current;
        if (controllers.length) {
          const queues = controllers.map((ctrl) => {
            const q = ctrl.queue;
            ctrl.queue = [];
            return q;
          });
          p = p.then(() => {
            each(controllers, (ctrl, i) => each(queues[i] || [], (update3) => ctrl.queue.push(update3)));
            return Promise.all(ref.start());
          });
        }
      });
    }
  });
}
function mergeConfig(config2, newConfig, defaultConfig) {
  if (defaultConfig) {
    defaultConfig = _extends3({}, defaultConfig);
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = _extends3({}, defaultConfig, newConfig);
  }
  sanitizeConfig(config2, newConfig);
  Object.assign(config2, newConfig);
  for (const key in defaults) {
    if (config2[key] == null) {
      config2[key] = defaults[key];
    }
  }
  let {
    mass,
    frequency,
    damping
  } = config2;
  if (!is.und(frequency)) {
    if (frequency < 0.01)
      frequency = 0.01;
    if (damping < 0)
      damping = 0;
    config2.tension = Math.pow(2 * Math.PI / frequency, 2) * mass;
    config2.friction = 4 * Math.PI * damping * mass / frequency;
  }
  return config2;
}
function sanitizeConfig(config2, props) {
  if (!is.und(props.decay)) {
    config2.duration = void 0;
  } else {
    const isTensionConfig = !is.und(props.tension) || !is.und(props.friction);
    if (isTensionConfig || !is.und(props.frequency) || !is.und(props.damping) || !is.und(props.mass)) {
      config2.duration = void 0;
      config2.decay = void 0;
    }
    if (isTensionConfig) {
      config2.frequency = void 0;
    }
  }
}
function scheduleProps(callId, {
  key,
  props,
  defaultProps,
  state,
  actions
}) {
  return new Promise((resolve, reject) => {
    var _props$cancel;
    let delay;
    let timeout;
    let cancel = matchProp((_props$cancel = props.cancel) != null ? _props$cancel : defaultProps == null ? void 0 : defaultProps.cancel, key);
    if (cancel) {
      onStart();
    } else {
      if (!is.und(props.pause)) {
        state.paused = matchProp(props.pause, key);
      }
      let pause = defaultProps == null ? void 0 : defaultProps.pause;
      if (pause !== true) {
        pause = state.paused || matchProp(pause, key);
      }
      delay = callProp(props.delay || 0, key);
      if (pause) {
        state.resumeQueue.add(onResume);
        actions.pause();
      } else {
        actions.resume();
        onResume();
      }
    }
    function onPause() {
      state.resumeQueue.add(onResume);
      state.timeouts.delete(timeout);
      timeout.cancel();
      delay = timeout.time - raf.now();
    }
    function onResume() {
      if (delay > 0 && !globals.skipAnimation) {
        state.delayed = true;
        timeout = raf.setTimeout(onStart, delay);
        state.pauseQueue.add(onPause);
        state.timeouts.add(timeout);
      } else {
        onStart();
      }
    }
    function onStart() {
      if (state.delayed) {
        state.delayed = false;
      }
      state.pauseQueue.delete(onPause);
      state.timeouts.delete(timeout);
      if (callId <= (state.cancelId || 0)) {
        cancel = true;
      }
      try {
        actions.start(_extends3({}, props, {
          callId,
          cancel
        }), resolve);
      } catch (err) {
        reject(err);
      }
    }
  });
}
function runAsync(to3, props, state, target) {
  const {
    callId,
    parentId,
    onRest
  } = props;
  const {
    asyncTo: prevTo,
    promise: prevPromise
  } = state;
  if (!parentId && to3 === prevTo && !props.reset) {
    return prevPromise;
  }
  return state.promise = (async () => {
    state.asyncId = callId;
    state.asyncTo = to3;
    const defaultProps = getDefaultProps(props, (value, key) => key === "onRest" ? void 0 : value);
    let preventBail;
    let bail;
    const bailPromise = new Promise((resolve, reject) => (preventBail = resolve, bail = reject));
    const bailIfEnded = (bailSignal) => {
      const bailResult = callId <= (state.cancelId || 0) && getCancelledResult(target) || callId !== state.asyncId && getFinishedResult(target, false);
      if (bailResult) {
        bailSignal.result = bailResult;
        bail(bailSignal);
        throw bailSignal;
      }
    };
    const animate = (arg1, arg2) => {
      const bailSignal = new BailSignal();
      const skipAnimationSignal = new SkipAniamtionSignal();
      return (async () => {
        if (globals.skipAnimation) {
          stopAsync(state);
          skipAnimationSignal.result = getFinishedResult(target, false);
          bail(skipAnimationSignal);
          throw skipAnimationSignal;
        }
        bailIfEnded(bailSignal);
        const props2 = is.obj(arg1) ? _extends3({}, arg1) : _extends3({}, arg2, {
          to: arg1
        });
        props2.parentId = callId;
        eachProp(defaultProps, (value, key) => {
          if (is.und(props2[key])) {
            props2[key] = value;
          }
        });
        const result2 = await target.start(props2);
        bailIfEnded(bailSignal);
        if (state.paused) {
          await new Promise((resume) => {
            state.resumeQueue.add(resume);
          });
        }
        return result2;
      })();
    };
    let result;
    if (globals.skipAnimation) {
      stopAsync(state);
      return getFinishedResult(target, false);
    }
    try {
      let animating;
      if (is.arr(to3)) {
        animating = (async (queue) => {
          for (const props2 of queue) {
            await animate(props2);
          }
        })(to3);
      } else {
        animating = Promise.resolve(to3(animate, target.stop.bind(target)));
      }
      await Promise.all([animating.then(preventBail), bailPromise]);
      result = getFinishedResult(target.get(), true, false);
    } catch (err) {
      if (err instanceof BailSignal) {
        result = err.result;
      } else if (err instanceof SkipAniamtionSignal) {
        result = err.result;
      } else {
        throw err;
      }
    } finally {
      if (callId == state.asyncId) {
        state.asyncId = parentId;
        state.asyncTo = parentId ? prevTo : void 0;
        state.promise = parentId ? prevPromise : void 0;
      }
    }
    if (is.fun(onRest)) {
      raf.batchedUpdates(() => {
        onRest(result, target, target.item);
      });
    }
    return result;
  })();
}
function stopAsync(state, cancelId) {
  flush(state.timeouts, (t) => t.cancel());
  state.pauseQueue.clear();
  state.resumeQueue.clear();
  state.asyncId = state.asyncTo = state.promise = void 0;
  if (cancelId)
    state.cancelId = cancelId;
}
function checkFinished(target, to3) {
  const goal = computeGoal(to3);
  const value = computeGoal(target.get());
  return isEqual(value, goal);
}
function createLoopUpdate(props, loop2 = props.loop, to3 = props.to) {
  let loopRet = callProp(loop2);
  if (loopRet) {
    const overrides = loopRet !== true && inferTo(loopRet);
    const reverse = (overrides || props).reverse;
    const reset = !overrides || overrides.reset;
    return createUpdate(_extends3({}, props, {
      loop: loop2,
      default: false,
      pause: void 0,
      to: !reverse || isAsyncTo(to3) ? to3 : void 0,
      from: reset ? props.from : void 0,
      reset
    }, overrides));
  }
}
function createUpdate(props) {
  const {
    to: to3,
    from
  } = props = inferTo(props);
  const keys = /* @__PURE__ */ new Set();
  if (is.obj(to3))
    findDefined(to3, keys);
  if (is.obj(from))
    findDefined(from, keys);
  props.keys = keys.size ? Array.from(keys) : null;
  return props;
}
function declareUpdate(props) {
  const update3 = createUpdate(props);
  if (is.und(update3.default)) {
    update3.default = getDefaultProps(update3);
  }
  return update3;
}
function findDefined(values, keys) {
  eachProp(values, (value, key) => value != null && keys.add(key));
}
function mergeActiveFn(target, props, type) {
  target.animation[type] = props[type] !== getDefaultProp(props, type) ? resolveProp(props[type], target.key) : void 0;
}
function sendEvent(target, type, ...args) {
  var _target$animation$typ, _target$animation, _target$defaultProps$, _target$defaultProps;
  (_target$animation$typ = (_target$animation = target.animation)[type]) == null ? void 0 : _target$animation$typ.call(_target$animation, ...args);
  (_target$defaultProps$ = (_target$defaultProps = target.defaultProps)[type]) == null ? void 0 : _target$defaultProps$.call(_target$defaultProps, ...args);
}
function flushUpdateQueue(ctrl, queue) {
  return Promise.all(queue.map((props) => flushUpdate(ctrl, props))).then((results) => getCombinedResult(ctrl, results));
}
async function flushUpdate(ctrl, props, isLoop) {
  const {
    keys,
    to: to3,
    from,
    loop: loop2,
    onRest,
    onResolve
  } = props;
  const defaults2 = is.obj(props.default) && props.default;
  if (loop2) {
    props.loop = false;
  }
  if (to3 === false)
    props.to = null;
  if (from === false)
    props.from = null;
  const asyncTo = is.arr(to3) || is.fun(to3) ? to3 : void 0;
  if (asyncTo) {
    props.to = void 0;
    props.onRest = void 0;
    if (defaults2) {
      defaults2.onRest = void 0;
    }
  } else {
    each(BATCHED_EVENTS, (key) => {
      const handler = props[key];
      if (is.fun(handler)) {
        const queue = ctrl["_events"][key];
        props[key] = ({
          finished,
          cancelled
        }) => {
          const result2 = queue.get(handler);
          if (result2) {
            if (!finished)
              result2.finished = false;
            if (cancelled)
              result2.cancelled = true;
          } else {
            queue.set(handler, {
              value: null,
              finished: finished || false,
              cancelled: cancelled || false
            });
          }
        };
        if (defaults2) {
          defaults2[key] = props[key];
        }
      }
    });
  }
  const state = ctrl["_state"];
  if (props.pause === !state.paused) {
    state.paused = props.pause;
    flushCalls(props.pause ? state.pauseQueue : state.resumeQueue);
  } else if (state.paused) {
    props.pause = true;
  }
  const promises = (keys || Object.keys(ctrl.springs)).map((key) => ctrl.springs[key].start(props));
  const cancel = props.cancel === true || getDefaultProp(props, "cancel") === true;
  if (asyncTo || cancel && state.asyncId) {
    promises.push(scheduleProps(++ctrl["_lastAsyncId"], {
      props,
      state,
      actions: {
        pause: noop,
        resume: noop,
        start(props2, resolve) {
          if (cancel) {
            stopAsync(state, ctrl["_lastAsyncId"]);
            resolve(getCancelledResult(ctrl));
          } else {
            props2.onRest = onRest;
            resolve(runAsync(asyncTo, props2, state, ctrl));
          }
        }
      }
    }));
  }
  if (state.paused) {
    await new Promise((resume) => {
      state.resumeQueue.add(resume);
    });
  }
  const result = getCombinedResult(ctrl, await Promise.all(promises));
  if (loop2 && result.finished && !(isLoop && result.noop)) {
    const nextProps = createLoopUpdate(props, loop2, to3);
    if (nextProps) {
      prepareKeys(ctrl, [nextProps]);
      return flushUpdate(ctrl, nextProps, true);
    }
  }
  if (onResolve) {
    raf.batchedUpdates(() => onResolve(result, ctrl, ctrl.item));
  }
  return result;
}
function getSprings(ctrl, props) {
  const springs = _extends3({}, ctrl.springs);
  if (props) {
    each(toArray(props), (props2) => {
      if (is.und(props2.keys)) {
        props2 = createUpdate(props2);
      }
      if (!is.obj(props2.to)) {
        props2 = _extends3({}, props2, {
          to: void 0
        });
      }
      prepareSprings(springs, props2, (key) => {
        return createSpring(key);
      });
    });
  }
  setSprings(ctrl, springs);
  return springs;
}
function setSprings(ctrl, springs) {
  eachProp(springs, (spring, key) => {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      addFluidObserver(spring, ctrl);
    }
  });
}
function createSpring(key, observer) {
  const spring = new SpringValue();
  spring.key = key;
  if (observer) {
    addFluidObserver(spring, observer);
  }
  return spring;
}
function prepareSprings(springs, props, create) {
  if (props.keys) {
    each(props.keys, (key) => {
      const spring = springs[key] || (springs[key] = create(key));
      spring["_prepareNode"](props);
    });
  }
}
function prepareKeys(ctrl, queue) {
  each(queue, (props) => {
    prepareSprings(ctrl.springs, props, (key) => {
      return createSpring(key, ctrl);
    });
  });
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function makeContext(target, init) {
  Object.assign(target, React2.createContext(init));
  target.Provider._context = target;
  target.Consumer._context = target;
  return target;
}
function useSprings(length, props, deps) {
  const propsFn = is.fun(props) && props;
  if (propsFn && !deps)
    deps = [];
  const ref = (0, import_react3.useMemo)(() => propsFn || arguments.length == 3 ? SpringRef() : void 0, []);
  const layoutId = (0, import_react3.useRef)(0);
  const forceUpdate = useForceUpdate();
  const state = (0, import_react3.useMemo)(() => ({
    ctrls: [],
    queue: [],
    flush(ctrl, updates2) {
      const springs2 = getSprings(ctrl, updates2);
      const canFlushSync = layoutId.current > 0 && !state.queue.length && !Object.keys(springs2).some((key) => !ctrl.springs[key]);
      return canFlushSync ? flushUpdateQueue(ctrl, updates2) : new Promise((resolve) => {
        setSprings(ctrl, springs2);
        state.queue.push(() => {
          resolve(flushUpdateQueue(ctrl, updates2));
        });
        forceUpdate();
      });
    }
  }), []);
  const ctrls = (0, import_react3.useRef)([...state.ctrls]);
  const updates = [];
  const prevLength = usePrev(length) || 0;
  (0, import_react3.useMemo)(() => {
    each(ctrls.current.slice(length, prevLength), (ctrl) => {
      detachRefs(ctrl, ref);
      ctrl.stop(true);
    });
    ctrls.current.length = length;
    declareUpdates(prevLength, length);
  }, [length]);
  (0, import_react3.useMemo)(() => {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);
  function declareUpdates(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      const ctrl = ctrls.current[i] || (ctrls.current[i] = new Controller(null, state.flush));
      const update3 = propsFn ? propsFn(i, ctrl) : props[i];
      if (update3) {
        updates[i] = declareUpdate(update3);
      }
    }
  }
  const springs = ctrls.current.map((ctrl, i) => getSprings(ctrl, updates[i]));
  const context = (0, import_react3.useContext)(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useIsomorphicLayoutEffect(() => {
    layoutId.current++;
    state.ctrls = ctrls.current;
    const {
      queue
    } = state;
    if (queue.length) {
      state.queue = [];
      each(queue, (cb) => cb());
    }
    each(ctrls.current, (ctrl, i) => {
      ref == null ? void 0 : ref.add(ctrl);
      if (hasContext) {
        ctrl.start({
          default: context
        });
      }
      const update3 = updates[i];
      if (update3) {
        replaceRef(ctrl, update3.ref);
        if (ctrl.ref) {
          ctrl.queue.push(update3);
        } else {
          ctrl.start(update3);
        }
      }
    });
  });
  useOnce(() => () => {
    each(state.ctrls, (ctrl) => ctrl.stop(true));
  });
  const values = springs.map((x) => _extends3({}, x));
  return ref ? [values, ref] : values;
}
function useSpring(props, deps) {
  const isFn = is.fun(props);
  const [[values], ref] = useSprings(1, isFn ? props : [props], isFn ? deps || [] : deps);
  return isFn || arguments.length == 2 ? [values, ref] : values;
}
function useTrail(length, propsArg, deps) {
  var _passedRef;
  const propsFn = is.fun(propsArg) && propsArg;
  if (propsFn && !deps)
    deps = [];
  let reverse = true;
  let passedRef = void 0;
  const result = useSprings(length, (i, ctrl) => {
    const props = propsFn ? propsFn(i, ctrl) : propsArg;
    passedRef = props.ref;
    reverse = reverse && props.reverse;
    return props;
  }, deps || [{}]);
  const ref = (_passedRef = passedRef) != null ? _passedRef : result[1];
  useIsomorphicLayoutEffect(() => {
    each(ref.current, (ctrl, i) => {
      const parent = ref.current[i + (reverse ? 1 : -1)];
      if (parent) {
        ctrl.start({
          to: parent.springs
        });
      } else {
        ctrl.start();
      }
    });
  }, deps);
  if (propsFn || arguments.length == 3) {
    ref["_getProps"] = (propsArg2, ctrl, i) => {
      const props = is.fun(propsArg2) ? propsArg2(i, ctrl) : propsArg2;
      if (props) {
        const parent = ref.current[i + (props.reverse ? 1 : -1)];
        if (parent)
          props.to = parent.springs;
        return props;
      }
    };
    return result;
  }
  ref["start"] = (propsArg2) => {
    const results = [];
    each(ref.current, (ctrl, i) => {
      const props = is.fun(propsArg2) ? propsArg2(i, ctrl) : propsArg2;
      const parent = ref.current[i + (reverse ? 1 : -1)];
      if (parent) {
        results.push(ctrl.start(_extends3({}, props, {
          to: parent.springs
        })));
      } else {
        results.push(ctrl.start(_extends3({}, props)));
      }
    });
    return results;
  };
  return result[0];
}
function useTransition(data, props, deps) {
  const propsFn = is.fun(props) && props;
  const {
    reset,
    sort,
    trail = 0,
    expires = true,
    exitBeforeEnter = false,
    onDestroyed,
    ref: propsRef,
    config: propsConfig
  } = propsFn ? propsFn() : props;
  const ref = (0, import_react3.useMemo)(() => propsFn || arguments.length == 3 ? SpringRef() : void 0, []);
  const items = toArray(data);
  const transitions = [];
  const usedTransitions = (0, import_react3.useRef)(null);
  const prevTransitions = reset ? null : usedTransitions.current;
  useIsomorphicLayoutEffect(() => {
    usedTransitions.current = transitions;
  });
  useOnce(() => {
    each(transitions, (t) => {
      ref == null ? void 0 : ref.add(t.ctrl);
      t.ctrl.ref = ref;
    });
    return () => {
      each(usedTransitions.current, (t) => {
        if (t.expired) {
          clearTimeout(t.expirationId);
        }
        detachRefs(t.ctrl, ref);
        t.ctrl.stop(true);
      });
    };
  });
  const keys = getKeys(items, propsFn ? propsFn() : props, prevTransitions);
  const expired = reset && usedTransitions.current || [];
  useIsomorphicLayoutEffect(() => each(expired, ({
    ctrl,
    item,
    key
  }) => {
    detachRefs(ctrl, ref);
    callProp(onDestroyed, item, key);
  }));
  const reused = [];
  if (prevTransitions)
    each(prevTransitions, (t, i) => {
      if (t.expired) {
        clearTimeout(t.expirationId);
        expired.push(t);
      } else {
        i = reused[i] = keys.indexOf(t.key);
        if (~i)
          transitions[i] = t;
      }
    });
  each(items, (item, i) => {
    if (!transitions[i]) {
      transitions[i] = {
        key: keys[i],
        item,
        phase: TransitionPhase.MOUNT,
        ctrl: new Controller()
      };
      transitions[i].ctrl.item = item;
    }
  });
  if (reused.length) {
    let i = -1;
    const {
      leave
    } = propsFn ? propsFn() : props;
    each(reused, (keyIndex, prevIndex) => {
      const t = prevTransitions[prevIndex];
      if (~keyIndex) {
        i = transitions.indexOf(t);
        transitions[i] = _extends3({}, t, {
          item: items[keyIndex]
        });
      } else if (leave) {
        transitions.splice(++i, 0, t);
      }
    });
  }
  if (is.fun(sort)) {
    transitions.sort((a, b) => sort(a.item, b.item));
  }
  let delay = -trail;
  const forceUpdate = useForceUpdate();
  const defaultProps = getDefaultProps(props);
  const changes = /* @__PURE__ */ new Map();
  const exitingTransitions = (0, import_react3.useRef)(/* @__PURE__ */ new Map());
  const forceChange = (0, import_react3.useRef)(false);
  each(transitions, (t, i) => {
    const key = t.key;
    const prevPhase = t.phase;
    const p = propsFn ? propsFn() : props;
    let to3;
    let phase;
    let propsDelay = callProp(p.delay || 0, key);
    if (prevPhase == TransitionPhase.MOUNT) {
      to3 = p.enter;
      phase = TransitionPhase.ENTER;
    } else {
      const isLeave = keys.indexOf(key) < 0;
      if (prevPhase != TransitionPhase.LEAVE) {
        if (isLeave) {
          to3 = p.leave;
          phase = TransitionPhase.LEAVE;
        } else if (to3 = p.update) {
          phase = TransitionPhase.UPDATE;
        } else
          return;
      } else if (!isLeave) {
        to3 = p.enter;
        phase = TransitionPhase.ENTER;
      } else
        return;
    }
    to3 = callProp(to3, t.item, i);
    to3 = is.obj(to3) ? inferTo(to3) : {
      to: to3
    };
    if (!to3.config) {
      const config2 = propsConfig || defaultProps.config;
      to3.config = callProp(config2, t.item, i, phase);
    }
    delay += trail;
    const payload = _extends3({}, defaultProps, {
      delay: propsDelay + delay,
      ref: propsRef,
      immediate: p.immediate,
      reset: false
    }, to3);
    if (phase == TransitionPhase.ENTER && is.und(payload.from)) {
      const _p = propsFn ? propsFn() : props;
      const from = is.und(_p.initial) || prevTransitions ? _p.from : _p.initial;
      payload.from = callProp(from, t.item, i);
    }
    const {
      onResolve
    } = payload;
    payload.onResolve = (result) => {
      callProp(onResolve, result);
      const transitions2 = usedTransitions.current;
      const t2 = transitions2.find((t3) => t3.key === key);
      if (!t2)
        return;
      if (result.cancelled && t2.phase != TransitionPhase.UPDATE) {
        return;
      }
      if (t2.ctrl.idle) {
        const idle = transitions2.every((t3) => t3.ctrl.idle);
        if (t2.phase == TransitionPhase.LEAVE) {
          const expiry = callProp(expires, t2.item);
          if (expiry !== false) {
            const expiryMs = expiry === true ? 0 : expiry;
            t2.expired = true;
            if (!idle && expiryMs > 0) {
              if (expiryMs <= 2147483647)
                t2.expirationId = setTimeout(forceUpdate, expiryMs);
              return;
            }
          }
        }
        if (idle && transitions2.some((t3) => t3.expired)) {
          exitingTransitions.current.delete(t2);
          if (exitBeforeEnter) {
            forceChange.current = true;
          }
          forceUpdate();
        }
      }
    };
    const springs = getSprings(t.ctrl, payload);
    if (phase === TransitionPhase.LEAVE && exitBeforeEnter) {
      exitingTransitions.current.set(t, {
        phase,
        springs,
        payload
      });
    } else {
      changes.set(t, {
        phase,
        springs,
        payload
      });
    }
  });
  const context = (0, import_react3.useContext)(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useIsomorphicLayoutEffect(() => {
    if (hasContext) {
      each(transitions, (t) => {
        t.ctrl.start({
          default: context
        });
      });
    }
  }, [context]);
  each(changes, (_, t) => {
    if (exitingTransitions.current.size) {
      const ind = transitions.findIndex((state) => state.key === t.key);
      transitions.splice(ind, 1);
    }
  });
  useIsomorphicLayoutEffect(() => {
    each(exitingTransitions.current.size ? exitingTransitions.current : changes, ({
      phase,
      payload
    }, t) => {
      const {
        ctrl
      } = t;
      t.phase = phase;
      ref == null ? void 0 : ref.add(ctrl);
      if (hasContext && phase == TransitionPhase.ENTER) {
        ctrl.start({
          default: context
        });
      }
      if (payload) {
        replaceRef(ctrl, payload.ref);
        if ((ctrl.ref || ref) && !forceChange.current) {
          ctrl.update(payload);
        } else {
          ctrl.start(payload);
          if (forceChange.current) {
            forceChange.current = false;
          }
        }
      }
    });
  }, reset ? void 0 : deps);
  const renderTransitions = (render) => React2.createElement(React2.Fragment, null, transitions.map((t, i) => {
    const {
      springs
    } = changes.get(t) || t.ctrl;
    const elem = render(_extends3({}, springs), t.item, t, i);
    return elem && elem.type ? React2.createElement(elem.type, _extends3({}, elem.props, {
      key: is.str(t.key) || is.num(t.key) ? t.key : t.ctrl.id,
      ref: elem.ref
    })) : elem;
  }));
  return ref ? [renderTransitions, ref] : renderTransitions;
}
function getKeys(items, {
  key,
  keys = key
}, prevTransitions) {
  if (keys === null) {
    const reused = /* @__PURE__ */ new Set();
    return items.map((item) => {
      const t = prevTransitions && prevTransitions.find((t2) => t2.item === item && t2.phase !== TransitionPhase.LEAVE && !reused.has(t2));
      if (t) {
        reused.add(t);
        return t.key;
      }
      return nextKey++;
    });
  }
  return is.und(keys) ? items : is.fun(keys) ? items.map(keys) : toArray(keys);
}
function Spring(_ref) {
  let {
    children
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  return children(useSpring(props));
}
function Trail(_ref) {
  let {
    items,
    children
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  const trails = useTrail(items.length, props);
  return items.map((item, index) => {
    const result = children(item, index);
    return is.fun(result) ? result(trails[index]) : result;
  });
}
function Transition(_ref) {
  let {
    items,
    children
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded);
  return useTransition(items, props)(children);
}
function isIdle(source) {
  return source.idle !== false;
}
function checkIdle(active) {
  return !active.size || Array.from(active).every(isIdle);
}
function becomeIdle(self) {
  if (!self.idle) {
    self.idle = true;
    each(getPayload(self), (node) => {
      node.done = true;
    });
    callFluidObservers(self, {
      type: "idle",
      parent: self
    });
  }
}
var React2, import_react3, matchProp, resolveProp, getDefaultProp, noopTransform, getDefaultProps, DEFAULT_PROPS, RESERVED_PROPS, config, c1, c2, c3, c4, c5, bounceOut, easings, defaults, AnimationConfig, emptyArray, Animation, getCombinedResult, getNoopResult, getFinishedResult, getCancelledResult, BailSignal, SkipAniamtionSignal, isFrameValue, nextId$1, FrameValue, $P, HAS_ANIMATED, IS_ANIMATING, IS_PAUSED, hasAnimated, isAnimating, isPaused, setActiveBit, setPausedBit, SpringValue, ACTIVE_EVENTS, BATCHED_EVENTS, nextId, Controller, _excluded$3, SpringContext, ctx, SpringRef, initSpringRef, useSpringRef, TransitionPhase, nextKey, _excluded$2, _excluded$1, _excluded, Interpolation, to2, interpolate2, update2;
var init_react_spring_core_esm = __esm({
  "node_modules/@react-spring/core/dist/react-spring-core.esm.js"() {
    init_react_spring_shared_esm();
    init_react_spring_shared_esm();
    React2 = __toESM(require_react());
    import_react3 = __toESM(require_react());
    init_react_spring_animated_esm();
    init_animated();
    init_interpolation();
    matchProp = (value, key) => value === true || !!(key && value && (is.fun(value) ? value(key) : toArray(value).includes(key)));
    resolveProp = (prop, key) => is.obj(prop) ? key && prop[key] : prop;
    getDefaultProp = (props, key) => props.default === true ? props[key] : props.default ? props.default[key] : void 0;
    noopTransform = (value) => value;
    getDefaultProps = (props, transform = noopTransform) => {
      let keys = DEFAULT_PROPS;
      if (props.default && props.default !== true) {
        props = props.default;
        keys = Object.keys(props);
      }
      const defaults2 = {};
      for (const key of keys) {
        const value = transform(props[key], key);
        if (!is.und(value)) {
          defaults2[key] = value;
        }
      }
      return defaults2;
    };
    DEFAULT_PROPS = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"];
    RESERVED_PROPS = {
      config: 1,
      from: 1,
      to: 1,
      ref: 1,
      loop: 1,
      reset: 1,
      pause: 1,
      cancel: 1,
      reverse: 1,
      immediate: 1,
      default: 1,
      delay: 1,
      onProps: 1,
      onStart: 1,
      onChange: 1,
      onPause: 1,
      onResume: 1,
      onRest: 1,
      onResolve: 1,
      items: 1,
      trail: 1,
      sort: 1,
      expires: 1,
      initial: 1,
      enter: 1,
      update: 1,
      leave: 1,
      children: 1,
      onDestroyed: 1,
      keys: 1,
      callId: 1,
      parentId: 1
    };
    config = {
      default: {
        tension: 170,
        friction: 26
      },
      gentle: {
        tension: 120,
        friction: 14
      },
      wobbly: {
        tension: 180,
        friction: 12
      },
      stiff: {
        tension: 210,
        friction: 20
      },
      slow: {
        tension: 280,
        friction: 60
      },
      molasses: {
        tension: 280,
        friction: 120
      }
    };
    c1 = 1.70158;
    c2 = c1 * 1.525;
    c3 = c1 + 1;
    c4 = 2 * Math.PI / 3;
    c5 = 2 * Math.PI / 4.5;
    bounceOut = (x) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (x < 1 / d1) {
        return n1 * x * x;
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    };
    easings = {
      linear: (x) => x,
      easeInQuad: (x) => x * x,
      easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
      easeInOutQuad: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
      easeInCubic: (x) => x * x * x,
      easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
      easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
      easeInQuart: (x) => x * x * x * x,
      easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
      easeInOutQuart: (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
      easeInQuint: (x) => x * x * x * x * x,
      easeOutQuint: (x) => 1 - Math.pow(1 - x, 5),
      easeInOutQuint: (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
      easeInSine: (x) => 1 - Math.cos(x * Math.PI / 2),
      easeOutSine: (x) => Math.sin(x * Math.PI / 2),
      easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
      easeInExpo: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
      easeOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
      easeInOutExpo: (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
      easeInCirc: (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
      easeOutCirc: (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
      easeInOutCirc: (x) => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
      easeInBack: (x) => c3 * x * x * x - c1 * x * x,
      easeOutBack: (x) => 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2),
      easeInOutBack: (x) => x < 0.5 ? Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2,
      easeInElastic: (x) => x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4),
      easeOutElastic: (x) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1,
      easeInOutElastic: (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5) / 2 + 1,
      easeInBounce: (x) => 1 - bounceOut(1 - x),
      easeOutBounce: bounceOut,
      easeInOutBounce: (x) => x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2
    };
    defaults = _extends3({}, config.default, {
      mass: 1,
      damping: 1,
      easing: easings.linear,
      clamp: false
    });
    AnimationConfig = class {
      constructor() {
        this.tension = void 0;
        this.friction = void 0;
        this.frequency = void 0;
        this.damping = void 0;
        this.mass = void 0;
        this.velocity = 0;
        this.restVelocity = void 0;
        this.precision = void 0;
        this.progress = void 0;
        this.duration = void 0;
        this.easing = void 0;
        this.clamp = void 0;
        this.bounce = void 0;
        this.decay = void 0;
        this.round = void 0;
        Object.assign(this, defaults);
      }
    };
    emptyArray = [];
    Animation = class {
      constructor() {
        this.changed = false;
        this.values = emptyArray;
        this.toValues = null;
        this.fromValues = emptyArray;
        this.to = void 0;
        this.from = void 0;
        this.config = new AnimationConfig();
        this.immediate = false;
      }
    };
    getCombinedResult = (target, results) => results.length == 1 ? results[0] : results.some((result) => result.cancelled) ? getCancelledResult(target.get()) : results.every((result) => result.noop) ? getNoopResult(target.get()) : getFinishedResult(target.get(), results.every((result) => result.finished));
    getNoopResult = (value) => ({
      value,
      noop: true,
      finished: true,
      cancelled: false
    });
    getFinishedResult = (value, finished, cancelled = false) => ({
      value,
      finished,
      cancelled
    });
    getCancelledResult = (value) => ({
      value,
      cancelled: true,
      finished: false
    });
    BailSignal = class extends Error {
      constructor() {
        super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.");
        this.result = void 0;
      }
    };
    SkipAniamtionSignal = class extends Error {
      constructor() {
        super("SkipAnimationSignal");
        this.result = void 0;
      }
    };
    isFrameValue = (value) => value instanceof FrameValue;
    nextId$1 = 1;
    FrameValue = class extends FluidValue {
      constructor(...args) {
        super(...args);
        this.id = nextId$1++;
        this.key = void 0;
        this._priority = 0;
      }
      get priority() {
        return this._priority;
      }
      set priority(priority2) {
        if (this._priority != priority2) {
          this._priority = priority2;
          this._onPriorityChange(priority2);
        }
      }
      get() {
        const node = getAnimated(this);
        return node && node.getValue();
      }
      to(...args) {
        return globals.to(this, args);
      }
      interpolate(...args) {
        deprecateInterpolate();
        return globals.to(this, args);
      }
      toJSON() {
        return this.get();
      }
      observerAdded(count) {
        if (count == 1)
          this._attach();
      }
      observerRemoved(count) {
        if (count == 0)
          this._detach();
      }
      _attach() {
      }
      _detach() {
      }
      _onChange(value, idle = false) {
        callFluidObservers(this, {
          type: "change",
          parent: this,
          value,
          idle
        });
      }
      _onPriorityChange(priority2) {
        if (!this.idle) {
          frameLoop.sort(this);
        }
        callFluidObservers(this, {
          type: "priority",
          parent: this,
          priority: priority2
        });
      }
    };
    $P = Symbol.for("SpringPhase");
    HAS_ANIMATED = 1;
    IS_ANIMATING = 2;
    IS_PAUSED = 4;
    hasAnimated = (target) => (target[$P] & HAS_ANIMATED) > 0;
    isAnimating = (target) => (target[$P] & IS_ANIMATING) > 0;
    isPaused = (target) => (target[$P] & IS_PAUSED) > 0;
    setActiveBit = (target, active) => active ? target[$P] |= IS_ANIMATING | HAS_ANIMATED : target[$P] &= ~IS_ANIMATING;
    setPausedBit = (target, paused) => paused ? target[$P] |= IS_PAUSED : target[$P] &= ~IS_PAUSED;
    SpringValue = class extends FrameValue {
      constructor(arg1, arg2) {
        super();
        this.key = void 0;
        this.animation = new Animation();
        this.queue = void 0;
        this.defaultProps = {};
        this._state = {
          paused: false,
          delayed: false,
          pauseQueue: /* @__PURE__ */ new Set(),
          resumeQueue: /* @__PURE__ */ new Set(),
          timeouts: /* @__PURE__ */ new Set()
        };
        this._pendingCalls = /* @__PURE__ */ new Set();
        this._lastCallId = 0;
        this._lastToId = 0;
        this._memoizedDuration = 0;
        if (!is.und(arg1) || !is.und(arg2)) {
          const props = is.obj(arg1) ? _extends3({}, arg1) : _extends3({}, arg2, {
            from: arg1
          });
          if (is.und(props.default)) {
            props.default = true;
          }
          this.start(props);
        }
      }
      get idle() {
        return !(isAnimating(this) || this._state.asyncTo) || isPaused(this);
      }
      get goal() {
        return getFluidValue(this.animation.to);
      }
      get velocity() {
        const node = getAnimated(this);
        return node instanceof AnimatedValue ? node.lastVelocity || 0 : node.getPayload().map((node2) => node2.lastVelocity || 0);
      }
      get hasAnimated() {
        return hasAnimated(this);
      }
      get isAnimating() {
        return isAnimating(this);
      }
      get isPaused() {
        return isPaused(this);
      }
      get isDelayed() {
        return this._state.delayed;
      }
      advance(dt) {
        let idle = true;
        let changed = false;
        const anim = this.animation;
        let {
          config: config2,
          toValues
        } = anim;
        const payload = getPayload(anim.to);
        if (!payload && hasFluidValue(anim.to)) {
          toValues = toArray(getFluidValue(anim.to));
        }
        anim.values.forEach((node2, i) => {
          if (node2.done)
            return;
          const to3 = node2.constructor == AnimatedString ? 1 : payload ? payload[i].lastPosition : toValues[i];
          let finished = anim.immediate;
          let position = to3;
          if (!finished) {
            position = node2.lastPosition;
            if (config2.tension <= 0) {
              node2.done = true;
              return;
            }
            let elapsed = node2.elapsedTime += dt;
            const from = anim.fromValues[i];
            const v0 = node2.v0 != null ? node2.v0 : node2.v0 = is.arr(config2.velocity) ? config2.velocity[i] : config2.velocity;
            let velocity;
            const precision = config2.precision || (from == to3 ? 5e-3 : Math.min(1, Math.abs(to3 - from) * 1e-3));
            if (!is.und(config2.duration)) {
              let p = 1;
              if (config2.duration > 0) {
                if (this._memoizedDuration !== config2.duration) {
                  this._memoizedDuration = config2.duration;
                  if (node2.durationProgress > 0) {
                    node2.elapsedTime = config2.duration * node2.durationProgress;
                    elapsed = node2.elapsedTime += dt;
                  }
                }
                p = (config2.progress || 0) + elapsed / this._memoizedDuration;
                p = p > 1 ? 1 : p < 0 ? 0 : p;
                node2.durationProgress = p;
              }
              position = from + config2.easing(p) * (to3 - from);
              velocity = (position - node2.lastPosition) / dt;
              finished = p == 1;
            } else if (config2.decay) {
              const decay = config2.decay === true ? 0.998 : config2.decay;
              const e = Math.exp(-(1 - decay) * elapsed);
              position = from + v0 / (1 - decay) * (1 - e);
              finished = Math.abs(node2.lastPosition - position) <= precision;
              velocity = v0 * e;
            } else {
              velocity = node2.lastVelocity == null ? v0 : node2.lastVelocity;
              const restVelocity = config2.restVelocity || precision / 10;
              const bounceFactor = config2.clamp ? 0 : config2.bounce;
              const canBounce = !is.und(bounceFactor);
              const isGrowing = from == to3 ? node2.v0 > 0 : from < to3;
              let isMoving;
              let isBouncing = false;
              const step = 1;
              const numSteps = Math.ceil(dt / step);
              for (let n = 0; n < numSteps; ++n) {
                isMoving = Math.abs(velocity) > restVelocity;
                if (!isMoving) {
                  finished = Math.abs(to3 - position) <= precision;
                  if (finished) {
                    break;
                  }
                }
                if (canBounce) {
                  isBouncing = position == to3 || position > to3 == isGrowing;
                  if (isBouncing) {
                    velocity = -velocity * bounceFactor;
                    position = to3;
                  }
                }
                const springForce = -config2.tension * 1e-6 * (position - to3);
                const dampingForce = -config2.friction * 1e-3 * velocity;
                const acceleration = (springForce + dampingForce) / config2.mass;
                velocity = velocity + acceleration * step;
                position = position + velocity * step;
              }
            }
            node2.lastVelocity = velocity;
            if (Number.isNaN(position)) {
              console.warn(`Got NaN while animating:`, this);
              finished = true;
            }
          }
          if (payload && !payload[i].done) {
            finished = false;
          }
          if (finished) {
            node2.done = true;
          } else {
            idle = false;
          }
          if (node2.setValue(position, config2.round)) {
            changed = true;
          }
        });
        const node = getAnimated(this);
        const currVal = node.getValue();
        if (idle) {
          const finalVal = getFluidValue(anim.to);
          if ((currVal !== finalVal || changed) && !config2.decay) {
            node.setValue(finalVal);
            this._onChange(finalVal);
          } else if (changed && config2.decay) {
            this._onChange(currVal);
          }
          this._stop();
        } else if (changed) {
          this._onChange(currVal);
        }
      }
      set(value) {
        raf.batchedUpdates(() => {
          this._stop();
          this._focus(value);
          this._set(value);
        });
        return this;
      }
      pause() {
        this._update({
          pause: true
        });
      }
      resume() {
        this._update({
          pause: false
        });
      }
      finish() {
        if (isAnimating(this)) {
          const {
            to: to3,
            config: config2
          } = this.animation;
          raf.batchedUpdates(() => {
            this._onStart();
            if (!config2.decay) {
              this._set(to3, false);
            }
            this._stop();
          });
        }
        return this;
      }
      update(props) {
        const queue = this.queue || (this.queue = []);
        queue.push(props);
        return this;
      }
      start(to3, arg2) {
        let queue;
        if (!is.und(to3)) {
          queue = [is.obj(to3) ? to3 : _extends3({}, arg2, {
            to: to3
          })];
        } else {
          queue = this.queue || [];
          this.queue = [];
        }
        return Promise.all(queue.map((props) => {
          const up = this._update(props);
          return up;
        })).then((results) => getCombinedResult(this, results));
      }
      stop(cancel) {
        const {
          to: to3
        } = this.animation;
        this._focus(this.get());
        stopAsync(this._state, cancel && this._lastCallId);
        raf.batchedUpdates(() => this._stop(to3, cancel));
        return this;
      }
      reset() {
        this._update({
          reset: true
        });
      }
      eventObserved(event) {
        if (event.type == "change") {
          this._start();
        } else if (event.type == "priority") {
          this.priority = event.priority + 1;
        }
      }
      _prepareNode(props) {
        const key = this.key || "";
        let {
          to: to3,
          from
        } = props;
        to3 = is.obj(to3) ? to3[key] : to3;
        if (to3 == null || isAsyncTo(to3)) {
          to3 = void 0;
        }
        from = is.obj(from) ? from[key] : from;
        if (from == null) {
          from = void 0;
        }
        const range = {
          to: to3,
          from
        };
        if (!hasAnimated(this)) {
          if (props.reverse)
            [to3, from] = [from, to3];
          from = getFluidValue(from);
          if (!is.und(from)) {
            this._set(from);
          } else if (!getAnimated(this)) {
            this._set(to3);
          }
        }
        return range;
      }
      _update(_ref, isLoop) {
        let props = _extends3({}, _ref);
        const {
          key,
          defaultProps
        } = this;
        if (props.default)
          Object.assign(defaultProps, getDefaultProps(props, (value, prop) => /^on/.test(prop) ? resolveProp(value, key) : value));
        mergeActiveFn(this, props, "onProps");
        sendEvent(this, "onProps", props, this);
        const range = this._prepareNode(props);
        if (Object.isFrozen(this)) {
          throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
        }
        const state = this._state;
        return scheduleProps(++this._lastCallId, {
          key,
          props,
          defaultProps,
          state,
          actions: {
            pause: () => {
              if (!isPaused(this)) {
                setPausedBit(this, true);
                flushCalls(state.pauseQueue);
                sendEvent(this, "onPause", getFinishedResult(this, checkFinished(this, this.animation.to)), this);
              }
            },
            resume: () => {
              if (isPaused(this)) {
                setPausedBit(this, false);
                if (isAnimating(this)) {
                  this._resume();
                }
                flushCalls(state.resumeQueue);
                sendEvent(this, "onResume", getFinishedResult(this, checkFinished(this, this.animation.to)), this);
              }
            },
            start: this._merge.bind(this, range)
          }
        }).then((result) => {
          if (props.loop && result.finished && !(isLoop && result.noop)) {
            const nextProps = createLoopUpdate(props);
            if (nextProps) {
              return this._update(nextProps, true);
            }
          }
          return result;
        });
      }
      _merge(range, props, resolve) {
        if (props.cancel) {
          this.stop(true);
          return resolve(getCancelledResult(this));
        }
        const hasToProp = !is.und(range.to);
        const hasFromProp = !is.und(range.from);
        if (hasToProp || hasFromProp) {
          if (props.callId > this._lastToId) {
            this._lastToId = props.callId;
          } else {
            return resolve(getCancelledResult(this));
          }
        }
        const {
          key,
          defaultProps,
          animation: anim
        } = this;
        const {
          to: prevTo,
          from: prevFrom
        } = anim;
        let {
          to: to3 = prevTo,
          from = prevFrom
        } = range;
        if (hasFromProp && !hasToProp && (!props.default || is.und(to3))) {
          to3 = from;
        }
        if (props.reverse)
          [to3, from] = [from, to3];
        const hasFromChanged = !isEqual(from, prevFrom);
        if (hasFromChanged) {
          anim.from = from;
        }
        from = getFluidValue(from);
        const hasToChanged = !isEqual(to3, prevTo);
        if (hasToChanged) {
          this._focus(to3);
        }
        const hasAsyncTo = isAsyncTo(props.to);
        const {
          config: config2
        } = anim;
        const {
          decay,
          velocity
        } = config2;
        if (hasToProp || hasFromProp) {
          config2.velocity = 0;
        }
        if (props.config && !hasAsyncTo) {
          mergeConfig(config2, callProp(props.config, key), props.config !== defaultProps.config ? callProp(defaultProps.config, key) : void 0);
        }
        let node = getAnimated(this);
        if (!node || is.und(to3)) {
          return resolve(getFinishedResult(this, true));
        }
        const reset = is.und(props.reset) ? hasFromProp && !props.default : !is.und(from) && matchProp(props.reset, key);
        const value = reset ? from : this.get();
        const goal = computeGoal(to3);
        const isAnimatable = is.num(goal) || is.arr(goal) || isAnimatedString(goal);
        const immediate = !hasAsyncTo && (!isAnimatable || matchProp(defaultProps.immediate || props.immediate, key));
        if (hasToChanged) {
          const nodeType = getAnimatedType(to3);
          if (nodeType !== node.constructor) {
            if (immediate) {
              node = this._set(goal);
            } else
              throw Error(`Cannot animate between ${node.constructor.name} and ${nodeType.name}, as the "to" prop suggests`);
          }
        }
        const goalType = node.constructor;
        let started = hasFluidValue(to3);
        let finished = false;
        if (!started) {
          const hasValueChanged = reset || !hasAnimated(this) && hasFromChanged;
          if (hasToChanged || hasValueChanged) {
            finished = isEqual(computeGoal(value), goal);
            started = !finished;
          }
          if (!isEqual(anim.immediate, immediate) && !immediate || !isEqual(config2.decay, decay) || !isEqual(config2.velocity, velocity)) {
            started = true;
          }
        }
        if (finished && isAnimating(this)) {
          if (anim.changed && !reset) {
            started = true;
          } else if (!started) {
            this._stop(prevTo);
          }
        }
        if (!hasAsyncTo) {
          if (started || hasFluidValue(prevTo)) {
            anim.values = node.getPayload();
            anim.toValues = hasFluidValue(to3) ? null : goalType == AnimatedString ? [1] : toArray(goal);
          }
          if (anim.immediate != immediate) {
            anim.immediate = immediate;
            if (!immediate && !reset) {
              this._set(prevTo);
            }
          }
          if (started) {
            const {
              onRest
            } = anim;
            each(ACTIVE_EVENTS, (type) => mergeActiveFn(this, props, type));
            const result = getFinishedResult(this, checkFinished(this, prevTo));
            flushCalls(this._pendingCalls, result);
            this._pendingCalls.add(resolve);
            if (anim.changed)
              raf.batchedUpdates(() => {
                anim.changed = !reset;
                onRest == null ? void 0 : onRest(result, this);
                if (reset) {
                  callProp(defaultProps.onRest, result);
                } else {
                  anim.onStart == null ? void 0 : anim.onStart(result, this);
                }
              });
          }
        }
        if (reset) {
          this._set(value);
        }
        if (hasAsyncTo) {
          resolve(runAsync(props.to, props, this._state, this));
        } else if (started) {
          this._start();
        } else if (isAnimating(this) && !hasToChanged) {
          this._pendingCalls.add(resolve);
        } else {
          resolve(getNoopResult(value));
        }
      }
      _focus(value) {
        const anim = this.animation;
        if (value !== anim.to) {
          if (getFluidObservers(this)) {
            this._detach();
          }
          anim.to = value;
          if (getFluidObservers(this)) {
            this._attach();
          }
        }
      }
      _attach() {
        let priority2 = 0;
        const {
          to: to3
        } = this.animation;
        if (hasFluidValue(to3)) {
          addFluidObserver(to3, this);
          if (isFrameValue(to3)) {
            priority2 = to3.priority + 1;
          }
        }
        this.priority = priority2;
      }
      _detach() {
        const {
          to: to3
        } = this.animation;
        if (hasFluidValue(to3)) {
          removeFluidObserver(to3, this);
        }
      }
      _set(arg, idle = true) {
        const value = getFluidValue(arg);
        if (!is.und(value)) {
          const oldNode = getAnimated(this);
          if (!oldNode || !isEqual(value, oldNode.getValue())) {
            const nodeType = getAnimatedType(value);
            if (!oldNode || oldNode.constructor != nodeType) {
              setAnimated(this, nodeType.create(value));
            } else {
              oldNode.setValue(value);
            }
            if (oldNode) {
              raf.batchedUpdates(() => {
                this._onChange(value, idle);
              });
            }
          }
        }
        return getAnimated(this);
      }
      _onStart() {
        const anim = this.animation;
        if (!anim.changed) {
          anim.changed = true;
          sendEvent(this, "onStart", getFinishedResult(this, checkFinished(this, anim.to)), this);
        }
      }
      _onChange(value, idle) {
        if (!idle) {
          this._onStart();
          callProp(this.animation.onChange, value, this);
        }
        callProp(this.defaultProps.onChange, value, this);
        super._onChange(value, idle);
      }
      _start() {
        const anim = this.animation;
        getAnimated(this).reset(getFluidValue(anim.to));
        if (!anim.immediate) {
          anim.fromValues = anim.values.map((node) => node.lastPosition);
        }
        if (!isAnimating(this)) {
          setActiveBit(this, true);
          if (!isPaused(this)) {
            this._resume();
          }
        }
      }
      _resume() {
        if (globals.skipAnimation) {
          this.finish();
        } else {
          frameLoop.start(this);
        }
      }
      _stop(goal, cancel) {
        if (isAnimating(this)) {
          setActiveBit(this, false);
          const anim = this.animation;
          each(anim.values, (node) => {
            node.done = true;
          });
          if (anim.toValues) {
            anim.onChange = anim.onPause = anim.onResume = void 0;
          }
          callFluidObservers(this, {
            type: "idle",
            parent: this
          });
          const result = cancel ? getCancelledResult(this.get()) : getFinishedResult(this.get(), checkFinished(this, goal != null ? goal : anim.to));
          flushCalls(this._pendingCalls, result);
          if (anim.changed) {
            anim.changed = false;
            sendEvent(this, "onRest", result, this);
          }
        }
      }
    };
    ACTIVE_EVENTS = ["onStart", "onRest", "onChange", "onPause", "onResume"];
    BATCHED_EVENTS = ["onStart", "onChange", "onRest"];
    nextId = 1;
    Controller = class {
      constructor(props, flush2) {
        this.id = nextId++;
        this.springs = {};
        this.queue = [];
        this.ref = void 0;
        this._flush = void 0;
        this._initialProps = void 0;
        this._lastAsyncId = 0;
        this._active = /* @__PURE__ */ new Set();
        this._changed = /* @__PURE__ */ new Set();
        this._started = false;
        this._item = void 0;
        this._state = {
          paused: false,
          pauseQueue: /* @__PURE__ */ new Set(),
          resumeQueue: /* @__PURE__ */ new Set(),
          timeouts: /* @__PURE__ */ new Set()
        };
        this._events = {
          onStart: /* @__PURE__ */ new Map(),
          onChange: /* @__PURE__ */ new Map(),
          onRest: /* @__PURE__ */ new Map()
        };
        this._onFrame = this._onFrame.bind(this);
        if (flush2) {
          this._flush = flush2;
        }
        if (props) {
          this.start(_extends3({
            default: true
          }, props));
        }
      }
      get idle() {
        return !this._state.asyncTo && Object.values(this.springs).every((spring) => {
          return spring.idle && !spring.isDelayed && !spring.isPaused;
        });
      }
      get item() {
        return this._item;
      }
      set item(item) {
        this._item = item;
      }
      get() {
        const values = {};
        this.each((spring, key) => values[key] = spring.get());
        return values;
      }
      set(values) {
        for (const key in values) {
          const value = values[key];
          if (!is.und(value)) {
            this.springs[key].set(value);
          }
        }
      }
      update(props) {
        if (props) {
          this.queue.push(createUpdate(props));
        }
        return this;
      }
      start(props) {
        let {
          queue
        } = this;
        if (props) {
          queue = toArray(props).map(createUpdate);
        } else {
          this.queue = [];
        }
        if (this._flush) {
          return this._flush(this, queue);
        }
        prepareKeys(this, queue);
        return flushUpdateQueue(this, queue);
      }
      stop(arg, keys) {
        if (arg !== !!arg) {
          keys = arg;
        }
        if (keys) {
          const springs = this.springs;
          each(toArray(keys), (key) => springs[key].stop(!!arg));
        } else {
          stopAsync(this._state, this._lastAsyncId);
          this.each((spring) => spring.stop(!!arg));
        }
        return this;
      }
      pause(keys) {
        if (is.und(keys)) {
          this.start({
            pause: true
          });
        } else {
          const springs = this.springs;
          each(toArray(keys), (key) => springs[key].pause());
        }
        return this;
      }
      resume(keys) {
        if (is.und(keys)) {
          this.start({
            pause: false
          });
        } else {
          const springs = this.springs;
          each(toArray(keys), (key) => springs[key].resume());
        }
        return this;
      }
      each(iterator) {
        eachProp(this.springs, iterator);
      }
      _onFrame() {
        const {
          onStart,
          onChange,
          onRest
        } = this._events;
        const active = this._active.size > 0;
        const changed = this._changed.size > 0;
        if (active && !this._started || changed && !this._started) {
          this._started = true;
          flush(onStart, ([onStart2, result]) => {
            result.value = this.get();
            onStart2(result, this, this._item);
          });
        }
        const idle = !active && this._started;
        const values = changed || idle && onRest.size ? this.get() : null;
        if (changed && onChange.size) {
          flush(onChange, ([onChange2, result]) => {
            result.value = values;
            onChange2(result, this, this._item);
          });
        }
        if (idle) {
          this._started = false;
          flush(onRest, ([onRest2, result]) => {
            result.value = values;
            onRest2(result, this, this._item);
          });
        }
      }
      eventObserved(event) {
        if (event.type == "change") {
          this._changed.add(event.parent);
          if (!event.idle) {
            this._active.add(event.parent);
          }
        } else if (event.type == "idle") {
          this._active.delete(event.parent);
        } else
          return;
        raf.onFrame(this._onFrame);
      }
    };
    _excluded$3 = ["children"];
    SpringContext = (_ref) => {
      let {
        children
      } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded$3);
      const inherited = (0, import_react3.useContext)(ctx);
      const pause = props.pause || !!inherited.pause, immediate = props.immediate || !!inherited.immediate;
      props = useMemoOne(() => ({
        pause,
        immediate
      }), [pause, immediate]);
      const {
        Provider
      } = ctx;
      return React2.createElement(Provider, {
        value: props
      }, children);
    };
    ctx = makeContext(SpringContext, {});
    SpringContext.Provider = ctx.Provider;
    SpringContext.Consumer = ctx.Consumer;
    SpringRef = () => {
      const current = [];
      const SpringRef2 = function SpringRef3(props) {
        deprecateDirectCall();
        const results = [];
        each(current, (ctrl, i) => {
          if (is.und(props)) {
            results.push(ctrl.start());
          } else {
            const update3 = _getProps(props, ctrl, i);
            if (update3) {
              results.push(ctrl.start(update3));
            }
          }
        });
        return results;
      };
      SpringRef2.current = current;
      SpringRef2.add = function(ctrl) {
        if (!current.includes(ctrl)) {
          current.push(ctrl);
        }
      };
      SpringRef2.delete = function(ctrl) {
        const i = current.indexOf(ctrl);
        if (~i)
          current.splice(i, 1);
      };
      SpringRef2.pause = function() {
        each(current, (ctrl) => ctrl.pause(...arguments));
        return this;
      };
      SpringRef2.resume = function() {
        each(current, (ctrl) => ctrl.resume(...arguments));
        return this;
      };
      SpringRef2.set = function(values) {
        each(current, (ctrl) => ctrl.set(values));
      };
      SpringRef2.start = function(props) {
        const results = [];
        each(current, (ctrl, i) => {
          if (is.und(props)) {
            results.push(ctrl.start());
          } else {
            const update3 = this._getProps(props, ctrl, i);
            if (update3) {
              results.push(ctrl.start(update3));
            }
          }
        });
        return results;
      };
      SpringRef2.stop = function() {
        each(current, (ctrl) => ctrl.stop(...arguments));
        return this;
      };
      SpringRef2.update = function(props) {
        each(current, (ctrl, i) => ctrl.update(this._getProps(props, ctrl, i)));
        return this;
      };
      const _getProps = function _getProps2(arg, ctrl, index) {
        return is.fun(arg) ? arg(index, ctrl) : arg;
      };
      SpringRef2._getProps = _getProps;
      return SpringRef2;
    };
    initSpringRef = () => SpringRef();
    useSpringRef = () => (0, import_react3.useState)(initSpringRef)[0];
    (function(TransitionPhase2) {
      TransitionPhase2["MOUNT"] = "mount";
      TransitionPhase2["ENTER"] = "enter";
      TransitionPhase2["UPDATE"] = "update";
      TransitionPhase2["LEAVE"] = "leave";
    })(TransitionPhase || (TransitionPhase = {}));
    nextKey = 1;
    _excluded$2 = ["children"];
    _excluded$1 = ["items", "children"];
    _excluded = ["items", "children"];
    Interpolation = class extends FrameValue {
      constructor(source, args) {
        super();
        this.key = void 0;
        this.idle = true;
        this.calc = void 0;
        this._active = /* @__PURE__ */ new Set();
        this.source = source;
        this.calc = createInterpolator(...args);
        const value = this._get();
        const nodeType = getAnimatedType(value);
        setAnimated(this, nodeType.create(value));
      }
      advance(_dt) {
        const value = this._get();
        const oldValue = this.get();
        if (!isEqual(value, oldValue)) {
          getAnimated(this).setValue(value);
          this._onChange(value, this.idle);
        }
        if (!this.idle && checkIdle(this._active)) {
          becomeIdle(this);
        }
      }
      _get() {
        const inputs = is.arr(this.source) ? this.source.map(getFluidValue) : toArray(getFluidValue(this.source));
        return this.calc(...inputs);
      }
      _start() {
        if (this.idle && !checkIdle(this._active)) {
          this.idle = false;
          each(getPayload(this), (node) => {
            node.done = false;
          });
          if (globals.skipAnimation) {
            raf.batchedUpdates(() => this.advance());
            becomeIdle(this);
          } else {
            frameLoop.start(this);
          }
        }
      }
      _attach() {
        let priority2 = 1;
        each(toArray(this.source), (source) => {
          if (hasFluidValue(source)) {
            addFluidObserver(source, this);
          }
          if (isFrameValue(source)) {
            if (!source.idle) {
              this._active.add(source);
            }
            priority2 = Math.max(priority2, source.priority + 1);
          }
        });
        this.priority = priority2;
        this._start();
      }
      _detach() {
        each(toArray(this.source), (source) => {
          if (hasFluidValue(source)) {
            removeFluidObserver(source, this);
          }
        });
        this._active.clear();
        becomeIdle(this);
      }
      eventObserved(event) {
        if (event.type == "change") {
          if (event.idle) {
            this.advance();
          } else {
            this._active.add(event.parent);
            this._start();
          }
        } else if (event.type == "idle") {
          this._active.delete(event.parent);
        } else if (event.type == "priority") {
          this.priority = toArray(this.source).reduce((highest, parent) => Math.max(highest, (isFrameValue(parent) ? parent.priority : 0) + 1), 0);
        }
      }
    };
    to2 = (source, ...args) => new Interpolation(source, args);
    interpolate2 = (source, ...args) => (deprecateInterpolate(), new Interpolation(source, args));
    globals.assign({
      createStringInterpolator,
      to: (source, args) => new Interpolation(source, args)
    });
    update2 = frameLoop.advance;
  }
});

// node_modules/@react-spring/web/dist/react-spring-web.esm.js
var react_spring_web_esm_exports = {};
__export(react_spring_web_esm_exports, {
  BailSignal: () => BailSignal,
  Controller: () => Controller,
  FrameValue: () => FrameValue,
  Globals: () => globals,
  Interpolation: () => Interpolation,
  Spring: () => Spring,
  SpringContext: () => SpringContext,
  SpringRef: () => SpringRef,
  SpringValue: () => SpringValue,
  Trail: () => Trail,
  Transition: () => Transition,
  a: () => animated,
  animated: () => animated,
  config: () => config,
  createInterpolator: () => createInterpolator,
  easings: () => easings,
  inferTo: () => inferTo,
  interpolate: () => interpolate2,
  to: () => to2,
  update: () => update2,
  useChain: () => useChain,
  useIsomorphicLayoutEffect: () => useIsomorphicLayoutEffect,
  useReducedMotion: () => useReducedMotion,
  useSpring: () => useSpring,
  useSpringRef: () => useSpringRef,
  useSprings: () => useSprings,
  useTrail: () => useTrail,
  useTransition: () => useTransition
});
function _objectWithoutPropertiesLoose2(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function dangerousStyleValue(name, value) {
  if (value == null || typeof value === "boolean" || value === "")
    return "";
  if (typeof value === "number" && value !== 0 && !isCustomPropRE.test(name) && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]))
    return value + "px";
  return ("" + value).trim();
}
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }
  const isFilterElement = instance.nodeName === "filter" || instance.parentNode && instance.parentNode.nodeName === "filter";
  const _ref = props, {
    style,
    children,
    scrollTop,
    scrollLeft
  } = _ref, attributes = _objectWithoutPropertiesLoose2(_ref, _excluded$22);
  const values = Object.values(attributes);
  const names = Object.keys(attributes).map((name) => isFilterElement || instance.hasAttribute(name) ? name : attributeCache[name] || (attributeCache[name] = name.replace(/([A-Z])/g, (n) => "-" + n.toLowerCase())));
  if (children !== void 0) {
    instance.textContent = children;
  }
  for (let name in style) {
    if (style.hasOwnProperty(name)) {
      const value = dangerousStyleValue(name, style[name]);
      if (isCustomPropRE.test(name)) {
        instance.style.setProperty(name, value);
      } else {
        instance.style[name] = value;
      }
    }
  }
  names.forEach((name, i) => {
    instance.setAttribute(name, values[i]);
  });
  if (scrollTop !== void 0) {
    instance.scrollTop = scrollTop;
  }
  if (scrollLeft !== void 0) {
    instance.scrollLeft = scrollLeft;
  }
}
var import_react_dom, _excluded$22, isCustomPropRE, attributeCache, isUnitlessNumber, prefixKey, prefixes, _excluded$12, domTransforms, pxTransforms, degTransforms, addUnit, isValueIdentity, AnimatedStyle, FluidTransform, primitives, _excluded2, host, animated;
var init_react_spring_web_esm = __esm({
  "node_modules/@react-spring/web/dist/react-spring-web.esm.js"() {
    init_react_spring_core_esm();
    init_react_spring_core_esm();
    import_react_dom = __toESM(require_react_dom());
    init_react_spring_shared_esm();
    init_react_spring_animated_esm();
    _excluded$22 = ["style", "children", "scrollTop", "scrollLeft"];
    isCustomPropRE = /^--/;
    attributeCache = {};
    isUnitlessNumber = {
      animationIterationCount: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    prefixKey = (prefix2, key) => prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
    prefixes = ["Webkit", "Ms", "Moz", "O"];
    isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
      prefixes.forEach((prefix2) => acc[prefixKey(prefix2, prop)] = acc[prop]);
      return acc;
    }, isUnitlessNumber);
    _excluded$12 = ["x", "y", "z"];
    domTransforms = /^(matrix|translate|scale|rotate|skew)/;
    pxTransforms = /^(translate)/;
    degTransforms = /^(rotate|skew)/;
    addUnit = (value, unit) => is.num(value) && value !== 0 ? value + unit : value;
    isValueIdentity = (value, id) => is.arr(value) ? value.every((v) => isValueIdentity(v, id)) : is.num(value) ? value === id : parseFloat(value) === id;
    AnimatedStyle = class extends AnimatedObject {
      constructor(_ref) {
        let {
          x,
          y,
          z
        } = _ref, style = _objectWithoutPropertiesLoose2(_ref, _excluded$12);
        const inputs = [];
        const transforms = [];
        if (x || y || z) {
          inputs.push([x || 0, y || 0, z || 0]);
          transforms.push((xyz) => [`translate3d(${xyz.map((v) => addUnit(v, "px")).join(",")})`, isValueIdentity(xyz, 0)]);
        }
        eachProp(style, (value, key) => {
          if (key === "transform") {
            inputs.push([value || ""]);
            transforms.push((transform) => [transform, transform === ""]);
          } else if (domTransforms.test(key)) {
            delete style[key];
            if (is.und(value))
              return;
            const unit = pxTransforms.test(key) ? "px" : degTransforms.test(key) ? "deg" : "";
            inputs.push(toArray(value));
            transforms.push(key === "rotate3d" ? ([x2, y2, z2, deg]) => [`rotate3d(${x2},${y2},${z2},${addUnit(deg, unit)})`, isValueIdentity(deg, 0)] : (input) => [`${key}(${input.map((v) => addUnit(v, unit)).join(",")})`, isValueIdentity(input, key.startsWith("scale") ? 1 : 0)]);
          }
        });
        if (inputs.length) {
          style.transform = new FluidTransform(inputs, transforms);
        }
        super(style);
      }
    };
    FluidTransform = class extends FluidValue {
      constructor(inputs, transforms) {
        super();
        this._value = null;
        this.inputs = inputs;
        this.transforms = transforms;
      }
      get() {
        return this._value || (this._value = this._get());
      }
      _get() {
        let transform = "";
        let identity = true;
        each(this.inputs, (input, i) => {
          const arg1 = getFluidValue(input[0]);
          const [t, id] = this.transforms[i](is.arr(arg1) ? arg1 : input.map(getFluidValue));
          transform += " " + t;
          identity = identity && id;
        });
        return identity ? "none" : transform;
      }
      observerAdded(count) {
        if (count == 1)
          each(this.inputs, (input) => each(input, (value) => hasFluidValue(value) && addFluidObserver(value, this)));
      }
      observerRemoved(count) {
        if (count == 0)
          each(this.inputs, (input) => each(input, (value) => hasFluidValue(value) && removeFluidObserver(value, this)));
      }
      eventObserved(event) {
        if (event.type == "change") {
          this._value = null;
        }
        callFluidObservers(this, event);
      }
    };
    primitives = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"];
    _excluded2 = ["scrollTop", "scrollLeft"];
    globals.assign({
      batchedUpdates: import_react_dom.unstable_batchedUpdates,
      createStringInterpolator,
      colors
    });
    host = createHost(primitives, {
      applyAnimatedValues,
      createAnimatedStyle: (style) => new AnimatedStyle(style),
      getComponentProps: (_ref) => {
        let props = _objectWithoutPropertiesLoose2(_ref, _excluded2);
        return props;
      }
    });
    animated = host.animated;
  }
});

// node_modules/react-tinder-card/index.js
var require_react_tinder_card = __commonJS({
  "node_modules/react-tinder-card/index.js"(exports, module) {
    var React3 = require_react();
    var { useSpring: useSpring2, animated: animated2 } = (init_react_spring_web_esm(), __toCommonJS(react_spring_web_esm_exports));
    var height = window.innerHeight;
    var width = window.innerWidth;
    var settings = {
      maxTilt: 25,
      // in deg
      rotationPower: 50,
      swipeThreshold: 0.5
      // need to update this threshold for RN (1.5 seems reasonable...?)
    };
    var physics = {
      touchResponsive: {
        friction: 50,
        tension: 2e3
      },
      animateOut: {
        friction: 30,
        tension: 400
      },
      animateBack: {
        friction: 10,
        tension: 200
      }
    };
    var pythagoras = (x, y) => {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };
    var normalize = (vector) => {
      const length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
      return { x: vector.x / length, y: vector.y / length };
    };
    var animateOut = async (gesture, setSpringTarget) => {
      const diagonal = pythagoras(height, width);
      const velocity = pythagoras(gesture.x, gesture.y);
      const finalX = diagonal * gesture.x;
      const finalY = diagonal * gesture.y;
      const finalRotation = gesture.x * 45;
      const duration = diagonal / velocity;
      setSpringTarget.start({
        xyrot: [finalX, finalY, finalRotation],
        config: { duration }
      });
      return await new Promise(
        (resolve) => setTimeout(() => {
          resolve();
        }, duration)
      );
    };
    var animateBack = (setSpringTarget) => {
      return new Promise((resolve) => {
        setSpringTarget.start({ xyrot: [0, 0, 0], config: physics.animateBack, onRest: resolve });
      });
    };
    var getSwipeDirection = (property) => {
      if (Math.abs(property.x) > Math.abs(property.y)) {
        if (property.x > settings.swipeThreshold) {
          return "right";
        } else if (property.x < -settings.swipeThreshold) {
          return "left";
        }
      } else {
        if (property.y > settings.swipeThreshold) {
          return "down";
        } else if (property.y < -settings.swipeThreshold) {
          return "up";
        }
      }
      return "none";
    };
    var AnimatedDiv = animated2.div;
    var TinderCard = React3.forwardRef(
      ({ flickOnSwipe = true, children, onSwipe, onCardLeftScreen, className, preventSwipe = [], swipeRequirementType = "velocity", swipeThreshold = settings.swipeThreshold, onSwipeRequirementFulfilled, onSwipeRequirementUnfulfilled }, ref) => {
        const [{ xyrot }, setSpringTarget] = useSpring2(() => ({
          xyrot: [0, 0, 0],
          config: physics.touchResponsive
        }));
        settings.swipeThreshold = swipeThreshold;
        React3.useImperativeHandle(ref, () => ({
          async swipe(dir = "right") {
            if (onSwipe)
              onSwipe(dir);
            const power = 1.3;
            const disturbance = (Math.random() - 0.5) / 2;
            if (dir === "right") {
              await animateOut({ x: power, y: disturbance }, setSpringTarget);
            } else if (dir === "left") {
              await animateOut({ x: -power, y: disturbance }, setSpringTarget);
            } else if (dir === "up") {
              await animateOut({ x: disturbance, y: power }, setSpringTarget);
            } else if (dir === "down") {
              await animateOut({ x: disturbance, y: -power }, setSpringTarget);
            }
            if (onCardLeftScreen)
              onCardLeftScreen(dir);
          },
          async restoreCard() {
            await animateBack(setSpringTarget);
          }
        }));
        const handleSwipeReleased = React3.useCallback(
          async (setSpringTarget2, gesture) => {
            const dir = getSwipeDirection({
              x: swipeRequirementType === "velocity" ? gesture.vx : gesture.dx,
              y: swipeRequirementType === "velocity" ? gesture.vy : gesture.dy
            });
            if (dir !== "none") {
              if (flickOnSwipe) {
                if (!preventSwipe.includes(dir)) {
                  if (onSwipe)
                    onSwipe(dir);
                  await animateOut(swipeRequirementType === "velocity" ? {
                    x: gesture.vx,
                    y: gesture.vy
                  } : normalize({ x: gesture.dx, y: gesture.dy }), setSpringTarget2, swipeRequirementType);
                  if (onCardLeftScreen)
                    onCardLeftScreen(dir);
                  return;
                }
              }
            }
            animateBack(setSpringTarget2);
          },
          [swipeRequirementType, flickOnSwipe, preventSwipe, onSwipe, onCardLeftScreen]
        );
        let swipeThresholdFulfilledDirection = "none";
        const gestureStateFromWebEvent = (ev, startPositon, lastPosition, isTouch) => {
          let dx = isTouch ? ev.touches[0].clientX - startPositon.x : ev.clientX - startPositon.x;
          let dy = isTouch ? ev.touches[0].clientY - startPositon.y : ev.clientY - startPositon.y;
          if (startPositon.x === 0 && startPositon.y === 0) {
            dx = 0;
            dy = 0;
          }
          const vx = -(dx - lastPosition.dx) / (lastPosition.timeStamp - Date.now());
          const vy = -(dy - lastPosition.dy) / (lastPosition.timeStamp - Date.now());
          const gestureState = { dx, dy, vx, vy, timeStamp: Date.now() };
          return gestureState;
        };
        React3.useLayoutEffect(() => {
          let startPositon = { x: 0, y: 0 };
          let lastPosition = { dx: 0, dy: 0, vx: 0, vy: 0, timeStamp: Date.now() };
          let isClicking = false;
          element.current.addEventListener("touchstart", (ev) => {
            if (!ev.srcElement.className.includes("pressable") && ev.cancelable) {
              ev.preventDefault();
            }
            const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, true);
            lastPosition = gestureState;
            startPositon = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
          });
          element.current.addEventListener("mousedown", (ev) => {
            isClicking = true;
            const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, false);
            lastPosition = gestureState;
            startPositon = { x: ev.clientX, y: ev.clientY };
          });
          const handleMove = (gestureState) => {
            if (onSwipeRequirementFulfilled || onSwipeRequirementUnfulfilled) {
              const dir = getSwipeDirection({
                x: swipeRequirementType === "velocity" ? gestureState.vx : gestureState.dx,
                y: swipeRequirementType === "velocity" ? gestureState.vy : gestureState.dy
              });
              if (dir !== swipeThresholdFulfilledDirection) {
                swipeThresholdFulfilledDirection = dir;
                if (swipeThresholdFulfilledDirection === "none") {
                  if (onSwipeRequirementUnfulfilled)
                    onSwipeRequirementUnfulfilled();
                } else {
                  if (onSwipeRequirementFulfilled)
                    onSwipeRequirementFulfilled(dir);
                }
              }
            }
            let rot = gestureState.vx * 15;
            rot = Math.max(Math.min(rot, settings.maxTilt), -settings.maxTilt);
            setSpringTarget.start({ xyrot: [gestureState.dx, gestureState.dy, rot], config: physics.touchResponsive });
          };
          window.addEventListener("mousemove", (ev) => {
            if (!isClicking)
              return;
            const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, false);
            lastPosition = gestureState;
            handleMove(gestureState);
          });
          window.addEventListener("mouseup", (ev) => {
            if (!isClicking)
              return;
            isClicking = false;
            handleSwipeReleased(setSpringTarget, lastPosition);
            startPositon = { x: 0, y: 0 };
            lastPosition = { dx: 0, dy: 0, vx: 0, vy: 0, timeStamp: Date.now() };
          });
          element.current.addEventListener("touchmove", (ev) => {
            const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, true);
            lastPosition = gestureState;
            handleMove(gestureState);
          });
          element.current.addEventListener("touchend", (ev) => {
            handleSwipeReleased(setSpringTarget, lastPosition);
            startPositon = { x: 0, y: 0 };
            lastPosition = { dx: 0, dy: 0, vx: 0, vy: 0, timeStamp: Date.now() };
          });
        });
        const element = React3.useRef();
        return React3.createElement(AnimatedDiv, {
          ref: element,
          className,
          style: {
            transform: xyrot.to((x, y, rot) => `translate3d(${x}px, ${y}px, ${0}px) rotate(${rot}deg)`)
          },
          children
        });
      }
    );
    module.exports = TinderCard;
  }
});
export default require_react_tinder_card();
//# sourceMappingURL=react-tinder-card.js.map
