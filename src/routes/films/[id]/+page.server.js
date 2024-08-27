const API = `${process.env.API_HOST || 'http://localhost:8000'}/api/v1`;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const res = await fetch(`${API}/films/${params.id}`);
	const film = await res.json();
	const related = await fetch(`${API}/films/${params.id}/related`).then((res) => res.json());
	const actors = await fetch(`${API}/films/${params.id}/actors`).then((res) => res.json());

	return { film, actors, related };
}
