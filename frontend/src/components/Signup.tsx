import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});
//  schema for form validation
type FormData = z.infer<typeof schema>;

export default function SignupForm() {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate a server delay
      console.log(data);
      reset(); // Clear the form data

      throw new Error();
    } catch (error) {
      setError("root", {
        // Error received at root
        message: "This email is already taken",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold">Create an Account</div>
          <div className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Log in
            </a>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-left font-semibold" htmlFor="username">
              Username:
            </label>
            <input
              id="username"
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {}
          </div>
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
              <div className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </div>
            )}
          </div>
          <div>
            <label className="block text-left font-semibold" htmlFor="password">
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
              <div className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full p-2 mt-5 text-white rounded ${
              isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors duration-200 flex items-center justify-center`}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
          </button>
          {errors.root && (
            <div className="mt-2 text-red-500 text-sm text-center">
              {errors.root.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
