import { useEffect, useRef } from "react";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";

import vertexShaderSource from "../../shaders/demo06/vertex.glsl";
import fragmentShaderSource from "../../shaders/demo06/frag.glsl";

export default function Demo06() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext>();

  const render = () => {
    if (glRef.current) {
      const gl = glRef.current;
      const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

      const positionAttributeLocation = gl.getAttribLocation(program, "a_Position");
      const pointSizeAttributeLocation = gl.getAttribLocation(program, "a_PointSize");
      const resolutionUniformLocation = gl.getUniformLocation(program, "u_Resolution");
      const colorUniformLocation = gl.getUniformLocation(program, "u_Color");

      resizeGLCanvas(gl, containerRef.current!.clientWidth, containerRef.current!.clientHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      // 绘制x轴和y轴
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const lines = [5, 5, gl.canvas.width / 2, 5, 5, 5, 5, gl.canvas.height / 2];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform4f(colorUniformLocation, 0, 0, 0, 1);

      gl.drawArrays(gl.LINES, 0, 4);

      // 绘制原点
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([5, 5]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      const pointSizeBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([10]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(pointSizeAttributeLocation);
      gl.vertexAttribPointer(pointSizeAttributeLocation, 1, gl.FLOAT, false, 0, 0);
      gl.uniform4f(colorUniformLocation, 254 / 255, 82 / 255, 33 / 255, 1);
      gl.drawArrays(gl.POINTS, 0, 1);
      gl.deleteBuffer(pointSizeBuffer);
      // fix INVALID_OPERATION: drawArrays: no buffer is bound to enabled attribute
      gl.disableVertexAttribArray(pointSizeAttributeLocation);

      // 绘制O 椭圆
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const radius = 6;
      const points = [];
      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);
        if (angle < Math.PI) {
          y += 2;
        }
        if (angle > Math.PI) {
          y -= 2;
        }
        points.push(x + 20, y + 20);
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform4f(colorUniformLocation, 100 / 255, 150 / 255, 238 / 255, 1);
      gl.drawArrays(gl.LINE_LOOP, 0, 100);

      // 绘制箭头
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const arrows = [
        0,
        gl.canvas.height / 2,
        10,
        gl.canvas.height / 2,
        5,
        gl.canvas.height / 2 + 10,
        gl.canvas.width / 2,
        0,
        gl.canvas.width / 2,
        10,
        gl.canvas.width / 2 + 10,
        5,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrows), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform4f(colorUniformLocation, 0, 0, 0, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const { canvas, gl } = createWebGL({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
      glRef.current = gl;
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(canvas);
      render();
    }
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
}
