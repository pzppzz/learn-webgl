type Mat3 = [number, number, number, number, number, number, number, number, number];

const DEFAULT_MAT3: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export const mat3 = {
  create() {
    return [...DEFAULT_MAT3] as Mat3;
  },
  projection(width: number, height: number) {
    const mat = mat3.create();
    mat[0] = 2 / width;
    mat[4] = -2 / height;
    mat[6] = -1;
    mat[7] = 1;
    return mat;
  },
  translate(target: Mat3, x: number, y: number) {
    const translateMat = mat3.create();
    translateMat[6] = x;
    translateMat[7] = y;
    return mat3.multiply(target, translateMat);
  },
  scale(target: Mat3, x: number, y: number) {
    const scaleMat = mat3.create();
    scaleMat[0] = x;
    scaleMat[4] = y;
    return mat3.multiply(target, scaleMat);
  },
  rotate(target: Mat3, angle: number) {
    const radian = (angle * Math.PI) / 180;
    const rotateMat = mat3.create();
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    rotateMat[0] = cos;
    rotateMat[1] = sin;
    rotateMat[3] = -sin;
    rotateMat[4] = cos;
    return mat3.multiply(target, rotateMat);
  },
  multiply(a: Mat3, b: Mat3) {
    const a00 = a[0 * 3 + 0];
    const a01 = a[0 * 3 + 1];
    const a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0];
    const a11 = a[1 * 3 + 1];
    const a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0];
    const a21 = a[2 * 3 + 1];
    const a22 = a[2 * 3 + 2];
    const b00 = b[0 * 3 + 0];
    const b01 = b[0 * 3 + 1];
    const b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0];
    const b11 = b[1 * 3 + 1];
    const b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0];
    const b21 = b[2 * 3 + 1];
    const b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ] as Mat3;
  },
};
