import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => (
  <View style={styles.track}>
    <View style={styles.fill(Math.max(0, Math.min(1, progress)))} />
  </View>
);

const styles = StyleSheet.create((theme) => ({
  track: {
    height: theme.sizes.progress,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.full,
    overflow: "hidden",
  },
  fill: (progress: number) => ({
    height: "100%",
    width: `${progress * 100}%`,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.full,
  }),
}));

export default ProgressBar;
