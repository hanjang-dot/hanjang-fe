import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useAuth } from "@/features/auth";
import { Button, BottomCta } from "@/shared/components";

import type { AuthProvider } from "@/features/auth";

const LoginScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const enter = (provider: AuthProvider) => {
    void signIn(provider).then(() => router.replace("/"));
  };
  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.logo}>한장</Text>
        <Text style={styles.tagline}>
          시험지 한 장을 펼쳐 시간 안에 풉니다
        </Text>
      </View>
      <BottomCta>
        <Button
          label="카카오로 시작"
          variant="primary"
          size="lg"
          full
          onPress={() => enter("kakao")}
        />
        <Button
          label="전화번호로 시작"
          variant="secondary"
          size="lg"
          full
          onPress={() => enter("phone")}
        />
      </BottomCta>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.xxxl,
  },
  logo: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  tagline: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
}));

export default LoginScreen;
