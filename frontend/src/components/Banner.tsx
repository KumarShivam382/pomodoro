import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
const particleOptions: ISourceOptions = {
  particles: {
    number: {
      value: 200,
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 1,
    },
    size: {
      value: 3,
    },
    move: {
      enable: true,
      speed: 5,
      direction: "right",
    },
    zIndex: {
      value: 5,
      opacityRate: 0.5,
    },
  },
  background: {
    color: "#000000",
  },
};

export default function Signup() {
  const [particlesInit, setParticlesInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-100">
      <div className="z-40">
        {particlesInit && (
          <Particles
            id="tsparticles"
            options={particleOptions}
            particlesLoaded={particlesLoaded}
            className="absolute inset-0 z-0"
          />
        )}{" "}
      </div>
      <div className="z-50 ">
        <div className="z-50 mx-auto max-w-screen-xl px-4 lg:flex lg:h-screen lg:items-center ">
          <div className="mx-auto max-w-3xl text-center ">
            <div className=" text-3xl font-black m-4 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent sm:text-7xl">
              POMODORO
            </div>
            <div className="text-xl m-4 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text  font-semibold text-transparent sm:text-3xl">
              The Productivity Tacker{" "}
            </div>

            <div className=" text-white text-md sm:text-xl">
              <TypeAnimation
                sequence={[
                  "Boost productivity with the Pomodoro Technique.",
                  3000,
                  "Focus better and achieve more in less time",
                  "Manage tasks effectively with timed work sessions.",
                  5000,
                  "Enhance your workflow and reduce distractions.",
                  3000,
                ]}
                wrapper="span"
                speed={50}
                style={{
                  fontSize: "1.5em",
                  display: "block",
                  marginBottom: "1rem",
                }}
                repeat={Infinity}
              />
            </div>

            <div className=" mt-8 flex flex-wrap justify-center gap-4">
              <Button
                color="blue"
                ripple="light"
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              >
                <Link to="/signup">Get Started</Link>
              </Button>

              <a
                className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="#"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
