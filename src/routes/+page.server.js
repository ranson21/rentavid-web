const API = `${process.env.API_HOST || 'http://localhost:8000'}/api/v1`;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch(`${API}/categories`);
	const featured = await fetch(`${API}/featured-films`);
	const categories = await res.json();

	const films = categories.reduce((list, category) => {
		return {
			...list,
			[category.category_id]: fetch(`${API}/categories/${category.category_id}/films`).then((res) =>
				res.json()
			)
		};
	}, {});

	return {
		films,
		featuredFilms: await featured.json(),
		categories
	};
}
