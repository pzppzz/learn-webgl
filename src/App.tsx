import { Suspense, useState } from "react";
import { DEMOS } from "./demos";
import "./app.css";

function App() {
	const [currentIndex, setCurrentIndex] = useState(5);

	const handleShowDemo = (index: number) => {
		setCurrentIndex(index);
	};

	const Demo = DEMOS[currentIndex].component;

	return (
		<div className="app">
			<div className="app-aside">
				<div className="app-aside-header">
					<h1>Learn WebGL</h1>
				</div>
				<div className="app-aside-menu">
					{DEMOS.map((demo, index) => {
						return (
							<div
								key={demo.name}
								className={`app-aside-menu-item ${
									index === currentIndex ? "app-aside-menu-item__active" : ""
								}`}
								onClick={() => handleShowDemo(index)}
							>
								{index + 1 + ". " + demo.name}
							</div>
						);
					})}
				</div>
			</div>
			<div className="app-main">
				<Suspense fallback={<h1>loading...</h1>}>
					<Demo />
				</Suspense>
			</div>
		</div>
	);
}

export default App;
