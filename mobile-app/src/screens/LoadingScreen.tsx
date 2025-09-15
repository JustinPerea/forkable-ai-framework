import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { UI_CONFIG, APP_CONFIG } from '../constants/config';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_CONFIG.NAME}</Text>
      <ActivityIndicator
        size="large"
        color={UI_CONFIG.COLORS.PRIMARY}
        style={styles.loader}
      />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONFIG.SPACING.XL,
  },
  loader: {
    marginVertical: UI_CONFIG.SPACING.LG,
  },
  subtitle: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
});

export default LoadingScreen;