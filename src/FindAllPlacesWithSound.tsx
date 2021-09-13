import React, { useState } from 'react';

import Fretboard from './Fretboard';

import { differenceWith, isEqual } from 'lodash';
import { Sound, Fret } from './types';
import { randomSound } from './Sound';
import { allFretsWithSound } from './Fret';

export type FindAllPlacesWithSoundState = {
  type: "answering" | "ready for next";
  sound: Sound;
  correctAnswers: Array<Fret>;
  actualAnswers: Array<Fret>;
};

export function leftToAnswer(
  correct: Array<Fret>,
  actual: Array<Fret>
): Array<Fret> {
  return differenceWith(correct, actual, isEqual);
}

export function wrongAnswers(
  correct: Array<Fret>,
  actual: Array<Fret>
): Array<Fret> {
  return differenceWith(actual, correct, isEqual);
}

type FindAllPlacesWithSoundEvent =
  | {
    type: "answer";
    fret: Fret;
  }
  | { type: "next" };

function initialFindAllPlacesWithSoundState() {
  const sound = randomSound();

  return {
    type: "answering" as "answering",
    sound,
    correctAnswers: allFretsWithSound(sound),
    actualAnswers: []
  };
}

function nextFindAllPlacesWithSoundState(
  state: FindAllPlacesWithSoundState,
  event: FindAllPlacesWithSoundEvent
): FindAllPlacesWithSoundState {
  if (state.type === "answering" && event.type === "answer") {
    const newActualAnswers = [...state.actualAnswers, event.fret];
    const leftToAnswerr = leftToAnswer(state.correctAnswers, newActualAnswers);
    const leftToAnswerCount = leftToAnswerr.length;

    console.log(leftToAnswerr, leftToAnswerCount);

    return {
      ...state,
      actualAnswers: newActualAnswers,
      type: leftToAnswerCount === 0 ? "ready for next" : "answering"
    };
  } else if (event.type === "next") {
    return initialFindAllPlacesWithSoundState();
  } else {
    return state;
  }
}

export function FindAllPlacesWithSound() {
  const [state, setState] = useState<FindAllPlacesWithSoundState>(
    initialFindAllPlacesWithSoundState()
  );

  return (
    <>
      <Fretboard
        fretsConfig={{
          type: "selected",
          frets: [
            ...state.actualAnswers.map((f) => ({
              coords: f,
              type: "shown" as "shown"
            }))
          ]
        }}
        onFretClick={(fret) => {
          setState(
            nextFindAllPlacesWithSoundState(state, {
              type: "answer",
              fret
            })
          );
        }}
      />
      Sound: {state.sound}, wrong answers:{" "}
      {wrongAnswers(state.correctAnswers, state.actualAnswers).length}
      <button
        onClick={() =>
          setState(nextFindAllPlacesWithSoundState(state, { type: "next" }))
        }
      >
        Next
      </button>
    </>
  );
}