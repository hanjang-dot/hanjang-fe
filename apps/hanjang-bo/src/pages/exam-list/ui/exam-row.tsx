import { Link } from "@tanstack/react-router";

import { useSetExamPaperPublished } from "@/entities/exam";
import { ROUTES } from "@/shared/config/constants";

import type { ExamPaper } from "@/entities/exam";

const ExamRow = ({ paper }: { paper: ExamPaper }) => {
  const setPublished = useSetExamPaperPublished();

  return (
    <tr>
      <td>
        <Link to={ROUTES.examDetail(paper.id)}>{paper.round}</Link>
      </td>
      <td>{paper.subject}</td>
      <td>
        <span className="stamp">{paper.year}</span>
      </td>
      <td>{paper.timeLimitMinutes}분</td>
      <td>
        <span className={paper.published ? "badge badge-on" : "badge badge-off"}>
          {paper.published ? "발행" : "숨김"}
        </span>
      </td>
      <td>
        <button
          type="button"
          className="button button-secondary button-sm"
          disabled={setPublished.isPending}
          onClick={() => setPublished.mutate({ id: paper.id, published: !paper.published })}
        >
          {paper.published ? "숨기기" : "발행"}
        </button>
      </td>
    </tr>
  );
};

export default ExamRow;
