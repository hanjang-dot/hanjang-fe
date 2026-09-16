import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface SkeletonCardProps {
  lines?: number;
}

const SkeletonCard = ({ lines = 2 }: SkeletonCardProps) => (
  <View style={styles.card}>
    <View style={styles.line} />
    {Array.from({ length: Math.max(0, lines - 1) }).map((_, index) => (
      <View key={index} style={styles.lineSm} />
    ))}
  </View>
);

interface SkeletonListProps {
  count?: number;
}

const SkeletonList = ({ count = 3 }: SkeletonListProps) => (
  <View style={styles.list}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create((theme) => ({
  list: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.screenPadding,
  },
  card: {
    minHeight: theme.sizes.scoreRing,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface2,
    padding: theme.spacing.cardPadding,
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  line: {
    height: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
    width: "60%",
  },
  lineSm: {
    height: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
    width: "40%",
  },
}));

export { SkeletonCard, SkeletonList };
export default SkeletonList;
