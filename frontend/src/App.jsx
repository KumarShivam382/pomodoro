import { useState } from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import React, { useLayoutEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#E86068";
  });
  return (
    <div className="">
      <div>
        <Navbar />
      </div>

      <Card />
    </div>
  );
}

export default App;
