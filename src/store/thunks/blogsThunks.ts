import { createAsyncThunk } from '@reduxjs/toolkit';
import { blogsApi } from '../../services/blogsApi';
import { Blog } from '../../types/cms';

export const fetchBlogs = createAsyncThunk<
  Blog[],
  void,
  { rejectValue: string }
>('blogs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await blogsApi.list();
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const fetchBlogById = createAsyncThunk<
  Blog,
  number,
  { rejectValue: string }
>('blogs/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await blogsApi.getOne(id);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Blog detail not found.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const updateBlog = createAsyncThunk<
  Blog,
  { id: number; data: Partial<Blog> },
  { rejectValue: string }
>('blogs/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await blogsApi.update(id, data);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to save blog updates.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const deleteBlog = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('blogs/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await blogsApi.delete(id);
    if (res) {
      return id;
    }
    return rejectWithValue('Failed to delete blog.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
