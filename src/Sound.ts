import { Sound } from './types';

export const allSounds: Array<Sound> = [
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

export function next(f: Sound): Sound {
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

export function nextN(n: number, f: Sound): Sound {
  let result = f;

  for (let i = 0; i < n; i++) {
    result = next(result);
  }

  return result;
}

export function randomSound(): Sound {
  return allSounds[Math.floor(Math.random() * allSounds.length)];
}
