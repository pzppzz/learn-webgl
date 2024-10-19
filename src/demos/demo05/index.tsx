import { useEffect, useRef } from "react";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";

import vertexShaderSource from "../../shaders/basic/vertex.glsl";
import fragmentShaderSource from "../../shaders/basic/frag.glsl";

export default function Demo05() {
	const containerRef = useRef<HTMLDivElement>(null);
	const glRef = useRef<WebGLRenderingContext>();

	const render = () => {
		if (glRef.current) {
			const gl = glRef.current;
			const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
			const positionAttributeLocation = gl.getAttribLocation(program, "a_Position");
			const colorUniformLocation = gl.getUniformLocation(program, "u_Color");
			gl.useProgram(program);
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

			gl.enableVertexAttribArray(positionAttributeLocation);
			gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

			function draw() {
				resizeGLCanvas(gl, containerRef.current!.clientWidth, containerRef.current!.clientHeight);
				gl.clearColor(0, 0, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);

				const resolution = gl.canvas.width / gl.canvas.height;
				{
					// draw fill circle
					const positions = [];
					const radius = 0.3;
					const numPoints = 100;
					for (let i = 0; i < numPoints; i++) {
						const angle = (i / numPoints) * Math.PI * 2;
						const x = Math.cos(angle) * radius;
						const y = Math.sin(angle) * radius * resolution;
						positions.push(x, y);
					}
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
					gl.uniform4fv(colorUniformLocation, [Math.random(), Math.random(), Math.random(), 1.0]);
					gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
				}
				{
					// draw stroke circle
					const positions = [];
					const radius = 0.4;
					const numPoints = 100;
					for (let i = 0; i < numPoints; i++) {
						const angle = (i / numPoints) * Math.PI * 2;
						const x = Math.cos(angle) * radius;
						const y = Math.sin(angle) * radius * resolution;
						positions.push(x, y);
					}
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
					gl.uniform4fv(colorUniformLocation, [Math.random(), Math.random(), Math.random(), 1.0]);
					gl.drawArrays(gl.LINE_LOOP, 0, numPoints);
				}
				{
					// draw stroke polygon
					const positions = [];
					const radius = 0.5;
					const numPoints = 6;
					for (let i = 0; i < numPoints; i++) {
						const angle = (i / numPoints) * Math.PI * 2;
						const x = Math.cos(angle) * radius;
						const y = Math.sin(angle) * radius * resolution;
						positions.push(x, y);
					}
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
					gl.uniform4fv(colorUniformLocation, [Math.random(), Math.random(), Math.random(), 1.0]);
					gl.drawArrays(gl.LINE_LOOP, 0, numPoints);
				}
			}

			window.addEventListener("resize", draw);
			draw();

			return () => {
				window.removeEventListener("resize", draw);
			};
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
			return render();
		}
	}, []);

	return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
}
