import { leftToAnswer, wrongAnswers } from "./FindAllPlacesWithSound";
import { Fret } from "./types";

test("leftToAnswer", () => {
  const correct = [[0, 0] as Fret];
  const actual = [[1, 1] as Fret];

  expect(leftToAnswer(correct, actual)).toEqual([[0, 0]]);
  expect(wrongAnswers(correct, actual)).toEqual([[1, 1]]);
});
