import { useEffect, useRef } from "react";

import vertexShaderSource from "../../shaders/demo13/vertex.glsl";
import fragShaderSource from "../../shaders/demo12/frag.glsl";

import dogSrc from "../../assets/dog.jpg";
import { createAndSetupTexture, createAndSetupWebGL, createProgram } from "../../utils/webgl";
import { mat3 } from "../../utils/matrix";
import { useSetupInputUI } from "../../hooks/useSetupInputUI";
import { IMAGE_KERNELS } from "../../constants";
import { loop } from "../../utils/loop";

export default function Demo13() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { UIView, syncUIState } = useSetupInputUI({
    kernel: {
      type: "select",
      label: "kernel",
      multiple: true,
      defaultValue: ["emboss", "gaussianBlur"],
      size: Object.keys(IMAGE_KERNELS).length,
      options: Array.from(Object.keys(IMAGE_KERNELS), (k) => ({
        label: k,
        value: k,
      })),
    },
  });

  const render = (image: HTMLImageElement) => {
    if (containerRef.current) {
      const gl = createAndSetupWebGL(containerRef.current);

      const program = createProgram(gl, vertexShaderSource, fragShaderSource);

      const positionAttribLoc = gl.getAttribLocation(program, "a_position");
      const texcoordAttribLoc = gl.getAttribLocation(program, "a_texcoord");
      const matrixUniformLoc = gl.getUniformLocation(program, "u_matrix");
      // const flipYUniformLoc = gl.getUniformLocation(program, "u_flipY");
      const kernelUniformLoc = gl.getUniformLocation(program, "u_kernel");
      const textureSizeUniformLoc = gl.getUniformLocation(program, "u_texture_size");
      const kernelWeightUniformLoc = gl.getUniformLocation(program, "u_kernel_weight");

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positionData = new Float32Array([
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
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

      const texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      const texcoordData = new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, texcoordData, gl.STATIC_DRAW);

      const textures: WebGLTexture[] = [];
      const frameBuffers: WebGLFramebuffer[] = [];

      for (let i = 0; i < 2; i++) {
        const texture = createAndSetupTexture(gl)!;
        textures.push(texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          image.width,
          image.height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );

        const frameBuffer = gl.createFramebuffer()!;
        frameBuffers.push(frameBuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      }

      const texture = createAndSetupTexture(gl);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      const update = () => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionAttribLoc);
        gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordAttribLoc);
        gl.vertexAttribPointer(texcoordAttribLoc, 2, gl.FLOAT, false, 0, 0);

        const applyNames = syncUIState.current.kernel as string[];

        // 在帧缓冲渲染效果时不翻转y轴
        // gl.uniform1f(flipYUniformLoc, -1);
        gl.uniform2f(textureSizeUniformLoc, image.width, image.height);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        for (let i = 0; i < applyNames.length; i++) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[i % 2]);

          let kernelWeight = IMAGE_KERNELS[applyNames[i]].reduce((acc, cur) => acc + cur, 0);
          kernelWeight = kernelWeight <= 0 ? 1 : kernelWeight;

          let uMatrix = mat3.projection(image.width, image.height);
          const flipYMatrix = mat3.create();
          flipYMatrix[4] = -1;
          uMatrix = mat3.multiply(flipYMatrix, uMatrix);

          gl.uniform1f(kernelWeightUniformLoc, kernelWeight);
          gl.uniform1fv(kernelUniformLoc, IMAGE_KERNELS[applyNames[i]]);
          gl.uniformMatrix3fv(matrixUniformLoc, false, uMatrix);
          gl.viewport(0, 0, image.width, image.height);
          gl.drawArrays(gl.TRIANGLES, 0, 6);

          gl.bindTexture(gl.TEXTURE_2D, textures[i % 2]);
        }

        let uMatrix = mat3.projection(gl.canvas.width, gl.canvas.height);
        uMatrix = mat3.translate(
          uMatrix,
          gl.canvas.width / 2 - image.width / 2,
          gl.canvas.height / 2 - image.height / 2,
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // gl.uniform1f(flipYUniformLoc, 1);
        gl.uniform1f(kernelWeightUniformLoc, 1);
        gl.uniform1fv(kernelUniformLoc, IMAGE_KERNELS["normal"]);
        gl.uniformMatrix3fv(matrixUniformLoc, false, uMatrix);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      loop(update);
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
