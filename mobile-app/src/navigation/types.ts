export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Camera: undefined;
  Gallery: undefined;
  Profile: undefined;
};

export type CameraStackParamList = {
  CameraCapture: undefined;
  ImagePreview: {
    imageUri: string;
    imageId: string;
  };
  ProcessingScreen: {
    imageId: string;
  };
  ResultScreen: {
    imageId: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}