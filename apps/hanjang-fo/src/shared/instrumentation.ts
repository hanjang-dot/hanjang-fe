export const instrument = {
  coverDecodes: 0,
  tileDecodes: 0,
  choiceTaps: 0,
  choiceBlocked: 0,
  strokeStarts: 0,
  appliedResults: 0,
  droppedResults: 0,
  reset: () => {
    instrument.coverDecodes = 0;
    instrument.tileDecodes = 0;
    instrument.choiceTaps = 0;
    instrument.choiceBlocked = 0;
    instrument.strokeStarts = 0;
    instrument.appliedResults = 0;
    instrument.droppedResults = 0;
  },
};
