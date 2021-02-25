export function getPieceCss(piece: string): string {
	switch (piece) {
		case "P":
			return "bp";
		case "L":
			return "bl";
		case "N":
			return "bn";
		case "S":
			return "bs";
		case "G":
			return "bg";
		case "B":
			return "bb";
		case "R":
			return "br";
		case "K":
			return "bk";
		case "+P":
			return "bpp";
		case "+L":
			return "bpl";
		case "+N":
			return "bpn";
		case "+S":
			return "bps";
		case "+B":
			return "bpb";
		case "+R":
			return "bpr";
		case "p":
			return "wp";
		case "l":
			return "wl";
		case "n":
			return "wn";
		case "s":
			return "ws";
		case "g":
			return "wg";
		case "b":
			return "wb";
		case "r":
			return "wr";
		case "k":
			return "wk";
		case "+p":
			return "wpp";
		case "+l":
			return "wpl";
		case "+n":
			return "wpn";
		case "+s":
			return "wps";
		case "+b":
			return "wpb";
		case "+r":
			return "wpr";
		default:
			throw new Error(`Invalid piece: ${piece}`);
	}
}
