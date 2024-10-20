precision highp float;

attribute vec2 a_Position;
uniform vec2 u_Translate;
uniform vec2 u_Scale;
uniform vec2 u_Rotation;
uniform vec2 u_Resolution;
uniform float u_DeviceRatio;

void main() {
  vec2 scaledPos = a_Position * u_Scale;
  vec2 rotatedPos = vec2(
    scaledPos.x * u_Rotation.y - scaledPos.y * u_Rotation.x,
    scaledPos.y * u_Rotation.y + scaledPos.x * u_Rotation.x);
  vec2 translatedPos = rotatedPos + u_Translate;
  vec2 zeroToOne = translatedPos * u_DeviceRatio / u_Resolution;
  vec2 clipPoint = zeroToOne * 2.0 - 1.0;
  gl_Position = vec4(clipPoint * vec2(1, -1), 0, 1);
}
