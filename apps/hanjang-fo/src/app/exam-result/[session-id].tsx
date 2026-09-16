import { useLocalSearchParams } from "expo-router";

import ExamResultScreen from "@/screens/exam-result-screen";

const ExamResultRoute = () => {
  const { "session-id": sessionId } = useLocalSearchParams<{
    "session-id": string;
  }>();
  return <ExamResultScreen sessionId={sessionId} />;
};

export default ExamResultRoute;
