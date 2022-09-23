<script lang="ts">
	import {slide} from 'svelte/transition';

	let showCode = false;

	export let code = '';
</script>

<section
	class="flex-center relative flex h-52 rounded-xl bg-gradient-to-tr from-[#63d8ff] to-[#3a98f0] text-white"
>
	<slot />
	<button
		on:click={() => (showCode = !showCode)}
		class="absolute right-2 bottom-2 rounded-lg px-3 py-2 text-xs hover:bg-white/25 focus:ring-black"
	>
		Show code
	</button>
</section>
{#if showCode}
	<pre transition:slide class="max-h-96"><code>{code}</code></pre>
{/if}
