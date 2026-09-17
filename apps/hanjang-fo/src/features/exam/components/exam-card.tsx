import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button, Card, IconButton } from "@/shared/components";
import { instrument } from "@/shared/instrumentation";

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
  >
    {paper.coverImageUrl ? (
      <Image
        testID="exam-card-cover"
        source={{ uri: paper.coverImageUrl }}
        style={styles.cover}
        onLoad={() => {
          instrument.coverDecodes += 1;
        }}
      />
    ) : null}
  </Card>
);

const styles = StyleSheet.create((theme) => ({
  cover: {
    width: "100%",
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.sizes.tapGap,
  },
}));

export default ExamCard;
