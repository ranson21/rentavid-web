<script>
	import { onMount } from 'svelte';
	import Paper from '@smui/paper';
	import Button from '@smui/button';
	import DvdTitle from './DVDTitle.svelte';

	export let carouselItems = [
		{
			image: 'https://via.placeholder.com/1920x1080?text=Slide+1',
			title: 'Welcome',
			subtitle: 'Discover our amazing products'
		},
		{
			image: 'https://via.placeholder.com/1920x1080?text=Slide+2',
			title: 'New Arrivals',
			subtitle: 'Check out our latest collection'
		},
		{
			image: 'https://via.placeholder.com/1920x1080?text=Slide+3',
			title: 'Special Offers',
			subtitle: 'Limited time discounts'
		}
	];

	let currentIndex = 0;
	let interval;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % carouselItems.length;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
	}

	function setSlide(index) {
		currentIndex = index;
	}

	onMount(() => {
		interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
		return () => clearInterval(interval);
	});
</script>

<div class="home-hero">
	<Paper class="hero" elevation={4}>
		{#each carouselItems as item, index}
			<div
				class="carousel-item"
				style="background-image: url({item.backdrop_path}); opacity: {index === currentIndex
					? 1
					: 0};"
			>
				<div class="content">
					<DvdTitle
						hideTitle
						dvdId={item.film_id}
						title={item.title}
						description={item.description}
						imageUrl={item.poster_path}
						releaseYear={item.release_year}
					/>
				</div>
			</div>
		{/each}

		<div class="carousel-controls">
			<Button on:click={prevSlide} class="nav-button prev">
				<span class="mdc-button__label">&lt;</span>
			</Button>
			<Button on:click={nextSlide} class="nav-button next">
				<span class="mdc-button__label">&gt;</span>
			</Button>
		</div>

		<div class="carousel-dots">
			{#each carouselItems as _, index}
				<span class="dot" class:active={index === currentIndex} on:click={() => setSlide(index)}
				></span>
			{/each}
		</div>
	</Paper>
</div>

<style>
	.home-hero {
		position: relative;
		overflow: hidden;
		height: 300px;
	}

	.hero {
		position: relative;
	}

	.carousel-item {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		transition: opacity 0.5s ease-in-out;
	}

	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: white;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}

	.carousel-controls {
		position: absolute;
		top: 50%;
		width: 100%;
		display: flex;
		justify-content: space-between;
		transform: translateY(-50%);
	}

	.nav-button {
		background: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		padding: 10px 20px;
		cursor: pointer;
	}

	.carousel-dots {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
	}

	.dot.active {
		background-color: white;
	}
</style>
