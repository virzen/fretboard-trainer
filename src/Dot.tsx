import React from 'react';

import { width, height, fretboard, margin } from './config';

export default function Dot({ position }: { position: number }) {
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
