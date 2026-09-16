import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create((theme) => ({
  title: {
    ...theme.typography.heading,
    color: theme.colors.ink,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
}));

export default SectionHeader;
