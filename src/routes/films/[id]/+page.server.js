/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const res = await fetch(`/api/v1/films/${params.id}`);
	const item = await res.json();

	return { item };
}
