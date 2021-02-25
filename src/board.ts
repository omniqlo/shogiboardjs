export function createBoardFromSfen(boardSfen: string): string[] {
	const board: string[] = new Array(81);
	let square = 0;
	for (let i = 0; i < boardSfen.length; i++) {
		if (boardSfen[i] === "/") {
			i++;
		}
		let piece = boardSfen[i];
		if (!Number.isNaN(Number(piece))) {
			for (let j = 0; j < Number(piece); j++) board[square++] = "";
		} else {
			if (piece === "+") piece += boardSfen[++i];
			board[square++] = piece;
		}
	}
	return board;
}
