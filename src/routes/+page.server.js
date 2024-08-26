/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch(`/api/v1/categories`);
	const featured = await fetch(`/api/v1/featured-films`);
	const categories = await res.json();

	const films = categories.reduce((list, category) => {
		return {
			...list,
			[category.category_id]: fetch(`/api/v1/categories/${category.category_id}/films`).then(
				(res) => res.json()
			)
		};
	}, {});

	return {
		films,
		featuredFilms: await featured.json(),
		categories
	};
}
