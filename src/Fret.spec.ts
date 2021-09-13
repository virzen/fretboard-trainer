import { allFretsWithSound } from "./Fret";

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
