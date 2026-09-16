import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useGradeChoice } from "@/features/session";
import { ChoiceButton } from "@/shared/components";

import type { ChoiceState } from "@/shared/components";
import type { ExamSession } from "@/features/session";
import type { Question } from "../types";

interface QuestionBlockProps {
  session: ExamSession;
  question: Question;
}

const choiceState = (
  picked: boolean,
  revealed: boolean,
  isAnswer: boolean,
  grading: boolean,
): ChoiceState => {
  if (isAnswer) return "correct";
  if (picked && revealed) return "wrong";
  if (picked || grading) return "selected";
  return "default";
};

const QuestionBlock = ({ session, question }: QuestionBlockProps) => {
  const { variant, grade, choose } = useGradeChoice(session, question);
  return (
    <View
      style={styles.block}
      testID={`sheet-variant-${grade ? "graded" : variant}`}
    >
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.choices}>
        {question.choices.map((choice) => {
          const picked =
            grade?.choiceId === choice.choiceId ||
            session.answers[question.questionId] === choice.choiceId;
          const revealed = grade !== null;
          const isAnswer =
            revealed &&
            (choice.choiceId === question.correctChoiceId ||
              (picked && grade?.correct === true));
          return (
            <ChoiceButton
              key={choice.choiceId}
              index={choice.label}
              text={choice.text}
              state={choiceState(
                picked,
                revealed,
                isAnswer,
                picked && variant === "grading",
              )}
              onPress={() => choose(choice.choiceId)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  block: {
    padding: theme.spacing.cardPadding,
    gap: theme.spacing.md,
  },
  prompt: {
    ...theme.typography.passage,
    color: theme.colors.text,
  },
  choices: {
    gap: theme.spacing.sm,
  },
}));

export default QuestionBlock;
