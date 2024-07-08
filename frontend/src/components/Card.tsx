import React from "react";

import { Button } from "@material-tailwind/react";
import AddTodo from "./modals/tasks/AddTodo";
import ViewTodo from "./modals/tasks/ViewTodos";
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
    setStart(false);
  }

  function handleShort() {
    setProcess("short");
    setMinute(5);
    setSecond(0);
    setColor("#A855F7");
    setStart(false);
  }

  function handleLong() {
    setProcess("long");
    setMinute(15);
    setSecond(0);
    setColor("#3B82F6");
    setStart(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-lg ">
        <div
          className={`m-4 p-4 ${
            color === "#E86068"
              ? "bg-cardBackground1"
              : color === "#A855F7"
              ? "bg-purple-400"
              : "bg-blue-400"
          } rounded-md`}
        >
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
                process === "short" ? "bg-purple-500" : ""
              } m-2 p-1 text-white text-lg font-medium cursor-pointer rounded-lg`}
              onClick={handleShort}
            >
              Short Break
            </div>
            <div
              className={`${
                process === "long" ? "bg-blue-500" : ""
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
            <Button
              onClick={() => {
                setStart((prev: boolean) => !prev);
              }}
            >
              {start ? "PAUSE" : "START"}
            </Button>
          </div>
        </div>

        <div className="m-4">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1">
              <div className="grid-col-span-1 text-center text-gray-700 font-medium">
                <div>
                  <AddTodo /> <ViewTodo />
                </div>
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
