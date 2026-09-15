import { useRef } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import type { StrokePoint } from "@/features/session";

const ACTIVATE_X = 8;
const FAIL_Y = 8;

interface InkLayerProps {
  onStroke: (points: StrokePoint[]) => void;
}

const InkLayer = ({ onStroke }: InkLayerProps) => {
  const points = useRef<StrokePoint[]>([]);
  const begin = (x: number, y: number) => {
    points.current = [{ x, y }];
  };
  const push = (x: number, y: number) => {
    points.current.push({ x, y });
  };
  const end = () => {
    if (points.current.length > 1) onStroke([...points.current]);
    points.current = [];
  };
  const pan = Gesture.Pan()
    .activeOffsetX([-ACTIVATE_X, ACTIVATE_X])
    .failOffsetY([-FAIL_Y, FAIL_Y])
    .onStart((event) => runOnJS(begin)(event.x, event.y))
    .onUpdate((event) => runOnJS(push)(event.x, event.y))
    .onEnd(() => runOnJS(end)());
  return (
    <GestureDetector gesture={pan}>
      <View style={styles.overlay} />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default InkLayer;
