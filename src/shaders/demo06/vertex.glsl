precision highp float;

attribute vec2 a_Position;
attribute float a_PointSize;
uniform vec2 u_Resolution;

void main() {
  // 坐标归一化
  vec2 zeroToOne = a_Position / u_Resolution;
  // 0,2 -> -1,1
  vec2 clipSpace = zeroToOne * 2.0 - 1.0;
  // 裁剪空间y轴方向翻转 向下为正
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  gl_PointSize = a_PointSize;
}
