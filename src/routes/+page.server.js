/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch(`/api/v1/films`);

	return {
		films: res.json()
	};
}
