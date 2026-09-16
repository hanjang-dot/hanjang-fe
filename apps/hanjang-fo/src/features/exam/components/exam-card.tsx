import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button, Card, IconButton } from "@/shared/components";

import type { ExamPaper } from "../types";

interface ExamCardProps {
  paper: ExamPaper;
  bookmarked: boolean;
  primaryAction?: boolean;
  actionLabel?: string;
  desc?: string;
  onPress: () => void;
  onToggleBookmark: () => void;
}

const ExamCard = ({
  paper,
  bookmarked,
  primaryAction = false,
  actionLabel = "풀기",
  desc,
  onPress,
  onToggleBookmark,
}: ExamCardProps) => (
  <Card
    onPress={onPress}
    title={paper.title}
    desc={desc ?? paper.subject}
    meta={`${Math.round(paper.timeLimitSec / 60)}분`}
    action={
      <View style={styles.actions}>
        <IconButton
          name="star"
          accessibilityLabel="북마크"
          selected={bookmarked}
          onPress={onToggleBookmark}
        />
        {primaryAction ? (
          <Button label={actionLabel} variant="primary" onPress={onPress} />
        ) : null}
      </View>
    }
  />
);

const styles = StyleSheet.create((theme) => ({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.sizes.tapGap,
  },
}));

export default ExamCard;
