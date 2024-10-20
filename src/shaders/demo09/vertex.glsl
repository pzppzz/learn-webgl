attribute vec2 a_Position;

uniform mat3 u_Matrix;

void main() {
  gl_Position = vec4((u_Matrix * vec3(a_Position, 1)).xy, 0, 1);
}
