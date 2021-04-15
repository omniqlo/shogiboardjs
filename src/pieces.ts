export const getPieceCssFromPiece: Record<string, string> = {
	"P": "bp",
	"L": "bl",
	"N": "bn",
	"S": "bs",
	"G": "bg",
	"B": "bb",
	"R": "br",
	"K": "bk",
	"+P": "bpp",
	"+L": "bpl",
	"+N": "bpn",
	"+S": "bps",
	"+B": "bpb",
	"+R": "bpr",
	"p": "wp",
	"l": "wl",
	"n": "wn",
	"s": "ws",
	"g": "wg",
	"b": "wb",
	"r": "wr",
	"k": "wk",
	"+p": "wpp",
	"+l": "wpl",
	"+n": "wpn",
	"+s": "wps",
	"+b": "wpb",
	"+r": "wpr",
};

export const getPieceFromPieceCss: Record<string, string> = {
	bp: "P",
	bl: "L",
	bn: "N",
	bs: "S",
	bg: "G",
	bb: "B",
	br: "R",
	wp: "P",
	wl: "l",
	wn: "n",
	ws: "s",
	wg: "g",
	wb: "b",
	wr: "r",
};
