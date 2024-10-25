attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat3 u_matrix;
// uniform float u_flipY;

void main() {
  v_texcoord = a_texcoord;
  // gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy * vec2(1, u_flipY), 0, 1);
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}