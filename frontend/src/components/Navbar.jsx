import React from "react";

export default function Navbar() {
  return (
    <div>
      <div className="flex grid grid-cols-4 border-b-2">
        <div className="col-span-2 m-auto text-white font-bold">Pomodoro</div>
        <div className="flex justify-around col-span-1">
          <div className="m-1 text-white">Report</div>
          <div className="m-1 text-white">Setting</div>
          <div className="m-1 text-white">Signin</div>
          <div className="m-1 text-white">:</div>
        </div>
      </div>
    </div>
  );
}
