import { useLocalSearchParams } from "expo-router";

import ResultScreen from "@/screens/result-screen";

const ResultRoute = () => {
  const { "session-id": sessionId } = useLocalSearchParams<{
    "session-id": string;
  }>();
  return <ResultScreen sessionId={sessionId} />;
};

export default ResultRoute;
