import { BrowserRouter, Routes, Route } from "react-router-dom";
import Timer from "./components/Timer";
import LandingPage from "./components/LandingPage";
import SideBar from "./components/Sidebar";
import Signin from "./components/Signin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/timer"
          element={
            <div className="flex">
              <div>
                <SideBar />
              </div>
              <div className="flex items-center justify-center w-full">
                <Timer />
              </div>
            </div>
          }
        />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
