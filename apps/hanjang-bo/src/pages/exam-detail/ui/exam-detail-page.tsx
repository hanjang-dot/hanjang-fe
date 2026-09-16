import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { useExamPapers, useQuestions, useSetExamPaperPublished } from "@/entities/exam";
import { ROUTES } from "@/shared/config/constants";

import QuestionEditor from "./question-editor";
import QuestionRow from "./question-row";

import type { Question } from "@/entities/exam";

const ExamDetailPage = ({ examId }: { examId: string }) => {
  const papers = useExamPapers();
  const questions = useQuestions(examId);
  const setPublished = useSetExamPaperPublished();
  const [editing, setEditing] = useState<Question | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const paper = papers.data?.find((p) => p.id === examId);
  const sortedQuestions = [...(questions.data ?? [])].sort((a, b) => a.number - b.number);

  if (papers.isSuccess && !paper) {
    return (
      <>
        <h1>시험지 없음</h1>
        <Link to={ROUTES.exams}>목록으로</Link>
      </>
    );
  }

  const openNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (question: Question) => {
    setEditing(question);
    setEditorOpen(true);
  };

  const closeEditor = () => setEditorOpen(false);

  return (
    <>
      <div className="row-between">
        <h1>{paper?.round ?? "시험지"}</h1>
        {paper && (
          <button
            type="button"
            className={paper.published ? "button button-secondary" : "button"}
            disabled={setPublished.isPending}
            onClick={() => setPublished.mutate({ id: paper.id, published: !paper.published })}
          >
            {paper.published ? "숨기기" : "발행"}
          </button>
        )}
      </div>
      {paper && (
        <p className="muted">
          {paper.subject} · <span className="stamp">{paper.year}</span> ·{" "}
          {paper.timeLimitMinutes}분 · {paper.published ? "발행됨" : "숨김"}
        </p>
      )}

      <div className="row-between">
        <h2>문항</h2>
        <button type="button" className="button" onClick={openNew}>
          문항 추가
        </button>
      </div>

      {editorOpen && (
        <QuestionEditor examPaperId={examId} question={editing} onDone={closeEditor} />
      )}

      {questions.isError && <p className="error-text">{questions.error.message}</p>}
      {questions.isPending ? (
        <p className="muted">불러오는 중.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>번호</th>
              <th>프롬프트</th>
              <th>선지 수</th>
              <th>정답</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sortedQuestions.map((question) => (
              <QuestionRow key={question.id} question={question} onEdit={openEdit} />
            ))}
          </tbody>
        </table>
      )}
      {questions.data?.length === 0 && <p className="muted">문항이 없다.</p>}
    </>
  );
};

export default ExamDetailPage;
