import { useEffect, useRef } from "react";
import { createProgram, createWebGL } from "../../utils/webgl";

import vertexShaderSource from "../../shaders/basic/vertex.glsl";
import fragmentShaderSource from "../../shaders/basic/frag.glsl";

export const Demo02: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const glRef = useRef<WebGLRenderingContext>();

	const render = () => {
		if (glRef.current) {
			const gl = glRef.current;
			const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(program);

			const positionAttributeLocation = gl.getAttribLocation(program, "a_Position");
			const colorUniformLocation = gl.getUniformLocation(program, "u_Color");

			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

			gl.enableVertexAttribArray(positionAttributeLocation);
			gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
			// draw points
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5]),
				gl.STATIC_DRAW,
			);
			gl.uniform4fv(colorUniformLocation, [Math.random(), Math.random(), Math.random(), 1.0]);
			gl.drawArrays(gl.POINTS, 0, 4);
			// draw triangle
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, -0.5]),
				gl.STATIC_DRAW,
			);
			gl.uniform4fv(colorUniformLocation, [Math.random(), Math.random(), Math.random(), 1.0]);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			// draw lines
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-0.5, 0.5, 0.5, 0.5, 0.5, -0.5]),
				gl.STATIC_DRAW,
			);
			gl.uniform4fv(colorUniformLocation, [Math.random(), Math.random(), Math.random(), 1.0]);
			gl.drawArrays(gl.LINE_STRIP, 0, 3);
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
};
