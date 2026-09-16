import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useAuth } from "@/features/auth";
import { Button, BottomCta, ErrorState } from "@/shared/components";

const LoginScreen = () => {
  const router = useRouter();
  const { signingIn, error, signInKakao } = useAuth();
  const [failed, setFailed] = useState(false);

  const enter = () => {
    setFailed(false);
    signInKakao()
      .then((status) => {
        if (status === "ok") router.replace("/");
      })
      .catch(() => setFailed(true));
  };

  if (failed) {
    return (
      <View style={styles.root}>
        <ErrorState
          desc="로그인하지 못했어요 다시 시도할 수 있어요"
          onRetry={() => setFailed(false)}
        />
      </View>
    );
  }

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
          loading={signingIn}
          onPress={enter}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
  error: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    textAlign: "center",
  },
}));

export default LoginScreen;
