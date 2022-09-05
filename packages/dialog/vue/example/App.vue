<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import Dialog from '../lib/main';

const open = ref(true);
const titleRef = ref<HTMLElement | null>(null);
watchEffect(() => {
	if (titleRef.value !== null) {
		titleRef.value.style.color = 'gray';
	}
});
const outside = ref(false);
const escape = ref(true);
const returnFocus = ref<HTMLElement | null>(null);
</script>

<template>
	<main>
		<button @click="() => (outside = !outside)" ref="returnFocus">
			Click outside {{ outside ? 'deactivates' : 'blocked' }}
		</button>
		<button @click="() => (escape = !escape)">
			Escape {{ escape ? 'deactivates' : 'blocked' }}
		</button>
		<h1>Ally UI Vue Dialog</h1>
		<Dialog.Root v-model:open="open" initial-open>
			<div>
				<button @click="() => (open = !open)">Manual toggle</button>
				<Dialog.Trigger>Edit profile</Dialog.Trigger>
				<span v-if="open">Editing profile...</span>
			</div>
			<Dialog.Content
				as-child
				v-slot="props"
				@close-auto-focus="
					(ev) => {
						ev.preventDefault();
						returnFocus?.focus();
					}
				"
				@escape-key-down="
					(ev) => {
						if (!escape) {
							ev.preventDefault();
						}
					}
				"
				@interact-outside="
					(ev) => {
						if (!outside) {
							ev.preventDefault();
						}
					}
				"
			>
				<section v-bind="props">
					<Dialog.Title
						as-child
						v-slot="props"
						:set-ref="(n) => (titleRef = n)"
					>
						<h2 v-bind="props">Edit profile</h2>
					</Dialog.Title>
					<Dialog.Description>
						Make changes to your profile here. Click save when you're done
					</Dialog.Description>
					<fieldset>
						<label for="name">Name</label>
						<input id="name" placeholder="Bryan Lee" />
					</fieldset>
					<fieldset>
						<label for="username">Username</label>
						<input id="username" placeholder="@bryanmylee" />
					</fieldset>
					<Dialog.Close>Save changes</Dialog.Close>
					<Dialog.Close>x</Dialog.Close>
				</section>
			</Dialog.Content>
		</Dialog.Root>
		<section>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aspernatur
				sed minus unde eius. Maxime hic, eligendi reprehenderit dignissimos cum
				accusantium, ex consequuntur magni cupiditate non cumque placeat
				corrupti? Saepe, officia est nemo debitis vero minima et reprehenderit,
				assumenda, praesentium ex impedit neque id! Fugiat, suscipit temporibus
				repudiandae repellat aliquam error. Autem, sapiente veniam laudantium
				provident ex iste, aliquid illo fugit nulla in explicabo. Voluptas rerum
				voluptates, sed deleniti eius beatae rem? Illo, ut. Dolorum magnam
				dolorem facilis, ipsa delectus architecto commodi a voluptate ducimus
				possimus magni animi sunt nisi quia saepe dicta necessitatibus
				praesentium quaerat rerum eaque? Aliquam, maiores?
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aspernatur
				sed minus unde eius. Maxime hic, eligendi reprehenderit dignissimos cum
				accusantium, ex consequuntur magni cupiditate non cumque placeat
				corrupti? Saepe, officia est nemo debitis vero minima et reprehenderit,
				assumenda, praesentium ex impedit neque id! Fugiat, suscipit temporibus
				repudiandae repellat aliquam error. Autem, sapiente veniam laudantium
				provident ex iste, aliquid illo fugit nulla in explicabo. Voluptas rerum
				voluptates, sed deleniti eius beatae rem? Illo, ut. Dolorum magnam
				dolorem facilis, ipsa delectus architecto commodi a voluptate ducimus
				possimus magni animi sunt nisi quia saepe dicta necessitatibus
				praesentium quaerat rerum eaque? Aliquam, maiores?
			</p>
		</section>
	</main>
</template>
