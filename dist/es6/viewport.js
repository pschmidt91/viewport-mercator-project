import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { createMat4 } from './math-utils';
import { worldToPixels, pixelsToWorld } from './web-mercator-utils';
import * as mat4 from 'gl-matrix/mat4';
const IDENTITY = createMat4();
export default class Viewport {
  constructor() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        _ref$viewMatrix = _ref.viewMatrix,
        viewMatrix = _ref$viewMatrix === void 0 ? IDENTITY : _ref$viewMatrix,
        _ref$projectionMatrix = _ref.projectionMatrix,
        projectionMatrix = _ref$projectionMatrix === void 0 ? IDENTITY : _ref$projectionMatrix;

    this.width = width || 1;
    this.height = height || 1;
    this.scale = 1;
    this.pixelsPerMeter = 1;
    this.viewMatrix = viewMatrix;
    this.projectionMatrix = projectionMatrix;
    const vpm = createMat4();
    mat4.multiply(vpm, vpm, this.projectionMatrix);
    mat4.multiply(vpm, vpm, this.viewMatrix);
    this.viewProjectionMatrix = vpm;
    const m = createMat4();
    mat4.scale(m, m, [this.width / 2, -this.height / 2, 1]);
    mat4.translate(m, m, [1, -1, 0]);
    mat4.multiply(m, m, this.viewProjectionMatrix);
    const mInverse = mat4.invert(createMat4(), m);

    if (!mInverse) {
      throw new Error('Pixel project matrix not invertible');
    }

    this.pixelProjectionMatrix = m;
    this.pixelUnprojectionMatrix = mInverse;
    this.equals = this.equals.bind(this);
    this.project = this.project.bind(this);
    this.unproject = this.unproject.bind(this);
    this.projectPosition = this.projectPosition.bind(this);
    this.unprojectPosition = this.unprojectPosition.bind(this);
    this.projectFlat = this.projectFlat.bind(this);
    this.unprojectFlat = this.unprojectFlat.bind(this);
  }

  equals(viewport) {
    if (!(viewport instanceof Viewport)) {
      return false;
    }

    return viewport.width === this.width && viewport.height === this.height && mat4.equals(viewport.projectionMatrix, this.projectionMatrix) && mat4.equals(viewport.viewMatrix, this.viewMatrix);
  }

  project(xyz) {
    let _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$topLeft = _ref2.topLeft,
        topLeft = _ref2$topLeft === void 0 ? true : _ref2$topLeft;

    const worldPosition = this.projectPosition(xyz);
    const coord = worldToPixels(worldPosition, this.pixelProjectionMatrix);

    const _coord = _slicedToArray(coord, 2),
          x = _coord[0],
          y = _coord[1];

    const y2 = topLeft ? y : this.height - y;
    return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
  }

  unproject(xyz) {
    let _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$topLeft = _ref3.topLeft,
        topLeft = _ref3$topLeft === void 0 ? true : _ref3$topLeft,
        targetZ = _ref3.targetZ;

    const _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          z = _xyz[2];

    const y2 = topLeft ? y : this.height - y;
    const targetZWorld = targetZ && targetZ * this.pixelsPerMeter;
    const coord = pixelsToWorld([x, y2, z], this.pixelUnprojectionMatrix, targetZWorld);

    const _this$unprojectPositi = this.unprojectPosition(coord),
          _this$unprojectPositi2 = _slicedToArray(_this$unprojectPositi, 3),
          X = _this$unprojectPositi2[0],
          Y = _this$unprojectPositi2[1],
          Z = _this$unprojectPositi2[2];

    if (Number.isFinite(z)) {
      return [X, Y, Z];
    }

    return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
  }

  projectPosition(xyz) {
    const _this$projectFlat = this.projectFlat(xyz),
          _this$projectFlat2 = _slicedToArray(_this$projectFlat, 2),
          X = _this$projectFlat2[0],
          Y = _this$projectFlat2[1];

    const Z = (xyz[2] || 0) * this.pixelsPerMeter;
    return [X, Y, Z];
  }

  unprojectPosition(xyz) {
    const _this$unprojectFlat = this.unprojectFlat(xyz),
          _this$unprojectFlat2 = _slicedToArray(_this$unprojectFlat, 2),
          X = _this$unprojectFlat2[0],
          Y = _this$unprojectFlat2[1];

    const Z = (xyz[2] || 0) / this.pixelsPerMeter;
    return [X, Y, Z];
  }

  projectFlat(xyz) {
    let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
    return xyz;
  }

  unprojectFlat(xyz) {
    let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
    return xyz;
  }

}
//# sourceMappingURL=viewport.js.map