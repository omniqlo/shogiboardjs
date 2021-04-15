export type Board = string[];

export type PiecesInHand = {
	black: Record<string, number>;
	white: Record<string, number>;
};

export type DraggingBoardPiece = {
	isBoardPiece: true;
	srcSquare: number;
	dom: HTMLElement;
	originalTransform: string;
};

export type DraggingPieceInHand = {
	isBoardPiece: false;
	piece: string;
	dom: HTMLElement;
	top: number;
	left: number;
};
