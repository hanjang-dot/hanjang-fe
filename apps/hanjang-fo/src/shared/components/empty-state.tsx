import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import Button from "./button";
import Icon from "./icon";

import type { IconName } from "./icon";

interface EmptyStateProps {
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconName;
}

const EmptyState = ({
  desc,
  actionLabel,
  onAction,
  icon = "inbox",
}: EmptyStateProps) => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.root}>
      <View style={styles.iconScale}>
        <Icon name={icon} size={24} color={theme.colors.textMuted} />
      </View>
      <Text style={styles.desc}>{desc}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="primary" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.screenPadding,
  },
  iconScale: {
    transform: [{ scale: 2 }],
    marginBottom: theme.spacing.md,
  },
  desc: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  action: {
    marginTop: theme.spacing.sm,
  },
}));

export default EmptyState;
