import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
createAsyncThunk("upload/getAsyncFile", (_, { rejectWithValue }) => {});

const initialState = {
  isCanceled: false,
  selectedFiles: [],
  uploadProgress: {},
  images: [],
  isUploading: false,
  isPaused: false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },
  },
});

export const {
  setIsCanceled,
  setSelectedFiles,
  setUploadProgress,
  setIsUploading,
  setIsPaused,
} = uploadSlice.actions;

export default uploadSlice.reducer;
