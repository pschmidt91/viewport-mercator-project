import WebMercatorViewport from './web-mercator-viewport';
import { mod } from './math-utils';
const MAX_LATITUDE = 85.05113;
const MIN_LATITUDE = -85.05113;
export default function normalizeViewportProps(_ref) {
  let width = _ref.width,
      height = _ref.height,
      longitude = _ref.longitude,
      latitude = _ref.latitude,
      zoom = _ref.zoom,
      _ref$pitch = _ref.pitch,
      pitch = _ref$pitch === void 0 ? 0 : _ref$pitch,
      _ref$bearing = _ref.bearing,
      bearing = _ref$bearing === void 0 ? 0 : _ref$bearing;

  if (longitude < -180 || longitude > 180) {
    longitude = mod(longitude + 180, 360) - 180;
  }

  if (bearing < -180 || bearing > 180) {
    bearing = mod(bearing + 180, 360) - 180;
  }

  let flatViewport = new WebMercatorViewport({
    width,
    height,
    longitude,
    latitude,
    zoom
  });
  let topY = flatViewport.project([longitude, MAX_LATITUDE])[1];
  let bottomY = flatViewport.project([longitude, MIN_LATITUDE])[1];
  let shiftY = 0;

  if (bottomY - topY < height) {
    zoom += Math.log2(height / (bottomY - topY));
    flatViewport = new WebMercatorViewport({
      width,
      height,
      longitude,
      latitude,
      zoom
    });
    topY = flatViewport.project([longitude, MAX_LATITUDE])[1];
    bottomY = flatViewport.project([longitude, MIN_LATITUDE])[1];
  }

  if (topY > 0) {
    shiftY = topY;
  } else if (bottomY < height) {
    shiftY = bottomY - height;
  }

  if (shiftY) {
    latitude = flatViewport.unproject([width / 2, height / 2 + shiftY])[1];
  }

  return {
    width,
    height,
    longitude,
    latitude,
    zoom,
    pitch,
    bearing
  };
}
//# sourceMappingURL=normalize-viewport-props.js.map