"use client";

import { useState } from "react";

import { useQuizzes } from "../api/quiz";

import QuizEditor from "./quiz-editor";
import QuizRow from "./quiz-row";

import type { Quiz } from "../model/quiz";

const QuizManagePage = () => {
  const quizzes = useQuizzes();
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const openNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (quiz: Quiz) => {
    setEditing(quiz);
    setEditorOpen(true);
  };

  return (
    <>
      <div className="row-between">
        <h1>퀴즈</h1>
        <button type="button" className="button" onClick={openNew}>
          퀴즈 추가
        </button>
      </div>
      {editorOpen && <QuizEditor quiz={editing} onDone={() => setEditorOpen(false)} />}
      {quizzes.isError && <p className="error-text">{quizzes.error.message}</p>}
      {quizzes.isPending ? (
        <p className="muted">불러오는 중.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>유형</th>
              <th>프롬프트</th>
              <th>선지 수</th>
              <th>정답</th>
              <th>direction</th>
              <th>상태</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(quizzes.data ?? []).map((quiz) => (
              <QuizRow key={quiz.id} quiz={quiz} onEdit={openEdit} />
            ))}
          </tbody>
        </table>
      )}
      {quizzes.data?.length === 0 && <p className="muted">퀴즈가 없다.</p>}
    </>
  );
};

export default QuizManagePage;
