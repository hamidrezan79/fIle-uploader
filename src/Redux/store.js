import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import uploadReducer from './Reducers/UploadSlice';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
  },
  middleware: [thunk], 
});
