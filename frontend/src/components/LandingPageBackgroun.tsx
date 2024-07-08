import React, { useEffect, useState } from "react";
import Signup from "./Signup";
import Banner from "./Banner";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Container, ISourceOptions, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

// Background style constant
export const LandingPageBackground = {
  background: "linear-gradient(to right, #9C27B0, #E91E63, #F44336)",
};

export default function LandingPage() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = {
    particles: {
      color: {
        value: "#fff",
        animation: {
          enable: false,
          speed: 20,
          sync: true,
        },
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
    emitters: {
      position: {
        y: 55,
        x: -5,
      },
      rate: {
        delay: 7,
        quantity: 1,
      },
      size: {
        width: 0,
        height: 0,
      },
      particles: {
        shape: {
          type: "images",
          options: {
            images: {
              src: "https://particles.js.org/images/cyan_amongus.png",
              width: 500,
              height: 634,
            },
          },
        },
        size: {
          value: 40,
        },
        move: {
          speed: 10,
          outModes: {
            default: "none",
            right: "destroy",
          },
          straight: true,
        },
        zIndex: {
          value: 0,
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 10,
            sync: true,
          },
        },
      },
    },
  };

  const scrollToSignup = () => {
    const signupSection = document.getElementById("signup-section");
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative h-screen overflow-y-auto"
      style={LandingPageBackground}
    >
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          className="absolute inset-0 z-10"
        />
      )}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="col-span-1">
          <Banner scrollToSignup={scrollToSignup} />
        </div>
        <div id="signup-section" className="col-span-1">
          <Signup />
        </div>
      </div>
    </div>
  );
}
