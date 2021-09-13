import { allFretsWithSound, leftToAnswer, wrongAnswers, Fret } from "./App";

test("allFretsWithSound", () => {
  expect(allFretsWithSound("A")).toEqual(
    expect.arrayContaining([
      [0, 2],
      [12, 2],
      [2, 0],
      [14, 0],
      [7, 1],
      [19, 1],
      [5, 3],
      [17, 3]
    ])
  );
});

test("leftToAnswer", () => {
  const correct = [[0, 0] as Fret];
  const actual = [[1, 1] as Fret];

  expect(leftToAnswer(correct, actual)).toEqual([[0, 0]]);
  expect(wrongAnswers(correct, actual)).toEqual([[1, 1]]);
});
