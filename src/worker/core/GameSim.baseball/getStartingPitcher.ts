import { random } from "../../util";
import type { PlayerGameSim } from "./types";

const CLOSER_INDEX = 5;

export const getStartingPitcher = (pitchers: PlayerGameSim[]) => {
	// First pass - look for starting pitcher with no fatigue
	for (let i = 0; i < pitchers.length; i++) {
		const p = pitchers[i];
		if (p.pFatigue === 0 && !p.injured) {
			return p;
		}

		if (i === 4) {
			break;
		}
	}

	// Second pass - reliever with no fatigue
	for (let i = CLOSER_INDEX + 1; i < pitchers.length; i++) {
		const p = pitchers[i];
		if (p.pFatigue === 0 && !p.injured) {
			return p;
		}
	}

	// Third pass - look for slightly tired starting pitcher
	for (let i = 0; i < pitchers.length; i++) {
		const p = pitchers[i];
		if (p.pFatigue <= 30 && !p.injured) {
			return p;
		}

		if (i === 4) {
			break;
		}
	}

	// Fourth pass - tired reliever
	for (let i = CLOSER_INDEX + 1; i < pitchers.length; i++) {
		const p = pitchers[i];
		if (p.pFatigue <= 30 && !p.injured) {
			return p;
		}
	}

	// Fifth pass - anybody
	let p = random.choice(pitchers.filter(p => !p.injured));
	if (!p) {
		p = random.choice(pitchers);
	}

	if (!p) {
		throw new Error("Should never happen");
	}

	return p;
};
