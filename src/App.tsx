import React from 'react';
import { useState } from "react";
import "./styles.css";

import GuessWhichSound from './GuessWhichSound';
import { FindAllPlacesWithSound } from './FindAllPlacesWithSound';

export type Mode = "guess which sound" | "find all places with sound";

const modes: Array<Mode> = ["find all places with sound", "guess which sound"];

type AppState = { type: "mode selection" } | { type: "in mode"; mode: Mode };

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
