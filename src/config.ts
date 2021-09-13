import { nextN } from './Sound';

export const fretsCount = 23;

export const fretboard = [
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "G")),
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "D")),
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "A")),
  new Array(fretsCount).fill(null).map((_, i) => nextN(i, "E/Fb"))
];

export const stringsCount = fretboard.length;

export const width = 50;
export const height = 30;
export const margin = 7;

