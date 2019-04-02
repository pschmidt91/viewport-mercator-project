import Viewport from './viewport';
import { zoomToScale, pixelsToWorld, lngLatToWorld, worldToLngLat, getProjectionMatrix, getDistanceScales, getViewMatrix } from './web-mercator-utils';
import fitBounds from './fit-bounds';
import * as vec2 from 'gl-matrix/vec2';
export default class WebMercatorViewport extends Viewport {
  constructor() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
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

    width = width || 1;
    height = height || 1;
    const scale = zoomToScale(zoom);
    altitude = Math.max(0.75, altitude);
    const center = lngLatToWorld([longitude, latitude], scale);
    center[2] = 0;
    const projectionMatrix = getProjectionMatrix({
      width,
      height,
      pitch,
      bearing,
      altitude,
      nearZMultiplier: nearZMultiplier || 1 / height,
      farZMultiplier: farZMultiplier || 1.01
    });
    const viewMatrix = getViewMatrix({
      height,
      center,
      pitch,
      bearing,
      altitude,
      flipY: true
    });
    super({
      width,
      height,
      viewMatrix,
      projectionMatrix
    });
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
    this.pitch = pitch;
    this.bearing = bearing;
    this.altitude = altitude;
    this.scale = scale;
    this.center = center;
    this.pixelsPerMeter = getDistanceScales(this).pixelsPerMeter[2];
    Object.freeze(this);
  }

  projectFlat(lngLat) {
    let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
    return lngLatToWorld(lngLat, scale);
  }

  unprojectFlat(xy) {
    let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
    return worldToLngLat(xy, scale);
  }

  getMapCenterByLngLatPosition(_ref2) {
    let lngLat = _ref2.lngLat,
        pos = _ref2.pos;
    const fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
    const toLocation = lngLatToWorld(lngLat, this.scale);
    const translate = vec2.add([], toLocation, vec2.negate([], fromLocation));
    const newCenter = vec2.add([], this.center, translate);
    return worldToLngLat(newCenter, this.scale);
  }

  getLocationAtPoint(_ref3) {
    let lngLat = _ref3.lngLat,
        pos = _ref3.pos;
    return this.getMapCenterByLngLatPosition({
      lngLat,
      pos
    });
  }

  fitBounds(bounds) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const width = this.width,
          height = this.height;

    const _fitBounds = fitBounds(Object.assign({
      width,
      height,
      bounds
    }, options)),
          longitude = _fitBounds.longitude,
          latitude = _fitBounds.latitude,
          zoom = _fitBounds.zoom;

    return new WebMercatorViewport({
      width,
      height,
      longitude,
      latitude,
      zoom
    });
  }

}
//# sourceMappingURL=web-mercator-viewport.js.map