import "./index.css";
import setup from "./setup";
import dragging from "./dragging";
import {initialSfen} from "./sfen";
import type {Options} from "./types";

const defaultOptions: Options = {
	allowCapture: false,
	size: 400,
};

function Shogiboard(elementId: string, opts?: Options) {
	try {
		const rootDom = document.getElementById(elementId);
		if (!rootDom) {
			throw new Error(`An element with the ID ${elementId} does not exist`);
		}

		const options = {...defaultOptions, ...opts};
		const sfen = initialSfen;

		const {
			board,
			piecesInHand,
			containerDom,
			boardDom,
			piecesInHandDoms,
		} = setup({options, rootDom, sfen});

		dragging({
			options,
			board,
			piecesInHand,
			containerDom,
			boardDom,
			piecesInHandDoms,
		});
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Shogiboard = Shogiboard;
