interface CreateWebGLOptions {
  width?: number;
  height?: number;
}

export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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
  fragmentShaderSource: string,
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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

export function resizeGLCanvas(gl: WebGLRenderingContext, width: number, height: number) {
  (gl.canvas as HTMLCanvasElement).style.width = width + "px";
  (gl.canvas as HTMLCanvasElement).style.height = height + "px";
  (gl.canvas as HTMLCanvasElement).width = width * window.devicePixelRatio;
  (gl.canvas as HTMLCanvasElement).height = height * window.devicePixelRatio;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

export function createWebGL(options: CreateWebGLOptions = {}) {
  const { width = 500, height = 300 } = options;
  const canvas = document.createElement("canvas");

  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error("WebGL is not supported");
  }

  resizeGLCanvas(gl, width, height);

  return {
    gl,
    canvas,
  };
}

export function createAndSetupWebGL(container: HTMLElement) {
  const { gl, canvas } = createWebGL({
    width: container.clientWidth,
    height: container.clientHeight,
  });
  container.appendChild(canvas);
  return gl;
}

export function createAndSetupTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}
