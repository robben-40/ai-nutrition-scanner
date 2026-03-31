import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

import ScanScreen from "./src/screens/ScanScreen";
import ResultScreen from "./src/screens/ResultScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import { theme } from "./src/constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CameraIcon = ({ color }) => (
  <Svg width="25" height="25" viewBox="0 0 22 22" fill="none">
    <Path d="M3 9a2 2 0 012-2h1l2-3h4l2 3h1a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="10" cy="13" r="3" stroke={color} strokeWidth="1.8"/>
  </Svg>
);

const GridIcon = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8"/>
    <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8"/>
    <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8"/>
    <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8"/>
  </Svg>
);

const ListIcon = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => {
            const color = focused ? theme.colors.text : theme.colors.hint;
            if (route.name === "Scanner") return <CameraIcon color={color} />;
            if (route.name === "Dashboard") return <GridIcon color={color} />;
            if (route.name === "History") return <ListIcon color={color} />;
          },
          tabBarActiveTintColor: theme.colors.text,
          tabBarInactiveTintColor: theme.colors.hint,
        })}
      >
        <Tab.Screen name="Scanner" component={ScanStack} options={{ title: "scan" }} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "today" }} />
        <Tab.Screen name="History" component={HistoryScreen} options={{ title: "log" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: 0.5,
    paddingTop: 6,
    height: 70,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
});
