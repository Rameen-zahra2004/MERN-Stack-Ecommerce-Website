import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProducts,
  selectAllProducts,
  selectIsProductsLoading,
  selectProductsError,
  selectPagination,
} from "../Slices/productSlice";
import Banner from "../Component/Banner";
import { FiShoppingBag, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const FALLBACK_IMAGE = "/placeholder-product.png";
const ITEMS_PER_PAGE = 10; // must match backend default limit

function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-pink-100 rounded-3xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-pink-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-pink-100 rounded" />
        <div className="h-3 w-1/3 bg-pink-100 rounded" />
        <div className="h-5 w-1/2 bg-pink-100 rounded" />
      </div>
    </div>
  );
}

function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const delta = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectAllProducts);
  const loading = useSelector(selectIsProductsLoading);
  const error = useSelector(selectProductsError).fetchAll;
  const { total, pages: totalPages } = useSelector(selectPagination);

  const [currentPage, setCurrentPage] = useState(1);

  // Re-fetch from server when page changes
  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: ITEMS_PER_PAGE }));
  }, [dispatch, currentPage]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div className="bg-linear-to-b from-pink-50 via-white to-pink-50 min-h-screen">
      <div className="mb-6">
        <Banner />
      </div>

      <div className="text-center px-6 mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest text-pink-500 uppercase mb-2">
          Curated Finds
        </span>
        <h1 className="text-4xl font-extrabold text-pink-700 tracking-tight">
          Our Products
        </h1>
        <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-pink-300" />
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center mb-12">
        <p className="text-gray-600 text-base leading-relaxed">
          At <span className="font-semibold text-pink-700">THE 999 BOX</span>,
          we believe everyday essentials should feel just as good as they look.
          Every item in our collection is handpicked for its quality, charm, and
          affordability — because looking good shouldn't cost a fortune.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="px-4 py-2 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
            ✨ Affordable Pricing
          </span>
          <span className="px-4 py-2 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
            📦 Fast & Secure Delivery
          </span>
          <span className="px-4 py-2 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
            💖 Handpicked Quality
          </span>
          <span className="px-4 py-2 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
            📩 Easy Ordering via DM
          </span>
        </div>
      </div>

      {error && (
        <div className="flex justify-center mb-6 px-6">
          <p className="text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center mt-16 px-6">
          <FiShoppingBag className="text-pink-300 mb-3" size={48} />
          <p className="text-pink-600 font-medium text-lg">
            No products found.
          </p>
          <p className="text-pink-400 text-sm mt-1">
            Check back soon — new boutique finds are on the way.
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {!loading && total > 0 && (
          <p className="text-sm text-pink-500 font-medium mb-4">
            Showing {startIndex}–{endIndex} of {total} products
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : items.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/products/${p._id}`)}
                  className="group bg-white border border-pink-100 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-pink-200/60 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-pink-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={handleImageError}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {p.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-pink-700 transition-colors">
                      {p.name}
                    </h3>
                    {p.category && (
                      <span className="text-[11px] text-pink-400 uppercase tracking-wide">
                        {p.category}
                      </span>
                    )}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <p className="text-pink-600 font-bold text-base">
                        Rs. {p.price?.toFixed(0)}
                      </p>
                      <span className="text-xs font-medium text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && totalPages > 1 && (
          <nav
            aria-label="Product pagination"
            className="flex items-center justify-center gap-1.5 mt-12 flex-wrap"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-pink-200 text-pink-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-9 h-9 flex items-center justify-center text-pink-300 text-sm"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-pink-500 text-white"
                      : "text-pink-600 hover:bg-pink-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-pink-200 text-pink-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
