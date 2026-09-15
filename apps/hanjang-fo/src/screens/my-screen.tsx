import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useAuth } from "@/features/auth";
import { SectionHeader } from "@/shared/components";

const PROVIDER_LABELS: Record<string, string> = {
  kakao: "카카오",
  phone: "전화",
};

const MyScreen = () => {
  const { user, signIn, signOut } = useAuth();
  return (
    <View style={styles.root}>
      <SectionHeader title="마이" />
      <View style={styles.card}>
        {user ? (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.caption}>
              {PROVIDER_LABELS[user.provider]} 계정
            </Text>
            <Pressable style={styles.button} onPress={signOut}>
              <Text style={styles.buttonText}>로그아웃</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.caption}>로그인이 필요합니다</Text>
            <Pressable style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>로그인</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  card: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    gap: theme.spacing.sm,
  },
  name: {
    ...theme.typography.heading,
    color: theme.colors.ink,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.navy,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.choiceOnText,
  },
}));

export default MyScreen;
