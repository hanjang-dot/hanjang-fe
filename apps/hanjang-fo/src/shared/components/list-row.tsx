import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface ListRowProps {
  title: string;
  meta?: string;
  metaColor?: "muted" | "correct" | "danger";
  onPress?: () => void;
}

const ListRow = ({ title, meta, metaColor = "muted", onPress }: ListRowProps) => {
  styles.useVariants({ metaColor });
  const content = (
    <>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </>
  );
  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    minHeight: theme.sizes.bottomCta,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.screenPadding,
    backgroundColor: theme.colors.surface1,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pressed: {
    backgroundColor: theme.colors.surface2,
  },
  title: {
    flex: 1,
    minWidth: 0,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  meta: {
    ...theme.typography.caption,
    variants: {
      metaColor: {
        muted: { color: theme.colors.textMuted },
        correct: { color: theme.colors.correct },
        danger: { color: theme.colors.danger },
      },
    },
  },
}));

export default ListRow;
