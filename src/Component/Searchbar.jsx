// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FiSearch } from "react-icons/fi";
// import {
//   fetchSearchResults,
//   setQuery,
//   clearResults,
// } from "../Slices/searchSlice";

// export default function Searchbar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { query, results } = useSelector((state) => state.search || {});
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const containerRef = useRef(null);

//   // Fetch results whenever query changes
//   useEffect(() => {
//     if (query?.trim()) {
//       dispatch(fetchSearchResults(query.trim()));
//     } else {
//       dispatch(clearResults());
//     }
//   }, [query, dispatch]);

//   // Keyboard navigation
//   const handleKeyDown = (e) => {
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightedIndex((prev) =>
//         prev < results.length - 1 ? prev + 1 : prev
//       );
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
//     } else if (e.key === "Enter" && highlightedIndex >= 0) {
//       const selectedItem = results[highlightedIndex];
//       navigateToProduct(selectedItem.id);
//     }
//   };

//   const navigateToProduct = (id) => {
//     dispatch(clearResults());
//     dispatch(setQuery("")); // Clear search input
//     setHighlightedIndex(-1);
//     navigate(`/products/${id}`);
//   };

//   // Close dropdown on click outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         dispatch(clearResults());
//         setHighlightedIndex(-1);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [dispatch]);

//   return (
//     <div ref={containerRef} className="flex-1 max-w-xl mx-4 relative">
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search Product..."
//           value={query || ""}
//           onChange={(e) => dispatch(setQuery(e.target.value))}
//           onKeyDown={handleKeyDown}
//           className="w-full border rounded-md py-2 px-10 focus:outline-none focus:ring"
//         />
//         <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
//       </div>

//       {/* Dropdown results */}
//       {results?.length > 0 && (
//         <ul className="absolute w-full bg-white border rounded-md mt-1 max-h-80 overflow-y-auto z-50 shadow-lg">
//           {results.map((item, index) => (
//             <li
//               key={item.id}
//               className={`flex items-center px-4 py-2 cursor-pointer ${
//                 highlightedIndex === index ? "bg-gray-100" : ""
//               }`}
//               onMouseEnter={() => setHighlightedIndex(index)}
//               onClick={() => navigateToProduct(item.id)}
//             >
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="w-10 h-10 object-contain mr-3"
//               />
//               <div className="flex flex-col">
//                 <span className="font-medium">{item.title}</span>
//                 <span className="text-sm text-gray-500">${item.price}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* No results message */}
//       {query && results?.length === 0 && (
//         <p className="absolute w-full bg-white border rounded-md mt-1 px-4 py-2 text-gray-500 z-50">
//           No results found
//         </p>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import {
  fetchSearchResults,
  setQuery,
  clearResults,
} from "../Slices/searchSlice";

export default function Searchbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query, results } = useSelector((state) => state.search || {});
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);

  // Fetch results whenever query changes
  useEffect(() => {
    if (query?.trim()) {
      dispatch(fetchSearchResults(query.trim()));
    } else {
      dispatch(clearResults());
    }
  }, [query, dispatch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      const selectedItem = results[highlightedIndex];
      navigateToProduct(selectedItem.id);
    }
  };

  const navigateToProduct = (id) => {
    dispatch(clearResults());
    dispatch(setQuery(""));
    setHighlightedIndex(-1);
    navigate(`/products/${id}`);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        dispatch(clearResults());
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [dispatch]);

  return (
    <div ref={containerRef} className="flex-1 max-w-2xl mx-4 relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Products..."
          value={query || ""}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onKeyDown={handleKeyDown}
          className="
            w-full
            py-3
            pl-12
            pr-5
            rounded-full
            border-2
            border-pink-300
            bg-white
            text-gray-700
            shadow-lg
            transition-all
            duration-300
            focus:outline-none
            focus:border-pink-500
            focus:ring-4
            focus:ring-pink-200
            placeholder:text-gray-400
          "
        />

        <FiSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-pink-500
            text-xl
          "
        />
      </div>

      {/* Search Results */}
      {results?.length > 0 && (
        <ul
          className="
            absolute
            w-full
            mt-3
            bg-white
            border
            border-pink-200
            rounded-3xl
            shadow-2xl
            overflow-hidden
            max-h-96
            overflow-y-auto
            z-50
          "
        >
          {results.map((item, index) => (
            <li
              key={item.id}
              className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
                highlightedIndex === index ? "bg-pink-100" : "hover:bg-pink-50"
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => navigateToProduct(item.id)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 object-contain rounded-lg bg-white p-1 mr-4"
              />

              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {item.title}
                </span>

                <span className="text-sm font-medium text-pink-600">
                  ${item.price}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {query && results?.length === 0 && (
        <div
          className="
            absolute
            w-full
            mt-3
            bg-white
            border
            border-pink-200
            rounded-2xl
            shadow-xl
            px-4
            py-3
            text-center
            text-gray-500
            z-50
          "
        >
          No products found
        </div>
      )}
    </div>
  );
}
