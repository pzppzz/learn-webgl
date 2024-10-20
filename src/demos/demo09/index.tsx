import { useEffect, useRef } from "react";
import { createProgram, createWebGL, resizeGLCanvas } from "../../utils/webgl";

import vertexShaderSource from "../../shaders/demo09/vertex.glsl";
import fragmentShaderSource from "../../shaders/demo09/frag.glsl";
import { mat3 } from "../../utils/matrix";
import { useSetupInputUI } from "../../hooks/useSetupInputUI";

export default function Demo09() {
	const containerRef = useRef<HTMLDivElement>(null);
	const isDirty = useRef(true);
	const { syncUIState, UIView } = useSetupInputUI(
		{
			x: {
				type: "range",
				label: "translateX",
				min: -600,
				max: 600,
				step: 1,
				defaultValue: 100,
			},
			y: {
				type: "range",
				label: "translateY",
				min: -600,
				max: 600,
				step: 1,
				defaultValue: 100,
			},
			scaleX: {
				type: "range",
				label: "scaleX",
				min: -5,
				max: 5,
				step: 0.1,
				defaultValue: 1,
			},
			scaleY: {
				type: "range",
				label: "scaleY",
				min: -5,
				max: 5,
				step: 0.1,
				defaultValue: 1,
			},
			rotation: {
				type: "range",
				label: "rotation",
				min: 0,
				max: 360,
				step: 1,
				defaultValue: 0,
			},
		},
		() => {
			isDirty.current = true;
		},
	);

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

				const angle = 360 - syncUIState.current.rotation;
				const rotateMat = mat3.rotate(mat3.create(), angle);
				const projectionMat = mat3.projection(gl.canvas.width, gl.canvas.height);
				const scaleMat = mat3.scale(
					mat3.create(),
					syncUIState.current.scaleX,
					syncUIState.current.scaleY,
				);
				const translateMat = mat3.translate(
					mat3.create(),
					syncUIState.current.x,
					syncUIState.current.y,
				);

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
				{UIView}
			</div>
		</div>
	);
}
