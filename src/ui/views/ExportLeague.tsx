import classNames from "classnames";
import { useState, ReactNode, FormEvent } from "react";
import { isSport, WEBSITE_ROOT } from "../../common";
import { MoreLinks } from "../components";
import useTitleBar from "../hooks/useTitleBar";
import { downloadFile, helpers, toWorker } from "../util";

export type ExportLeagueKey =
	| "players"
	| "gameHighs"
	| "teams"
	| "headToHead"
	| "schedule"
	| "draftPicks"
	| "gameAttributes"
	| "gameState"
	| "newsFeedTransactions"
	| "newsFeedOther"
	| "games";

type Category = {
	key: ExportLeagueKey;
	name: string;
	desc: string;
	default: boolean;
	parent?: ExportLeagueKey;
};

const categories: Category[] = [
	{
		key: "players",
		name: "Players",
		desc: "All player info, ratings, stats, and awards.",
		default: true,
	},
	...((!isSport("football")
		? [
				{
					key: "gameHighs",
					name: "Include game highs",
					desc: "Game highs are fun, but they increase export size by 25%.",
					default: true,
					parent: "players",
				},
		  ]
		: []) as Category[]),
	{
		key: "teams",
		name: "Teams",
		desc: "All team info and stats.",
		default: true,
	},
	{
		key: "schedule",
		name: "Schedule",
		desc: "Current regular season schedule and playoff series.",
		default: true,
	},
	{
		key: "draftPicks",
		name: "Draft Picks",
		desc: "Future draft picks.",
		default: true,
	},
	{
		key: "gameAttributes",
		name: "League Settings",
		desc: "All league settings and conference/division settings, including some game state (like current season/phase) that is stored in the same place.",
		default: true,
	},
	{
		key: "gameState",
		name: "Game State",
		desc: "Interactions with the owner, current contract negotiations, etc. Useful for saving or backing up a game, but not for creating custom rosters to share.",
		default: true,
	},
	{
		key: "newsFeedTransactions",
		name: "News Feed - Transactions",
		desc: "Trades, draft picks, and signings.",
		default: true,
	},
	{
		key: "newsFeedOther",
		name: "News Feed - All Other Entries",
		desc: "All entries besides trades, draft picks, and signings - usually not that important, and increases export size by 10%.",
		default: true,
	},
	{
		key: "headToHead",
		name: "Head-to-Head Data",
		desc: "History of head-to-head results between teams.",
		default: true,
	},
	{
		key: "games",
		name: "Box Scores",
		desc: "Box scores take up tons of space, but by default only three seasons are saved.",
		default: false,
	},
];

const ExportLeague = () => {
	const [status, setStatus] = useState<ReactNode | undefined>();
	const [compressed, setCompressed] = useState(true);
	const [checked, setChecked] = useState<Record<ExportLeagueKey, boolean>>(
		() => {
			const init = {
				players: false,
				gameHighs: false,
				teams: false,
				headToHead: false,
				schedule: false,
				draftPicks: false,
				gameAttributes: false,
				gameState: false,
				newsFeedTransactions: false,
				newsFeedOther: false,
				games: false,
			};

			for (const category of categories) {
				init[category.key] = category.default;
			}

			return init;
		},
	);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		setStatus("Exporting...");

		try {
			const { filename, json } = await toWorker("main", "exportLeague", {
				...checked,
				compressed,
			});

			downloadFile(filename, json, "application/json");
		} catch (err) {
			console.error(err);
			setStatus(
				<span className="text-danger">
					Error exporting league: "{err.message}
					". You might have to select less things to export or{" "}
					<a href={helpers.leagueUrl(["delete_old_data"])}>
						delete old data
					</a>{" "}
					before exporting.
				</span>,
			);
			return;
		}

		setStatus(undefined);
	};

	useTitleBar({ title: "Export League" });

	return (
		<>
			<MoreLinks type="importExport" page="export_league" />
			<p>
				Here you can export your entire league data to a single League File. A
				League File can serve many purposes. You can use it as a <b>backup</b>,
				to <b>copy a league from one computer to another</b>, or to use as the
				base for a <b>custom roster file</b> to share with others. Select as
				much or as little information as you want to export, since any missing
				information will be filled in with default values when it is used.{" "}
				<a href={`http://${WEBSITE_ROOT}/manual/customization/`}>
					Read the manual for more info.
				</a>
			</p>

			<form onSubmit={handleSubmit}>
				<div className="row">
					<div className="col-md-6 col-lg-5 col-xl-4">
						<h2>Data</h2>
						{categories.map(cat => (
							<div
								key={cat.name}
								className={classNames("form-check", {
									"ml-4": cat.parent,
								})}
							>
								<label className="form-check-label">
									<input
										className="form-check-input"
										type="checkbox"
										checked={
											checked[cat.key] && (!cat.parent || checked[cat.parent])
										}
										disabled={cat.parent && !checked[cat.parent]}
										onChange={() => {
											setChecked(checked2 => ({
												...checked2,
												[cat.key]: !checked2[cat.key],
											}));
										}}
									/>
									{cat.name}
									<p className="text-muted">{cat.desc}</p>
								</label>
							</div>
						))}
					</div>
					<div className="col-md-6 col-lg-5 col-xl-4">
						<h2>Format</h2>
						<div className="form-check mb-3">
							<label className="form-check-label">
								<input
									className="form-check-input"
									type="checkbox"
									checked={compressed}
									onChange={() => {
										setCompressed(compressed => !compressed);
									}}
								/>
								Compressed (no extra whitespace)
							</label>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-10 col-xl-8 text-center">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={status === "Exporting..."}
						>
							{status === "Exporting..." ? (
								<>
									<span
										className="spinner-border spinner-border-sm"
										role="status"
										aria-hidden="true"
									></span>{" "}
									Processing
								</>
							) : (
								"Export League"
							)}
						</button>
					</div>
				</div>
			</form>

			{status && status !== "Exporting..." ? (
				<p className="mt-3 text-center">{status}</p>
			) : null}
		</>
	);
};

export default ExportLeague;
