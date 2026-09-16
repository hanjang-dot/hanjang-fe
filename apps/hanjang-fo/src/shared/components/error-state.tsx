import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import Button from "./button";
import Icon from "./icon";

interface ErrorStateProps {
  desc?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  desc = "불러오지 못했어요 다시 시도할 수 있어요",
  onRetry,
}: ErrorStateProps) => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.root}>
      <View style={styles.iconScale}>
        <Icon name="alert" size={24} color={theme.colors.danger} />
      </View>
      <Text style={styles.desc}>{desc}</Text>
      {onRetry ? (
        <View style={styles.action}>
          <Button label="다시 시도" onPress={onRetry} variant="secondary" />
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

export default ErrorState;
