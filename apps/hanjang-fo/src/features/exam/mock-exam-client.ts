import { Effect } from "effect";

import { MOCK_LATENCY_MS } from "./constants";

import type { ExamClient } from "./exam-client";
import type { ExamDetail, ExamPaper, Question } from "./types";

const PAGE_SIZE = 4;

const MOCK_EXAM_PAPERS: ExamPaper[] = [
  {
    examId: "exam-2025-suneung-korean",
    year: 2025,
    title: "2025학년도 수능 국어",
    subject: "국어",
    timeLimitSec: 80 * 60,
    publishedAt: "2026-09-01T00:00:00Z",
  },
  {
    examId: "exam-2025-sep-english",
    year: 2025,
    title: "2025학년도 9월 모의평가 영어",
    subject: "영어",
    timeLimitSec: 70 * 60,
    publishedAt: "2026-09-05T00:00:00Z",
  },
  {
    examId: "exam-2024-suneung-math",
    year: 2024,
    title: "2024학년도 수능 수학",
    subject: "수학",
    timeLimitSec: 100 * 60,
    publishedAt: "2026-08-20T00:00:00Z",
  },
  {
    examId: "exam-2025-jun-korean",
    year: 2025,
    title: "2025학년도 6월 모의평가 국어",
    subject: "국어",
    timeLimitSec: 80 * 60,
    publishedAt: "2026-08-10T00:00:00Z",
  },
  {
    examId: "exam-2024-sep-english",
    year: 2024,
    title: "2024학년도 9월 모의평가 영어",
    subject: "영어",
    timeLimitSec: 70 * 60,
    publishedAt: "2026-07-15T00:00:00Z",
  },
  {
    examId: "exam-2023-suneung-korean",
    year: 2023,
    title: "2023학년도 수능 국어",
    subject: "국어",
    timeLimitSec: 80 * 60,
    publishedAt: "2026-07-01T00:00:00Z",
  },
];

const choiceLabels = ["①", "②", "③", "④", "⑤"] as const;

const buildChoices = (questionId: string, texts: string[]) =>
  texts.map((text, index) => ({
    choiceId: `${questionId}-c${index + 1}`,
    label: choiceLabels[index],
    text,
  }));

const MOCK_QUESTIONS: Record<string, Question[]> = {
  "exam-2025-suneung-korean": [
    {
      questionId: "q-kor-1",
      number: 1,
      passage:
        "현대 사회에서 정보의 홍수는 개인의 판단력을 흐리게 한다. 쏟아지는 뉴스와 의견 속에서 사실과 주장을 가려내는 일은 점점 어려워지고 있다. 글쓴이는 이러한 상황에서 비판적 읽기의 중요성을 강조한다.",
      prompt: "위 글에서 글쓴이가 강조하는 것으로 가장 적절한 것은?",
      choices: buildChoices("q-kor-1", [
        "정보의 양을 줄이기 위해 뉴스 소비를 중단해야 한다",
        "사실과 주장을 구분하는 비판적 읽기가 필요하다",
        "모든 의견은 동등한 가치를 지니므로 판단을 유보해야 한다",
        "정보 홍수는 개인의 판단력을 강화하는 계기가 된다",
        "전문가의 견해에 의존해 판단하는 것이 바람직하다",
      ]),
      correctChoiceId: "q-kor-1-c2",
    },
    {
      questionId: "q-kor-2",
      number: 2,
      passage: "",
      passageImageHeight: 2400,
      prompt: "위 지문의 중심 내용으로 알맞은 것은?",
      choices: buildChoices("q-kor-2", [
        "전통 시장의 가격 경쟁력 분석",
        "전통 시장이 담고 있는 공동체적 관계",
        "대형 마트 확산의 경제적 효과",
        "흥정 문화의 역사적 기원",
        "상업 공간의 물리적 구조 비교",
      ]),
      correctChoiceId: "q-kor-2-c2",
    },
  ],
  "exam-2025-sep-english": [
    {
      questionId: "q-eng-1",
      number: 1,
      passage:
        "Reading widely exposes us to perspectives we would never encounter in our daily lives. Books become windows into other minds, other eras, and other ways of being human.",
      prompt: "위 글의 요지로 가장 적절한 것은?",
      choices: buildChoices("q-eng-1", [
        "독서는 일상의 스트레스를 해소하는 수단이다",
        "독서는 다양한 관점을 접하게 해 준다",
        "책은 과거의 지혜를 보존하는 저장소다",
        "독서 습관은 어릴 때 형성되어야 한다",
        "책보다 직접적 경험이 더 중요하다",
      ]),
      correctChoiceId: "q-eng-1-c2",
    },
  ],
  "exam-2024-suneung-math": [
    {
      questionId: "q-math-1",
      number: 1,
      passage: "함수 f(x) = x² - 4x + 3 이 있다.",
      prompt: "f(x)의 최솟값은?",
      choices: buildChoices("q-math-1", ["-2", "-1", "0", "1", "3"]),
      correctChoiceId: "q-math-1-c2",
    },
  ],
};

const delayed = <T>(value: T) =>
  Effect.promise(
    () =>
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(value), MOCK_LATENCY_MS);
      }),
  );

export const createMockExamClient = (): ExamClient => ({
  listPapers: () => delayed(MOCK_EXAM_PAPERS),
  listPapersPage: (page) => {
    const start = page * PAGE_SIZE;
    if (start >= MOCK_EXAM_PAPERS.length + PAGE_SIZE) return delayed([]);
    if (start >= MOCK_EXAM_PAPERS.length) {
      return delayed(MOCK_EXAM_PAPERS.slice(0, PAGE_SIZE));
    }
    return delayed(MOCK_EXAM_PAPERS.slice(start, start + PAGE_SIZE));
  },
  getExam: (examId) => {
    const paper = MOCK_EXAM_PAPERS.find((item) => item.examId === examId);
    const detail: ExamDetail | null = paper
      ? { paper, questions: MOCK_QUESTIONS[examId] ?? [] }
      : null;
    return delayed(detail);
  },
});
