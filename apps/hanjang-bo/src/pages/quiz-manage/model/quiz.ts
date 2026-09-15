export type QuizType = "ox" | "cloze" | "word" | "history";

export type QuizDirection = "en-ko" | "ko-en";

export type Quiz = {
  id: string;
  type: QuizType;
  prompt: string;
  choices: string[];
  answer: string;
  direction: QuizDirection | null;
  published: boolean;
};

export type QuizInput = {
  type: QuizType;
  prompt: string;
  choices: string[];
  answer: string;
  direction: QuizDirection | null;
};

export const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  ox: "OX",
  cloze: "빈칸",
  word: "영단어",
  history: "한국사",
};

const CHOICE_COUNT: Record<QuizType, { min: number; max: number }> = {
  ox: { min: 2, max: 2 },
  cloze: { min: 5, max: 5 },
  word: { min: 6, max: 6 },
  history: { min: 5, max: 5 },
};

export const quizChoiceRange = (type: QuizType) => CHOICE_COUNT[type];

export const validateQuiz = (
  quiz: Pick<Quiz, "type" | "choices" | "answer" | "direction">,
): string | null => {
  const { min, max } = CHOICE_COUNT[quiz.type];
  if (quiz.choices.length < min || quiz.choices.length > max) {
    return min === max
      ? `${QUIZ_TYPE_LABELS[quiz.type]} 선지는 정확히 ${min}개다.`
      : `${QUIZ_TYPE_LABELS[quiz.type]} 선지는 ${min}~${max}개다.`;
  }
  if (!quiz.choices.includes(quiz.answer)) {
    return "정답은 선지 안의 값이어야 한다.";
  }
  if (quiz.type !== "word" && quiz.direction !== null) {
    return "direction은 영단어에서만 쓴다.";
  }
  return null;
};
