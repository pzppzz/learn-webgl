import { useEffect, useRef } from "react";
import dogSrc from "../../assets/dog.jpg";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";
import vertexShaderSource from "../../shaders/demo12/vertex.glsl";
import fragShaderSource from "../../shaders/demo12/frag.glsl";
import { mat3 } from "../../utils/matrix";
import { useSetupInputUI } from "../../hooks/useSetupInputUI";
import { useWatcher } from "../../hooks/useWatcher";
import { IMAGE_KERNELS } from "../../constants";

export default function Demo12() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { UIView, uiState } = useSetupInputUI({
    kernel: {
      type: "select",
      label: "kernel",
      defaultValue: "normal",
      options: Array.from(Object.keys(IMAGE_KERNELS), (k) => ({
        label: k,
        value: k,
      })),
    },
  });
  const kernelWatcher = useWatcher(uiState.kernel);

  const render = (image: HTMLImageElement) => {
    if (containerRef.current) {
      const { gl, canvas } = createWebGL();
      containerRef.current.appendChild(canvas);
      resizeGLCanvas(gl, containerRef.current.clientWidth, containerRef.current.clientHeight);

      const program = createProgram(gl, vertexShaderSource, fragShaderSource);

      const positionAttribLoc = gl.getAttribLocation(program, "a_position");
      const texcoordAttribLoc = gl.getAttribLocation(program, "a_texcoord");
      const matrixUniformLoc = gl.getUniformLocation(program, "u_matrix");
      const textureSizeUniformLoc = gl.getUniformLocation(program, "u_texture_size");
      const kernelUniformLoc = gl.getUniformLocation(program, "u_kernel");
      const kernelWeightLoc = gl.getUniformLocation(program, "u_kernel_weight");

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positionData = [
        0,
        0,
        0,
        image.height,
        image.width,
        image.height,
        0,
        0,
        image.width,
        0,
        image.width,
        image.height,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttribLoc);
      gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);

      const texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      const texcoordData = [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordData), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(texcoordAttribLoc);
      gl.vertexAttribPointer(texcoordAttribLoc, 2, gl.FLOAT, false, 0, 0);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      const update = (kernelName: string) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        const uMatrix = mat3.projection(gl.canvas.width, gl.canvas.height);
        gl.uniformMatrix3fv(matrixUniformLoc, false, uMatrix);
        gl.uniform2f(textureSizeUniformLoc, image.width, image.height);
        const kernel = IMAGE_KERNELS[kernelName];
        const sum = kernel.reduce((sum, num) => sum + num, 0);
        const weight = sum <= 0 ? 1 : sum;
        gl.uniform1fv(kernelUniformLoc, kernel);
        gl.uniform1f(kernelWeightLoc, weight);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      kernelWatcher.attach(update);
    }
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      render(image);
    };
    image.src = dogSrc;
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
      <div style={{ position: "absolute", right: 12, bottom: 12 }}>{UIView}</div>
    </>
  );
}
