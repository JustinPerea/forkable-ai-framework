import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { AuthStackParamList } from '../navigation/types';
import { UI_CONFIG, APP_CONFIG } from '../constants/config';
import { useLoginMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';

type LoginNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      if (result.success && result.token && result.user) {
        dispatch(setCredentials({
          token: result.token,
          user: result.user,
        }));
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to {APP_CONFIG.NAME}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={UI_CONFIG.COLORS.TEXT_SECONDARY}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={UI_CONFIG.COLORS.TEXT_SECONDARY}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkButtonText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  header: {
    paddingTop: UI_CONFIG.SPACING.XL * 2,
    marginBottom: UI_CONFIG.SPACING.XL,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
  form: {
    gap: UI_CONFIG.SPACING.MD,
  },
  input: {
    backgroundColor: UI_CONFIG.COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.BORDER,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.MD,
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
  },
  loginButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
    alignItems: 'center',
    marginTop: UI_CONFIG.SPACING.MD,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: UI_CONFIG.SPACING.MD,
  },
  linkButtonText: {
    color: UI_CONFIG.COLORS.PRIMARY,
    fontSize: 16,
  },
});

export default LoginScreen;