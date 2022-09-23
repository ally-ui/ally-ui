/** @jsxImportSource solid-js */
import * as Dialog from '@ally-ui/solid-dialog';

export default () => (
	<Dialog.Root>
		<Dialog.Trigger />
		<Dialog.Portal>
			<Dialog.Content>
				<Dialog.Title />
				<Dialog.Description />
				<Dialog.Close />
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
);
