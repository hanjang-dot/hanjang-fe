import { Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

const TabsLayout = () => {
  const { theme } = useUnistyles();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.ink,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.paper,
          borderTopColor: theme.colors.hairline,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="library" options={{ title: "자료실" }} />
      <Tabs.Screen name="saved" options={{ title: "저장" }} />
      <Tabs.Screen name="review" options={{ title: "복습" }} />
      <Tabs.Screen name="my" options={{ title: "마이" }} />
    </Tabs>
  );
};

export default TabsLayout;
