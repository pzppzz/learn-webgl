import { useEffect, useRef } from "react";
import { createWebGL } from "../../utils/webgl";

export const Demo01: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const glRef = useRef<WebGLRenderingContext>();

	useEffect(() => {
		if (containerRef.current) {
			const { canvas, gl } = createWebGL();
			glRef.current = gl;

			containerRef.current.innerHTML = "";
			containerRef.current.appendChild(canvas);

			const timer = setInterval(() => {
				gl.clearColor(Math.random(), Math.random(), Math.random(), 1);
				gl.clear(gl.COLOR_BUFFER_BIT);
			}, 200);

			return () => {
				clearInterval(timer);
			};
		}
	}, []);

	return <div ref={containerRef}></div>;
};
