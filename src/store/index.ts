import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import auditsReducer from './slices/auditsSlice';
import caseStudiesReducer from './slices/caseStudiesSlice';
import websiteReducer from './slices/websiteSlice';
import appReducer from './slices/appSlice';
import blogsReducer from './slices/blogsSlice';
import pagesReducer from './slices/pagesSlice';
import reviewsReducer from './slices/reviewsSlice';
import changeRequestsReducer from './slices/changeRequestsSlice';
import cmsCollectionsReducer from './slices/cmsCollectionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    audits: auditsReducer,
    caseStudies: caseStudiesReducer,
    website: websiteReducer,
    app: appReducer,
    blogs: blogsReducer,
    pages: pagesReducer,
    reviews: reviewsReducer,
    changeRequests: changeRequestsReducer,
    cmsCollections: cmsCollectionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
