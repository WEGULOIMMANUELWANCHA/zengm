import helpers from "./helpers";
import type { PlayerStats, PlayerStatType } from "./types";

const processStats = (
	ps: PlayerStats,
	stats: string[],
	statType?: PlayerStatType,
	bornYear?: number,
) => {
	const row: any = {};

	const ab = ps.pa - ps.bb - ps.hbp - ps.sf;
	const tb = ps.h + ps["2b"] + 2 * ps["3b"] + 3 * ps.hr;
	const ba = helpers.ratio(ps.h, ab);
	const obp = helpers.ratio(ps.h + ps.bb + ps.hbp, ab + ps.bb + ps.hbp + ps.sf);
	const slg = helpers.ratio(tb, ab);

	const era = helpers.ratio(ps.er, ps.outs / 27);

	for (const stat of stats) {
		if (stat === "age") {
			if (bornYear === undefined) {
				throw new Error(
					"You must supply bornYear to processStats if you want age",
				);
			}

			row.age = ps.season - bornYear;
		} else if (stat === "keyStats") {
			let role: string | undefined;
			if (ps.pa > 0 && ps.pa >= ps.pc) {
				role = "batter";
			} else if (ps.pc > 0) {
				role = "pitcher";
			}

			if (role === "batter") {
				row[stat] = `${helpers.roundWinp(ba)} BA, ${ps.hr} HR`;
			} else if (role === "pitcher") {
				const recordOrSaves = ps.w >= ps.sv ? `${ps.w}-${ps.l}` : `${ps.sv} SV`;
				row[stat] = `${recordOrSaves}, ${era.toFixed(2)} ERA`;
			} else {
				row[stat] = "";
			}
		} else if (stat === "ab") {
			row[stat] = ab;
		} else if (stat === "ba") {
			row[stat] = ba;
		} else if (stat === "obp") {
			row[stat] = obp;
		} else if (stat === "slg") {
			row[stat] = slg;
		} else if (stat === "ops") {
			row[stat] = obp + slg;
		} else if (stat === "tb") {
			row[stat] = tb;
		} else if (stat === "ip") {
			const completeInnings = Math.floor(ps.outs / 3);
			const fractionalInnings = ps.outs % 3;

			row[stat] = completeInnings + fractionalInnings / 10;
		} else if (stat === "winp") {
			row[stat] = helpers.ratio(ps.w, ps.w + ps.l);
		} else if (stat === "era") {
			row[stat] = era;
		} else if (stat === "fip") {
			row[stat] =
				helpers.ratio(
					13 * ps.hrPit + 3 * (ps.hbpPit + ps.bbPit) - 2 * ps.soPit,
					ps.outs / 3,
				) + 3.2;
		} else if (stat === "whip") {
			row[stat] = helpers.ratio(ps.bbPit + ps.hPit, ps.outs / 3);
		} else if (stat === "h9") {
			row[stat] = helpers.ratio(ps.hPit, ps.outs / 27);
		} else if (stat === "hr9") {
			row[stat] = helpers.ratio(ps.hrPit, ps.outs / 27);
		} else if (stat === "bb9") {
			row[stat] = helpers.ratio(ps.soPit, ps.outs / 27);
		} else if (stat === "so9") {
			row[stat] = helpers.ratio(ps.soPit, ps.outs / 27);
		} else if (stat === "pc9") {
			row[stat] = helpers.ratio(ps.pc, ps.outs / 27);
		} else if (stat === "sow") {
			row[stat] = helpers.ratio(ps.soPit, ps.bbPit);
		} else {
			row[stat] = ps[stat];
		}

		// For keepWithNoStats
		if (
			(row[stat] === undefined || Number.isNaN(row[stat])) &&
			stat !== "jerseyNumber"
		) {
			row[stat] = 0;
		}
	}

	// Since they come in same stream, always need to be able to distinguish
	row.playoffs = ps.playoffs;
	return row;
};

export default processStats;
