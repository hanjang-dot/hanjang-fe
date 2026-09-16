import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import InkLayer from "./ink-layer";
import TiledPassageImage from "./tiled-passage-image";

import type { StrokePoint } from "@/features/session";
import type { Question } from "../types";

interface PassagePaneProps {
  questions: Question[];
  onStroke: (points: StrokePoint[]) => void;
}

const PassagePane = ({ questions, onStroke }: PassagePaneProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  return (
    <View style={styles.pane}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        onLayout={(event) =>
          setViewportHeight(event.nativeEvent.layout.height)
        }
      >
        {questions.map((question) => (
          <View key={question.questionId} style={styles.passage}>
            <Text style={styles.number}>{question.number}번</Text>
            {question.passageImageHeight ? (
              <TiledPassageImage
                imageHeight={question.passageImageHeight}
                scrollY={scrollY}
                viewportHeight={viewportHeight}
              />
            ) : (
              <Text style={styles.text}>{question.passage}</Text>
            )}
          </View>
        ))}
      </ScrollView>
      <InkLayer onStroke={onStroke} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  pane: {
    flex: 1,
    position: "relative",
    backgroundColor: theme.colors.surface2,
    borderRightWidth: {
      phone: 0,
      tablet: 1,
    },
    borderBottomWidth: {
      phone: 1,
      tablet: 0,
    },
    borderColor: theme.colors.border,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.cardPadding,
    gap: theme.spacing.xl,
  },
  passage: {
    gap: theme.spacing.sm,
  },
  number: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  text: {
    ...theme.typography.passage,
    color: theme.colors.text,
  },
}));

export default PassagePane;
