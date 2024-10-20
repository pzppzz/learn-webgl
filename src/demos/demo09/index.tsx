import { useEffect, useRef, useState } from "react";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";

import vertexShaderSource from "../../shaders/demo09/vertex.glsl";
import fragmentShaderSource from "../../shaders/demo09/frag.glsl";
import { mat3 } from "../../utils/matrix";

export default function Demo09() {
	const containerRef = useRef<HTMLDivElement>(null);
	const isDirty = useRef(true);
	const [transforms] = useState({
		x: 100,
		y: 100,
		scaleX: 1,
		scaleY: 1,
		rotation: 0,
	});

	const onTransformChange = (type: keyof typeof transforms, value: number) => {
		transforms[type] = value;
		isDirty.current = true;
	};

	const render = () => {
		if (containerRef.current) {
			const { canvas, gl } = createWebGL();
			containerRef.current.appendChild(canvas);
			resizeGLCanvas(gl, containerRef.current.clientWidth, containerRef.current.clientHeight);

			const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

			const posAttribLoc = gl.getAttribLocation(program, "a_Position");
			const colorUniformLoc = gl.getUniformLocation(program, "u_Color");
			const matrixUniformLoc = gl.getUniformLocation(program, "u_Matrix");

			const positionBuffer = gl.createBuffer();
			const positionData = [0, 0, 0, 100, 200, 100, 0, 0, 200, 0, 200, 100];
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);

			const color = [Math.random(), Math.random(), Math.random(), 1];

			const draw = () => {
				gl.clearColor(0, 0, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.useProgram(program);

				const angle = 360 - transforms.rotation;
				const rotateMat = mat3.rotate(mat3.create(), angle);
				const projectionMat = mat3.projection(gl.canvas.width, gl.canvas.height);
				const scaleMat = mat3.scale(mat3.create(), transforms.scaleX, transforms.scaleY);
				const translateMat = mat3.translate(mat3.create(), transforms.x, transforms.y);

				gl.enableVertexAttribArray(posAttribLoc);
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, false, 0, 0);

				gl.uniform4fv(colorUniformLoc, color);

				let uMatrix = projectionMat;
				for (let i = 0; i < 5; i++) {
					uMatrix = mat3.multiply(uMatrix, translateMat);
					uMatrix = mat3.multiply(uMatrix, rotateMat);
					uMatrix = mat3.multiply(uMatrix, scaleMat);
					gl.uniformMatrix3fv(matrixUniformLoc, false, uMatrix);
					gl.drawArrays(gl.TRIANGLES, 0, 6);
				}
			};

			const renderLoop = () => {
				if (isDirty.current) {
					isDirty.current = false;
					draw();
				}
				requestAnimationFrame(renderLoop);
			};

			renderLoop();
		}
	};

	useEffect(() => {
		render();
	}, []);

	return (
		<div ref={containerRef} style={{ width: "100%", height: "100%" }}>
			<div
				style={{ position: "absolute", top: 0, right: 0, display: "flex", flexDirection: "column" }}
			>
				<label>
					translateX:
					<input
						type="range"
						min={-600}
						max={600}
						defaultValue={transforms.x}
						onChange={(e) => onTransformChange("x", +e.target.value)}
					/>
				</label>
				<label>
					translateY:
					<input
						type="range"
						min={-600}
						max={600}
						defaultValue={transforms.y}
						onChange={(e) => onTransformChange("y", +e.target.value)}
					/>
				</label>
				<label>
					scaleX:
					<input
						type="range"
						min={-5}
						max={5}
						step={0.1}
						defaultValue={transforms.scaleX}
						onChange={(e) => onTransformChange("scaleX", +e.target.value)}
					/>
				</label>
				<label>
					scaleY:
					<input
						type="range"
						min={-5}
						max={5}
						step={0.1}
						defaultValue={transforms.scaleY}
						onChange={(e) => onTransformChange("scaleY", +e.target.value)}
					/>
				</label>
				<label>
					rotation:
					<input
						type="range"
						min={0}
						max={360}
						defaultValue={transforms.rotation}
						onChange={(e) => onTransformChange("rotation", +e.target.value)}
					/>
				</label>
			</div>
		</div>
	);
}
