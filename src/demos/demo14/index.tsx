import { useEffect, useRef } from "react";
import { createAndSetupWebGL, createProgram } from "../../utils/webgl";
import vertexShaderSource from "../../shaders/demo14/vertex.glsl";
import fragShaderSource from "../../shaders/demo14/frag.glsl";
import { mat3 } from "../../utils/matrix";
import { loop } from "../../utils/loop";

export default function Demo14() {
  const containerRef = useRef<HTMLDivElement>(null);

  const render = () => {
    if (containerRef.current) {
      const gl = createAndSetupWebGL(containerRef.current);

      const program = createProgram(gl, vertexShaderSource, fragShaderSource);

      const positionAttribLoc = gl.getAttribLocation(program, "a_position");
      const colorAttribLoc = gl.getAttribLocation(program, "a_color");
      const matrixUniformLoc = gl.getUniformLocation(program, "u_matrix");
      const timeUniformLoc = gl.getUniformLocation(program, "u_time");

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

      const speed = 200 / 1000;

      let x = 0;
      let y = 0;
      let dirX = 1;
      let dirY = 1;

      const updateXY = (dt: number) => {
        x += speed * dt * dirX;
        y += speed * dt * dirY;
        if (x + 200 >= gl.canvas.width) {
          x = gl.canvas.width - 200;
          dirX *= -1;
        }
        if (x <= 0) {
          x = 0;
          dirX *= -1;
        }
        if (y + 100 >= gl.canvas.height) {
          y = gl.canvas.height - 100;
          dirY *= -1;
        }
        if (y <= 0) {
          y = 0;
          dirY *= -1;
        }
      };

      const colors = [
        Math.random(),
        Math.random(),
        Math.random(),
        1,
        Math.random(),
        Math.random(),
        Math.random(),
        1,
        Math.random(),
        Math.random(),
        Math.random(),
        1,
        Math.random(),
        Math.random(),
        Math.random(),
        1,
      ];

      let time = 0;

      const update = (dt: number) => {
        time += dt;
        updateXY(dt);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [100, 0, 0, 100, 200, 100];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttribLoc);
        gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorAttribLoc);
        gl.vertexAttribPointer(colorAttribLoc, 4, gl.FLOAT, false, 0, 0);

        let matrix = mat3.projection(gl.canvas.width, gl.canvas.height);
        matrix = mat3.translate(matrix, x, y);
        gl.uniformMatrix3fv(matrixUniformLoc, false, matrix);
        gl.uniform1f(timeUniformLoc, time / 2000);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      return loop(update);
    }
  };

  useEffect(() => {
    return render();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
}
