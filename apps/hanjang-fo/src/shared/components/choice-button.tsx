import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import Icon from "./icon";

export type ChoiceState =
  | "default"
  | "selected"
  | "correct"
  | "wrong"
  | "disabled";

interface ChoiceButtonProps {
  index: string;
  text: string;
  state?: ChoiceState;
  onPress?: () => void;
}

const ChoiceButton = ({
  index,
  text,
  state = "default",
  onPress,
}: ChoiceButtonProps) => {
  styles.useVariants({ state: state === "default" ? undefined : state });
  const disabled = state === "disabled";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.choice, pressed && styles.pressed]}
    >
      <Text style={styles.index}>{index}</Text>
      <Text style={styles.text}>{text}</Text>
      {state === "correct" ? (
        <View style={styles.mark}>
          <Icon name="check" size={20} color={styles.correctMark.color} />
          <Text style={[styles.markText, styles.correctMark]}>정답</Text>
        </View>
      ) : null}
      {state === "wrong" ? (
        <View style={styles.mark}>
          <Icon name="x" size={20} color={styles.wrongMark.color} />
          <Text style={[styles.markText, styles.wrongMark]}>내 선택</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    minHeight: theme.sizes.tapMin,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.cardPadding,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    variants: {
      state: {
        default: {},
        selected: {
          borderColor: theme.colors.accent,
          backgroundColor: theme.colors.accentSoft,
        },
        correct: {
          borderColor: theme.colors.correct,
          backgroundColor: theme.colors.correctSoft,
        },
        wrong: {
          borderColor: theme.colors.danger,
          backgroundColor: theme.colors.dangerSoft,
        },
        disabled: { opacity: 0.4 },
      },
    },
  },
  pressed: {
    backgroundColor: theme.colors.surface2,
  },
  index: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
  },
  text: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  mark: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginLeft: "auto",
  },
  markText: {
    ...theme.typography.label,
  },
  correctMark: {
    color: theme.colors.correct,
  },
  wrongMark: {
    color: theme.colors.danger,
  },
}));

export default ChoiceButton;
