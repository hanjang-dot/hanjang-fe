import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { ChoiceState } from "@/shared/components";

const MARKS = ["O", "X"] as const;

interface TfRowProps {
  selectedIndex: number | null;
  answerIndex: number | null;
  onSelect: (index: number) => void;
}

const markState = (
  index: number,
  selectedIndex: number | null,
  answerIndex: number | null,
): ChoiceState => {
  if (selectedIndex === null || answerIndex === null) return "default";
  if (index === answerIndex) return "correct";
  if (index === selectedIndex) return "wrong";
  return "default";
};

const TfRow = ({ selectedIndex, answerIndex, onSelect }: TfRowProps) => (
  <View style={styles.row}>
    {MARKS.map((mark, index) => {
      const state = markState(index, selectedIndex, answerIndex);
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
          : theme.colors.surface1,
    borderWidth: 1,
    borderColor:
      state === "correct"
        ? theme.colors.correct
        : state === "wrong"
          ? theme.colors.danger
          : theme.colors.border,
    borderRadius: theme.radius.lg,
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
          : theme.colors.text,
  }),
}));

export default TfRow;
