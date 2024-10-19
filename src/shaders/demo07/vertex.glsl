precision highp float;

attribute vec2 a_Position;
uniform vec2 u_Resolution;
uniform float u_PointSize;
uniform float u_DeviceRatio;

void main() {
  vec2 zeroToOne = a_Position * u_DeviceRatio / u_Resolution;
  vec2 clipPoint = zeroToOne * 2.0 - 1.0;
  gl_Position = vec4(clipPoint * vec2(1, -1), 0, 1);
  gl_PointSize = u_PointSize;
}
