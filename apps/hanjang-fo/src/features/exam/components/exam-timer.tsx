import { useEffect, useState } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { formatRemaining } from "@/shared/utils";

interface ExamTimerProps {
  deadlineAt: number;
}

const ExamTimer = ({ deadlineAt }: ExamTimerProps) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Text style={styles.timer}>{formatRemaining(deadlineAt - now)}</Text>
  );
};

const styles = StyleSheet.create((theme) => ({
  timer: {
    ...theme.typography.timer,
    color: theme.colors.text,
  },
}));

export default ExamTimer;
