import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const schema = z.object({
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});
type FormData = z.infer<typeof schema>;

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

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a server delay
      console.log(data);
      reset(); // Clear the form data
      throw new Error();
    } catch (error) {
      setError("root", {
        message: "This email is already taken",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative ">
      {particlesInit && (
        <Particles
          id="tsparticles"
          options={particleOptions}
          particlesLoaded={particlesLoaded}
          className="absolute inset-0 z-0"
        />
      )}
      <div className="z-10 relative w-full max-w-md shadow-md rounded-lg p-8">
        <Card>
          <CardHeader
            variant="gradient"
            color="gray"
            className="mb-4 grid h-20 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div>
              <label className="block text-left font-semibold" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <div className="mt-1 text-red-500 text-md">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div>
              <label
                className="block text-left font-semibold"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <div className="mt-1 text-red-500 text-md">
                  {errors.password.message}
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 m-auto text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Submit"
              )}
            </Button>
            {errors.root && (
              <div className="mt-2 text-red-500 text-md text-center">
                {errors.root.message}
              </div>
            )}
            <Typography variant="small" className="mt-6 flex justify-center">
              Create an account?
              <Typography
                as="a"
                href="#signin"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
              >
                <Link to="/signup">Sign up</Link>
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
