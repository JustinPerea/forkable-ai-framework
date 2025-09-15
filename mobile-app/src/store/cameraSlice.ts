import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CameraState {
  capturedImages: Array<{
    id: string;
    uri: string;
    timestamp: number;
    processed: boolean;
    processedImageUri?: string;
  }>;
  isProcessing: boolean;
  processingProgress: number;
  currentImageId: string | null;
  cameraPermissionGranted: boolean;
  mediaLibraryPermissionGranted: boolean;
}

const initialState: CameraState = {
  capturedImages: [],
  isProcessing: false,
  processingProgress: 0,
  currentImageId: null,
  cameraPermissionGranted: false,
  mediaLibraryPermissionGranted: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    addCapturedImage: (state, action: PayloadAction<{
      id: string;
      uri: string;
      timestamp: number;
    }>) => {
      state.capturedImages.unshift({
        ...action.payload,
        processed: false,
      });
    },
    removeCapturedImage: (state, action: PayloadAction<string>) => {
      state.capturedImages = state.capturedImages.filter(
        image => image.id !== action.payload
      );
    },
    setProcessing: (state, action: PayloadAction<{
      imageId: string;
      isProcessing: boolean;
    }>) => {
      state.isProcessing = action.payload.isProcessing;
      state.currentImageId = action.payload.isProcessing ? action.payload.imageId : null;

      if (!action.payload.isProcessing) {
        state.processingProgress = 0;
      }
    },
    setProcessingProgress: (state, action: PayloadAction<number>) => {
      state.processingProgress = action.payload;
    },
    markImageProcessed: (state, action: PayloadAction<{
      imageId: string;
      processedImageUri: string;
    }>) => {
      const image = state.capturedImages.find(img => img.id === action.payload.imageId);
      if (image) {
        image.processed = true;
        image.processedImageUri = action.payload.processedImageUri;
      }
    },
    setCameraPermission: (state, action: PayloadAction<boolean>) => {
      state.cameraPermissionGranted = action.payload;
    },
    setMediaLibraryPermission: (state, action: PayloadAction<boolean>) => {
      state.mediaLibraryPermissionGranted = action.payload;
    },
    clearAllImages: (state) => {
      state.capturedImages = [];
    },
  },
});

export const {
  addCapturedImage,
  removeCapturedImage,
  setProcessing,
  setProcessingProgress,
  markImageProcessed,
  setCameraPermission,
  setMediaLibraryPermission,
  clearAllImages,
} = cameraSlice.actions;

export default cameraSlice.reducer;