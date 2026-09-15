"use client";

import { useState } from "react";

import { useSaveQuestion } from "@/entities/exam";

import type { FormEvent } from "react";
import type { PassageRegion, Question } from "@/entities/exam";

const MIN_CHOICES = 2;
const MAX_CHOICES = 6;

type QuestionDraft = {
  id?: string;
  number: string;
  passageImageUrl: string;
  regionX: string;
  regionY: string;
  regionWidth: string;
  regionHeight: string;
  prompt: string;
  choices: string[];
  answer: string;
};

const toDraft = (question: Question | null): QuestionDraft => ({
  id: question?.id,
  number: question ? String(question.number) : "",
  passageImageUrl: question?.passageImageUrl ?? "",
  regionX: question?.passageRegion ? String(question.passageRegion.x) : "",
  regionY: question?.passageRegion ? String(question.passageRegion.y) : "",
  regionWidth: question?.passageRegion ? String(question.passageRegion.width) : "",
  regionHeight: question?.passageRegion ? String(question.passageRegion.height) : "",
  prompt: question?.prompt ?? "",
  choices: question?.choices ?? ["", "", "", "", ""],
  answer: question?.answer ?? "",
});

const toRegion = (draft: QuestionDraft): PassageRegion | null => {
  const filled = [draft.regionX, draft.regionY, draft.regionWidth, draft.regionHeight].every(
    (v) => v.trim().length > 0,
  );
  return filled
    ? {
        x: Number(draft.regionX),
        y: Number(draft.regionY),
        width: Number(draft.regionWidth),
        height: Number(draft.regionHeight),
      }
    : null;
};

const QuestionEditor = ({
  examPaperId,
  question,
  onDone,
}: {
  examPaperId: string;
  question: Question | null;
  onDone: () => void;
}) => {
  const saveQuestion = useSaveQuestion();
  const [draft, setDraft] = useState<QuestionDraft>(() => toDraft(question));
  const [error, setError] = useState("");

  const setChoice = (index: number, value: string) =>
    setDraft((prev) => ({
      ...prev,
      choices: prev.choices.map((c, i) => (i === index ? value : c)),
    }));

  const addChoice = () =>
    setDraft((prev) =>
      prev.choices.length < MAX_CHOICES ? { ...prev, choices: [...prev.choices, ""] } : prev,
    );

  const removeChoice = (index: number) =>
    setDraft((prev) =>
      prev.choices.length > MIN_CHOICES
        ? { ...prev, choices: prev.choices.filter((_, i) => i !== index) }
        : prev,
    );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const choices = draft.choices.map((c) => c.trim()).filter((c) => c.length > 0);
    if (choices.length < MIN_CHOICES || choices.length > MAX_CHOICES) {
      setError(`선지는 ${MIN_CHOICES}~${MAX_CHOICES}개다.`);
      return;
    }
    if (!choices.includes(draft.answer)) {
      setError("정답은 선지 안의 값이어야 한다.");
      return;
    }
    saveQuestion.mutate(
      {
        id: draft.id,
        input: {
          examPaperId,
          number: Number(draft.number),
          passageImageUrl: draft.passageImageUrl.trim(),
          passageRegion: toRegion(draft),
          prompt: draft.prompt.trim(),
          choices,
          answer: draft.answer,
        },
      },
      { onSuccess: onDone },
    );
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="field">
        <label className="label">문항 번호</label>
        <input
          className="input"
          type="number"
          value={draft.number}
          onChange={(event) => setDraft((prev) => ({ ...prev, number: event.target.value }))}
          required
        />
      </div>
      <div className="field">
        <label className="label">지문 이미지 URL</label>
        <input
          className="input"
          value={draft.passageImageUrl}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, passageImageUrl: event.target.value }))
          }
        />
      </div>
      <div className="field">
        <label className="label">지문 영역 (x, y, width, height)</label>
        <div className="row">
          <input
            className="input"
            placeholder="x"
            value={draft.regionX}
            onChange={(event) => setDraft((prev) => ({ ...prev, regionX: event.target.value }))}
          />
          <input
            className="input"
            placeholder="y"
            value={draft.regionY}
            onChange={(event) => setDraft((prev) => ({ ...prev, regionY: event.target.value }))}
          />
          <input
            className="input"
            placeholder="width"
            value={draft.regionWidth}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, regionWidth: event.target.value }))
            }
          />
          <input
            className="input"
            placeholder="height"
            value={draft.regionHeight}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, regionHeight: event.target.value }))
            }
          />
        </div>
      </div>
      <div className="field">
        <label className="label">프롬프트</label>
        <textarea
          className="textarea"
          value={draft.prompt}
          onChange={(event) => setDraft((prev) => ({ ...prev, prompt: event.target.value }))}
          required
        />
      </div>
      <div className="field">
        <label className="label">
          선지 ({MIN_CHOICES}~{MAX_CHOICES})
        </label>
        <div className="choice-grid">
          {draft.choices.map((choice, index) => (
            <div className="row" key={index}>
              <input
                className="input"
                value={choice}
                onChange={(event) => setChoice(index, event.target.value)}
              />
              <button
                type="button"
                className="button button-secondary button-sm"
                onClick={() => removeChoice(index)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="button button-secondary button-sm"
          onClick={addChoice}
          disabled={draft.choices.length >= MAX_CHOICES}
        >
          선지 추가
        </button>
      </div>
      <div className="field">
        <label className="label">정답</label>
        <select
          className="select"
          value={draft.answer}
          onChange={(event) => setDraft((prev) => ({ ...prev, answer: event.target.value }))}
          required
        >
          <option value="">선택</option>
          {draft.choices
            .filter((c) => c.trim().length > 0)
            .map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
        </select>
      </div>
      {error && <p className="error-text">{error}</p>}
      {saveQuestion.isError && <p className="error-text">{saveQuestion.error.message}</p>}
      <div className="row">
        <button type="submit" className="button" disabled={saveQuestion.isPending}>
          저장
        </button>
        <button type="button" className="button button-secondary" onClick={onDone}>
          닫기
        </button>
      </div>
    </form>
  );
};

export default QuestionEditor;
