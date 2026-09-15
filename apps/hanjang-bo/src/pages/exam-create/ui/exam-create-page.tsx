"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateExamPaper } from "@/entities/exam";
import { ROUTES } from "@/shared/config/constants";

import type { FormEvent } from "react";

const ExamCreatePage = () => {
  const router = useRouter();
  const createPaper = useCreateExamPaper();
  const [round, setRound] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");

  const canSubmit =
    round.trim().length > 0 &&
    subject.trim().length > 0 &&
    Number(year) > 0 &&
    Number(timeLimitMinutes) > 0 &&
    !createPaper.isPending;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    createPaper.mutate(
      {
        round: round.trim(),
        subject: subject.trim(),
        year: Number(year),
        coverImageUrl: coverImageUrl.trim(),
        timeLimitMinutes: Number(timeLimitMinutes),
      },
      {
        onSuccess: (paper) => router.push(ROUTES.examDetail(paper.id)),
      },
    );
  };

  return (
    <>
      <h1>새 시험지</h1>
      <form className="card" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="exam-round">
            회차
          </label>
          <input
            id="exam-round"
            className="input"
            value={round}
            onChange={(event) => setRound(event.target.value)}
            placeholder="2025학년도 수능"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="exam-subject">
            과목
          </label>
          <input
            id="exam-subject"
            className="input"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="국어"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="exam-year">
            연도
          </label>
          <input
            id="exam-year"
            className="input"
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="exam-cover">
            표지 이미지 URL
          </label>
          <input
            id="exam-cover"
            className="input"
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="exam-limit">
            제한 시간 (분)
          </label>
          <input
            id="exam-limit"
            className="input"
            type="number"
            value={timeLimitMinutes}
            onChange={(event) => setTimeLimitMinutes(event.target.value)}
          />
        </div>
        {createPaper.isError && <p className="error-text">{createPaper.error.message}</p>}
        <div className="row">
          <button type="submit" className="button" disabled={!canSubmit}>
            생성
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => router.push(ROUTES.exams)}
          >
            취소
          </button>
        </div>
      </form>
    </>
  );
};

export default ExamCreatePage;
