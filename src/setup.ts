import {getDataFromSfen} from "./sfen";
import {emptySquare, getPieceCssFromPiece} from "./pieces";
import {translate} from "./utils";
import type {
	Board,
	PiecesInHand,
	Sfen,
	PiecesInHandDoms,
	Options,
} from "./types";

function setup({
	options,
	rootDom,
	sfen,
}: {
	options: Options;
	rootDom: HTMLElement;
	sfen: Sfen;
}): {
	board: Board;
	piecesInHand: PiecesInHand;
	containerDom: HTMLDivElement;
	boardDom: HTMLDivElement;
	piecesInHandDoms: PiecesInHandDoms;
} {
	const {board, piecesInHand} = getDataFromSfen(sfen);
	const {size} = options;
	const pieceSize = size / 9;

	// container
	const containerDom = document.createElement("div");
	containerDom.classList.add("shogiboardjs");
	containerDom.style.width = `${size}px`;

	// board
	const boardDom = document.createElement("div");
	boardDom.classList.add("board");
	boardDom.style.height = `${size}px`;

	// area for black's pieces in hand (komadai)
	const blackPiecesInHand = document.createElement("div");
	blackPiecesInHand.classList.add("pieces-in-hand");
	blackPiecesInHand.style.height = `${pieceSize}px`;

	// area for white's pieces in hand (komadai)
	const whitePiecesInHand = document.createElement("div");
	whitePiecesInHand.classList.add("pieces-in-hand");
	whitePiecesInHand.style.height = `${pieceSize}px`;

	// append dom elements
	containerDom.appendChild(whitePiecesInHand);
	containerDom.appendChild(boardDom);
	containerDom.appendChild(blackPiecesInHand);
	rootDom.appendChild(containerDom);

	// board pieces
	for (let rank = 0; rank < 9; rank++) {
		for (let file = 0; file < 9; file++) {
			const piece = board[9 * rank + file];
			if (piece !== emptySquare) {
				const boardPieceDom = document.createElement("div");
				boardPieceDom.classList.add("board-piece", getPieceCssFromPiece[piece]);
				boardPieceDom.style.transform = translate(file, rank);
				boardDom.appendChild(boardPieceDom);
			}
		}
	}

	// pieces in hand
	const piecesInHandDoms: PiecesInHandDoms = {};

	const addPieceInHand = (parentDom: HTMLDivElement) => ([
		pieceInHand,
		pieceInHandCount,
	]: [string, number]) => {
		const pieceInHandContainerDom = document.createElement("div");

		const pieceInHandDom = document.createElement("div");
		pieceInHandDom.classList.add(
			"piece-in-hand",
			getPieceCssFromPiece[pieceInHand],
		);

		const pieceInHandCountDom = document.createElement("div");
		pieceInHandCountDom.classList.add("piece-in-hand-count");

		if (pieceInHandCount > 0) {
			pieceInHandCountDom.innerText = pieceInHandCount.toString();
			pieceInHandContainerDom.appendChild(pieceInHandCountDom);
		} else {
			pieceInHandDom.classList.add("transparent");
		}

		pieceInHandContainerDom.appendChild(pieceInHandDom);
		parentDom.appendChild(pieceInHandContainerDom);

		piecesInHandDoms[pieceInHand] = {
			pieceDom: pieceInHandDom,
			countDom: pieceInHandCountDom,
		};
	};

	Object.entries(piecesInHand.black).forEach(addPieceInHand(blackPiecesInHand));
	Object.entries(piecesInHand.white).forEach(addPieceInHand(whitePiecesInHand));

	return {board, piecesInHand, containerDom, boardDom, piecesInHandDoms};
}

export default setup;
