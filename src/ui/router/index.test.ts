/* eslint-disable no-async-promise-executor */
import assert from "assert";
import router from ".";
import type { Context } from ".";

const counts: Record<string, number> = {};
const countCallback = async (context: Context) => {
	if (context.path.startsWith("/3/")) {
		counts["/3/:foo"] += 1;
	} else {
		counts[context.path] += 1;
	}
};
const routes = {
	"/": countCallback,
	"/0": countCallback,
	"/1": countCallback,
	"/2": countCallback,
	"/3/:foo": countCallback,
	"/error": async (context: Context) => {
		countCallback(context);
		throw new Error("runtime error");
	},
	"/state": async (context: Context) => {
		countCallback(context);
		assert.equal(context.state, 123);
	},
};
for (const key of Object.keys(routes)) {
	counts[key] = 0;
}

it("sets routes", () => {
	const countBefore = counts["/"];

	router.start(routes);

	assert.equal((router as any).routes.length, 7);
	assert.equal(counts["/"], countBefore + 1);
});

it("navigates", async () => {
	const countBefore = counts["/0"];
	assert.equal(window.location.pathname, "/");

	await router.navigate("/0");

	assert.equal(window.location.pathname, "/0");
	assert.equal(counts["/0"], countBefore + 1);
});

// https://github.com/jsdom/jsdom/issues/1565
it.skip("handles back/forward navigation", () => {
	assert.equal(window.location.pathname, "/0");
	window.history.back();
	assert.equal(window.location.pathname, "/");
	window.history.forward();
	assert.equal(window.location.pathname, "/0");
});

// Same issue as previous test prevents this test from being good
it("navigates without creating a history entry", async () => {
	const countBefore = counts["/1"];
	assert.equal(window.location.pathname, "/0");

	await router.navigate("/1", { replace: true });

	assert.equal(window.location.pathname, "/1");
	assert.equal(counts["/1"], countBefore + 1);
});

it("fires routematched event", () => {
	return new Promise(async resolve => {
		const countBefore = counts["/2"];
		const callback = (event: CustomEvent<any>) => {
			assert.equal(counts["/2"], countBefore); // Hasn't navigated yet
			assert.deepEqual(event.detail, {
				context: {
					params: {},
					path: "/2",
					state: {},
				},
				error: null,
			});

			resolve();
			router.removeEventListener("routematched", callback);
		};
		router.addEventListener("routematched", callback);
		await router.navigate("/2");
	});
});

it("fires navigationend event", () => {
	return new Promise(async resolve => {
		const countBefore = counts["/3/:foo"];
		const callback = (event: CustomEvent<any>) => {
			assert.equal(counts["/3/:foo"], countBefore + 1);
			assert.deepEqual(event.detail, {
				context: {
					params: {
						foo: "bar",
					},
					path: "/3/bar",
					state: {},
				},
				error: null,
			});

			resolve();
			router.removeEventListener("navigationend", callback);
		};
		router.addEventListener("navigationend", callback);
		await router.navigate("/3/bar");
	});
});

it("fires navigationend event with 404 error", () => {
	return new Promise(async resolve => {
		const callback = (event: CustomEvent<any>) => {
			assert.equal(event.detail.error.message, "Matching route not found");

			resolve();
			router.removeEventListener("navigationend", callback);
		};
		router.addEventListener("navigationend", callback);
		await router.navigate("/does-not-exist");
	});
});

it("fires navigationend event with runtime error", () => {
	return new Promise(async resolve => {
		const countBefore = counts["/error"];
		const callback = (event: CustomEvent<any>) => {
			assert.equal(event.detail.error.message, "runtime error");
			assert.equal(counts["/error"], countBefore + 1);

			resolve();
			router.removeEventListener("navigationend", callback);
		};
		router.addEventListener("navigationend", callback);
		await router.navigate("/error");
	});
});

it("passes state to callback", async () => {
	const countBefore = counts["/state"];

	const arg: any = { state: 123 };
	await router.navigate("/state", arg);

	assert.equal(window.location.pathname, "/state");
	assert.equal(counts["/state"], countBefore + 1);
});
