export type PassageRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Question = {
  id: string;
  examPaperId: string;
  number: number;
  passageImageUrl: string;
  passageRegion: PassageRegion | null;
  prompt: string;
  choices: string[];
  answer: string;
};

export type QuestionInput = {
  examPaperId: string;
  number: number;
  passageImageUrl: string;
  passageRegion: PassageRegion | null;
  prompt: string;
  choices: string[];
  answer: string;
};
