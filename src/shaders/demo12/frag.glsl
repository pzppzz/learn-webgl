precision highp float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform float u_kernel[9];
uniform float u_kernel_weight;

void main() {
  vec2 unit = vec2(1.0, 1.0) / u_texture_size;
  // vec4 leftColor = texture2D(u_texture, v_texcoord - unit);
  // vec4 rightColor = texture2D(u_texture, v_texcoord + unit);
  // vec4 midColor = texture2D(u_texture, v_texcoord);
  // gl_FragColor = (leftColor + midColor + rightColor) / 3.0;
  vec4 colorSum =
    texture2D(u_texture, v_texcoord + unit * vec2(-1, -1)) * u_kernel[0] +
    texture2D(u_texture, v_texcoord + unit * vec2( 0, -1)) * u_kernel[1] +
    texture2D(u_texture, v_texcoord + unit * vec2( 1, -1)) * u_kernel[2] +
    texture2D(u_texture, v_texcoord + unit * vec2(-1,  0)) * u_kernel[3] +
    texture2D(u_texture, v_texcoord + unit * vec2( 0,  0)) * u_kernel[4] +
    texture2D(u_texture, v_texcoord + unit * vec2( 1,  0)) * u_kernel[5] +
    texture2D(u_texture, v_texcoord + unit * vec2(-1,  1)) * u_kernel[6] +
    texture2D(u_texture, v_texcoord + unit * vec2( 0,  1)) * u_kernel[7] +
    texture2D(u_texture, v_texcoord + unit * vec2( 1,  1)) * u_kernel[8] ;
 
   // 只把rgb值求和除以权重
   // 将阿尔法值设为 1.0
   gl_FragColor = vec4((colorSum / u_kernel_weight).rgb, 1); 
}