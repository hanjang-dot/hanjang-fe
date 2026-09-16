import Constants from "expo-constants";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useAuth } from "@/features/auth";
import { Button, ListRow } from "@/shared/components";

const PROVIDER_LABELS: Record<string, string> = {
  kakao: "카카오",
};

const MyScreen = () => {
  const { user, signOut } = useAuth();
  const version = Constants.expoConfig?.version ?? "1.0.0";
  return (
    <View style={styles.root}>
      <View style={styles.rows}>
        <ListRow
          title="계정"
          meta={
            user
              ? `${PROVIDER_LABELS[user.provider]} 연결됨${user.email ? ` · ${user.email}` : ""}`
              : "미연결"
          }
        />
        <ListRow title="앱 버전" meta={version} />
      </View>
      <View style={styles.actions}>
        <Button
          label="로그아웃"
          variant="primary"
          size="lg"
          full
          icon="logout"
          onPress={signOut}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  rows: {
    marginTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  actions: {
    padding: theme.spacing.screenPadding,
  },
}));

export default MyScreen;
