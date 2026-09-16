
import { useDeleteQuestion } from "@/entities/exam";

import type { Question } from "@/entities/exam";

const QuestionRow = ({
  question,
  onEdit,
}: {
  question: Question;
  onEdit: (question: Question) => void;
}) => {
  const deleteQuestion = useDeleteQuestion(question.examPaperId);

  return (
    <tr>
      <td>{question.number}</td>
      <td>{question.prompt}</td>
      <td>{question.choices.length}</td>
      <td>{question.answer}</td>
      <td>
        <div className="row">
          <button
            type="button"
            className="button button-secondary button-sm"
            onClick={() => onEdit(question)}
          >
            편집
          </button>
          <button
            type="button"
            className="button button-danger button-sm"
            disabled={deleteQuestion.isPending}
            onClick={() => deleteQuestion.mutate(question.id)}
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
};

export default QuestionRow;
