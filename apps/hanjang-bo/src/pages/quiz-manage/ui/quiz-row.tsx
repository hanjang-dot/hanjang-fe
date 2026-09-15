"use client";

import { useDeleteQuiz, useSetQuizPublished } from "../api/quiz";
import { QUIZ_TYPE_LABELS } from "../model/quiz";

import type { Quiz } from "../model/quiz";

const QuizRow = ({ quiz, onEdit }: { quiz: Quiz; onEdit: (quiz: Quiz) => void }) => {
  const setPublished = useSetQuizPublished();
  const deleteQuiz = useDeleteQuiz();

  return (
    <tr>
      <td>{QUIZ_TYPE_LABELS[quiz.type]}</td>
      <td>{quiz.prompt}</td>
      <td>{quiz.choices.length}</td>
      <td>{quiz.answer}</td>
      <td>{quiz.direction ?? "-"}</td>
      <td>
        <span className={quiz.published ? "badge badge-on" : "badge badge-off"}>
          {quiz.published ? "발행" : "숨김"}
        </span>
      </td>
      <td>
        <div className="row">
          <button
            type="button"
            className="button button-secondary button-sm"
            onClick={() => onEdit(quiz)}
          >
            편집
          </button>
          <button
            type="button"
            className="button button-secondary button-sm"
            onClick={() => setPublished.mutate({ id: quiz.id, published: !quiz.published })}
          >
            {quiz.published ? "숨기기" : "발행"}
          </button>
          <button
            type="button"
            className="button button-danger button-sm"
            onClick={() => deleteQuiz.mutate(quiz.id)}
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
};

export default QuizRow;
