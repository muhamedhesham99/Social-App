import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center bg-secondary h-screen">
      <div className="bg-accent1 p-16 rounded-2xl shadow-xl text-center w-[75%] ">
        <h1 className="text-8xl font-extrabold text-primary">404</h1>

        <p className="mt-4 text-accent2 text-lg">
          Sorry, the page you are looking for doesn't exist.
        </p>

        <Link
          to="/home"
          className="inline-block mt-8 px-6 py-3 rounded-xl bg-primary text-accent1 font-semibold hover:scale-105 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
