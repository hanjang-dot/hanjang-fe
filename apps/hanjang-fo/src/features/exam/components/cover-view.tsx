import { useEffect } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { instrument } from "@/shared/instrumentation";

interface CoverViewProps {
  visible: boolean;
  title: string;
}

const CoverView = ({ visible, title }: CoverViewProps) => {
  useEffect(() => {
    if (visible) instrument.coverDecodes += 1;
  }, [visible]);
  return (
    <View style={styles.cover}>
      {visible ? <Text style={styles.initial}>{title.slice(0, 1)}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  cover: {
    width: 54,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    ...theme.typography.heading,
    color: theme.colors.muted,
  },
}));

export default CoverView;
