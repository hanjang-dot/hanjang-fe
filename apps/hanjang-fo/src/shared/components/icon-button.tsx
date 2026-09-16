import { Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import Icon from "./icon";

import type { IconName, IconSize } from "./icon";

interface IconButtonProps {
  name: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  size?: IconSize;
  selected?: boolean;
  disabled?: boolean;
}

const IconButton = ({
  name,
  onPress,
  accessibilityLabel,
  size = 24,
  selected = false,
  disabled = false,
}: IconButtonProps) => {
  const { theme } = useUnistyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      hitSlop={theme.sizes.tapGap}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
    >
      <Icon
        name={name}
        size={size}
        color={selected ? theme.colors.accent : theme.colors.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    minWidth: theme.sizes.tapMin,
    minHeight: theme.sizes.tapMin,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.full,
  },
  pressed: {
    backgroundColor: theme.colors.surface2,
  },
  selected: {
    backgroundColor: theme.colors.accentSoft,
  },
  disabled: {
    opacity: 0.4,
  },
}));

export default IconButton;
