import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { ReactNode } from "react";

interface BottomCtaProps {
  children: ReactNode;
}

const BottomCta = ({ children }: BottomCtaProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom + theme.spacing.sm }]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    minHeight: theme.sizes.bottomCta,
    paddingTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.screenPadding,
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));

export default BottomCta;
