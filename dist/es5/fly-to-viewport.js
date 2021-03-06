"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flyToViewport;

var _mathUtils = require("./math-utils");

var _webMercatorUtils = require("./web-mercator-utils");

var vec2 = _interopRequireWildcard(require("gl-matrix/vec2"));

var EPSILON = 0.01;
var VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom'];

function flyToViewport(startProps, endProps, t) {
  var viewport = {};
  var rho = 1.414;
  var startZoom = startProps.zoom;
  var startCenter = [startProps.longitude, startProps.latitude];
  var startScale = (0, _webMercatorUtils.zoomToScale)(startZoom);
  var endZoom = endProps.zoom;
  var endCenter = [endProps.longitude, endProps.latitude];
  var scale = (0, _webMercatorUtils.zoomToScale)(endZoom - startZoom);
  var startCenterXY = (0, _webMercatorUtils.lngLatToWorld)(startCenter, startScale);
  var endCenterXY = (0, _webMercatorUtils.lngLatToWorld)(endCenter, startScale);
  var uDelta = vec2.sub([], endCenterXY, startCenterXY);
  var w0 = Math.max(startProps.width, startProps.height);
  var w1 = w0 / scale;
  var u1 = vec2.length(uDelta);

  if (Math.abs(u1) < EPSILON) {
    var _arr = VIEWPORT_TRANSITION_PROPS;

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];
      var startValue = startProps[key];
      var endValue = endProps[key];
      viewport[key] = (0, _mathUtils.lerp)(startValue, endValue, t);
    }

    return viewport;
  }

  var rho2 = rho * rho;
  var b0 = (w1 * w1 - w0 * w0 + rho2 * rho2 * u1 * u1) / (2 * w0 * rho2 * u1);
  var b1 = (w1 * w1 - w0 * w0 - rho2 * rho2 * u1 * u1) / (2 * w1 * rho2 * u1);
  var r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  var r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  var S = (r1 - r0) / rho;
  var s = t * S;
  var w = Math.cosh(r0) / Math.cosh(r0 + rho * s);
  var u = w0 * ((Math.cosh(r0) * Math.tanh(r0 + rho * s) - Math.sinh(r0)) / rho2) / u1;
  var scaleIncrement = 1 / w;
  var newZoom = startZoom + (0, _webMercatorUtils.scaleToZoom)(scaleIncrement);
  var newCenterWorld = vec2.scale([], uDelta, u);
  vec2.add(newCenterWorld, newCenterWorld, startCenterXY);
  vec2.scale(newCenterWorld, newCenterWorld, scaleIncrement);
  var newCenter = (0, _webMercatorUtils.worldToLngLat)(newCenterWorld, (0, _webMercatorUtils.zoomToScale)(newZoom));
  viewport.longitude = newCenter[0];
  viewport.latitude = newCenter[1];
  viewport.zoom = newZoom;
  return viewport;
}
//# sourceMappingURL=fly-to-viewport.js.map