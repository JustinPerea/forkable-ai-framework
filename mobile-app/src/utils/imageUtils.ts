import * as FileSystem from 'expo-file-system';

/**
 * Convert image URI to base64 string
 */
export const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64' as any, // Fallback for expo-file-system types
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image');
  }
};

/**
 * Get image file size in bytes
 */
export const getImageSize = async (imageUri: string): Promise<number> => {
  try {
    const info = await FileSystem.getInfoAsync(imageUri);
    return (info as any).size || 0;
  } catch (error) {
    console.error('Error getting image size:', error);
    return 0;
  }
};

/**
 * Generate unique image ID
 */
export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2)}`;
};