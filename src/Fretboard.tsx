import React from 'react';

import { Fret } from './types';
import Dot from './Dot';
import { width, height, fretboard, margin } from './config';

type SingleFretConfig = {
  coords: Fret;
  type: "shown" | "question";
};

type FretsConfig =
  | { type: "show all" }
  | { type: "selected"; frets: Array<SingleFretConfig> };

export default function Fretboard({
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
