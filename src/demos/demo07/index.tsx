import { useEffect, useRef } from "react";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";

import vertexShaderSource from "../../shaders/demo07/vertex.glsl";
import fragmentShaderSource from "../../shaders/demo07/frag.glsl";

interface IPen {
  color: number[];
  path: number[];
}

export default function Demo07() {
  const containerRef = useRef<HTMLDivElement>(null);

  const render = () => {
    if (containerRef.current) {
      const { canvas, gl } = createWebGL();
      containerRef.current.appendChild(canvas);

      const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

      const positionAttribLoc = gl.getAttribLocation(program, "a_Position");
      const colorUniformLoc = gl.getUniformLocation(program, "u_Color");
      const pointSizeUniformLoc = gl.getUniformLocation(program, "u_PointSize");
      const resolutionUniformLoc = gl.getUniformLocation(program, "u_Resolution");
      const deviceRatioUniformLoc = gl.getUniformLocation(program, "u_DeviceRatio");

      resizeGLCanvas(gl, containerRef.current.clientWidth, containerRef.current.clientHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.uniform1f(pointSizeUniformLoc, 10);
      gl.uniform1f(deviceRatioUniformLoc, window.devicePixelRatio);
      gl.uniform2f(resolutionUniformLoc, gl.canvas.width, gl.canvas.height);

      const positionBuffer = gl.createBuffer();

      const pens: Array<IPen> = [
        {
          color: [Math.random(), Math.random(), Math.random(), 1],
          path: [10, 10, 100, 100],
        },
      ];
      let canDraw = false;
      let isDrawing = false;
      let currentPen: IPen | null = null;

      const drawPens = () => {
        gl.enableVertexAttribArray(positionAttribLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        for (let i = 0; i < pens.length; i++) {
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pens[i].path), gl.STREAM_DRAW);
          gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);
          gl.uniform4fv(colorUniformLoc, new Float32Array(pens[i].color));
          gl.drawArrays(gl.LINE_STRIP, 0, pens[i].path.length / 2);
          gl.drawArrays(gl.POINTS, 0, pens[i].path.length / 2);
        }
      };

      const draw = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        drawPens();
      };

      const canvasBounds = canvas.getBoundingClientRect();

      const handleMouseMove = (evt: MouseEvent) => {
        if (canDraw && currentPen) {
          const x = evt.clientX - canvasBounds.left;
          const y = evt.clientY - canvasBounds.top;
          if (!isDrawing) {
            isDrawing = true;
            currentPen.path.push(x, y);
            pens.push(currentPen);
          } else {
            const length = currentPen.path.length;
            currentPen.path[length - 2] = x;
            currentPen.path[length - 1] = y;
          }
          draw();
        }
      };

      const handleMouseUp = (evt: MouseEvent) => {
        if (!canDraw) {
          canDraw = true;
          currentPen = {
            color: [Math.random(), Math.random(), Math.random(), 1],
            path: [evt.clientX - canvasBounds.left, evt.clientY - canvasBounds.top],
          };
          canvas.addEventListener("mousemove", handleMouseMove);
        } else {
          currentPen?.path.push(evt.clientX - canvasBounds.left, evt.clientY - canvasBounds.top);
          draw();
        }
      };

      const handleRightClick = (evt: MouseEvent) => {
        evt.preventDefault();
        if (isDrawing) {
          canDraw = false;
          isDrawing = false;
          currentPen = null;
          canvas.removeEventListener("mousemove", handleMouseMove);
        }
      };

      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("contextmenu", handleRightClick);

      draw();
    }
  };

  useEffect(() => {
    render();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
}
