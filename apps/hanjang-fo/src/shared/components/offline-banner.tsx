import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const OfflineBanner = () => (
  <View style={styles.banner}>
    <Text style={styles.text}>
      오프라인 — 마지막으로 저장된 내용을 보여줘요
    </Text>
  </View>
);

const styles = StyleSheet.create((theme) => ({
  banner: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.screenPadding,
    backgroundColor: theme.colors.surface2,
  },
  text: {
    ...theme.typography.bodySm,
    color: theme.colors.text,
  },
}));

export default OfflineBanner;
