import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import { UI_CONFIG } from '../constants/config';
import { RootState } from '../store';
import { clearCredentials } from '../store/authSlice';
import { useGetUserProfileQuery } from '../store/apiSlice';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: profileData, isLoading, error } = useGetUserProfileQuery();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(clearCredentials()),
        },
      ]
    );
  };

  const currentUser = profileData || user;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={UI_CONFIG.COLORS.PRIMARY} />
          </View>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading profile...</Text>
          ) : error ? (
            <Text style={styles.errorText}>Error loading profile</Text>
          ) : (
            <>
              <Text style={styles.userName}>{currentUser?.email}</Text>
              <Text style={styles.userTokens}>
                {currentUser?.tokens || 0} tokens available
              </Text>
            </>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Images Processed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Tokens Used</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="card" size={24} color={UI_CONFIG.COLORS.TEXT_PRIMARY} />
            <Text style={styles.settingText}>Purchase Tokens</Text>
            <Ionicons name="chevron-forward" size={20} color={UI_CONFIG.COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications" size={24} color={UI_CONFIG.COLORS.TEXT_PRIMARY} />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={UI_CONFIG.COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle" size={24} color={UI_CONFIG.COLORS.TEXT_PRIMARY} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={UI_CONFIG.COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="document-text" size={24} color={UI_CONFIG.COLORS.TEXT_PRIMARY} />
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={UI_CONFIG.COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color={UI_CONFIG.COLORS.ERROR} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
  },
  userSection: {
    alignItems: 'center',
    padding: UI_CONFIG.SPACING.LG,
    backgroundColor: UI_CONFIG.COLORS.CARD_BACKGROUND,
    marginHorizontal: UI_CONFIG.SPACING.MD,
    marginTop: UI_CONFIG.SPACING.MD,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONFIG.SPACING.XS,
  },
  userTokens: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
  loadingText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
  errorText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.ERROR,
  },
  section: {
    backgroundColor: UI_CONFIG.COLORS.CARD_BACKGROUND,
    marginHorizontal: UI_CONFIG.SPACING.MD,
    marginTop: UI_CONFIG.SPACING.MD,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MD,
    padding: UI_CONFIG.SPACING.MD,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
    marginBottom: UI_CONFIG.SPACING.XS,
  },
  statLabel: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.BORDER,
    gap: UI_CONFIG.SPACING.MD,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: UI_CONFIG.SPACING.MD,
    gap: UI_CONFIG.SPACING.SM,
  },
  logoutText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.ERROR,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: UI_CONFIG.SPACING.LG,
  },
  versionText: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
});

export default ProfileScreen;