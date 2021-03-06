import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import WebMercatorViewport from './web-mercator-viewport';
import assert from './assert';
export default function fitBounds(_ref) {
  let width = _ref.width,
      height = _ref.height,
      bounds = _ref.bounds,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 0 : _ref$padding,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? [0, 0] : _ref$offset;

  const _bounds = _slicedToArray(bounds, 2),
        _bounds$ = _slicedToArray(_bounds[0], 2),
        west = _bounds$[0],
        south = _bounds$[1],
        _bounds$2 = _slicedToArray(_bounds[1], 2),
        east = _bounds$2[0],
        north = _bounds$2[1];

  if (Number.isFinite(padding)) {
    const p = padding;
    padding = {
      top: p,
      bottom: p,
      left: p,
      right: p
    };
  } else {
    assert(Number.isFinite(padding.top) && Number.isFinite(padding.bottom) && Number.isFinite(padding.left) && Number.isFinite(padding.right));
  }

  const viewport = new WebMercatorViewport({
    width,
    height,
    longitude: 0,
    latitude: 0,
    zoom: 0
  });
  const nw = viewport.project([west, north]);
  const se = viewport.project([east, south]);
  const size = [Math.abs(se[0] - nw[0]), Math.abs(se[1] - nw[1])];
  const targetSize = [width - padding.left - padding.right - Math.abs(offset[0]) * 2, height - padding.top - padding.bottom - Math.abs(offset[1]) * 2];
  const scaleX = targetSize[0] / size[0];
  const scaleY = targetSize[1] / size[1];
  const offsetX = (padding.right - padding.left) / 2 / scaleX;
  const offsetY = (padding.bottom - padding.top) / 2 / scaleY;
  const center = [(se[0] + nw[0]) / 2 + offsetX, (se[1] + nw[1]) / 2 + offsetY];
  const centerLngLat = viewport.unproject(center);
  const zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));
  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom
  };
}
//# sourceMappingURL=fit-bounds.js.map