import { useNetInfo } from "@react-native-community/netinfo";

export const useIsOffline = () => {
  const { isConnected } = useNetInfo();
  return isConnected === false;
};
