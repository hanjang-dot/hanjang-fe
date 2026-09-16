import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { ChoiceState } from "@/shared/components";

const MARKS = ["O", "X"] as const;

interface TfRowProps {
  selectedIndex: number | null;
  correct: boolean | null;
  onSelect: (index: number) => void;
}

const markState = (
  index: number,
  selectedIndex: number | null,
  correct: boolean | null,
): ChoiceState => {
  if (selectedIndex === null) return "default";
  if (index !== selectedIndex) return "disabled";
  if (correct === null) return "selected";
  return correct ? "correct" : "wrong";
};

const TfRow = ({ selectedIndex, correct, onSelect }: TfRowProps) => (
  <View style={styles.row}>
    {MARKS.map((mark, index) => {
      const state = markState(index, selectedIndex, correct);
      return (
        <Pressable
          key={mark}
          accessibilityRole="button"
          disabled={selectedIndex !== null}
          onPress={() => onSelect(index)}
          style={({ pressed }) => [
            styles.button(state),
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.mark(state)}>{mark}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  button: (state: ChoiceState) => ({
    flex: 1,
    minHeight: theme.sizes.oxButton,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor:
      state === "correct"
        ? theme.colors.correctSoft
        : state === "wrong"
          ? theme.colors.dangerSoft
          : state === "selected"
            ? theme.colors.accentSoft
            : theme.colors.surface1,
    borderWidth: 1,
    borderColor:
      state === "correct"
        ? theme.colors.correct
        : state === "wrong"
          ? theme.colors.danger
          : state === "selected"
            ? theme.colors.accent
            : theme.colors.border,
    borderRadius: theme.radius.lg,
    opacity: state === "disabled" ? 0.4 : 1,
  }),
  pressed: {
    backgroundColor: theme.colors.surface2,
  },
  mark: (state: ChoiceState) => ({
    ...theme.typography.ox,
    color:
      state === "correct"
        ? theme.colors.correct
        : state === "wrong"
          ? theme.colors.danger
          : state === "selected"
            ? theme.colors.accent
            : theme.colors.text,
  }),
}));

export default TfRow;
