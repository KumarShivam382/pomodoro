import { BrowserRouter, Routes, Route } from "react-router-dom";
import Timer from "./components/Timer";
import LandingPage from "./components/LandingPage";
import SideBar from "./components/Sidebar";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import Banner from "./components/Banner";
import Signup from "./components/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Banner />} />
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/banner" element={<Banner />} />
        <Route
          path="/dashboard"
          element={
            <div className="flex">
              <div>
                <SideBar />
              </div>
              <div className="flex items-center justify-center w-full">
                <Dashboard />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
