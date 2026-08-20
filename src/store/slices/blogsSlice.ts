import { createSlice } from '@reduxjs/toolkit';
import { Blog } from '../../types/cms';
import { fetchBlogs, fetchBlogById, updateBlog, deleteBlog } from '../thunks/blogsThunks';

interface BlogsState {
  items: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: BlogsState = {
  items: [],
  selectedBlog: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearSelectedBlog(state) {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch blogs';
      })

      // Fetch One
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch blog details';
      })

      // Update
      .addCase(updateBlog.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedBlog && state.selectedBlog.id === action.payload.id) {
          state.selectedBlog = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to update blog';
      })

      // Delete
      .addCase(deleteBlog.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedBlog && state.selectedBlog.id === action.payload) {
          state.selectedBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete blog';
      });
  },
});

export const { clearSelectedBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
