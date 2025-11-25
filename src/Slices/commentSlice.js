import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const COMMENTS_API = "http://localhost:3000/comments";

// Fetch comments + attach user info
export const fetchCommentsWithUsers = createAsyncThunk(
  "comments/fetchWithUsers",
  async (_, { getState }) => {
    const res = await axios.get(COMMENTS_API);
    const comments = res.data;

    const users = getState().user.items;

    return comments.map((c) => ({
      ...c,
      user: users.find((u) => u.id === c.userId) || null,
    }));
  }
);

// Add comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, userId, text }) => {
    const res = await axios.post(COMMENTS_API, {
      postId,
      userId,
      text,
      createdAt: new Date().toISOString(),
      replies: [],
    });
    return res.data;
  }
);

// Add reply (nested level 1 only)
export const addReply = createAsyncThunk(
  "comments/addReply",
  async ({ commentId, userId, text }) => {
    const res = await axios.get(`${COMMENTS_API}/${commentId}`);
    const existing = res.data;

    const updated = {
      ...existing,
      replies: [
        ...existing.replies,
        {
          id: Date.now(),
          userId,
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const updateRes = await axios.put(`${COMMENTS_API}/${commentId}`, updated);
    return updateRes.data;
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id) => {
    await axios.delete(`${COMMENTS_API}/${id}`);
    return id;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsWithUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsWithUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsWithUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(addReply.fulfilled, (state, action) => {
        const i = state.comments.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.comments[i] = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      });
  },
});

export default commentsSlice.reducer;
