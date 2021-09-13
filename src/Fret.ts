import { flatten } from 'lodash';
import { Sound, Fret } from './types';
import { fretboard } from './config';
import { notEmpty } from './utils';

export function allFretsWithSound(s: Sound): Array<Fret> {
  return flatten(
    fretboard.map((string, y) =>
      string
        .map((sound, x) => (sound === s ? ([x, y] as Fret) : null))
        .filter(notEmpty)
    )
  );
}
