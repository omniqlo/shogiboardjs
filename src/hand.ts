import type {PiecesInHand} from "./types";

export const initialPiecesInHand = (): PiecesInHand => ({
	black: {P: 0, L: 0, N: 0, S: 0, G: 0, B: 0, R: 0},
	white: {p: 0, l: 0, n: 0, s: 0, g: 0, b: 0, r: 0},
});
