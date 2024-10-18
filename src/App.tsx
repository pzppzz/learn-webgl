import { useState } from "react";
import DemoList from "./demos";
import "./app.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(3);

  const handleShowDemo = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="app">
      <div className="app-aside">
        <div className="app-aside-header">
          <h1>WebGL</h1>
        </div>
        <div className="app-aside-menu">
          {DemoList.map((demo, index) => {
            return (
              <div
                key={demo.name}
                className={`app-aside-menu-item ${
                  index === currentIndex ? "app-aside-menu-item__active" : ""
                }`}
                onClick={() => handleShowDemo(index)}
              >
                {demo.name}
              </div>
            );
          })}
        </div>
      </div>
      <div className="app-main">
        {DemoList[currentIndex] && DemoList[currentIndex].component}
      </div>
    </div>
  );
}

export default App;
