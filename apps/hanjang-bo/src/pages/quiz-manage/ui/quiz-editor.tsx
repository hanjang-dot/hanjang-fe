
import { useState } from "react";

import { useSaveQuiz } from "../api/quiz";
import { quizChoiceRange, validateQuiz } from "../model/quiz";

import type { FormEvent } from "react";
import type { Quiz, QuizDirection, QuizType } from "../model/quiz";

type QuizDraft = {
  id?: string;
  type: QuizType;
  prompt: string;
  choices: string[];
  answer: string;
  direction: QuizDirection;
};

const defaultChoices = (type: QuizType): string[] => {
  const { min } = quizChoiceRange(type);
  return Array.from({ length: min }, () => "");
};

const toDraft = (quiz: Quiz | null): QuizDraft => ({
  id: quiz?.id,
  type: quiz?.type ?? "ox",
  prompt: quiz?.prompt ?? "",
  choices: quiz?.choices ?? defaultChoices("ox"),
  answer: quiz?.answer ?? "",
  direction: quiz?.direction ?? "en-ko",
});

const QuizEditor = ({ quiz, onDone }: { quiz: Quiz | null; onDone: () => void }) => {
  const saveQuiz = useSaveQuiz();
  const [draft, setDraft] = useState<QuizDraft>(() => toDraft(quiz));
  const [error, setError] = useState("");

  const { min, max } = quizChoiceRange(draft.type);

  const onTypeChange = (type: QuizType) =>
    setDraft((prev) => ({ ...prev, type, choices: defaultChoices(type), answer: "" }));

  const setChoice = (index: number, value: string) =>
    setDraft((prev) => ({
      ...prev,
      choices: prev.choices.map((c, i) => (i === index ? value : c)),
    }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const choices = draft.choices.map((c) => c.trim());
    const direction = draft.type === "word" ? draft.direction : null;
    const message = validateQuiz({ type: draft.type, choices, answer: draft.answer, direction });
    if (message) {
      setError(message);
      return;
    }
    saveQuiz.mutate(
      {
        id: draft.id,
        input: {
          type: draft.type,
          prompt: draft.prompt.trim(),
          choices,
          answer: draft.answer,
          direction,
        },
      },
      { onSuccess: onDone },
    );
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="field">
        <label className="label">유형</label>
        <select
          className="select"
          value={draft.type}
          onChange={(event) => onTypeChange(event.target.value as QuizType)}
        >
          <option value="ox">OX</option>
          <option value="cloze">빈칸</option>
          <option value="word">영단어</option>
          <option value="history">한국사</option>
        </select>
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
          선지 ({min === max ? `${min}개` : `${min}~${max}개`})
        </label>
        <div className="choice-grid">
          {draft.choices.map((choice, index) => (
            <input
              key={index}
              className="input"
              value={choice}
              onChange={(event) => setChoice(index, event.target.value)}
              required
            />
          ))}
        </div>
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
      {draft.type === "word" && (
        <div className="field">
          <label className="label">direction</label>
          <select
            className="select"
            value={draft.direction}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, direction: event.target.value as QuizDirection }))
            }
          >
            <option value="en-ko">en → ko</option>
            <option value="ko-en">ko → en</option>
          </select>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
      {saveQuiz.isError && <p className="error-text">{saveQuiz.error.message}</p>}
      <div className="row">
        <button type="submit" className="button" disabled={saveQuiz.isPending}>
          저장
        </button>
        <button type="button" className="button button-secondary" onClick={onDone}>
          닫기
        </button>
      </div>
    </form>
  );
};

export default QuizEditor;
