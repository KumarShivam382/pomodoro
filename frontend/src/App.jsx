import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import React, { useLayoutEffect } from "react";

function App() {
  const [process, setProcess] = useState("pomodoro");
  const [minute, setMinute] = useState(25);
  const [second, setSecond] = useState(59);
  const [color, setColor] = useState("#E86068");
  const [start, setStart] = useState(true);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setSecond((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [start]);

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);
  return (
    <div className="">
      <div>
        <Navbar />
      </div>

      <Card
        process={process}
        setProcess={setProcess}
        second={second}
        setSecond={setSecond}
        setMinute={setMinute}
        minute={minute}
        start={start}
        setStart={setStart}
        color={color}
        setColor={setColor}
      />
    </div>
  );
}

export default App;
