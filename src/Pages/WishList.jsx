import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../Slices/wishListSlice";
import { FiTrash2, FiHeart, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserWishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get wishlist from store
  const { wishlist = [] } = useSelector((state) => state.wishlist);

  const handleRemoveFromWishlist = (id) => dispatch(removeFromWishlist(id));

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user")} // <-- Navigate to UserPage dashboard
        className="flex items-center gap-2 mb-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
      >
        <FiArrowLeft /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FiHeart /> My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          💔 Your wishlist is empty. Add products you like!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 border rounded-md shadow-sm hover:shadow transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600 text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="text-red-600 hover:text-red-700 text-xl"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
