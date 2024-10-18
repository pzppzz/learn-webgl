interface CreateWebGLOptions {
  width?: number;
  height?: number;
}

export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("Failed to compile shader: " + gl.getShaderInfoLog(shader));
  }

  return shader;
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = gl.createProgram();
  if (!program) {
    throw new Error("Failed to create program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("Failed to link program: " + gl.getProgramInfoLog(program));
  }

  return program;
}

export function createWebGL(options: CreateWebGLOptions = {}) {
  const { width = 500, height = 300 } = options;
  const canvas = document.createElement("canvas");
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;

  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error("WebGL is not supported");
  }

  return {
    gl,
    canvas,
  };
}
