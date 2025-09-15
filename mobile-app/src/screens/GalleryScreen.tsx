import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import { UI_CONFIG } from '../constants/config';
import { RootState } from '../store';
import { useProcessImageMutation } from '../store/apiSlice';
import {
  setProcessing,
  markImageProcessed,
  removeCapturedImage,
} from '../store/cameraSlice';
import { imageToBase64 } from '../utils/imageUtils';

const GalleryScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { capturedImages, isProcessing } = useSelector((state: RootState) => state.camera);
  const [processImage] = useProcessImageMutation();

  const handleProcessImage = async (imageId: string, imageUri: string) => {
    if (isProcessing) {
      Alert.alert('Processing', 'Another image is currently being processed. Please wait.');
      return;
    }

    try {
      dispatch(setProcessing({ imageId, isProcessing: true }));

      // Convert image to base64
      const base64Image = await imageToBase64(imageUri);

      const result = await processImage({
        imageData: base64Image,
        prompt: 'Enhance this image with AI processing',
      }).unwrap();

      if (result.success && result.processedImageUrl) {
        dispatch(markImageProcessed({
          imageId,
          processedImageUri: result.processedImageUrl,
        }));

        Alert.alert('Success!', 'Your image has been processed successfully.');
      } else {
        Alert.alert('Processing Failed', result.message || 'Failed to process image');
      }
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      dispatch(setProcessing({ imageId, isProcessing: false }));
    }
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(removeCapturedImage(imageId)),
        },
      ]
    );
  };

  const renderImageItem = ({ item }: { item: typeof capturedImages[0] }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.image} />

      <View style={styles.imageOverlay}>
        <View style={styles.imageInfo}>
          <Text style={styles.imageDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          {item.processed && (
            <Text style={styles.processedLabel}>✓ Processed</Text>
          )}
        </View>

        <View style={styles.imageActions}>
          {!item.processed && (
            <TouchableOpacity
              style={[styles.actionButton, styles.processButton]}
              onPress={() => handleProcessImage(item.id, item.uri)}
              disabled={isProcessing}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isProcessing ? 'Processing...' : 'Process'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteImage(item.id)}
          >
            <Ionicons name="trash" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {item.processed && item.processedImageUri && (
        <View style={styles.processedImageContainer}>
          <Image
            source={{ uri: item.processedImageUri }}
            style={styles.processedImage}
          />
          <Text style={styles.processedLabel}>Processed Result</Text>
        </View>
      )}
    </View>
  );

  if (capturedImages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="images-outline"
            size={64}
            color={UI_CONFIG.COLORS.TEXT_SECONDARY}
          />
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptySubtitle}>
            Capture photos using the camera to get started
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={capturedImages}
        keyExtractor={(item) => item.id}
        renderItem={renderImageItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  listContainer: {
    padding: UI_CONFIG.SPACING.MD,
    gap: UI_CONFIG.SPACING.MD,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginTop: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  emptySubtitle: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  imageItem: {
    backgroundColor: UI_CONFIG.COLORS.CARD_BACKGROUND,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    padding: UI_CONFIG.SPACING.MD,
  },
  imageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  imageDate: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
  processedLabel: {
    fontSize: 12,
    color: UI_CONFIG.COLORS.SUCCESS,
    fontWeight: '600',
  },
  imageActions: {
    flexDirection: 'row',
    gap: UI_CONFIG.SPACING.SM,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: UI_CONFIG.BORDER_RADIUS.SM,
    gap: UI_CONFIG.SPACING.XS,
  },
  processButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: UI_CONFIG.COLORS.ERROR,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  processedImageContainer: {
    borderTopWidth: 1,
    borderTopColor: UI_CONFIG.COLORS.BORDER,
    padding: UI_CONFIG.SPACING.MD,
  },
  processedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: UI_CONFIG.BORDER_RADIUS.SM,
  },
});

export default GalleryScreen;