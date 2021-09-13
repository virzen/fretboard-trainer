import React, { useState } from "react";
import { isEqual } from "lodash";

import { fretsCount, stringsCount } from "./config";
import Fretboard from "./Fretboard";
import { Fret } from "./types";

type GuessWhichSoundState =
  | { type: "guessing"; coords: [number, number] }
  | { type: "result"; coords: [number, number] };
type GuessWhichSoundEvent = { type: "reveal" } | { type: "next" };

function randomFretCoords(): Fret {
  return [
    Math.floor(Math.random() * fretsCount),
    Math.floor(Math.random() * stringsCount)
  ];
}
function nextGuessWhichSoundState(
  state: GuessWhichSoundState,
  event: GuessWhichSoundEvent
): GuessWhichSoundState {
  if (state.type === "guessing" && event.type === "reveal") {
    return { type: "result", coords: state.coords };
  } else if (state.type === "result" && event.type === "next") {
    return { type: "guessing", coords: randomFretCoords() };
  } else {
    return state;
  }
}

export default function GuessWhichSound() {
  const [state, setState] = useState<GuessWhichSoundState>({
    type: "guessing",
    coords: randomFretCoords()
  });

  switch (state.type) {
    case "guessing":
      return (
        <Fretboard
          fretsConfig={{
            type: "selected",
            frets: [{ coords: state.coords, type: "question" }]
          }}
          onFretClick={(coords) => {
            if (isEqual(coords, state.coords)) {
              setState(nextGuessWhichSoundState(state, { type: "reveal" }));
            }
          }}
        />
      );
    case "result":
      return (
        <>
          <Fretboard
            fretsConfig={{
              type: "selected",
              frets: [{ coords: state.coords, type: "shown" }]
            }}
            onFretClick={() => { }}
          />
          <button
            onClick={() => {
              setState(nextGuessWhichSoundState(state, { type: "next" }));
            }}
          >
            Next
          </button>
        </>
      );
  }
}