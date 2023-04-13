export type Key =
	| "numGames"
	| "numGamesDiv"
	| "numGamesConf"
	| "numPeriods"
	| "quarterLength"
	| "minRosterSize"
	| "maxRosterSize"
	| "numGamesPlayoffSeries"
	| "numPlayoffByes"
	| "draftType"
	| "numSeasonsFutureDraftPicks"
	| "draftAges"
	| "salaryCap"
	| "minPayroll"
	| "luxuryPayroll"
	| "luxuryTax"
	| "minContract"
	| "maxContract"
	| "minContractLength"
	| "maxContractLength"
	| "salaryCapType"
	| "budget"
	| "aiTradesFactor"
	| "playersRefuseToNegotiate"
	| "injuryRate"
	| "tragicDeathRate"
	| "brotherRate"
	| "sonRate"
	| "forceRetireAge"
	| "homeCourtAdvantage"
	| "rookieContractLengths"
	| "rookiesCanRefuse"
	| "allStarGame"
	| "allStarNum"
	| "allStarType"
	| "foulRateFactor"
	| "foulsNeededToFoulOut"
	| "foulsUntilBonus"
	| "threePointers"
	| "pace"
	| "threePointTendencyFactor"
	| "threePointAccuracyFactor"
	| "twoPointAccuracyFactor"
	| "blockFactor"
	| "stealFactor"
	| "turnoverFactor"
	| "orbFactor"
	| "challengeNoDraftPicks"
	| "challengeNoFreeAgents"
	| "challengeNoRatings"
	| "challengeNoTrades"
	| "challengeLoseBestPlayer"
	| "challengeFiredLuxuryTax"
	| "challengeFiredMissPlayoffs"
	| "challengeThanosMode"
	| "realPlayerDeterminism"
	| "repeatSeason"
	| "ties"
	| "otl"
	| "spectator"
	| "elam"
	| "elamASG"
	| "elamMinutes"
	| "elamOvertime"
	| "elamPoints"
	| "playerMoodTraits"
	| "numPlayersOnCourt"
	| "numDraftRounds"
	| "tradeDeadline"
	| "autoDeleteOldBoxScores"
	| "difficulty"
	| "stopOnInjuryGames"
	| "stopOnInjury"
	| "aiJerseyRetirement"
	| "tiebreakers"
	| "pointsFormula"
	| "equalizeRegions"
	| "noStartingInjuries"
	| "realDraftRatings"
	| "randomization"
	| "realStats"
	| "hideDisabledTeams"
	| "hofFactor"
	| "injuries"
	| "inflationAvg"
	| "inflationMax"
	| "inflationMin"
	| "inflationStd"
	| "playoffsByConf"
	| "playoffsNumTeamsDiv"
	| "playoffsReseed"
	| "playerBioInfo"
	| "playIn"
	| "numPlayersDunk"
	| "numPlayersThree"
	| "fantasyPoints"
	| "tragicDeaths"
	| "goatFormula"
	| "draftPickAutoContract"
	| "draftPickAutoContractPercent"
	| "draftPickAutoContractRounds"
	| "dh"
	| "draftLotteryCustomNumPicks"
	| "draftLotteryCustomChances"
	| "assistFactor"
	| "foulFactor"
	| "groundFactor"
	| "lineFactor"
	| "flyFactor"
	| "powerFactor"
	| "stealFactor"
	| "throwOutFactor"
	| "strikeFactor"
	| "balkFactor"
	| "wildPitchFactor"
	| "passedBallFactor"
	| "hitByPitchFactor"
	| "swingFactor"
	| "contactFactor"
	| "hitFactor"
	| "fantasyPoints"
	| "passFactor"
	| "rushYdsFactor"
	| "passYdsFactor"
	| "completionFactor"
	| "scrambleFactor"
	| "sackFactor"
	| "fumbleFactor"
	| "intFactor"
	| "fgAccuracyFactor"
	| "fourthDownFactor"
	| "onsideFactor"
	| "onsideRecoveryFactor"
	| "giveawayFactor"
	| "takeawayFactor"
	| "blockFactor"
	| "deflectionFactor"
	| "saveFactor"
	| "gender"
	| "heightFactor"
	| "weightFactor"
	| "allStarDunk"
	| "allStarThree"
	| "minRetireAge"
	| "numWatchColors";

export type Category =
	| "New League"
	| "General"
	| "Schedule"
	| "Standings"
	| "Playoffs"
	| "Teams"
	| "Draft"
	| "Finances"
	| "All-Star"
	| "Inflation"
	| "Contracts"
	| "Rookie Contracts"
	| "Events"
	| "Injuries"
	| "Game Simulation"
	| "Elam Ending"
	| "Challenge Modes"
	| "Game Modes"
	| "Players"
	| "UI";

export type FieldType =
	| "bool"
	| "float"
	| "float1000"
	| "floatOrNull"
	| "int"
	| "intOrNull"
	| "jsonString"
	| "string"
	| "rangePercent"
	| "floatValuesOrCustom"
	| "custom";

export type Decoration = "currency" | "percent";

export type Values = {
	key: string;
	value: string;
}[];
