import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ScoreRingProps {
  correct: number;
  total: number;
}

const ScoreRing = ({ correct, total }: ScoreRingProps) => {
  const { theme } = useUnistyles();
  const size = theme.sizes.scoreRing;
  const stroke = theme.sizes.scoreRingLine;
  const radiusValue = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radiusValue;
  const ratio = total > 0 ? correct / total : 0;
  return (
    <View style={styles.root}>
      <View style={styles.ringBox}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radiusValue}
            stroke={theme.colors.surface2}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radiusValue}
            stroke={theme.colors.accent}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - ratio)}
            strokeLinecap="round"
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>
        <View style={styles.center}>
          <Text style={styles.score}>
            {correct}/{total}
          </Text>
        </View>
      </View>
      <Text style={styles.caption}>정답</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  ringBox: {
    width: theme.sizes.scoreRing,
    height: theme.sizes.scoreRing,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default ScoreRing;
