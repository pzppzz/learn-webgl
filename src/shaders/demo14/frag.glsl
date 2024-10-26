precision highp float;

varying vec4 v_color;

uniform float u_time;

void main() {
  // 计算三个颜色权重，使其值在 0 到 1 之间波动
  float weight1 = 0.5 + 0.5 * sin(u_time);         // 第一个颜色的权重
  float weight2 = 0.5 + 0.5 * sin(u_time + 4.0);   // 第二个颜色的权重
  float weight3 = 0.5 + 0.5 * sin(u_time + 8.0);   // 第三个颜色的权重
  // 对颜色进行加权混合
  vec3 color = vec3(v_color.r, 0, 0) * weight1 + vec3(0.0, v_color.g, 0.0) * weight2 + vec3(0.0, 0.0, v_color.b) * weight3;
  gl_FragColor = vec4(color, 1.0);
}
