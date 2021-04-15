/* eslint-disable no-param-reassign */
import {
	emptySquare,
	isBlackPiece,
	isWhitePiece,
	getPieceInHand,
	getPieceFromPieceCss,
} from "./pieces";
import {isSquareOnBoard, translate} from "./utils";
import type {
	Board,
	PiecesInHand,
	PiecesInHandDoms,
	DraggingBoardPiece,
	DraggingPieceInHand,
	Options,
} from "./types";

function dragging({
	board,
	piecesInHand,
	containerDom,
	boardDom,
	piecesInHandDoms,
	options,
}: {
	board: Board;
	piecesInHand: PiecesInHand;
	containerDom: HTMLDivElement;
	boardDom: HTMLDivElement;
	piecesInHandDoms: PiecesInHandDoms;
	options: Options;
}): void {
	const {
		top: boardDomTop,
		left: boardDomLeft,
	} = boardDom.getBoundingClientRect();
	let draggingPiece: DraggingBoardPiece | DraggingPieceInHand | null = null;
	let pieceInHandClone: Node | null = null;
	const hoverSquare = document.createElement("div");
	hoverSquare.classList.add("hover");
	const {size} = options;
	const halfPieceSize = size / 18;

	// helper functions for dragging
	const getCurrentFileAndRank = (clientX: number, clientY: number) => [
		Math.floor((Math.abs(clientX - boardDomLeft) / size) * 9),
		Math.floor((Math.abs(clientY - boardDomTop) / size) * 9),
	];

	const updatePieceInHandDom = (
		pieceInHand: string,
		pieceInHandCount: number,
	) => {
		const {pieceDom, countDom} = piecesInHandDoms[pieceInHand];
		if (pieceInHandCount === 0) {
			countDom.parentNode?.removeChild(countDom);
			(pieceInHandClone as HTMLDivElement).classList.add("transparent");
		} else {
			if (pieceDom.classList.contains("transparent")) {
				pieceDom.classList.remove("transparent");
			}
			countDom.innerText = pieceInHandCount.toString();
			if (!pieceDom.parentNode?.contains(countDom)) {
				pieceDom.parentNode?.appendChild(countDom);
			}
		}
		if (pieceInHandClone !== null) {
			piecesInHandDoms[
				pieceInHand
			].pieceDom = pieceInHandClone as HTMLDivElement;
		}
		pieceInHandClone = null;
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
					boardDom.insertBefore(hoverSquare, boardDom.firstChild);
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
			const destSquare = 9 * currentRank + currentFile;

			if (draggingPiece.isBoardPiece) {
				// moved a board piece
				if (isSquareOnBoard(currentFile, currentRank)) {
					const srcPiece = board[draggingPiece.srcSquare];
					const destPiece = board[destSquare];
					const capturedPiece = e.target as HTMLElement;

					if (options.allowCapture) {
						if (
							isBlackPiece(srcPiece) &&
							isWhitePiece(destPiece) &&
							destPiece !== "k"
						) {
							// black captures a white piece
							const pieceInHand = getPieceInHand[destPiece];
							piecesInHand.black[pieceInHand]++;
							updatePieceInHandDom(
								pieceInHand,
								piecesInHand.black[pieceInHand],
							);
						} else if (
							isWhitePiece(srcPiece) &&
							isBlackPiece(destPiece) &&
							destPiece !== "K"
						) {
							// white captures a black piece
							const pieceInHand = getPieceInHand[destPiece];
							piecesInHand.white[pieceInHand]++;
							updatePieceInHandDom(
								pieceInHand,
								piecesInHand.white[pieceInHand],
							);
						}
					}

					board[destSquare] = srcPiece;
					board[draggingPiece.srcSquare] = emptySquare;

					if (destPiece !== emptySquare) {
						capturedPiece.parentNode?.removeChild(capturedPiece);
					}
					draggingPiece.dom.style.transform = translate(
						currentFile,
						currentRank,
					);
				} else {
					// move board piece to original position
					draggingPiece.dom.style.transform = draggingPiece.originalTransform;
				}
			} else {
				// moved a piece in hand
				draggingPiece.dom.style.removeProperty("top");
				draggingPiece.dom.style.removeProperty("left");

				if (
					isSquareOnBoard(currentFile, currentRank) &&
					board[destSquare] === emptySquare
				) {
					// change the piece in hand to a board piece
					const pieceInHand = draggingPiece.piece;
					board[destSquare] = pieceInHand;

					if (isBlackPiece(pieceInHand)) {
						// move a black piece
						piecesInHand.black[pieceInHand]--;
						updatePieceInHandDom(pieceInHand, piecesInHand.black[pieceInHand]);
					} else {
						// move a white piece
						piecesInHand.white[pieceInHand]--;
						updatePieceInHandDom(pieceInHand, piecesInHand.white[pieceInHand]);
					}

					draggingPiece.dom.classList.remove("piece-in-hand");
					draggingPiece.dom.parentNode?.removeChild(draggingPiece.dom);
					draggingPiece.dom.classList.add("board-piece");
					draggingPiece.dom.style.transform = translate(
						currentFile,
						currentRank,
					);
					boardDom.appendChild(draggingPiece.dom);
				} else if (pieceInHandClone) {
					pieceInHandClone.parentNode?.removeChild(pieceInHandClone);
					pieceInHandClone = null;
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
		const clickedPieceDom = e.target as HTMLElement;
		if (clickedPieceDom.classList.contains("board-piece")) {
			// clicked a board piece
			const [currentFile, currentRank] = getCurrentFileAndRank(
				e.clientX,
				e.clientY,
			);

			draggingPiece = {
				isBoardPiece: true,
				srcSquare: 9 * currentRank + currentFile,
				dom: clickedPieceDom,
				originalTransform: clickedPieceDom.style.transform,
			};

			clickedPieceDom.classList.add("dragging");
			// prettier-ignore
			clickedPieceDom.style.transform = `translate(
					${e.clientX - boardDomLeft - halfPieceSize}px,
					${e.clientY - boardDomTop - halfPieceSize}px)`;
		} else if (clickedPieceDom.classList.contains("piece-in-hand")) {
			// clicked a piece in hand
			if (clickedPieceDom.classList.contains("transparent")) return;
			let pieceInHand = "";
			clickedPieceDom.classList.forEach((c) => {
				if (c !== "piece-in-hand" && (c.startsWith("b") || c.startsWith("w"))) {
					pieceInHand = getPieceFromPieceCss[c];
				}
			});
			const {
				top,
				left,
			} = (clickedPieceDom.parentElement as HTMLElement).getBoundingClientRect();

			draggingPiece = {
				isBoardPiece: false,
				piece: pieceInHand,
				dom: clickedPieceDom,
				top,
				left,
			};

			pieceInHandClone = clickedPieceDom.cloneNode();
			clickedPieceDom.classList.add("dragging");
			clickedPieceDom.style.top = `${e.clientY - top - halfPieceSize}px`;
			clickedPieceDom.style.left = `${e.clientX - left - halfPieceSize}px`;
			clickedPieceDom.parentNode?.appendChild(pieceInHandClone);
		}

		document.addEventListener("mousemove", mousemove);
		document.addEventListener("mouseup", mouseup);
	};

	containerDom.addEventListener("mousedown", mousedown);
}

export default dragging;
