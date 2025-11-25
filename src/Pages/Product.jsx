import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import { fetchProducts } from "../Slices/productSlice";

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ define navigate
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50 ">
      <div className="flex justify-center items-center h-20">
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">
          Products
        </h1>
      </div>

      <div className="flex items-center text-center">
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:grid-cols-4 items-center mt-8">
        {items.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)} // ✅ make card clickable
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center text-center p-4 w-60 cursor-pointer"
          >
            <img
              src={p.image}
              alt={p.title}
              className="h-40 w-40 object-contain mb-3"
            />
            <h3 className="font-semibold text-gray-800 text-center mb-2 text-sm line-clamp-2">
              {p.title}
            </h3>
            <p className="text-gray-600 font-medium">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
