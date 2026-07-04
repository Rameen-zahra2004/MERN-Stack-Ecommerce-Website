import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch and filter products from DummyJSON
export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query) => {
    if (!query.trim()) return [];
    const response = await fetch(
      `${import.meta.env.VITE_PRODUCTS_API}/products/search?q=${encodeURIComponent(query.trim())}`
    );
    const data = await response.json();

    return data.products.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.thumbnail, // dummyjson uses "thumbnail" instead of "image"
      price: item.price,
    }));
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.results = action.payload;
    });
  },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;