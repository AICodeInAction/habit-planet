import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppStore } from './src/store/useAppStore';
import { colors } from './src/theme';
import { RootStackParamList, MainTabParamList } from './src/types';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import GalaxyScreen from './src/screens/GalaxyScreen';
import MedalsScreen from './src/screens/MedalsScreen';
import FamilyScreen from './src/screens/FamilyScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PlanetDetailScreen from './src/screens/PlanetDetailScreen';
import CreateHabitScreen from './src/screens/CreateHabitScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 自定义导航主题
const NavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.blue,
    background: colors.background.dark,
    card: colors.tabBar.background,
    text: colors.text.primary,
    border: colors.border.light,
  },
};

// Tab 图标映射
const tabIcons: Record<keyof MainTabParamList, { focused: string; unfocused: string }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Galaxy: { focused: 'rocket', unfocused: 'rocket-outline' },
  Medals: { focused: 'medal', unfocused: 'medal-outline' },
  Family: { focused: 'people', unfocused: 'people-outline' },
  Profile: { focused: 'person-circle', unfocused: 'person-circle-outline' },
};

// Tab 标签映射
const tabLabels: Record<keyof MainTabParamList, string> = {
  Home: '首页',
  Galaxy: '探索',
  Medals: '奖牌',
  Family: '家庭',
  Profile: '我的',
};

// 底部 Tab 导航
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarLabel: tabLabels[route.name],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Galaxy" component={GalaxyScreen} />
      <Tab.Screen name="Medals" component={MedalsScreen} />
      <Tab.Screen name="Family" component={FamilyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 主导航栈
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.dark },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="PlanetDetail" 
        component={PlanetDetailScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="CreateHabit" 
        component={CreateHabitScreen}
        options={{ 
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

// 加载屏幕
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary.blue} />
    </View>
  );
}

export default function App() {
  const { isLoading, initializeApp } = useAppStore();
  
  useEffect(() => {
    initializeApp();
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer theme={NavigationTheme}>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
  },
});

