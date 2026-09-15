import ExamDetailPage from "@/pages/exam-detail";

const Page = async ({ params }: { params: Promise<{ examId: string }> }) => {
  const { examId } = await params;
  return <ExamDetailPage examId={examId} />;
};

export default Page;
