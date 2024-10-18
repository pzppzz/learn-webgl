precision mediump float;
attribute vec3 a_Position;

void main() {
  gl_PointSize = 10.0;
  gl_Position = vec4(a_Position, 1.0);
}