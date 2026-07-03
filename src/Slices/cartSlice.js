export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.get("/");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.post("/", { productId, quantity });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.put(`/${productId}`, { quantity });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.delete(`/${productId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.delete("/");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
