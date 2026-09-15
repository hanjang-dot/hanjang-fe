import { useLocalSearchParams } from "expo-router";

import ExamScreen from "@/screens/exam-screen";

const ExamRoute = () => {
  const { "exam-id": examId } = useLocalSearchParams<{
    "exam-id": string;
  }>();
  return <ExamScreen examId={examId} />;
};

export default ExamRoute;
