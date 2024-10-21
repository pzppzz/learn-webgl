import { useEffect, useRef } from "react";

import vertexShaderSource from "../../shaders/demo10/vertex.glsl";
import fragmentShaderSource from "../../shaders/demo10/frag.glsl";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";

import dogSrc from "../../assets/dog.jpg";
import { mat3 } from "../../utils/matrix";

export default function Demo10() {
  const containerRef = useRef<HTMLDivElement>(null);

  const render = () => {
    if (containerRef.current) {
      const renderImage = (image: HTMLImageElement) => {
        const { canvas, gl } = createWebGL();
        containerRef.current!.appendChild(canvas);

        resizeGLCanvas(gl, containerRef.current!.clientWidth, containerRef.current!.clientHeight);

        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        const positionAttribLoc = gl.getAttribLocation(program, "a_position");
        const texcoordAttribLoc = gl.getAttribLocation(program, "a_texcoord");
        const matrixUniformLoc = gl.getUniformLocation(program, "u_matrix");

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
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
          ]),
          gl.STATIC_DRAW,
        );
        gl.enableVertexAttribArray(positionAttribLoc);
        gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);

        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1]),
          gl.STATIC_DRAW,
        );
        gl.enableVertexAttribArray(texcoordAttribLoc);
        gl.vertexAttribPointer(texcoordAttribLoc, 2, gl.FLOAT, false, 0, 0);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        let uMatrix = mat3.projection(gl.canvas.width, gl.canvas.height);
        uMatrix = mat3.scale(uMatrix, 0.5, 0.5);
        uMatrix = mat3.translate(uMatrix, 200, 200);
        gl.uniformMatrix3fv(matrixUniformLoc, false, uMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      const image = new Image();
      image.onload = () => {
        renderImage(image);
      };
      image.src = dogSrc;
    }
  };

  useEffect(() => {
    render();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
}
