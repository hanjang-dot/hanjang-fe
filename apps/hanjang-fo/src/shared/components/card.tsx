import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { PropsWithChildren, ReactNode } from "react";

interface CardProps {
  onPress?: () => void;
  title?: string;
  desc?: string;
  meta?: string;
  action?: ReactNode;
  children?: ReactNode;
}

const CardBody = ({
  title,
  desc,
  meta,
  action,
  children,
}: Omit<CardProps, "onPress">) => (
  <>
    <View style={styles.row}>
      <View style={styles.body}>
        {title ? (
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        ) : null}
        {desc ? (
          <Text style={styles.desc} numberOfLines={3}>
            {desc}
          </Text>
        ) : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      {action}
    </View>
    {children}
  </>
);

const Card = ({ onPress, ...props }: PropsWithChildren<CardProps>) => {
  if (!onPress) {
    return (
      <View style={styles.card}>
        <CardBody {...props} />
      </View>
    );
  }
  return (
    <Pressable
      accessible={false}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <CardBody {...props} />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.cardPadding,
    boxShadow: theme.shadows.sm,
    gap: theme.spacing.md,
  },
  pressed: {
    backgroundColor: theme.colors.surface2,
    boxShadow: "none",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  desc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  meta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default Card;
