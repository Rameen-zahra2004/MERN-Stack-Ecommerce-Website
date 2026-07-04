import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// FETCH ALL COMMENTS
export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/comments");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch comments");
    }
  }
);

// ADD COMMENT
export const addComment = createAsyncThunk(
  "comments/add",
  async (comment, { rejectWithValue }) => {
    try {
      const res = await api.post("/comments", comment);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add comment");
    }
  }
);

// DELETE COMMENT
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
    }
  }
);

// ✅ ADD REPLY TO A COMMENT
export const addReply = createAsyncThunk(
  "comments/addReply",
  async ({ commentId, reply }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/comments/${commentId}/replies`, reply);
      return { commentId, reply: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add reply");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // FETCH COMMENTS
      .addCase(fetchComments.pending, pending)
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, rejected)

      // ADD COMMENT
      .addCase(addComment.pending, pending)
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, rejected)

      // DELETE COMMENT
      .addCase(deleteComment.pending, pending)
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, rejected)

      // ✅ ADD REPLY
      .addCase(addReply.pending, pending)
      .addCase(addReply.fulfilled, (state, action) => {
        state.loading = false;
        const { commentId, reply } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push(reply);
        }
      })
      .addCase(addReply.rejected, rejected);
  },
});

export const { clearError } = commentSlice.actions;
export default commentSlice.reducer;