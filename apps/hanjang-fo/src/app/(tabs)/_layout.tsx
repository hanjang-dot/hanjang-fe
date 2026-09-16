import { Redirect, Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

import { useAuth } from "@/features/auth";
import { Icon } from "@/shared/components";

import type { ColorValue } from "react-native";

import type { IconName } from "@/shared/components";

const tabIcon =
  (name: IconName) =>
  ({ color }: { color: ColorValue }) => (
    <Icon name={name} color={color as string} />
  );

const TabsLayout = () => {
  const { theme } = useUnistyles();
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: theme.typography.h3.fontFamily,
          fontSize: theme.typography.h3.fontSize,
          color: theme.colors.text,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface1,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.caption.fontFamily,
          fontSize: theme.typography.caption.fontSize,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "한장", tabBarIcon: tabIcon("home") }}
      />
      <Tabs.Screen
        name="library"
        options={{ title: "자료실", tabBarIcon: tabIcon("library") }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: "저장", tabBarIcon: tabIcon("bookmark") }}
      />
      <Tabs.Screen
        name="review"
        options={{ title: "복습", tabBarIcon: tabIcon("history") }}
      />
      <Tabs.Screen
        name="my"
        options={{ title: "마이", tabBarIcon: tabIcon("user") }}
      />
    </Tabs>
  );
};

export default TabsLayout;
