import { useState } from "react";
import Navbar from "./components/Navbar";
import React, { useLayoutEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#E86068";
  });
  return (
    <div className="">
      <Navbar />
    </div>
  );
}

export default App;
