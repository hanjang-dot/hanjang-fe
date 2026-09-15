import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useGradeChoice } from "@/features/session";

import type { ExamSession } from "@/features/session";
import type { Question } from "../types";

interface QuestionBlockProps {
  session: ExamSession;
  question: Question;
}

const QuestionBlock = ({ session, question }: QuestionBlockProps) => {
  const { variant, grade, choose } = useGradeChoice(session, question);
  return (
    <View style={styles.block} testID={`sheet-variant-${grade ? "graded" : variant}`}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{question.number}</Text>
        </View>
        {grade ? (
          <Text
            style={[styles.result, grade.correct ? styles.correct : styles.wrong]}
          >
            {grade.correct ? "정답" : "오답"}
          </Text>
        ) : null}
      </View>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.choices}>
        {question.choices.map((choice) => {
          const picked = grade?.choiceId === choice.choiceId;
          const revealed = grade !== null;
          const isAnswer =
            revealed && choice.choiceId === question.correctChoiceId;
          return (
            <Pressable
              key={choice.choiceId}
              onPress={() => choose(choice.choiceId)}
              style={[
                styles.choice,
                picked && styles.choicePicked,
                isAnswer && styles.choiceCorrect,
                picked && !grade?.correct && styles.choiceWrong,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  picked && styles.choicePickedText,
                  isAnswer && styles.choiceCorrectText,
                ]}
              >
                {choice.label} {choice.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  block: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.choiceOnText,
  },
  result: {
    ...theme.typography.caption,
    fontWeight: "600",
  },
  correct: {
    color: theme.colors.success,
  },
  wrong: {
    color: theme.colors.error,
  },
  prompt: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  choices: {
    gap: theme.spacing.sm,
  },
  choice: {
    backgroundColor: theme.colors.choice,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  choicePicked: {
    backgroundColor: theme.colors.choiceOn,
    borderColor: theme.colors.choiceOn,
  },
  choiceCorrect: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  choiceWrong: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  choiceText: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  choicePickedText: {
    color: theme.colors.choiceOnText,
  },
  choiceCorrectText: {
    color: theme.colors.choiceOnText,
  },
}));

export default QuestionBlock;
