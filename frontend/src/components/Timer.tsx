import React, { useEffect, useState } from "react";
import Card from "./Card";

function Timer() {
  const [process, setProcess] = useState("pomodoro");
  const [minute, setMinute] = useState(25);
  const [second, setSecond] = useState(0);
  const [color, setColor] = useState("#E86068");
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        if (second > 0) {
          setSecond((prev) => (prev > 0 ? prev - 1 : 0));
        } else {
          setMinute((prev) => (prev > 0 ? prev - 1 : 0));
          if (minute > 0) {
            setSecond(59);
          } else {
            setStart(false);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [start, minute, second]);

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return (
    <div className="flex items-center justify-center min-h-screen ">
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

export default Timer;
