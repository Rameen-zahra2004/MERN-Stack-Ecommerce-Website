import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiAlertCircle } from "react-icons/fi";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Icon */}
      <div className="text-gray-300 mb-6">
        <FiAlertCircle className="w-20 h-20 animate-pulse" />
      </div>

      {/* Error Code */}
      <h1 className="text-9xl font-extrabold text-gray-400 mb-4 animate-bounce">
        500
      </h1>

      {/* Message */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Oops! Server Error
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Something went wrong on our end. Please try refreshing the page or come
        back later. If the issue persists, contact support.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2 bg-gray-100 rounded hover:bg-gray-200 shadow transition transform hover:-translate-y-1 active:scale-95"
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );
}
