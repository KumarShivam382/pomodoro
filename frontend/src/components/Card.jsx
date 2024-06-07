import React from "react";

export default function Card({
  process,
  setProcess,
  second,
  setSecond,
  minute,
  setMinute,
  start,
  setStart,
  color,
  setColor,
}) {
  function handlePomodoro() {
    setProcess("pomodoro");
    setMinute(25);
    setSecond(0);
    setColor("#E86068");
  }

  function handleShort() {
    setProcess("short");
    setMinute(5);
    setSecond(0);
    setColor("#33a5c7");
  }
  // set opacity
  function handleLong() {
    setProcess("long");
    setMinute(15);
    setSecond();
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="m-4 p-4 bg-cardBackground rounded-md">
          <div className="flex justify-around">
            <div
              className={`${
                process === "pomodoro" ? "bg-customRed" : ""
              } m-2 rounded-lg p-1 text-white text-lg font-medium cursor-pointer`}
              onClick={handlePomodoro}
            >
              Pomodoro
            </div>
            <div
              className={`${
                process === "short" ? "bg-customRed" : ""
              } m-2 p-1 text-white text-lg font-medium cursor-pointer rounded-lg }`}
              onClick={handleShort}
            >
              Short Break
            </div>
            <div
              className={`${
                process === "long" ? "bg-customRed" : ""
              } m-2 p-1 text-white text-lg font-medium cursor-pointer rounded-lg`}
              onClick={handleLong}
            >
              Long Break
            </div>
          </div>
          <div className="text-9xl text-white m-5">
            {minute > 9 ? minute : `0${minute}`} :{" "}
            {second > 9 ? second : `0${second}`}
          </div>
          <div className="m-2 text-center">
            <button
              onClick={() => {
                setStart((prev) => !prev);
              }}
              className="m-3 bg-white text-customRed py-2 px-4 rounded border border-customRed transition duration-300 text-2xl font-semibold border-b-4 border-b-gray-400"
            >
              {start ? "PAUSE" : "START"}
            </button>
          </div>
        </div>

        <div className="m-4">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1">
              <div className="grid-col-span-1 text-center text-gray-700 font-medium">
                #1
              </div>
              <div className="grid-col-span-1 text-white text-lg font-medium">
                Time to focus !!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
