import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Viewport from './viewport';
import { zoomToScale, pixelsToWorld, lngLatToWorld, worldToLngLat, getProjectionMatrix, getDistanceScales, getViewMatrix } from './web-mercator-utils';
import _fitBounds from './fit-bounds';
import * as vec2 from 'gl-matrix/vec2';

var WebMercatorViewport = function (_Viewport) {
  _inherits(WebMercatorViewport, _Viewport);

  function WebMercatorViewport() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        _ref$latitude = _ref.latitude,
        latitude = _ref$latitude === void 0 ? 0 : _ref$latitude,
        _ref$longitude = _ref.longitude,
        longitude = _ref$longitude === void 0 ? 0 : _ref$longitude,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === void 0 ? 0 : _ref$zoom,
        _ref$pitch = _ref.pitch,
        pitch = _ref$pitch === void 0 ? 0 : _ref$pitch,
        _ref$bearing = _ref.bearing,
        bearing = _ref$bearing === void 0 ? 0 : _ref$bearing,
        _ref$altitude = _ref.altitude,
        altitude = _ref$altitude === void 0 ? 1.5 : _ref$altitude,
        nearZMultiplier = _ref.nearZMultiplier,
        farZMultiplier = _ref.farZMultiplier;

    _classCallCheck(this, WebMercatorViewport);

    width = width || 1;
    height = height || 1;
    var scale = zoomToScale(zoom);
    altitude = Math.max(0.75, altitude);
    var center = lngLatToWorld([longitude, latitude], scale);
    center[2] = 0;
    var projectionMatrix = getProjectionMatrix({
      width: width,
      height: height,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      nearZMultiplier: nearZMultiplier || 1 / height,
      farZMultiplier: farZMultiplier || 1.01
    });
    var viewMatrix = getViewMatrix({
      height: height,
      center: center,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      flipY: true
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebMercatorViewport).call(this, {
      width: width,
      height: height,
      viewMatrix: viewMatrix,
      projectionMatrix: projectionMatrix
    }));
    _this.latitude = latitude;
    _this.longitude = longitude;
    _this.zoom = zoom;
    _this.pitch = pitch;
    _this.bearing = bearing;
    _this.altitude = altitude;
    _this.scale = scale;
    _this.center = center;
    _this.pixelsPerMeter = getDistanceScales(_assertThisInitialized(_this)).pixelsPerMeter[2];
    Object.freeze(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WebMercatorViewport, [{
    key: "projectFlat",
    value: function projectFlat(lngLat) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return lngLatToWorld(lngLat, scale);
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xy) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return worldToLngLat(xy, scale);
    }
  }, {
    key: "getMapCenterByLngLatPosition",
    value: function getMapCenterByLngLatPosition(_ref2) {
      var lngLat = _ref2.lngLat,
          pos = _ref2.pos;
      var fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
      var toLocation = lngLatToWorld(lngLat, this.scale);
      var translate = vec2.add([], toLocation, vec2.negate([], fromLocation));
      var newCenter = vec2.add([], this.center, translate);
      return worldToLngLat(newCenter, this.scale);
    }
  }, {
    key: "getLocationAtPoint",
    value: function getLocationAtPoint(_ref3) {
      var lngLat = _ref3.lngLat,
          pos = _ref3.pos;
      return this.getMapCenterByLngLatPosition({
        lngLat: lngLat,
        pos: pos
      });
    }
  }, {
    key: "fitBounds",
    value: function fitBounds(bounds) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var width = this.width,
          height = this.height;

      var _fitBounds2 = _fitBounds(Object.assign({
        width: width,
        height: height,
        bounds: bounds
      }, options)),
          longitude = _fitBounds2.longitude,
          latitude = _fitBounds2.latitude,
          zoom = _fitBounds2.zoom;

      return new WebMercatorViewport({
        width: width,
        height: height,
        longitude: longitude,
        latitude: latitude,
        zoom: zoom
      });
    }
  }]);

  return WebMercatorViewport;
}(Viewport);

export { WebMercatorViewport as default };
//# sourceMappingURL=web-mercator-viewport.js.map