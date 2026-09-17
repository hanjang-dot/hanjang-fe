import { useRef } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { instrument } from "@/shared/instrumentation";

import { instrument } from "@/shared/instrumentation";

import type { StrokePoint } from "@/features/session";
import type { ReactNode } from "react";

const ACTIVATE_X = 8;
const FAIL_Y = 8;

interface InkLayerProps {
  onStroke: (points: StrokePoint[]) => void;
  children: ReactNode;
}

const InkLayer = ({ onStroke, children }: InkLayerProps) => {
  const points = useRef<StrokePoint[]>([]);
  const begin = (x: number, y: number) => {
    instrument.strokeStarts += 1;
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
      <View>{children}</View>
    </GestureDetector>
  );
};

export default InkLayer;
