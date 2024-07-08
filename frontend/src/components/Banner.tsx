import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { TypeAnimation } from "react-type-animation";

export default function Banner({ scrollToSignup }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    setIsSmallScreen(mediaQuery.matches);

    const handleResize = () => {
      setIsSmallScreen(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const handleSignupClick = () => {
    if (scrollToSignup) {
      scrollToSignup();
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-white">
      <div className="text-center">
        <div className="text-5xl font-bold mt-4">
          <span className="text-red-500">P</span>
          <span className="text-blue-500">o</span>
          <span className="text-yellow-500">m</span>
          <span className="text-green-500">o</span>
          <span className="text-purple-500">d</span>
          <span className="text-pink-500">o</span>
          <span className="text-orange-500">r</span>
          <span className="text-indigo-500">o</span>
        </div>
        <div>Make Your Life Colorful</div>
        <div className="text-red-500">
          <TypeAnimation
            sequence={[
              "Boost productivity with the Pomodoro Technique",
              3000,
              "Focus better and achieve more in less time",
              "Manage tasks effectively with timed work sessions",
              5000,
              "Enhance your workflow and reduce distractions",
              3000,
            ]}
            wrapper="span"
            speed={50}
            style={{
              fontSize: "1.7em",
              display: "block",
              marginBottom: "1rem",
            }}
            repeat={Infinity}
          />
        </div>
        {isSmallScreen && (
          <Button
            onClick={handleSignupClick}
            color="blue"
            ripple="light"
            className="mt-4"
          >
            Sign Up
          </Button>
        )}
      </div>
    </div>
  );
}
