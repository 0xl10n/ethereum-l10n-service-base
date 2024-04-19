// input better as observable to get right buffer

export const findSegment = () => {};

export const stitchSegment = () => {};

export const CUE_BUFFER = 0.1;

export const isCurrentCue = (
  cue: { startTime: number; endTime: number },
  currentPlaybackS: number,
) => {
  return (
    cue.startTime + CUE_BUFFER >= currentPlaybackS &&
    currentPlaybackS < cue.endTime - 5
  );
};
