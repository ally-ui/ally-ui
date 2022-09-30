import {DialogContentModel} from '@ally-ui/core-dialog';
import {cleanup, render} from 'solid-testing-library';
import * as Dialog from '../../lib/main';

function MissingTitle() {
	return (
		<Dialog.Root initialOpen>
			<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
			<Dialog.Content data-testid="content">
				<Dialog.Description data-testid="description">
					description
				</Dialog.Description>
				<Dialog.Close data-testid="close">close dialog</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}

afterEach(() => {
	cleanup();
});

it('warns the user if the title component is missing', async () => {
	const warnSpy = vi.spyOn(console, 'warn');
	render(() => <MissingTitle />);
	await new Promise((res) => setTimeout(res));
	expect(warnSpy).toHaveBeenCalledWith(
		DialogContentModel.MISSING_TITLE_WARNING,
	);
});
