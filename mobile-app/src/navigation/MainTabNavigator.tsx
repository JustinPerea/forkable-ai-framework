import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { UI_CONFIG } from '../constants/config';

import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: UI_CONFIG.COLORS.PRIMARY,
        tabBarInactiveTintColor: UI_CONFIG.COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: UI_CONFIG.COLORS.CARD_BACKGROUND,
          borderTopColor: UI_CONFIG.COLORS.BORDER,
        },
        headerStyle: {
          backgroundColor: UI_CONFIG.COLORS.PRIMARY,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Capture' }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ title: 'Gallery' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;