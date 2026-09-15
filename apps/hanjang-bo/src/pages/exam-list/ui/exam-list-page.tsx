"use client";

import Link from "next/link";

import { useExamPapers } from "@/entities/exam";
import { ROUTES } from "@/shared/config/constants";

import ExamRow from "./exam-row";

const ExamListPage = () => {
  const papers = useExamPapers();

  return (
    <>
      <div className="row-between">
        <h1>시험지</h1>
        <Link href={ROUTES.examNew} className="button">
          새 시험지
        </Link>
      </div>
      {papers.isError && <p className="error-text">{papers.error.message}</p>}
      {papers.isPending ? (
        <p className="muted">불러오는 중.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>회차</th>
              <th>과목</th>
              <th>연도</th>
              <th>제한 시간</th>
              <th>상태</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(papers.data ?? []).map((paper) => (
              <ExamRow key={paper.id} paper={paper} />
            ))}
          </tbody>
        </table>
      )}
      {papers.data?.length === 0 && <p className="muted">시험지가 없다.</p>}
    </>
  );
};

export default ExamListPage;
