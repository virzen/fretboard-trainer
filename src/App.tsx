import React from 'react';
import { differenceWith, flatten, isEqual } from "lodash";
import { useState } from "react";
import "./styles.css";

type Mode = "guess which sound" | "find all places with sound";
type Sound =
  | "A"
  | "A#/Bb"
  | "B/Cb"
  | "C"
  | "C#/Db"
  | "D"
  | "D#/Eb"
  | "E/Fb"
  | "E#/F"
  | "F#/Gb"
  | "G"
  | "G#/Ab";

const allSounds: Array<Sound> = [
  "A",
  "A#/Bb",
  "B/Cb",
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E/Fb",
  "E#/F",
  "F#/Gb",
  "G",
  "G#/Ab"
];

function next(f: Sound): Sound {
  switch (f) {
    case "A":
      return "A#/Bb";
    case "A#/Bb":
      return "B/Cb";
    case "B/Cb":
      return "C";
    case "C":
      return "C#/Db";
    case "C#/Db":
      return "D";
    case "D":
      return "D#/Eb";
    case "D#/Eb":
      return "E/Fb";
    case "E/Fb":
      return "E#/F";
    case "E#/F":
      return "F#/Gb";
    case "F#/Gb":
      return "G";
    case "G":
      return "G#/Ab";
    case "G#/Ab":
      return "A";
  }
}

function nextN(n: number, f: Sound): Sound {
  let result = f;

  for (let i = 0; i < n; i++) {
    result = next(result);
  }

  return result;
}

const fretsCount = 23;

const fretboard = [
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "G")),
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "D")),
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "A")),
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "E/Fb"))
];

const stringsCount = fretboard.length;

const width = 50;
const height = 30;
const margin = 7;

function Dot({ position }: { position: number }) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "black",
        position: "absolute",
        top: height * (fretboard.length / 2) + margin * 2,
        transform: "translate(10%, -15%)",
        left: width * (position - 0.5) + margin * (position - 1)
      }}
    />
  );
}

type SingleFretConfig = {
  coords: Fret;
  type: "shown" | "question";
};

type FretsConfig =
  | { type: "show all" }
  | { type: "selected"; frets: Array<SingleFretConfig> };

function Fretboard({
  fretsConfig,
  onFretClick
}: {
  fretsConfig: FretsConfig;
  onFretClick?: (coords: Fret) => void;
}) {
  return (
    <>
      <div
        style={{
          backgroundColor: "brown",
          position: "relative",
          marginLeft: width + margin,
          height: fretboard.length * height + margin * (fretboard.length + 1),
          width:
            (fretboard[0].length - 1) * width + margin * fretboard[0].length
        }}
      >
        {[3, 5, 7, 9, 12, 15, 17, 19, 21].map((n) => (
          <Dot position={n} />
        ))}

        {fretboard.map((string, y) =>
          string.map((fret, x) => (
            <button
              onClick={onFretClick && (() => onFretClick([x, y]))}
              style={{
                position: "absolute",
                top: height * y + margin * (y + 1),
                left: width * (x - 1) + margin * x,
                width: width,
                height: height,
                padding: 0,
                boxSizing: "border-box"
              }}
            >
              {(function () {
                if (fretsConfig.type === "show all") {
                  return fret;
                } else if (fretsConfig.type === "selected") {
                  const currentFretConfig = fretsConfig.frets.find(
                    ({ coords: [fx, fy] }) => fx === x && fy === y
                  );

                  if (!currentFretConfig) {
                    return " ";
                  }

                  if (currentFretConfig.type === "question") {
                    return "?";
                  }

                  if (currentFretConfig.type === "shown") {
                    return fret;
                  }
                }
              })()}
            </button>
          ))
        )}
      </div>
    </>
  );
}

const modes: Array<Mode> = ["find all places with sound", "guess which sound"];

type AppState = { type: "mode selection" } | { type: "in mode"; mode: Mode };

type GuessWhichSoundState =
  | { type: "guessing"; coords: [number, number] }
  | { type: "result"; coords: [number, number] };
type GuessWhichSoundEvent = { type: "reveal" } | { type: "next" };

export type Fret = [
  number, // x, [0, 22]
  number // y, [0, 3]
];
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

function GuessWhichSound() {
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

function randomSound(): Sound {
  return allSounds[Math.floor(Math.random() * allSounds.length)];
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function allFretsWithSound(s: Sound): Array<Fret> {
  return flatten(
    fretboard.map((string, y) =>
      string
        .map((sound, x) => (sound === s ? ([x, y] as Fret) : null))
        .filter(notEmpty)
    )
  );
}

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

function FindAllPlacesWithSound() {
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

export default function App() {
  const [state, setState] = useState<AppState>({ type: "mode selection" });

  switch (state.type) {
    case "mode selection":
      return ( 
        <>
          {modes.map((m) => (
            <button key={m} onClick={() => setState({ type: "in mode", mode: m })}>
              {m}
            </button>
          ))}
        </> 
      );
    case "in mode":
      return (
        <>
          Mode: {state.mode}
          <button onClick={() => setState({ type: "mode selection" })}>
            Mode selection
          </button>
          {(function () {
            switch (state.mode) {
              case "guess which sound":
                return <GuessWhichSound />;
              case "find all places with sound":
                return <FindAllPlacesWithSound />;
            }
          })()}
        </>
      );
  }
}
