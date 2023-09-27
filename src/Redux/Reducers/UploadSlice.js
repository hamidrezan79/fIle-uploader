import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
createAsyncThunk("upload/getAsyncFile", (_, { rejectWithValue }) => {});

const initialState = {
  isCanceled: false,
  selectedFiles: [],
  uploadProgress: {},
  files: [],
  isUploading: false,
  isPaused: false,
  uploadingFile:[],
  queueChunk:[],
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setIsCanceled: (state, action) => {
      state.isCanceled = action.payload;
      return state;
    },
    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
      return state;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
      return state;
    },
    setImages: (state, action) => {
      state.images = action.payload;
      return state;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
      return state;
    },
    setIsPaused: (state, action) => {
      state.isPaused = action.payload;
      return state;
    },
    setFiles: (state, action) => {
      state.files = action.payload;
      return state;
    },
    setUploadingFile: (state, action) => {
      state.uploadingFile = action.payload;
      return state;
    },
    setQueueChunk: (state, action) => {
      state.queueChunk = action.payload;
      return state;
    },

  },
});

export const {
  setIsCanceled,
  setSelectedFiles,
  setUploadProgress,
  setIsUploading,
  setIsPaused,
  setFiles,
  setQueueChunk
} = uploadSlice.actions;

export default uploadSlice.reducer;
