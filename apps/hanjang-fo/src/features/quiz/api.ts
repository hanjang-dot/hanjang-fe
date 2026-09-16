import type { QuizSet } from "./types";

const MOCK_LATENCY_MS = 150;

const MOCK_QUIZ_SET: QuizSet = {
  quizSetId: "quiz-set-today",
  title: "오늘의 퀴즈",
  quizzes: [
    {
      quizId: "quiz-1",
      type: "ox",
      prompt: "지구의 자전 주기는 약 24시간이다.",
      choices: ["O", "X"],
      answerIndex: 0,
    },
    {
      quizId: "quiz-2",
      type: "ox",
      prompt: "수능은 매년 11월에 시행된다.",
      choices: ["O", "X"],
      answerIndex: 0,
    },
    {
      quizId: "quiz-3",
      type: "cloze",
      prompt: "사과의 ____ 효과: 하나를 보면 열을 안다.",
      choices: ["추론", "확산", "반영", "환기", "도미노"],
      answerIndex: 4,
    },
    {
      quizId: "quiz-4",
      type: "cloze",
      prompt: "조선 왕조의 세종대왕이 창제한 문자는 ____이다.",
      choices: ["가림토", "훈민정음", "이두", "향찰", "구결"],
      answerIndex: 1,
    },
    {
      quizId: "quiz-5",
      type: "word",
      prompt: "apple",
      choices: ["사과", "배", "포도", "복숭아", "감", "귤"],
      answerIndex: 0,
      direction: "en-ko",
    },
    {
      quizId: "quiz-6",
      type: "word",
      prompt: "도서관",
      choices: ["museum", "library", "station", "market", "school", "office"],
      answerIndex: 1,
      direction: "ko-en",
    },
    {
      quizId: "quiz-7",
      type: "history",
      prompt: "임진왜란이 발발한 연도는?",
      choices: ["1592년", "1597년", "1627년", "1636년", "1894년"],
      answerIndex: 0,
    },
    {
      quizId: "quiz-8",
      type: "history",
      prompt: "조선을 건국한 인물은?",
      choices: ["이방원", "이성계", "정도전", "세종", "광해군"],
      answerIndex: 1,
    },
    {
      quizId: "quiz-9",
      type: "ox",
      prompt: "한글은 표음문자다.",
      choices: ["O", "X"],
      answerIndex: 0,
    },
    {
      quizId: "quiz-10",
      type: "cloze",
      prompt: "물은 섭씨 ____도에서 끓는다.",
      choices: ["80", "90", "100", "110", "120"],
      answerIndex: 2,
    },
  ],
};

export const fetchTodayQuizSet = (): Promise<QuizSet> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_QUIZ_SET), MOCK_LATENCY_MS);
  });
