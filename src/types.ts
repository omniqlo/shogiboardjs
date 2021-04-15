export type Board = string[];

export type PiecesInHand = {
	black: Record<string, number>;
	white: Record<string, number>;
};

export type Sfen = string;

export type PiecesInHandDoms = Record<
	string,
	{
		pieceDom: HTMLDivElement;
		countDom: HTMLDivElement;
	}
>;

export type DraggingBoardPiece = Readonly<{
	isBoardPiece: true;
	srcSquare: number;
	dom: HTMLElement;
	originalTransform: string;
}>;

export type DraggingPieceInHand = Readonly<{
	isBoardPiece: false;
	piece: string;
	dom: HTMLElement;
	top: number;
	left: number;
}>;

export type Options = Readonly<{
	allowCapture: boolean;
	size: number;
}>;
