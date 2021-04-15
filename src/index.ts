import "./index.css";
import {createBoardFromSfen} from "./board";
import {initialPiecesInHand} from "./hand";
import {getPieceCssFromPiece, getPieceFromPieceCss} from "./pieces";
import {initialSfen} from "./sfen";
import type {
	Board,
	PiecesInHand,
	DraggingBoardPiece,
	DraggingPieceInHand,
} from "./types";

function isSquareOnBoard(file: number, rank: number) {
	return file >= 0 && file < 9 && rank >= 0 && rank < 9;
}

function translate(x: number, y: number): string {
	// prettier-ignore
	return `translate(
		${x === 0 ? "0px" : `${x * 100}%`},
		${y === 0 ? "0px" : `${y * 100}%`})`;
}

function Shogiboard(elementId: string): void {
	try {
		const rootDom = document.getElementById(elementId);
		if (!rootDom) {
			throw new Error(`An element with the ID ${elementId} does not exist`);
		}

		const sfen: string = initialSfen;
		const board: Board = createBoardFromSfen(sfen);
		const piecesInHand: PiecesInHand = initialPiecesInHand();
		const size = 400;
		const pieceSize = size / 9;
		const halfPieceSize = pieceSize / 2;

		// container
		const containerDom = document.createElement("div");
		containerDom.classList.add("shogiboardjs");
		containerDom.style.width = `${size}px`;

		// board
		const boardDom = document.createElement("div");
		boardDom.classList.add("board");
		boardDom.style.height = `${size}px`;

		// area for black player's pieces in hand (komadai)
		const blackPiecesInHand = document.createElement("div");
		blackPiecesInHand.classList.add("pieces-in-hand");
		blackPiecesInHand.style.height = `${pieceSize}px`;

		// area for white player's pieces in hand (komadai)
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
				if (piece) {
					const boardPieceDom = document.createElement("div");
					boardPieceDom.classList.add(
						"board-piece",
						getPieceCssFromPiece[piece],
					);
					boardPieceDom.style.transform = translate(file, rank);
					boardDom.appendChild(boardPieceDom);
				}
			}
		}

		// pieces in hand
		const pieceInHandCountDoms: Record<string, HTMLDivElement> = {};

		const addPiecesInHand = (parentDom: HTMLDivElement) => ([
			piece,
			pieceCount,
		]: [string, number]) => {
			const pieceInHandDomContainer = document.createElement("div");
			const pieceInHandCountDom = document.createElement("div");
			pieceInHandCountDom.classList.add("piece-in-hand-count");
			pieceInHandCountDoms[piece] = pieceInHandCountDom;
			const pieceInHandDom = document.createElement("div");
			pieceInHandDom.classList.add(
				"piece-in-hand",
				getPieceCssFromPiece[piece],
			);
			if (pieceCount > 0) {
				pieceInHandCountDom.innerText = pieceCount.toString();
				pieceInHandDomContainer.appendChild(pieceInHandCountDom);
			} else {
				pieceInHandDom.classList.add("transparent");
			}
			pieceInHandDomContainer.appendChild(pieceInHandDom);
			parentDom.appendChild(pieceInHandDomContainer);
		};

		Object.entries(piecesInHand.black).forEach(
			addPiecesInHand(blackPiecesInHand),
		);
		Object.entries(piecesInHand.white).forEach(
			addPiecesInHand(whitePiecesInHand),
		);

		// dragging
		const boardDomRect = boardDom.getBoundingClientRect();
		const {top: boardDomTop, left: boardDomLeft} = boardDomRect;
		let draggingPiece: DraggingBoardPiece | DraggingPieceInHand | null = null;
		let clone: Node | null = null;
		const hoverSquare = document.createElement("div");
		hoverSquare.classList.add("hover");

		// helper functions for dragging
		const getCurrentFileAndRank = (clientX: number, clientY: number) => [
			Math.floor((Math.abs(clientX - boardDomLeft) / size) * 9),
			Math.floor((Math.abs(clientY - boardDomTop) / size) * 9),
		];

		const updatePieceCount = (piece: string, pieceCount: number) => {
			if (pieceCount === 0) {
				const pieceInHandCountDom = pieceInHandCountDoms[piece];
				pieceInHandCountDom.parentNode?.removeChild(pieceInHandCountDom);
				(clone as HTMLElement).classList.add("transparent");
			} else {
				pieceInHandCountDoms[piece].innerText = pieceCount.toString();
			}
			clone = null;
		};

		// event listeners for dragging
		const mousemove = (e: MouseEvent) => {
			if (draggingPiece) {
				if (draggingPiece.isBoardPiece) {
					// dragging a board piece
					// prettier-ignore
					draggingPiece.dom.style.transform = `translate(
						${e.clientX - boardDomLeft - halfPieceSize}px,
						${e.clientY - boardDomTop - halfPieceSize}px)`;
				} else {
					// dragging a piece in hand
					// prettier-ignore
					draggingPiece.dom.style.top = `${e.clientY - draggingPiece.top - halfPieceSize}px`;
					// prettier-ignore
					draggingPiece.dom.style.left = `${e.clientX - draggingPiece.left - halfPieceSize}px`;
				}
				// update hover square if needed
				const [currentFile, currentRank] = getCurrentFileAndRank(
					e.clientX,
					e.clientY,
				);
				if (isSquareOnBoard(currentFile, currentRank)) {
					if (!boardDom.contains(hoverSquare)) {
						boardDom.appendChild(hoverSquare);
					}
					hoverSquare.style.transform = translate(currentFile, currentRank);
				} else if (boardDom.contains(hoverSquare)) {
					boardDom.removeChild(hoverSquare);
				}
			}
		};

		const mouseup = (e: MouseEvent) => {
			if (draggingPiece) {
				draggingPiece.dom.classList.remove("dragging");
				const [currentFile, currentRank] = getCurrentFileAndRank(
					e.clientX,
					e.clientY,
				);
				const square = 9 * currentRank + currentFile;
				if (draggingPiece.isBoardPiece) {
					// dropped a board piece
					if (
						isSquareOnBoard(currentFile, currentRank) &&
						board[square] === ""
					) {
						// move board piece to new position
						board[square] = board[draggingPiece.srcSquare];
						board[draggingPiece.srcSquare] = "";
						draggingPiece.dom.style.transform = translate(
							currentFile,
							currentRank,
						);
					} else {
						// move board piece to original position
						draggingPiece.dom.style.transform = draggingPiece.originalTransform as string;
					}
				} else {
					// dropped a piece in hand
					draggingPiece.dom.style.removeProperty("top");
					draggingPiece.dom.style.removeProperty("left");
					if (
						isSquareOnBoard(currentFile, currentRank) &&
						board[square] === ""
					) {
						// change the piece in hand to a board piece
						board[square] = draggingPiece.piece;
						if (draggingPiece.piece.toLowerCase() !== draggingPiece.piece) {
							piecesInHand.black[draggingPiece.piece]--;
							updatePieceCount(
								draggingPiece.piece,
								piecesInHand.black[draggingPiece.piece],
							);
						} else {
							piecesInHand.white[draggingPiece.piece]--;
							updatePieceCount(
								draggingPiece.piece,
								piecesInHand.white[draggingPiece.piece],
							);
						}
						draggingPiece.dom.classList.remove("piece-in-hand");
						draggingPiece.dom.parentNode?.removeChild(draggingPiece.dom);
						draggingPiece.dom.classList.add("board-piece");
						draggingPiece.dom.style.transform = translate(
							currentFile,
							currentRank,
						);
						boardDom.appendChild(draggingPiece.dom);
					} else if (clone) {
						clone.parentNode?.removeChild(clone);
						clone = null;
					}
				}
				if (boardDom.contains(hoverSquare)) {
					boardDom.removeChild(hoverSquare);
				}
				draggingPiece = null;
			}
			document.removeEventListener("mousemove", mousemove);
			document.removeEventListener("mouseup", mouseup);
		};

		const mousedown = (e: MouseEvent) => {
			const pieceDom = e.target as HTMLElement;
			if (pieceDom.classList.contains("board-piece")) {
				// clicked a board piece
				const [currentFile, currentRank] = getCurrentFileAndRank(
					e.clientX,
					e.clientY,
				);
				draggingPiece = {
					isBoardPiece: true,
					srcSquare: 9 * currentRank + currentFile,
					dom: pieceDom,
					originalTransform: pieceDom.style.transform,
				};
				pieceDom.classList.add("dragging");
				// prettier-ignore
				pieceDom.style.transform = `translate(
					${e.clientX - boardDomLeft - halfPieceSize}px,
					${e.clientY - boardDomTop - halfPieceSize}px)`;
			} else if (pieceDom.classList.contains("piece-in-hand")) {
				// clicked a piece in hand
				if (pieceDom.classList.contains("transparent")) return;
				let piece = "";
				pieceDom.classList.forEach((c) => {
					if (
						c !== "piece-in-hand" &&
						(c.startsWith("b") || c.startsWith("w"))
					) {
						piece = getPieceFromPieceCss[c];
					}
				});
				const {
					top,
					left,
				} = (pieceDom.parentElement as HTMLElement).getBoundingClientRect();
				draggingPiece = {
					isBoardPiece: false,
					piece,
					dom: pieceDom,
					top,
					left,
				};
				clone = pieceDom.cloneNode();
				pieceDom.parentNode?.appendChild(clone);
				pieceDom.classList.add("dragging");
				pieceDom.style.top = `${e.clientY - top - halfPieceSize}px`;
				pieceDom.style.left = `${e.clientX - left - halfPieceSize}px`;
			}
			document.addEventListener("mousemove", mousemove);
			document.addEventListener("mouseup", mouseup);
		};

		containerDom.addEventListener("mousedown", mousedown);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Shogiboard = Shogiboard;
