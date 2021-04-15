export function isSquareOnBoard(file: number, rank: number): boolean {
	return file >= 0 && file < 9 && rank >= 0 && rank < 9;
}

export function translate(x: number, y: number): string {
	// prettier-ignore
	return `translate(
		${x === 0 ? "0px" : `${x * 100}%`},
		${y === 0 ? "0px" : `${y * 100}%`})`;
}
