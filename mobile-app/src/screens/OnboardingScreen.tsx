import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { UI_CONFIG, APP_CONFIG } from '../constants/config';

type OnboardingNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to {APP_CONFIG.NAME}</Text>
        <Text style={styles.subtitle}>
          Transform your photos with AI-powered image processing
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.feature}>📷 Capture photos with your camera</Text>
          <Text style={styles.feature}>🎨 AI-powered image enhancement</Text>
          <Text style={styles.feature}>📱 Easy sharing and saving</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  subtitle: {
    fontSize: 18,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING.XL,
    lineHeight: 24,
  },
  featureList: {
    marginBottom: UI_CONFIG.SPACING.XL * 2,
  },
  feature: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONFIG.SPACING.MD,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: UI_CONFIG.SPACING.MD,
  },
  primaryButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingVertical: UI_CONFIG.SPACING.MD,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: UI_CONFIG.SPACING.MD,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  secondaryButtonText: {
    color: UI_CONFIG.COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;