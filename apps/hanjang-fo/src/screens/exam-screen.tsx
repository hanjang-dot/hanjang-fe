import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import {
  ExamTimer,
  PassagePane,
  QuestionBlock,
  paneContract,
  useExam,
} from "@/features/exam";
import {
  useExamSession,
  useSessionStore,
} from "@/features/session";

interface ExamScreenProps {
  examId: string;
}

const ExamScreen = ({ examId }: ExamScreenProps) => {
  const router = useRouter();
  const { data } = useExam(examId);
  const session = useExamSession(examId, data?.paper.timeLimitSec);
  const submitSession = useSessionStore((state) => state.submitSession);
  const addStroke = useSessionStore((state) => state.addStroke);
  const { rt } = useUnistyles();
  const wide = rt.breakpoint !== "phone";
  if (!data || !session) {
    return <View style={styles.root} />;
  }
  const submit = () => {
    submitSession(session.sessionId);
    router.replace(`/result/${session.sessionId}`);
  };
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerMeta}>
          <Text style={styles.title} numberOfLines={1}>
            {data.paper.title}
          </Text>
          <Text style={styles.caption}>{data.paper.subject}</Text>
        </View>
        <ExamTimer deadlineAt={session.deadlineAt} />
        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>제출</Text>
        </Pressable>
      </View>
      <View style={[styles.panes, !wide && styles.panesStack]}>
        <PassagePane
          questions={data.questions}
          onStroke={(points) =>
            addStroke(session.sessionId, { points })
          }
        />
        <ScrollView style={[styles.questions, wide && styles.questionsWide]}>
          {data.questions.map((question) => (
            <QuestionBlock
              key={question.questionId}
              session={session}
              question={question}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },
  headerMeta: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.ink,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  submit: {
    backgroundColor: theme.colors.navy,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  submitText: {
    ...theme.typography.button,
    color: theme.colors.choiceOnText,
  },
  panes: {
    flex: 1,
    flexDirection: "row",
  },
  panesStack: {
    flexDirection: "column",
  },
  questions: {
    flex: 1,
  },
  questionsWide: {
    flexGrow: 0,
    width: paneContract.questionPaneWidth,
  },
}));

export default ExamScreen;
