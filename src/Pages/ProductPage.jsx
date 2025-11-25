import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../AdminSlices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../Slices/wishListSlice";
import { FiHeart, FiArrowLeft, FiLoader } from "react-icons/fi";
import CommentSection from "../Component/Comment";

// Small toast component
const Toast = ({ message }) => (
  <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
    {message}
  </div>
);

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cart } = useSelector((state) => state.cart || {});
  const { wishlist: wishlistItems = [] } = useSelector(
    (state) => state.wishlist || {}
  );

  const loggedInUserId = 1; // example user id

  // Fetch product from API
  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  // Show toast message
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const sizes = ["XS", "S", "M", "L", "XL"];

  // Check if product already exists in cart
  const existingCartItem = useMemo(
    () => cart.find((i) => i.id === product?.id),
    [cart, product]
  );

  // Check if product is in wishlist
  const isInWishlist = useMemo(
    () => wishlistItems.some((i) => i.id === product?.id),
    [wishlistItems, product]
  );

  const handleAddToCart = () => {
    if (!selectedSize) return showToast("⚠ Please select a size first.");

    const payload = {
      ...product,
      size: selectedSize,
      quantity: existingCartItem
        ? existingCartItem.quantity + quantity
        : quantity,
    };

    dispatch(addTocart(payload));
    showToast("✔ Added to cart");
    navigate("/user/cart");
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      showToast("💔 Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      showToast("❤ Added to wishlist");
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-6 bg-gray-300 w-32 rounded mb-4"></div>
        <div className="bg-white p-6 rounded shadow flex gap-6">
          <div className="w-1/3 h-64 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error handler
  if (error || !product) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        ❌ {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {toast && <Toast message={toast} />}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-6 bg-white shadow rounded-lg p-6">
        {/* Product Image */}
        <div className="md:w-1/3 relative flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-h-72 object-contain"
          />
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 text-3xl transition-transform ${
              isInWishlist
                ? "text-red-500 scale-110"
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <FiHeart />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-gray-500 capitalize">{product.category}</p>
          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-2">Select Size</h3>
            <div className="flex gap-3 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md transition ${
                    selectedSize === size
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add Button */}
          <div className="flex items-center gap-4 mt-4">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium mb-1"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 border rounded-md text-center p-1"
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <CommentSection postId={product.id} loggedInUserId={loggedInUserId} />
      </div>
    </div>
  );
}
