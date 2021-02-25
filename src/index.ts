import "./index.css";
import {createBoardFromSfen} from "./board";
import {getPieceCss} from "./pieces";
import {initialSfen} from "./sfen";

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

		const size = 400;

		const containerDom = document.createElement("div");
		containerDom.classList.add("sb");
		const boardDom = document.createElement("div");
		boardDom.classList.add("board");
		boardDom.style.width = `${size}px`;
		boardDom.style.height = `${size}px`;
		const blackCaptures = document.createElement("div");
		const whiteCaptures = document.createElement("div");
		containerDom.appendChild(whiteCaptures);
		containerDom.appendChild(boardDom);
		containerDom.appendChild(blackCaptures);
		rootDom.appendChild(containerDom);

		const sfen = initialSfen;
		const board = createBoardFromSfen(sfen.split(" ")[0]);
		// const turn = "b";
		// const captures = {black: {}, white: {}};

		const rect = boardDom.getBoundingClientRect();
		const {top} = rect;
		const {left} = rect;

		for (let rank = 0; rank < 9; rank++) {
			for (let file = 0; file < 9; file++) {
				const square = 9 * rank + file;
				const piece = board[square];
				if (piece) {
					const pieceDom = document.createElement("div");
					pieceDom.classList.add("piece", getPieceCss(piece));
					pieceDom.style.transform = translate(file, rank);
					boardDom.appendChild(pieceDom);
				}
			}
		}

		let draggingPiece: {
			dom: HTMLElement;
			width: number;
			height: number;
			originalTransform: string;
		} | null = null;

		const mousemove = (e: MouseEvent) => {
			if (draggingPiece) {
				// prettier-ignore
				draggingPiece.dom.style.transform = `translate(
					${e.pageX - left - draggingPiece.width / 2}px,
					${e.pageY - top - draggingPiece.height / 2}px)`;
			}
		};

		const mouseup = (e: MouseEvent) => {
			if (draggingPiece) {
				draggingPiece.dom.classList.remove("dragging");
				const piece = e.target as HTMLElement;
				if (piece.classList.contains("board")) {
					const currentFile = Math.floor(((e.pageX - left) / size) * 9);
					const currentRank = Math.floor(((e.pageY - top) / size) * 9);
					draggingPiece.dom.style.transform = translate(
						currentFile,
						currentRank,
					);
				} else {
					draggingPiece.dom.style.transform = draggingPiece.originalTransform;
				}
				draggingPiece = null;
			}
			document.removeEventListener("mousemove", mousemove);
			document.removeEventListener("mouseup", mouseup);
		};

		const mousedown = (e: MouseEvent) => {
			const piece = e.target as HTMLElement;
			if (piece.classList.contains("board")) return;
			const {clientWidth, clientHeight} = piece;
			draggingPiece = {
				dom: piece,
				width: clientWidth,
				height: clientHeight,
				originalTransform: piece.style.transform,
			};
			piece.classList.add("dragging");
			// prettier-ignore
			piece.style.transform = `translate(
				${e.pageX - left - clientWidth / 2}px,
				${e.pageY - top - clientHeight / 2}px)`;
			document.addEventListener("mousemove", mousemove);
			document.addEventListener("mouseup", mouseup);
		};

		boardDom.addEventListener("mousedown", mousedown);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
}

// @ts-ignore
window.Shogiboard = Shogiboard;
