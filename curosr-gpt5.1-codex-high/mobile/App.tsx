import "react-native-gesture-handler";
import React from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrototypeProvider } from "@/hooks/PrototypeProvider";
import { HomeScreen } from "@/screens/HomeScreen";
import { GalaxyScreen } from "@/screens/GalaxyScreen";
import { FamilyScreen } from "@/screens/FamilyScreen";
import { RewardsScreen } from "@/screens/RewardsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { palette } from "@/theme/colors";

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: "rgba(3,7,18,0.9)",
    borderTopWidth: 0,
    height: 80
  },
  tabBarActiveTintColor: "#a5b4fc",
  tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 8
  }
};

const AppNavigator = () => (
  <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "首页",
        tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
      }}
    />
    <Tab.Screen
      name="Galaxy"
      component={GalaxyScreen}
      options={{
        tabBarLabel: "星际",
        tabBarIcon: ({ color, size }) => <Ionicons name="planet" color={color} size={size} />
      }}
    />
    <Tab.Screen
      name="Family"
      component={FamilyScreen}
      options={{
        tabBarLabel: "家庭",
        tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />
      }}
    />
    <Tab.Screen
      name="Rewards"
      component={RewardsScreen}
      options={{
        tabBarLabel: "奖章",
        tabBarIcon: ({ color, size }) => <Ionicons name="ribbon" color={color} size={size} />
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "我",
        tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  const scheme = useColorScheme();
  return (
    <PrototypeProvider>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            ...(scheme === "dark" ? DarkTheme : DefaultTheme),
            colors: { ...(scheme === "dark" ? DarkTheme : DefaultTheme).colors, background: palette.night }
          }}
        >
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </PrototypeProvider>
  );
}

