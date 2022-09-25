<script lang="ts">
	import {slide} from 'svelte/transition';

	let showCode = false;

	export let codeLanguage = '';
	export let codeHTML = '';
	export let showCodeLabel: string;
</script>

<section
	class="flex-center relative flex h-52 rounded-xl bg-gradient-to-tr from-[#63d8ff] to-[#3a98f0] text-white"
>
	<slot />
	<button
		on:click={() => (showCode = !showCode)}
		class="reset absolute right-2 bottom-2 rounded-lg px-3 py-2 text-xs hover:bg-white/25 focus:ring-white"
	>
		{showCodeLabel}
	</button>
</section>
{#if showCode}
	<!-- prettier-ignore -->
	<pre transition:slide class="language-{codeLanguage} max-h-96"
		><code>{@html codeHTML}</code></pre>
{/if}
