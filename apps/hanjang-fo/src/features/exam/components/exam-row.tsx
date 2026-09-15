import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import CoverView from "./cover-view";

import type { ExamPaper } from "../types";

interface ExamRowProps {
  paper: ExamPaper;
  bookmarked: boolean;
  visible: boolean;
  onPress: () => void;
  onToggleBookmark: () => void;
}

const ExamRow = ({
  paper,
  bookmarked,
  visible,
  onPress,
  onToggleBookmark,
}: ExamRowProps) => (
  <Pressable onPress={onPress} style={styles.row}>
    <CoverView visible={visible} title={paper.title} />
    <View style={styles.meta}>
      <Text style={styles.year}>{paper.year}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {paper.title}
      </Text>
      <Text style={styles.subject}>{paper.subject}</Text>
    </View>
    <Pressable onPress={onToggleBookmark} hitSlop={8} style={styles.bookmark}>
      <Text style={[styles.bookmarkText, bookmarked && styles.bookmarkOn]}>
        {bookmarked ? "저장됨" : "저장"}
      </Text>
    </Pressable>
  </Pressable>
);

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
    backgroundColor: theme.colors.paper,
  },
  meta: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  year: {
    ...theme.typography.year,
    color: theme.colors.stamp,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.ink,
  },
  subject: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  bookmark: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  bookmarkText: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  bookmarkOn: {
    color: theme.colors.navy,
  },
}));

export default ExamRow;
