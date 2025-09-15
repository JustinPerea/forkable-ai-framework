import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { UI_CONFIG, CAMERA_CONFIG } from '../constants/config';
import { RootState } from '../store';
import {
  addCapturedImage,
  setCameraPermission,
  setMediaLibraryPermission,
} from '../store/cameraSlice';
import { generateImageId } from '../utils/imageUtils';

const { width: screenWidth } = Dimensions.get('window');
const CAMERA_HEIGHT = screenWidth * (4 / 3); // 4:3 aspect ratio

const CameraScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { capturedImages } = useSelector((state: RootState) => state.camera);

  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request camera permission
    if (!cameraPermission?.granted) {
      const cameraResult = await requestCameraPermission();
      dispatch(setCameraPermission(cameraResult.granted));
    } else {
      dispatch(setCameraPermission(true));
    }

    // Request microphone permission
    if (!micPermission?.granted) {
      await requestMicPermission();
    }

    // Request media library permission
    if (!mediaLibraryPermission?.granted) {
      const mediaResult = await requestMediaLibraryPermission();
      dispatch(setMediaLibraryPermission(mediaResult.granted));
    } else {
      dispatch(setMediaLibraryPermission(true));
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: CAMERA_CONFIG.QUALITY,
        });

        if (photo) {
          const imageId = generateImageId();
          dispatch(addCapturedImage({
            id: imageId,
            uri: photo.uri,
            timestamp: Date.now(),
          }));

          Alert.alert(
            'Photo Captured!',
            'Your photo has been captured successfully. Go to Gallery to process it.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any, // Updated to use string literal
        allowsEditing: CAMERA_CONFIG.ALLOW_EDITING,
        aspect: CAMERA_CONFIG.ASPECT_RATIO,
        quality: CAMERA_CONFIG.QUALITY,
      });

      if (!result.canceled && result.assets[0]) {
        const imageId = generateImageId();
        dispatch(addCapturedImage({
          id: imageId,
          uri: result.assets[0].uri,
          timestamp: Date.now(),
        }));

        Alert.alert(
          'Photo Selected!',
          'Your photo has been selected successfully. Go to Gallery to process it.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!cameraPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Requesting camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to capture photos for AI processing.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermissions}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
          <Ionicons name="images" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Flip</Text>
        </TouchableOpacity>
      </View>

      {capturedImages.length > 0 && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {capturedImages.length} photo{capturedImages.length > 1 ? 's' : ''} captured
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONFIG.SPACING.MD,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING.LG,
  },
  permissionButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    height: CAMERA_HEIGHT,
    width: screenWidth,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: UI_CONFIG.SPACING.XL,
    paddingVertical: UI_CONFIG.SPACING.LG,
  },
  controlButton: {
    alignItems: 'center',
    opacity: 0.8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    marginTop: UI_CONFIG.SPACING.XS,
    fontSize: 12,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: UI_CONFIG.BORDER_RADIUS.SM,
  },
});

export default CameraScreen;