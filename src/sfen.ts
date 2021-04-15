import {initialPiecesInHand} from "./hand";
import {emptySquare, isBlackPiece} from "./pieces";
import type {Board, PiecesInHand, Sfen} from "./types";

export const initialSfen =
	"lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1";

export function getDataFromSfen(
	sfen: Sfen,
): {board: Board; piecesInHand: PiecesInHand} {
	const s = sfen.split(" ");
	const sfenBoard = s[0];
	const sfenPiecesInHand = s[2];

	// board
	const board: Board = new Array(81);
	let square = 0;
	for (let i = 0; i < sfenBoard.length; i++) {
		if (sfenBoard[i] === "/") i++;
		let piece = sfenBoard[i];
		if (!Number.isNaN(Number(piece))) {
			for (let j = 0; j < Number(piece); j++) board[square++] = emptySquare;
		} else {
			if (piece === "+") piece += sfenBoard[++i];
			board[square++] = piece;
		}
	}

	// pieces in hand
	const piecesInHand = initialPiecesInHand();
	if (sfenPiecesInHand && sfenPiecesInHand !== "-") {
		for (let i = 0; i < sfenPiecesInHand.length; i++) {
			let pieceInHand = sfenPiecesInHand[i];
			let pieceInHandCount = 1;
			// TODO: Handle case when count > 9
			if (!Number.isNaN(Number(pieceInHand))) {
				pieceInHandCount = Number(pieceInHand);
				pieceInHand = sfenPiecesInHand[++i];
			}
			if (isBlackPiece(pieceInHand)) {
				piecesInHand.black[pieceInHand] = pieceInHandCount;
			} else {
				piecesInHand.white[pieceInHand] = pieceInHandCount;
			}
		}
	}

	return {board, piecesInHand};
}
