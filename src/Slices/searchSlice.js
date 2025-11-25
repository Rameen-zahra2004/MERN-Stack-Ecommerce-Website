import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch and filter products from FakeStoreAPI
export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query) => {
    if (!query.trim()) return [];
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();

    // Filter products by title (case-insensitive)
    return data
      .filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase().trim())
      )
      .map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
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
