import { useEffect } from "react";
import "./App.css";
import MainGame from "./game/maingame";

function App() {
  // Only create the MainGame object on mount
  useEffect(() => {
    const maingame = new MainGame();
    return () => {
      maingame.dispose();
    };
  }, []);

  return (
    <div className="app">
      <canvas
        id="canvas"
        className="fixed w-screen h-screen top-0 left-0"
      ></canvas>
    </div>
  );
}

export default App;
