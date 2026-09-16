import { ActivityIndicator, Pressable, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import Icon from "./icon";

import type { IconName } from "./icon";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
}

const Button = ({
  label,
  onPress,
  variant = "secondary",
  size = "md",
  full = false,
  disabled = false,
  loading = false,
  icon,
}: ButtonProps) => {
  styles.useVariants({ variant, size, full });
  const { theme } = useUnistyles();
  const spinnerColor =
    variant === "primary" || variant === "danger"
      ? theme.colors.surface1
      : theme.colors.accent;
  const iconColor =
    variant === "primary" || variant === "danger"
      ? theme.colors.surface1
      : variant === "ghost"
        ? theme.colors.accent
        : theme.colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        full && styles.full,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {icon ? (
            <Icon name={icon} size={20} color={iconColor} />
          ) : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: theme.sizes.buttonMd,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface1,
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.accent,
          borderColor: "transparent",
        },
        secondary: {
          backgroundColor: theme.colors.surface1,
          borderColor: theme.colors.border,
        },
        ghost: {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
        danger: {
          backgroundColor: theme.colors.danger,
          borderColor: "transparent",
        },
      },
      size: {
        sm: {
          height: theme.sizes.buttonSm,
          paddingHorizontal: theme.spacing.md,
        },
        md: {
          height: theme.sizes.buttonMd,
          paddingHorizontal: theme.spacing.lg,
        },
        lg: {
          height: theme.sizes.buttonLg,
          paddingHorizontal: theme.sizes.buttonPadLg,
        },
      },
      full: {
        true: {
          alignSelf: "stretch",
          borderRadius: theme.radius.xl,
        },
      },
    },
  },
  full: {},
  pressed: {
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.accentPressed },
        secondary: { backgroundColor: theme.colors.surface2 },
        ghost: { backgroundColor: theme.colors.accentSoft },
        danger: { backgroundColor: theme.colors.danger },
      },
    },
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...theme.typography.button,
    variants: {
      size: {
        sm: theme.typography.buttonSm,
        md: theme.typography.button,
        lg: theme.typography.buttonLg,
      },
      variant: {
        primary: { color: theme.colors.surface1 },
        secondary: { color: theme.colors.text },
        ghost: { color: theme.colors.accent },
        danger: { color: theme.colors.surface1 },
      },
    },
  },
}));

export default Button;
