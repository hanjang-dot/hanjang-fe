import { useEffect, useState } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { formatRemaining } from "@/shared/utils";

interface ExamTimerProps {
  deadlineAt: number;
  showBelowSec?: number;
}

const ExamTimer = ({ deadlineAt, showBelowSec }: ExamTimerProps) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const remainingMs = deadlineAt - now;
  if (showBelowSec !== undefined && remainingMs > showBelowSec * 1000) {
    return null;
  }
  return <Text style={styles.timer}>{formatRemaining(remainingMs)}</Text>;
};

const styles = StyleSheet.create((theme) => ({
  timer: {
    ...theme.typography.timer,
    color: theme.colors.text,
  },
}));

export default ExamTimer;
