export const ETERNAL_PER_SOL = 1000;

export function eternalToSol(eternal: number) {
  return eternal / ETERNAL_PER_SOL;
}
