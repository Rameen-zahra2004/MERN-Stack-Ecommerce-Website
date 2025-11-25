import { useNavigate } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen from-purple-200 via-pink-100 to-yellow-200 p-6">
      {/* Main 404 Illustration */}
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-extrabold text-purple-700 animate-bounce">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800">
          Oops! Page Not Found
        </h2>
        {/* <p className="text-gray-600 mt-2 mb-6">
          The page you are looking for might have been removed or never existed.
        </p> */}

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {/* <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg shadow transition transform hover:-translate-y-1 active:scale-95"
          >
            <FiArrowLeft /> Go Back
          </button> */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 m-4 rounded-lg shadow transition transform hover:-translate-y-1 active:scale-95"
          >
            <FiHome /> Home
          </button>
        </div>

        {/* Optional small illustration */}
        <div className="mt-8">
          <img
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            alt="404 illustration"
            className="mx-auto max-w-xs animate-fadeIn"
          />
        </div>
      </div>
    </div>
  );
}
