import React from "react";

export default function Card() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="m-4 p-4 bg-cardBackground rounded-md">
          <div className="flex justify-around">
            <div className="bg-customRed m-2 rounded-lg p-1 text-white text-lg font-medium ">
              Pomodoro
            </div>
            <div className="m-2 p-1 text-white text-lg font-medium ">
              Short Break
            </div>
            <div className="m-2 p-1 text-white text-lg font-medium">
              Long Break
            </div>
          </div>
          <div className="text-9xl text-white m-5">10 : 00</div>
          <div className="m-2 text-center">
            <button className="m-3 bg-white text-customRed py-2 px-4 rounded border border-customRed transition duration-300 text-2xl font-semibold border-b-4 border-b-gray-400">
              START
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
